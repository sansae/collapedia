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
}
