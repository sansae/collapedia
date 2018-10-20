const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

const validation = require("./validation");

router.get("/users/signup", userController.signUpForm);

router.post("/users", validation.validateUsers, userController.create);

router.get("/users/signin", userController.signInForm);

router.post("/users/signin", userController.signIn);

router.get("/users/signout", userController.signOut);

router.get("/users/upgrade", userController.upgradeForm);

router.post("/users/upgrade", userController.upgrade);

router.get("/users/downgrade", userController.downgradeForm);

router.post("/users/downgrade", validation.checkPasswordConfirmation, userController.downgrade);

router.get("/users/:id", userController.show);

module.exports = router;
