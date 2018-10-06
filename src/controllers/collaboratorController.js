const Collaborator = require("../db/models").Collaborator;
const Authorizer = require("../policies/collaborator");

module.exports = {
  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();

    if (authorized) {
      res.render("collaborators/new");
    } else {
      req.flash("notice", "You are not authorized to do that");
      res.redirect("/wikis");
    };
  },
}
