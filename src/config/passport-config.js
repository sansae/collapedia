const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../db/models").User;
const authHelper = require("../auth/helpers");

module.exports = {
  init(app){
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy({
      usernameField: "email"
    }, (email, password, done) => {
      User.findOne({
        where: {email}
      })
      .then((user) => {
        if (!authHelper.comparePass(password, user.password)) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      })
    }));

    /* serializeUser and deserializeUser tell Passport.js how to get information from a user object to store in a session (serialize), and how to take that information and turn it back into a user object (deserialize) */
    passport.serializeUser((user, callback) => {
      callback(null, user.id);
    });

    passport.deserializeUser((id, callback) => {
      User.findById(id)
      .then((user) => {
        callback(null, user);
      })
      .catch((err) => {
        callback(err, user);
      })
    })
  }
}
