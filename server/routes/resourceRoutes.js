const express = require("express");
const { getResources, updateResource, addResource } = require("../controllers/resourceController");

const router = express.Router();

// Example: GET /api/resources?branch=Computer&semester=1&subject=Math&topic=Calculus
router.get("/", getResources);
router.post("/", addResource);
router.patch("/", updateResource);

module.exports = router;
