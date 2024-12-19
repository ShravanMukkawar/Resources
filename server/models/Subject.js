const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester" },
});

module.exports = mongoose.model("Subject", SubjectSchema);
