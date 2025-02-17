const express = require('express');
const router = express.Router();
const { createProject, getAllProjects, getProjectById, getMyPostedProjects } = require('../controllers/projectController');

router.post('/', createProject);
router.get('/', getAllProjects);
router.get('/my', getMyPostedProjects);
router.get('/:id', getProjectById);

module.exports = router;
