const express = require('express');
const router = express.Router();
const { updatePassword } = require('../controllers/passwordController');

router.put('/', updatePassword);

module.exports = router;
