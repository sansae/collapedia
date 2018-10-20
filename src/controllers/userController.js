const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const sgMail = require('@sendgrid/mail');
const passport = require("passport");
const User = require("../db/models").User;
const keys = require("../config/keys");
var stripe = require("stripe")(keys.stripeSecretKey);
const authHelper = require("../auth/helpers");
const markdown = require( "markdown" ).markdown;

module.exports = {
  signUpForm(req, res, next) {
    res.render("users/signup");
  },

  create(req, res, next) {
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash("error", err);
        res.redirect("/users/signup");
      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed up! An email confirmation has been sent to you.");
          res.redirect("/");
        })
      }

      if (user) {
        userQueries.sendEmail(user);
      }
    });
  },

  signInForm(req, res, next) {
    res.render("users/signin");
  },

  signIn(req, res, next) {
    User.findOne({
      where: { email: req.body.email }
    })
    .then((user) => {
      if (!user) {
        req.flash("notice", `${req.body.email} does not exist`);
        res.redirect("/users/signin");
      } else {
        passport.authenticate('local', function(err, user, info) {
          if (err) {
            return next(err);
          }

          if (!user) {
            req.flash("notice", `Sign in failed. ${info.message}`);
            res.redirect("/users/signin");
          }

          req.logIn(user, function(err) {
            if (err) {
              return next("Sign in failed.");
            }

            req.flash("notice", "You've successfully signed in!");
            res.redirect("/");
          });
        })(req, res, next);
      }
    })
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  upgradeForm(req, res, next) {
    res.render("users/upgrade", {stripePublishableKey: keys.stripePublishableKey});
  },

  upgrade(req, res, next) {
    const email = req.body.stripeEmail;
    const token = req.body.stripeToken;

    User.findOne({
      where: { email }
    })
    .then((user) => {
      if (user) {
        stripe.customers.create({
          email,
          source: token,
        })
        .then((customer) => {
          stripe.charges.create({
            amount: 1500,
            currency: 'usd',
            description: "Blocipedia",
            customer: customer.id,
          })
          .then((charge) => {
            if (charge) {
              let action = "charge";
              userQueries.changeRole(user, action);
            }

            if (charge) {
              req.flash("notice", "Congratulations. You upgraded to premium!");
              res.render("static/index");
            } else {
              req.flash("notice", "Sorry. Something went wrong and your account was not upgraded. Please try again.");
              res.redirect("/users/upgrade");
            }
          })
        })
      } else {
        req.flash("notice", "Your account was not upgraded. Please use the email address that you used to sign up for Blocipedia.");
        res.redirect("/users/upgrade");
      }
    })
  },

  downgradeForm(req, res, next) {
    res.render("users/downgrade");
  },

  downgrade(req, res, next) {
    User.findOne({
      where: { email: req.body.email }
    })
    .then((user) => {
      if (user) {
        // if user found, check password
        if (authHelper.comparePass(req.body.password, user.password)) {
          // find customer info to retrieve charge id
          stripe.customers.list({
            email: req.body.email
          })
          .then((customer) => {
            stripe.charges.list({
              customer: customer.data[0].id
            })
            .then((chargeId) => {
              // issue the refund using the charge id
              stripe.refunds.create({
                charge: chargeId.data[0].id
              })
              .then((refund) => {
                if (refund) {
                  let action = "refund";

                  userQueries.changeRole(user, action);
                  wikiQueries.changePrivacy(user);

                  req.flash("notice", "Your account has been downgraded to Standard. Feel free to upgrade again if you change your mind!");
                  res.render("static/index");
                } else {
                  req.flash("notice", "Sorry. Something went wrong and your account was not downgraded. Please try again.");
                  res.redirect("/users/upgrade");
                }
              })
            })
          })
        } else {
          req.flash("notice", "The password you entered was incorrect. Please try again.");
          res.redirect("/users/downgrade");
        }
      } else {
        req.flash("notice", "That email is not in our database. Please use the email address that you used to sign up for Blocipedia.");
        res.redirect("/users/downgrade");
      }
    })
  },// end downgrade

  show(req, res, next) {
    userQueries.getUser(req.params.id, (err, result) => {
      if (err || result.user == undefined) {
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        result.wikis.forEach((wiki) => {
          wiki.title = markdown.toHTML(wiki.title);
        })
        res.render("users/show", {...result});
      }
    })
  }
}
