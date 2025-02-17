"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/courses.css"

const CollaborationRequestsPage = () => {
  const [requests, setRequests] = useState([])
  const [expandedRequest, setExpandedRequest] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    fetchCollaborationRequests()
  }, [])

  const fetchCollaborationRequests = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`http://localhost:5000/api/courses/requests?collabMentor=${user.email}`)
      const data = await response.json()
      if (Array.isArray(data)) {
        setRequests(data)
      } else {
        setRequests([])
      }
    } catch (error) {
      console.error("Error fetching collaboration requests:", error)
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
      const response = await fetch("http://localhost:5000/api/courses/addcollabcourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })

      if (response.ok) {
        alert("Request accepted successfully!")
        fetchCollaborationRequests()
      } else {
        const errorData = await response.json()
        alert(`Failed to accept request: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Error accepting request:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading collaboration requests...</p>
      </div>
    )
  }

  return (
    <div className="collab-page">
      <div className="collab-header">
        <h1>Collaboration Requests</h1>
        <button className="add-collab-btn" onClick={() => navigate("/addcourse")}>
          Add Collaborated Course
        </button>
      </div>

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
                  <span className="label">Mentor:</span>
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
                    <span className="label">Description:</span>
                    <p className="value description">{request.description}</p>
                  </div>
                  <div className="details-item">
                    <span className="label">Collaborating Mentor:</span>
                    <span className="value">{request.collabMentor}</span>
                  </div>
                </div>

                <button className="accept-btn" onClick={() => handleAcceptRequest(request)}>
                  Accept Request
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📬</div>
            <h2>No Requests Yet</h2>
            <p>When you receive collaboration requests, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollaborationRequestsPage

