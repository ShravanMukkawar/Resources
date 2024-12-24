const express = require('express');
const { getVisitorCount, incrementVisitorCount,submitFeedback,getAllFeedback} = require('../controllers/visitorCountController');

const router = express.Router();

// Route to get visitor count
router.get('/visitor-count', getVisitorCount);

// Route to increment visitor count
router.post('/visitor-count', incrementVisitorCount);
router.post('/feedback', submitFeedback);
router.get('/feedback', getAllFeedback);

module.exports = router;
