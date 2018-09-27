const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

const validation = require("./validation");

router.get("/users/signup", userController.signUpForm);

router.post("/users", validation.validateUsers, userController.create);

router.get("/users/signin", userController.signInForm);

module.exports = router;
