const Collaborator = require("../db/models").Collaborator;
const Authorizer = require("../policies/collaborator");
const User = require("../db/models").User;
const Wiki = require("../db/models").Wiki;
const collaboratorQueries = require("../db/queries.collaborators.js");

module.exports = {
  new(req, res, next) {
    User.findAll()
    .then((users) => {
      Wiki.findOne({
        where: { id: req.params.id }
      })
      .then((wiki) => {
        Collaborator.findAll({
          where: { wikiId: wiki.id }
        })
        .then((collaborators) => {
          const authorized = new Authorizer(req.user).new();

          if (authorized) {
          res.render("collaborators/new", {users, wiki, collaborators});
          } else {
            req.flash("notice", "You are not authorized to do that");
            res.redirect("/wikis");
          };
        })
      })
    })
  },

  create(req, res, next) {
    User.findById(req.body.btn)
    .then((user) => {
      let newCollaborator = {
        username: user.username,
        email: user.email,
        wikiId: req.params.id,
        userId: user.id
      };

      collaboratorQueries.addCollaborator(newCollaborator, (err, collaborator) => {
        if (err) {
          req.flash("notice", err);
          res.redirect(`/wikis/${req.params.id}/new`);
        } else {
          req.flash("notice", "Collaborator added!");
          res.redirect(`/wikis/${req.params.id}/new`);
        }
      });
    });
  },

  destroy(req, res, next) {
    Collaborator.findById(req.body.deleteBtn)
    .then((collaborator) => {
      collaboratorQueries.deleteCollaborator(req.body.deleteBtn, (err, collaborator) => {
        if (err) {
          res.redirect(500, `/wikis/${req.params.id}/new`);
        } else {
          req.flash("notice", "Collaborator deleted!");
          res.redirect(`/wikis/${req.params.id}/new`);
        }
      });
    });
  },
}
