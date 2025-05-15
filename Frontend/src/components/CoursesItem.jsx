"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const CourseItem = ({ course, userRole, style }) => {
  const navigate = useNavigate()
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [menteeName, setMenteeName] = useState("")
  const [progressStatus, setProgressStatus] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setMenteeName(parsedUser.email)
    }
  }, [])

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses/checkEnrollement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mentor: course.mentor,
            mentee: menteeName,
            courseTitle: course.title,
          }),
        })
        const data = await response.json()
        setIsEnrolled(data.isEnrolled)
      } catch {
        setIsEnrolled(false)
      }
    }
    if (menteeName) checkEnrollment()
  }, [course.mentor, course.title, menteeName])

  useEffect(() => {
    if (userRole === "mentee" && course.progress) {
      setProgressStatus(course.progress)
    }
  }, [userRole, course.progress])

  const handleStartCourse = () => {
    navigate(`/course/${course.id}`, { state: { course } })
  }

  const handleCompleteStop = () => {
    navigate(`/givefeedback/${course.id}`, { state: { course } })
  }

  const handleEditCourse = () => {
    navigate(`/edit-course/${course.id}`, { state: { course } })
  }

  const handleShowFeedback = () => {
    navigate(`/course-feedback/${course.id}`, { state: { course } })
  }

  const handleDeleteCourse = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the course "${course.title}"?`)
    if (!confirmDelete) return

    try {
      const response = await fetch("http://localhost:5000/api/courses/deleteCourse", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseTitle: course.title,
          mentor: course.mentor,
        }),
      })

      if (response.ok) {
        alert(`Course "${course.title}" deleted successfully!`)
        window.location.reload()
      } else {
        const errorData = await response.json()
        alert(`Failed to delete course: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Error deleting course:", error)
      alert("Failed to delete course. Please try again.")
    }
  }

  const startConversation = async (mentor) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"))
      const menteeId = currentUser._id || currentUser.id
      const res = await axios.post("http://localhost:5000/api/chat/conversations", {
        menteeId,
        mentorId: mentor,
      })
      navigate(`/chat/${res.data._id}`)
    } catch (err) {
      console.error("Error starting conversation:", err)
    }
  }

  const getProgressColor = () => {
    switch (progressStatus.toLowerCase()) {
      case "completed":
        return "status-completed"
      case "started":
        return "status-started"
      default:
        return "status-not-started"
    }
  }

  return (
    <div className="course-item" style={style}>
      <div className="course-item-content">
        <div className="course-header">
          <h2>{course.title}</h2>
          <div className={`status-badge ${getProgressColor()}`}>{progressStatus || "Not Started"}</div>
        </div>

        <div className="course-info">
          <div className="info-item">
            <span className="info-label">Mentor:</span>
            <span className="info-value">{course.mentor}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Cost:</span>
            <span className="info-value">${course.cost}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Rating:</span>
            <span className="info-value">{course.averageRating}/5</span>
          </div>
        </div>

        <div className="course-actions">
          {userRole === "mentee" && !isEnrolled && (
            <button className="btn-primary" onClick={handleStartCourse}>
              Start Course
            </button>
          )}

          {userRole === "mentee" && isEnrolled && (
            <div className="action-group">
              {progressStatus === "Completed" ? (
                <button className="btn-success" disabled>
                  Completed
                </button>
              ) : (
                <>
                  <button className="btn-primary" onClick={handleCompleteStop}>
                    Continue
                  </button>
                  <button className="btn-secondary" onClick={() => startConversation(course.mentor)}>
                    Chat
                  </button>
                </>
              )}
            </div>
          )}

          {userRole === "mentor" && (
            <div className="action-group">
              <button className="btn-secondary" onClick={handleEditCourse}>
                Edit Course
              </button>
              <button className="btn-primary" onClick={handleShowFeedback}>
                View Feedback
              </button>
            </div>
          )}

          {(userRole === "mentor" || userRole === "admin") && (
            <button className="btn-danger" onClick={handleDeleteCourse}>
              Delete Course
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseItem

