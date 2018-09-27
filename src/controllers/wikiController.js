const wikiQueries = require("../db/queries.wikis.js");

module.exports = {
  wiki(req, res, next) {
    wikiQueries.getAllQueries((err, wikis) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/wiki", {wikis});
      }
    });
  },

  new(req, res, next) {
    res.render("wikis/new");
  },

  create(req, res, next) {
    let newWiki = {
      title: req.body.title,
      body: req.body.body,
      private: JSON.parse(req.body.private)
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
        res.render("wikis/show", {wiki});
      }
    });
  },
}
