const mongoose = require('mongoose');
const collabCourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    cost: Number,
    mentor: String,
    collabMentor: String,
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    feedback: { type: String, default: '' }
  });
  
  module.exports = mongoose.model('CollabCourse', collabCourseSchema);