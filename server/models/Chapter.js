const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    resources: [
        {
            type: { type: String, enum: ["pdf"], required: true },
            link: { type: String, required: true },
        },
    ],
});

module.exports = mongoose.model("Chapter", ChapterSchema);
