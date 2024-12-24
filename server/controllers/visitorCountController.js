const Visitor = require('../models/visitor');
const Feedback = require('../models/Feedback');

// Get visitor count
const getVisitorCount = async (req, res) => {
    try {
        let visitor = await Visitor.findOne();
        if (!visitor) {
            visitor = new Visitor({ count: 0 });
            await visitor.save();
        }
        res.status(200).json({ count: visitor.count });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch visitor count' });
    }
};
const submitFeedback = async (req, res) => {
    try {
        const { name, branch, suggestion } = req.body;
        const newFeedback = new Feedback({ name, branch, suggestion });
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit feedback.' });
    }
};

const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find();
        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch feedback.' });
    }
};
// Increment visitor count
const incrementVisitorCount = async (req, res) => {
    try {
        let visitor = await Visitor.findOne();
        if (!visitor) {
            visitor = new Visitor({ count: 1 });
        } else {
            visitor.count += 1;
        }
        await visitor.save();
        res.status(200).json({ count: visitor.count });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update visitor count' });
    }
};

module.exports = {
    getVisitorCount,
    incrementVisitorCount,
    submitFeedback,
    getAllFeedback
};
