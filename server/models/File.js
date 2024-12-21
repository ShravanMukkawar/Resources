const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester", required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  fileLink: { type: String, required: true }, // Link to the uploaded file on Dropbox
}, { timestamps: true });

module.exports = mongoose.model("File", FileSchema);
