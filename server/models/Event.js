const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    holidays: { type: String, default: null },
    examination: { type: String, default: null },
    academicActivities: { type: String, default: null },
    extraCurricularActivities: { type: String, default: null },
    specialDaysJayantis: { type: String, default: null },
});

module.exports = mongoose.model("Event", eventSchema);
