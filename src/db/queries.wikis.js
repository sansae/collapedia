const Wiki = require("./models").Wiki;

module.exports = {
  getAllQueries(callback) {
    return Wiki.all()
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    })
  },
}
