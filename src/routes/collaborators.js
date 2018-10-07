const express = require("express");
const router = express.Router();

const collaboratorController = require("../controllers/collaboratorController");

router.get("/wikis/:id/new", collaboratorController.new);

router.post("/wikis/:id/create", collaboratorController.create);

module.exports = router;
