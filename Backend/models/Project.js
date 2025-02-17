const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true }, // e.g., "2 weeks"
    budget: { type: Number, required: true },
    requiredSkills: { type: [String], required: true },
    postedBy: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        role: { type: String, enum: ['mentee', 'mentor'], required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
