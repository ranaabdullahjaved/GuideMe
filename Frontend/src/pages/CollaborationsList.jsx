import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/CollaborationList.css"

const CollaborationsList = () => {
  const [collaborations, setCollaborations] = useState([])
  const [expandedCollab, setExpandedCollab] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  useEffect(() => {
    fetchCollaborations()
  }, [])

  const fetchCollaborations = async () => {
    try {
      setIsLoading(true)
      // Fetch collaborations where the current user is either the mentor or collabMentor
      const response = await fetch(`${API_URL}/api/courses/collaborations?email=${user.email}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch collaborations")
      }
      
      const data = await response.json()
      if (Array.isArray(data)) {
        setCollaborations(data)
      } else {
        setCollaborations([])
      }
    } catch (error) {
      console.error("Error fetching collaborations:", error)
      setMessage("Error loading collaborations. Please try again.")
      setCollaborations([])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCollabDetails = (id) => {
    setExpandedCollab(expandedCollab === id ? null : id)
  }

  if (isLoading) {
    return (
      <div className="collab-list-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading collaborations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="collab-list-container">
      <div className="collab-list-header">
        <h1>Active Collaborations</h1>
        <div className="collab-actions">
          <button 
            className="view-requests-btn" 
            onClick={() => navigate("/collaborations/requests")}
          >
            View Requests
          </button>
          <button 
            className="create-collab-btn" 
            onClick={() => navigate("/new-collaboration")}
          >
            <span className="plus-icon">+</span> Create New Collaboration
          </button>
        </div>
      </div>

      {message && <div className="collab-message">{message}</div>}

      <div className="requests-grid">
        {collaborations && collaborations.length > 0 ? (
          collaborations.map((collab, index) => (
            <div
              className={`request-card ${expandedCollab === collab._id ? "expanded" : ""}`}
              key={collab._id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="request-card-header">
                <h2>{collab.title}</h2>
                <button className="toggle-details-btn" onClick={() => toggleCollabDetails(collab._id)}>
                  {expandedCollab === collab._id ? "−" : "+"}
                </button>
              </div>

              <div className="request-card-preview">
                <div className="preview-item">
                  <span className="label">Primary Mentor:</span>
                  <span className="value">{collab.mentor}</span>
                </div>
                <div className="preview-item">
                  <span className="label">Collaborating Mentor:</span>
                  <span className="value">{collab.collabMentor}</span>
                </div>
                <div className="preview-item">
                  <span className="label">Cost:</span>
                  <span className="value">${collab.cost * 2}</span>
                </div>
              </div>

              <div className="request-details">
                <div className="details-grid">
                  <div className="details-item">
                    <span className="label">Topic:</span>
                    <span className="value topic">{collab.title}</span>
                  </div>
                  <div className="details-item">
                    <span className="label">Description:</span>
                    <p className="value description">{collab.description}</p>
                  </div>
                  {collab.feedback && (
                    <div className="details-item">
                      <span className="label">Feedback:</span>
                      <p className="value feedback">{collab.feedback}</p>
                    </div>
                  )}
                  {collab.averageRating > 0 && (
                    <div className="details-item">
                      <span className="label">Rating:</span>
                      <div className="value rating">
                        {collab.averageRating.toFixed(1)} ({collab.ratingCount} {collab.ratingCount === 1 ? 'rating' : 'ratings'})
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🤝</div>
            <h2>No Active Collaborations</h2>
            <p>You don't have any active collaborations with other mentors yet.</p>
            <div className="empty-state-actions">
              <button 
                className="create-collab-empty-btn" 
                onClick={() => navigate("/new-collaboration")}
              >
                Create a Collaboration Request
              </button>
              <button 
                className="view-requests-btn" 
                onClick={() => navigate("/collaborations/requests")}
              >
                View Pending Requests
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollaborationsList 