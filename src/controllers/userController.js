const userQueries = require("../db/queries.users.js");
const sgMail = require('@sendgrid/mail');
const passport = require("passport");
const User = require("../db/models").User;
const keys = require("../config/keys");
var stripe = require("stripe")(keys.stripeSecretKey);

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
              return next("Sign in failed. I am from userController.js");
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
              userQueries.changeRole(user);
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
  }
}
