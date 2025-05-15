const Course = require('../models/Course'); // Adjust the path as needed
const Progressbar=require('../models/ProgressBar');
const CollabCourse=require('../models/CollabCourse');
const CollaborationRequest=require('../models/CollabRequest');
const Mentor = require('../models/Mentor');

// Controller function to retrieve all courses
const getAllCourses = async (req, res) => {
    try {
      const { mentee } = req.query;
  
      // Retrieve all courses
      const courses = await Course.find();
  
      // Map over courses and retrieve the progress for each course
      const coursesWithProgress = await Promise.all(courses.map(async (course) => {
        let progress = "Not Started";
  
        // Check if a mentee is provided, and retrieve progress accordingly
        if (mentee) {
            console.log('yes mentee');
          const progressEntry = await Progressbar.findOne({
            courseName: course.title,
            mentee: mentee,
            mentor: course.mentor
            
          });
          if (progressEntry) {
            console.log('yes progress entry');
            progress = progressEntry.progress;
          }
        } else {
          // If no mentee provided, retrieve general progress
          const progressEntry = await Progressbar.findOne({
            courseName: course.title,
            mentor: course.mentor
          });
          if (progressEntry) {
            progress = progressEntry.progress;
          }
        }
        console.log(progress);
  
        // Add the progress field
        return {
          ...course._doc,
          progress
        };
      }));
  
      // Send the modified courses back to the client
      res.status(200).json(coursesWithProgress);
    } catch (error) {
      console.error('Error retrieving courses with progress:', error);
      res.status(500).json({ message: 'Error retrieving courses with progress', error: error.message });
    }
  };
  const deleteCourse = async (req, res) => {
    try {
      const { courseTitle, mentor } = req.body;
  
      if (!courseTitle || !mentor) {
        return res.status(400).json({ message: "Course title and mentor are required" });
      }
  
      // Delete the course
      const deletedCourse = await Course.findOneAndDelete({ title: courseTitle, mentor });
  
      if (!deletedCourse) {
        return res.status(404).json({ message: "Course not found for the given mentor" });
      }
  
      // Delete all related progress entries
      const deletedProgress = await Progressbar.deleteMany({ courseName: courseTitle, mentor });
  
      res.status(200).json({ 
        message: "Course and associated progress entries deleted successfully", 
        deletedCourse, 
        deletedProgress 
      });
    } catch (error) {
      console.error("Error deleting course and progress entries:", error);
      res.status(500).json({ 
        message: "Error deleting course and progress entries", 
        error: error.message 
      });
    }
  };
  
const addCourse = async (req, res) => {
    try {
        // console.log("Request Body:", req.body);
        const newCourse = new Course(req.body);
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        res.status(500).json({ message: 'Error adding course', error: error.message });
    }
};
const getCoursesByMentor = async (req, res) => {
    try {
        const { mentor } = req.query;
        const courses = await Course.find({ mentor });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving courses by mentor', error: error.message });
    }
};
const updateCourseByMentor = async (req, res) => {
    try {
      const { originalTitle, title, description, cost, mentor } = req.body;
  
      // Validate inputs
      if (!originalTitle || !title || !description || cost === undefined || !mentor) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Find the course by mentor and original title
      const course = await Course.findOne({ title: originalTitle, mentor });
  
      if (!course) {
        return res.status(404).json({ message: "Course not found for the given mentor" });
      }
  
      // Update the course details
      course.title = title;
      course.description = description;
      course.cost = cost;
  
      const updatedCourse = await course.save();
  
      res.status(200).json({ message: "Course updated successfully", updatedCourse });
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ message: "Error updating course", error: error.message });
    }
  };
const addFeedback = async (req, res) => {
    try {
      const { title, mentor, mentee, feedback, rating } = req.body;
  
      // Validate inputs
      if (!title || !mentor || !mentee || !feedback || rating === undefined) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Find the course with the same title and mentor
      const course = await Course.findOne({ title, mentor });
  
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      // Concatenate new feedback with existing feedbacks
      const newFeedbackEntry = `${feedback} by ${mentee} rated as ${rating}`;
      const updatedFeedback = course.feedback
        ? `${course.feedback} | ${newFeedbackEntry}`
        : newFeedbackEntry;
  
      // Calculate the new average rating
      const totalRatings = (course.averageRating * (course.ratingCount || 0)) + rating;
      const newRatingCount = (course.ratingCount || 0) + 1;
      const newAverageRating = totalRatings / newRatingCount;
  
      // Update the course with the new feedback and rating
      course.feedback = updatedFeedback;
      course.averageRating = newAverageRating;
      course.ratingCount = newRatingCount;
  
      const updatedCourse = await course.save();
  
      // Update progress to 'Completed' in the Progressbar collection
      const updatedProgress = await Progressbar.updateOne(
        { courseName: title, mentee, mentor },
        { $set: { progress: "Completed" } }
      );
  
      if (updatedProgress.modifiedCount === 0) {
        return res.status(404).json({ message: "Progress entry not found for the given mentee and mentor" });
      }
  
      res.status(200).json({ 
        message: "Feedback added successfully, progress updated to Completed", 
        course: updatedCourse 
      });
  
    } catch (error) {
      console.error("Error adding feedback and updating progress:", error);
      res.status(500).json({ 
        message: "Error adding feedback and updating progress", 
        error: error.message 
      });
    }
  };
