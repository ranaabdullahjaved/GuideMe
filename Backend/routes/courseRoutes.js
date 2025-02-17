const express = require('express');
const router = express.Router();
const { searchMentors,addCollaborationRequest,getAllCourses,addCourse,getCoursesByMentor,updateCourseByMentor,addFeedback, addProgressbar,checkEnrollment,deleteCourse,getCollaborationRequests,acceptCollaborationRequest } = require('../controllers/courseController');

// Signup for mentors and mentees
router.get('/allcourses', getAllCourses);
router.post('/addcourse',addCourse);
router.get('/byMentor', getCoursesByMentor);
router.post('/addprogress',addProgressbar);
router.post('/checkEnrollement',checkEnrollment);
router.post('/addFeedback',addFeedback);
router.put('/updateCourseByMentor', updateCourseByMentor);
router.delete('/deleteCourse', deleteCourse);
router.get('/requests',getCollaborationRequests);
router.post('/addrequest',addCollaborationRequest);
router.get('/search',searchMentors);
router.post('/addcollabcourse',acceptCollaborationRequest)



module.exports = router;