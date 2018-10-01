// test to see if we are in production or dev environment

if (process.env.NODE_ENV === 'production') {
  // if we're on the server (i.e. heroku)
  module.exports = require('./keys_prod');
} else {
  // if we're on the local dev env
  module.exports = require('./keys_dev');
}
