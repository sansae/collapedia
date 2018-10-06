const Collaborator = require("../db/models").Collaborator;

module.exports = {
  new(req, res, next) {
    res.render("collaborators/new");
  },
}
