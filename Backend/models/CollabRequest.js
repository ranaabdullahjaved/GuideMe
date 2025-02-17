const mongoose = require('mongoose');

// CollaborationRequest Schema
const collaborationRequestSchema = new mongoose.Schema({
  mentor: String,
  collabMentor: String,
  title: String,
  description: String,
  cost: Number
});

module.exports = mongoose.model('CollaborationRequest', collaborationRequestSchema);
