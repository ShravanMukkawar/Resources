const mongoose = require("mongoose");

const SemesterSchema = new mongoose.Schema({
    number: { type: Number, required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
});

module.exports = mongoose.model("Semester", SemesterSchema);
