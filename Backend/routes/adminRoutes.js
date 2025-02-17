const express = require('express');
const router = express.Router();
const { getPendingUsers, approveUser, deleteUser } = require('../controllers/adminController');

router.get('/pending-users', getPendingUsers);
router.put('/approve-user', approveUser);
router.delete('/delete-user', deleteUser);

module.exports = router;
