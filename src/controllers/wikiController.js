const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/wiki");
const Wiki = require("../db/models").Wiki;
const markdown = require( "markdown" ).markdown;

module.exports = {
  wiki(req, res, next) {
    wikiQueries.getAllQueries((err, wikis) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        wikis.forEach((wiki) => {
          wiki.title = markdown.toHTML(wiki.title);
          wiki.body = markdown.toHTML(wiki.body);
        })

        res.render("wikis/wiki", {wikis});
      }
    });
  },

  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();

    if (authorized) {
      res.render("wikis/new");
    } else {
      req.flash("notice", "You are not authorized to do that");
      res.redirect("/wikis");
    }
  },

  create(req, res, next) {
    let newWiki = {
      title: req.body.title,
      body: req.body.body,
      private: JSON.parse(req.body.private),
      userId: req.user.id,
    };

    wikiQueries.addWiki(newWiki, (err, wiki) => {
      if (err) {
        res.redirect(500, "/wikis/new");
      } else {
        res.redirect(303, `/wikis/${wiki.id}`);
      }
    });
  },

  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err) {
        res.redirect(404, "/");
      } else {
        wiki.title = markdown.toHTML(wiki.title);
        wiki.body = markdown.toHTML(wiki.body);

        res.render("wikis/show", {wiki});
      }
    });
  },

  destroy(req, res, next) {
    Wiki.findById(req.params.id)
    .then((wiki) => {
      const authorized = new Authorizer(req.user, wiki).destroy();

      if (authorized) {
        wikiQueries.deleteWiki(req, (err, wiki) => {
          if (err) {
            res.redirect(500, `/wikis/${req.params.id}`);
          } else {
            res.redirect(303, "/wikis");
          }
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  },

  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, wiki).edit();

        if (authorized) {
          res.render("wikis/edit", {wiki});
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/wikis/${req.params.id}`);
        }
      };
    });
  },

  update(req, res, next) {
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(500, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  }
}
