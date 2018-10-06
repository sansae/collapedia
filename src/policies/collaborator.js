const ApplicationPolicy = require("./application");

module.exports = class CollaboratorPolicy extends ApplicationPolicy {
  new() {
    return this.user && (this.user.role == "premium" || this.user.role == "admin");
  }
}
