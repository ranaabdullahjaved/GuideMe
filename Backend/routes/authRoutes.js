const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { signup, login, searchMentors, verifyEmail } = require('../controllers/authController');

// Configure Multer for signup image and document uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// Accept multiple files for mentor signup
router.post('/signup', upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'educationCertificate', maxCount: 1 },
    { name: 'workExperienceLetter', maxCount: 1 }
]), signup);
router.post('/login', login);
router.get('/search', searchMentors);

// Route for email verification
router.get('/verify-email/:token', verifyEmail);

module.exports = router;
