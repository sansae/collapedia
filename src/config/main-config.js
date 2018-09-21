require("dotenv").config();
const logger = require("morgan");

module.exports = {
  init(app, express){
    app.use(logger("dev"));
  }
};
