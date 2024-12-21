const express = require("express");
const multer = require("multer");
const { uploadFile } = require("../controllers/dropController"); // Import controller function

// Set up multer for file uploads (using memory storage for simplicity)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Define route for file upload
router.post("/upload", upload.single("file"), uploadFile);

module.exports = router;
