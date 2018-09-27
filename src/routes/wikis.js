const express = require("express");
const router = express.Router();

const wikiController = require("../controllers/wikiController");

router.get("/wikis", wikiController.wiki);

router.get("/wikis/new", wikiController.new);

module.exports = router;
