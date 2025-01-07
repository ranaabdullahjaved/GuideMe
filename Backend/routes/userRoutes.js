const express = require('express');
const { signup, login,searchMentors } = require('../controller/UserController');
const router = express.Router();

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);
router.get('/search', searchMentors);

module.exports = router;
