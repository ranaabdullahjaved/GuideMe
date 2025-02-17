"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"

const CourseDetailPage = ({ userRole }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [course, setCourse] = useState(location.state?.course || null)
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUsername(parsedUser.email)
    }
  }, [])

  const postProgress = async () => {
    const progressData = {
      courseName: course.title,
      mentee: username,
      mentor: course.mentor,
      progress: "started",
    }

    try {
      const response = await fetch("http://localhost:5000/api/courses/addprogress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(progressData),
      })

      if (response.ok) {
        console.log("Progress added successfully")
      } else {
        console.error("Failed to add progress")
      }
    } catch (error) {
      console.error("Error posting progress:", error)
    }
  }

  const handlePay = async () => {
    setIsLoading(true)
    await postProgress()
    setTimeout(() => {
      setIsLoading(false)
      navigate("/courses")
    }, 1000)
  }

  if (!course) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading course details...</p>
      </div>
    )
  }

  const feedbackEntries = course.feedback
    ? course.feedback.split(" | ").map((feedback) => {
        const match = feedback.match(/(.*?) by (.*?) rated as (.*)/)
        if (match) {
          const [_, comment, mentee, rating] = match
          return { comment, mentee, rating }
        }
        return { comment: feedback, mentee: "Unknown", rating: "N/A" }
      })
    : []

  return (
    <div className="course-detail-container">
      <div className="course-header">
        <h1 className="course-title">{course.title}</h1>
        <div className="course-meta">
          <div className="meta-item">
            <span className="meta-label">Mentor</span>
            <span className="meta-value">{course.mentor}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Cost</span>
            <span className="meta-value price">${course.cost}</span>
          </div>
        </div>
      </div>

      <div className="course-description">
        <h2>Description</h2>
        <p>{course.description}</p>
      </div>

      <div className="reviews-section">
        <h2>Reviews</h2>
        <div className="reviews-grid">
          {feedbackEntries.length > 0 ? (
            feedbackEntries.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-content">
                  <p className="review-text">{review.comment}</p>
                  <div className="review-meta">
                    <span className="review-author">by {review.mentee}</span>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`star ${i < Number.parseInt(review.rating) ? "filled" : ""}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-reviews">No reviews available yet</p>
          )}
        </div>
      </div>

      {userRole === "mentee" && (
        <div className="action-section">
          <button className={`pay-button ${isLoading ? "loading" : ""}`} onClick={handlePay} disabled={isLoading}>
            {isLoading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      )}
    </div>
  )
}

export default CourseDetailPage

