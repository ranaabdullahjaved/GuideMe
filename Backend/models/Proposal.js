const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    applicant: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        role: { type: String, enum: ["mentee", "mentor"], required: true }
    },
    proposalText: { type: String, required: true },
    proposedBudget: { type: Number, required: true },
    timeline: { type: String, required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Proposal", ProposalSchema);
