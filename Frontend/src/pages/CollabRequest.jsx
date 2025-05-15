"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/CollaborationList.css"

const CollaborationRequestsPage = () => {
  const [requests, setRequests] = useState([])
  const [expandedRequest, setExpandedRequest] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  useEffect(() => {
    fetchCollaborationRequests()
  }, [])

  const fetchCollaborationRequests = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/api/courses/requests?collabMentor=${user.email}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch collaboration requests")
      }
      
      const data = await response.json()
      if (Array.isArray(data)) {
        setRequests(data)
      } else {
        setRequests([])
      }
    } catch (error) {
      console.error("Error fetching collaboration requests:", error)
      setMessage("Error loading collaboration requests. Please try again.")
      setRequests([])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleRequestDetails = (id) => {
    setExpandedRequest(expandedRequest === id ? null : id)
  }

  const handleAcceptRequest = async (request) => {
    try {
      setMessage("")
      const response = await fetch(`${API_URL}/api/courses/addcollabcourse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })

      if (response.ok) {
        setMessage("Collaboration request accepted successfully!")
        fetchCollaborationRequests()
      } else {
        const errorData = await response.json()
        setMessage(`Failed to accept request: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Error accepting request:", error)
      setMessage("Error accepting request. Please try again.")
    }
  }

  const handleDeclineRequest = async (request) => {
    if (!confirm("Are you sure you want to decline this collaboration request?")) {
      return
    }
    
    try {
      setMessage("")
      // We'll remove the request without adding any course
      const response = await fetch(`${API_URL}/api/courses/deleterequest`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: request._id 
        }),
      })

      if (response.ok) {
        setMessage("Collaboration request declined successfully.")
        fetchCollaborationRequests()
      } else {
        const errorData = await response.json()
        setMessage(`Failed to decline request: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Error declining request:", error)
      setMessage("Error declining request. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="collab-list-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading collaboration requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="collab-list-container">
      <div className="collab-list-header">
        <h1>Pending Collaboration Requests</h1>
        <div className="collab-actions">
          <button 
            className="view-active-btn" 
            onClick={() => navigate("/collaborations")}
          >
            View Active Collaborations
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
        {requests && requests.length > 0 ? (
          requests.map((request, index) => (
            <div
              className={`request-card ${expandedRequest === request._id ? "expanded" : ""}`}
              key={request._id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="request-card-header">
                <h2>{request.title}</h2>
                <button className="toggle-details-btn" onClick={() => toggleRequestDetails(request._id)}>
                  {expandedRequest === request._id ? "−" : "+"}
                </button>
              </div>

              <div className="request-card-preview">
                <div className="preview-item">
                  <span className="label">From:</span>
                  <span className="value">{request.mentor}</span>
                </div>
                <div className="preview-item">
                  <span className="label">Cost:</span>
                  <span className="value">${request.cost}</span>
                </div>
              </div>

              <div className="request-details">
                <div className="details-grid">
                  <div className="details-item">
                    <span className="label">Topic:</span>
                    <span className="value topic">{request.title}</span>
                  </div>
                  <div className="details-item">
                    <span className="label">Description:</span>
                    <p className="value description">{request.description}</p>
                  </div>
                </div>

                <div className="request-actions">
                  <button 
                    className="accept-btn" 
                    onClick={() => handleAcceptRequest(request)}
                  >
                    Accept
                  </button>
                  <button 
                    className="decline-btn" 
                    onClick={() => handleDeclineRequest(request)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📬</div>
            <h2>No Collaboration Requests</h2>
            <p>When other mentors send you collaboration requests, they will appear here.</p>
            <div className="empty-state-actions">
              <button 
                className="create-collab-empty-btn" 
                onClick={() => navigate("/new-collaboration")}
              >
                Create a Collaboration Request
              </button>
              <button 
                className="view-active-btn" 
                onClick={() => navigate("/collaborations")}
              >
                View Active Collaborations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollaborationRequestsPage

