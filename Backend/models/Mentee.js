const mongoose = require('mongoose');

const MenteeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skill: { type: String, required: true },
    avatar: { type: String }, // filename of uploaded profile image
    isApproved: { type: Boolean, default: false } // new field
}, { timestamps: true });

module.exports = mongoose.model('Mentee', MenteeSchema);
