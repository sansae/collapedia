const User = require("./models").User;

module.exports = {
  createUser(newUser, callback) {
    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: newUser.password
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },
}
