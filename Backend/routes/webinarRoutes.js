// routes/webinarRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { addWebinar, getWebinars } = require('../controllers/webinarController');

// Configure Multer for webinar image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this folder exists or is auto-created
    },
    filename: (req, file, cb) => {
        const uniqueName = `webinar-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// POST /api/webinars – Add webinar (admin only)
router.post('/', upload.single('image'), addWebinar);

// GET /api/webinars – Get webinars with optional filter
router.get('/', getWebinars);

module.exports = router;
