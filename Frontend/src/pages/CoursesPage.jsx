import React, { useState, useEffect } from 'react';
import CourseList from "../components/CoursesList";
import NewCourseModal from "../components/NewCoursesModelPage";
import "../styles/courses.css";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [mentorEmail, setMentorEmail] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "https://harmonious-creation-production.up.railway.app";

  // Step 1: Retrieve user role and email from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserRole(parsedUser.role);
      setMentorEmail(parsedUser.email);
    }
  }, []);

  // Step 2: Fetch courses based on user role
  useEffect(() => {
    if (userRole) {
      fetchCourses();
    }
  }, [userRole, mentorEmail]);

  const fetchCourses = async () => {
    try {
      let url = "";
      if (userRole === "mentor") {
        // Mentor sees only their own courses
        url = `${API_URL}/api/courses/byMentor?mentor=${mentorEmail}`;
      } else {
        // Mentee sees all courses with their email as a query parameter
        url = `${API_URL}/api/courses/allcourses?mentee=${mentorEmail}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleNewCourse = () => {
    setShowNewCourseModal(true);
  };

  const handleCloseModal = () => {
    setShowNewCourseModal(false);
  };

  return (
    <div className="courses-page">
      <h1>{userRole === "mentor" ? "My Courses" : "Available Courses"}</h1>
      {userRole === "mentor" && (
        <button className="new-course-btn" onClick={handleNewCourse}>
          Add New Course
        </button>
      )}
      <CourseList courses={courses} userRole={userRole} />
      {showNewCourseModal && (
        <NewCourseModal onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default CoursesPage;
