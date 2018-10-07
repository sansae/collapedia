const express = require("express");
const router = express.Router();

const collaboratorController = require("../controllers/collaboratorController");

router.get("/wikis/:id/new", collaboratorController.new);

router.post("/wikis/:id/create", collaboratorController.create);

router.post("/wikis/:id/destroyCollaborator", collaboratorController.destroy);

module.exports = router;
