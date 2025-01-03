const express = require("express");
const eventController = require("../controllers/eventController");
const router = express.Router();

// Example: GET /api/resources?branch=Computer&semester=1&subject=Math&topic=Calculus
router.get("/", eventController.getEvents);
router.post("/", eventController.addEvent);
router.patch("/", eventController.updateAllEventsDate);
router.delete("/", eventController.deleteEvent);
router.get("/:date", eventController.getEventByDate);
router.post("/file", eventController.addEventsFromCSV);

module.exports = router;
