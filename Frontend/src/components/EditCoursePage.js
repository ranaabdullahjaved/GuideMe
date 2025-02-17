"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

const EditCoursePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)

  useEffect(() => {
    // Fetch course details
    fetchCourseDetails(id)
  }, [id])

  const fetchCourseDetails = async (courseId) => {
    // API call to fetch course details
    // Update course state
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // API call to update course
    navigate("/courses")
  }

  if (!course) return <div>Loading...</div>

  return (
    <div className="edit-course">
      <h1>Edit Course</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          required
        />
        <textarea
          value={course.description}
          onChange={(e) => setCourse({ ...course, description: e.target.value })}
          required
        />
        <input
          type="number"
          value={course.cost}
          onChange={(e) => setCourse({ ...course, cost: Number.parseFloat(e.target.value) })}
          required
        />
        <button type="submit">Update Course</button>
      </form>
    </div>
  )
}

export default EditCoursePage

