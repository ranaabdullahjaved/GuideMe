const express = require('express');
const router = express.Router();
const { signup, login, searchMentors } = require('../controllers/authController');

// Signup for mentors and mentees
router.post('/signup', signup);

// Login for mentors, mentees, and admin
router.post('/login', login);

// Search mentors endpoint
router.get('/mentors/search', searchMentors);

module.exports = router;
