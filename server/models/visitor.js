const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
    count: { type: Number, required: true },
});

module.exports = mongoose.model('Visitor', VisitorSchema);
