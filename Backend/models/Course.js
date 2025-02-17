const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    cost: Number,
    mentor: String,
    averageRating: Number,
    ratingCount: { type: Number, default: 0 },
    feedback: String,
  });
  
  module.exports = mongoose.model('Course', courseSchema);
  