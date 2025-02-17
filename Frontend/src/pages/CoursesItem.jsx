import { useNavigate } from "react-router-dom"

const CourseItem = ({ course, userRole }) => {
  const navigate = useNavigate()

  const handleStartCourse = () => {
    navigate(`/course/${course.id}`)
  }

  const handleEditCourse = () => {
    navigate(`/edit-course/${course.id}`)
  }

  const handleShowFeedback = () => {
    navigate(`/course-feedback/${course.id}`)
  }

  return (
    <div className="course-item">
      <h2>{course.title}</h2>
      <p>Mentor: {course.mentorName}</p>
      <p>Cost: ${course.cost}</p>
      <p>Rating: {course.averageRating}/5</p>
      {userRole === "mentee" && !course.enrolled && <button onClick={handleStartCourse}>Start Course</button>}
      {userRole === "mentee" && course.enrolled && (
        <div>
          <button onClick={() => navigate(`/stop-course/${course.id}`)}>Stop Course</button>
          <button onClick={() => navigate(`/complete-course/${course.id}`)}>Completed</button>
          <button onClick={() => navigate(`/chat/${course.id}`)}>Start Chat</button>
        </div>
      )}
      {userRole === "mentor" && (
        <div>
          <button onClick={handleEditCourse}>Edit</button>
          <button onClick={handleShowFeedback}>Show Feedbacks</button>
        </div>
      )}
    </div>
  )
}

export default CourseItem

