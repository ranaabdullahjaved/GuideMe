const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderRole: { type: String, enum: ["mentor", "mentee"], required: true },
    senderName: { type: String, required: true },
    text: { type: String, required: true },
    time: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