const addProgressbar = async (req, res) => {
    try {
        // console.log(req.body);
      const {  courseName, mentee, mentor, progress } = req.body;
  
      // Validate request fields
      if ( !courseName || !mentor || !mentee || progress === undefined) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Create and save a new Progressbar document
      const progressEntry = new Progressbar({
        courseName,
        mentor,
        mentee,
        progress,
      });
  
      const savedProgress = await progressEntry.save();
      res.status(201).json({
        message: "Progress added successfully",
        progress: savedProgress,
      });
    } catch (error) {
      console.error("Error adding progress:", error);
      res.status(500).json({
        message: "Failed to add progress",
        error: error.message,
      });
    }
  };
const checkEnrollment = async (req, res) => {
    console.log(req.body);
    const { mentor, mentee, courseTitle } = req.body;
    let isEnrolled = false;
  
    try {
      // Strict AND condition for all fields
      const progressEntry = await Progressbar.findOne({
        $and: [
          { courseName: courseTitle },
          { mentee: mentee },
          { mentor: mentor },
        //   { progress: "started" }
        ]
      });
  
      if (progressEntry) {
        isEnrolled = true;
        console.log(isEnrolled);
      }
    } catch (error) {
      // Do nothing, fallback to false
    }
    console.log(isEnrolled);
    // Return only enrollment status
    res.json({ isEnrolled });
  };
  const getCollaborationRequests = async (req, res) => {
    const { collabMentor } = req.query;
    try {
      const requests = await CollaborationRequest.find({ collabMentor });
      if (requests.length === 0) {
        return res.status(200).json({ message: 'No collaboration requests found' });
      }
      res.status(200).json(requests);
    } catch (error) {
      console.error('Error retrieving collaboration requests:', error);
      res.status(500).json({ message: 'Failed to retrieve collaboration requests', error: error.message });
    }
  };
  
  const acceptCollaborationRequest = async (req, res) => {
    const { mentor, collabMentor, title, description, cost } = req.body;
  
    try {
      // Add the course twice: once for mentor and once for collabMentor, with doubled cost
      const mentorCourse = new Course({
        title,
        description,
        cost: cost * 2,
        mentor,
        averageRating: 0,
        feedback: ''
      });
  
      const collabMentorCourse = new Course({
        title,
        description,
        cost: cost * 2,
        mentor: collabMentor,
        averageRating: 0,
        feedback: ''
      });
  
      await mentorCourse.save();
      await collabMentorCourse.save();
  
      // Add the course to the CollabCourse collection
      const newCollabCourse = new CollabCourse({
        title,
        description,
        cost,
        mentor,
        collabMentor,
        averageRating: 0,
        ratingCount: 0,
        feedback: ''
      });
  
      await newCollabCourse.save();
  
      // Delete the corresponding collaboration request
      await CollaborationRequest.deleteOne({ mentor, collabMentor, title });
  
      res.status(201).json({ message: 'Collaboration request accepted, courses added successfully' });
    } catch (error) {
      console.error('Error accepting collaboration request:', error);
      res.status(500).json({ message: 'Failed to accept collaboration request', error: error.message });
    }
  };
  const searchMentors = async (req, res) => {
    const { query } = req.query;
    try {
      const mentors = await Mentor.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { skill: { $regex: query, $options: 'i' } }
        ]
      });
      res.status(200).json(mentors);
    } catch (error) {
      console.error('Error searching mentors:', error);
      res.status(500).json({ message: 'Failed to search mentors', error: error.message });
    }
  };
  const addCollaborationRequest = async (req, res) => {
    const { mentor, collabMentor, title, description, cost } = req.body;
  
    try {
      const newRequest = new CollaborationRequest({
        mentor,
        collabMentor,
        title,
        description,
        cost
      });
  
      await newRequest.save();
      return res.status(201).json({ message: 'Collaboration request sent successfully' });
    } catch (error) {
      console.error('Error adding collaboration request:', error);
      res.status(500).json({ message: 'Failed to add collaboration request', error: error.message });
    }
  };
const deleteCollaborationRequest = async (req, res) => {
  const { id } = req.body;
  
  try {
    const deletedRequest = await CollaborationRequest.findByIdAndDelete(id);
    
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Collaboration request not found' });
    }
    
    res.status(200).json({ message: 'Collaboration request deleted successfully' });
  } catch (error) {
    console.error('Error deleting collaboration request:', error);
    res.status(500).json({ message: 'Failed to delete collaboration request', error: error.message });
  }
};

const getCollaborations = async (req, res) => {
  const { email } = req.query;
  try {
    // Find all collaborations where the user is either a mentor or collaborating mentor
    const collaborations = await CollabCourse.find({
      $or: [
        { mentor: email },
        { collabMentor: email }
      ]
    });
    
    res.status(200).json(collaborations);
  } catch (error) {
    console.error('Error retrieving collaborations:', error);
    res.status(500).json({ message: 'Failed to retrieve collaborations', error: error.message });
  }
};

// module.exports = { updateCourse };

module.exports = { 
  addCollaborationRequest,
  deleteCollaborationRequest,
  searchMentors,
  getAllCourses,
  addCourse,
  getCoursesByMentor,
  updateCourseByMentor,
  addFeedback,
  addProgressbar,
  checkEnrollment,
  deleteCourse,
  getCollaborationRequests,
  acceptCollaborationRequest,
  getCollaborations
};