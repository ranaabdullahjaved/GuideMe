const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { signup, login, searchMentors } = require('../controllers/authController');

// Configure Multer for signup image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        const uniqueName = `avatar-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

router.post('/signup', upload.single('avatar'), signup);
router.post('/login', login);
router.get('/search', searchMentors);

module.exports = router;
