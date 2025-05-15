// models/Webinar.js
const mongoose = require('mongoose');

const WebinarSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    hostName: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    link: { type: String, required: true },
    type: { type: String, enum: ['live', 'recorded'], required: true },
    topic: { type: String },
    image: { type: String }, // optional thumbnail image filename
}, { timestamps: true });

module.exports = mongoose.model('Webinar', WebinarSchema);
