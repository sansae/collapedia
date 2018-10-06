const express = require("express");
const router = express.Router();

const collaboratorController = require("../controllers/collaboratorController");

router.get("/wikis/:id/new", collaboratorController.new);

module.exports = router;
