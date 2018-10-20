const User = require("./models").User;
const Wiki = require("./models").Wiki;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');

module.exports = {
  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  sendEmail(newUser) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const output = `
    <div>
      <h3>Hi ${newUser.dataValues.username}, Thank you for joining Blocipedia! We hope you enjoy our service!</h3>
    </div>
    <p>- Blocipedia Team</p>
    `;

    const msg = {
      from: "blocipedia@mail.com",
      to: newUser.dataValues.email,
      subject: "Blocipedia Sign-Up Confirmation",
      html: output
    };

    sgMail.send(msg, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log("SendGrid Sent Your Message Successfully!");
      }
    });
  },

  changeRole(user, action) {
    let userRole;

    User.findOne({
      where: { email: user.email }
    })
    .then((user) => {
      if (action === "charge") {
        userRole = "premium";
      } else {
        userRole = "standard";
      }

      user.update({
        role: userRole
      })
    })
  },

  getUser(id, callback) {
    let result = {};

    User.findById(id)
    .then((user) => {
      if(!user) {
        callback(404);
      } else {
        result["user"] = user;

        Wiki.findAll({
          where: { userId: user.id }
        })
        .then((wikis) => {
          if(!wikis) {
            callback(404);
          } else {
            result["wikis"] = wikis;
            callback(null, result);
          }
        });
      }
    })
    .catch((err) => {
      callback(err);
    });
  },
}
