// models/Conversation.js
const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
    menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentee", required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Conversation", ConversationSchema);
