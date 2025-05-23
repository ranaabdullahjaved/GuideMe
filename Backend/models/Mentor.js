const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skill: { type: String, required: true },
    education: { type: String, required: true },
    yearsExperience: { type: Number, required: true },
    linkedin: { type: String, required: true },
    avatar: { type: String },
    isApproved: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    isLinkedinVerified: { type: Boolean, default: false },
    educationCertificate: { type: String },
    github: { type: String },
    workExperienceLetter: { type: String },
    references: [{
        name: { type: String },
        email: { type: String },
        phone: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Mentor', MentorSchema);
