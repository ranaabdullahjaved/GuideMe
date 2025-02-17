"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EditCoursePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state;

  // Initialize state with existing course details
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [cost, setCost] = useState(course.cost);
  const [originalTitle] = useState(course.title);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve mentor email from localStorage
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : {};
    const mentor = user.email;

    const updatedCourse = {
      originalTitle, // original course title for identification
      title,
      description,
      cost: Number.parseFloat(cost),
      mentor: mentor,
    };

    try {
      const response = await fetch("http://localhost:5000/api/courses/updateCourseByMentor", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCourse),
      });

      if (response.ok) {
        alert("Course updated successfully!");
        navigate("/courses");
      } else {
        const errorData = await response.json();
        alert(`Failed to update course: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Error updating course. Please try again.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Course</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Course Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
          />
          <button type="submit">Update Course</button>
          <button type="button" onClick={() => navigate("/courses")}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCoursePage;
