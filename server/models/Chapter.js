const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    resources: [
        {
            type: { type: String, enum: ["pdf", "youtube", "url"], required: true },
            link: { type: String, required: true },
            linkName: { type: String },
            from: { type: Number, required: function () { return this.type === "youtube"; } }, // Only required for youtube
            to: { type: Number, required: function () { return this.type === "youtube"; } },   // Only required for youtube
        },
    ],
});



module.exports = mongoose.model("Chapter", ChapterSchema);
