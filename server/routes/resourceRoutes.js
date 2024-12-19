const express = require("express");
const { getResources } = require("../controllers/resourceController");
const { addResource } = require("../controllers/resourceController");

const router = express.Router();

// Example: GET /api/resources?branch=Computer&semester=1&subject=Math&topic=Calculus
router.get("/", getResources);
router.post("/", addResource);

module.exports = router;
