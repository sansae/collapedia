module.exports = {
  validateUsers(req, res, next) {
    if (req.method === "POST") {
      req.checkBody("email", "must be valid").isEmail();
      req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6});
      req.checkBody("passwordConfirmation", "must match passwordprovided").optional().matches(req.body.password);
    }

    const errors = req.validationErrors();

    if (errors) {
      return res.redirect(req.headers.referer);
    } else {
      return next();
    }
  },
}
