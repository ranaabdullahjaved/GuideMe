const mongoose = require('mongoose');

const progressbarSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true
  },
  mentee: {
    type: String,
    required: true
  },
  mentor: {
    type: String,
    required: true
  },
  progress: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Progressbar = mongoose.model('Progressbar', progressbarSchema);

module.exports = Progressbar;
