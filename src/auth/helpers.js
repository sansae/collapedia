const bcrypt = require("bcryptjs");

module.exports = {
  comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
  }
}
