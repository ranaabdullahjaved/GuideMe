"use client"

import { useState } from "react"
import {  useNavigate, useLocation } from "react-router-dom"
const FeedbackModal = ({ userRole }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const navigate = useNavigate()
  const location = useLocation()

  const [course, setCourse] = useState(location.state?.course || null)
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : {};
  const menteeEmail = user.email;
  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      title: course.title,
      mentor: course.mentor,
      mentee: menteeEmail,
      feedback:comment,
      rating: parseFloat(rating),
    };

    try {
      const response = await fetch("http://localhost:5000/api/courses/addFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Feedback submitted successfully!");
        navigate("/courses");
      } else {
        alert(`Failed to submit feedback: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Course Feedback</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Rating:
            <select value={rating} onChange={(e) => setRating(Number.parseInt(e.target.value))}>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
          <textarea placeholder="Your feedback" value={comment} onChange={(e) => setComment(e.target.value)} required />
          <button type="submit">Submit Feedback</button>
          {/* <button type="button" onClick={onClose}>
            Cancel
          </button> */}
        </form>
      </div>
    </div>
  )
}

export default FeedbackModal

