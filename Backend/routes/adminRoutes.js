const express = require('express');
const router = express.Router();
const { getPendingUsers, approveUser, deleteUser, getStatistics } = require('../controllers/adminController');

router.get('/statistics', getStatistics);
router.get('/pending-users', getPendingUsers);
router.put('/approve-user', approveUser);
router.delete('/delete-user', deleteUser);

module.exports = router;
