const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getProfile, updateProfile } = require('../controllers/profileController');

// Configure Multer for profile update (optional image update)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `avatar-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

router.get('/:id/:role', getProfile);
router.put('/', upload.single('avatar'), updateProfile);

module.exports = router;
