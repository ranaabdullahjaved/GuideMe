import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CollaborationForm.css";

const SendCollabRequest = () => {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [mentorSearch, setMentorSearch] = useState("");
  const [mentorResults, setMentorResults] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Handler for searching mentors
  const handleMentorSearch = async (input) => {
    setMentorSearch(input);
    if (input.length >= 2) {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/courses/search?query=${input}`);
        if (!response.ok) {
          throw new Error("Failed to search mentors");
        }
        const data = await response.json();
        // Filter out current user from results
        const filteredResults = data.filter(mentor => mentor.email !== user.email);
        setMentorResults(filteredResults);
      } catch (error) {
        console.error("Error searching mentors:", error);
        setError("Error searching for mentors. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setMentorResults([]);
    }
  };

  // Handler for selecting a mentor
  const handleMentorSelect = (mentor) => {
    setSelectedMentor(mentor);
    setMentorSearch(mentor.name);
    setMentorResults([]);
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMentor) {
      setError("Please select a mentor to collaborate with");
      return;
    }

    const collaborationRequest = {
      mentor: user.email,
      collabMentor: selectedMentor.email,
      title: topic,
      description,
      cost: Number(cost)
    };

    try {
      setIsLoading(true);
      setError("");
      
      const response = await fetch(`${API_URL}/api/courses/addrequest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collaborationRequest)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send collaboration request");
      }

      // Success - redirect to collaborations page
      alert("Collaboration request sent successfully!");
      navigate("/collaborations");
    } catch (error) {
      console.error("Error sending collaboration request:", error);
      setError(error.message || "Error sending collaboration request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="collab-form-container">
      <div className="collab-form-header">
        <h1>Send Collaboration Request</h1>
        <p>Find another mentor to collaborate with on a specific topic</p>
      </div>

      {error && <div className="collab-form-error">{error}</div>}

      <form className="collab-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="mentor-search">Search for a Mentor:</label>
          <div className="search-container">
            <input
              id="mentor-search"
              type="text"
              value={mentorSearch}
              onChange={(e) => handleMentorSearch(e.target.value)}
              placeholder="Enter mentor name or skill"
              className="search-input"
            />
            {isLoading && <div className="search-spinner"></div>}
          </div>
          
          {mentorResults.length > 0 && (
            <ul className="mentor-results-dropdown">
              {mentorResults.map((mentor) => (
                <li 
                  key={mentor._id} 
                  onClick={() => handleMentorSelect(mentor)}
                  className="mentor-result-item"
                >
                  <div className="mentor-result-info">
                    {mentor.avatar && (
                      <img 
                        src={`${API_URL}/uploads/${mentor.avatar}`} 
                        alt={mentor.name} 
                        className="mentor-avatar"
                      />
                    )}
                    <div className="mentor-details">
                      <span className="mentor-name">{mentor.name}</span>
                      <span className="mentor-skill">{mentor.skill}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          {mentorResults.length === 0 && mentorSearch.length >= 2 && !isLoading && (
            <div className="no-results">No mentors found with that name or skill</div>
          )}
        </div>

        {selectedMentor && (
          <div className="selected-mentor">
            <h3>Selected Mentor:</h3>
            <div className="selected-mentor-card">
              {selectedMentor.avatar && (
                <img 
                  src={`${API_URL}/uploads/${selectedMentor.avatar}`} 
                  alt={selectedMentor.name}
                  className="selected-mentor-avatar" 
                />
              )}
              <div className="selected-mentor-info">
                <span className="mentor-name">{selectedMentor.name}</span>
                <span className="mentor-skill">{selectedMentor.skill}</span>
                <span className="mentor-experience">Experience: {selectedMentor.yearsExperience} years</span>
              </div>
              <button 
                type="button" 
                className="change-mentor-btn"
                onClick={() => {
                  setSelectedMentor(null);
                  setMentorSearch("");
                }}
              >
                Change
              </button>
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="collab-topic">Collaboration Topic:</label>
          <input
            id="collab-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter the topic for collaboration"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="collab-description">Description:</label>
          <textarea
            id="collab-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the collaboration in detail"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="collab-cost">Cost (per person):</label>
          <input
            id="collab-cost"
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="Enter the cost in dollars"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate("/collaborations")}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading || !selectedMentor}
          >
            {isLoading ? "Sending..." : "Send Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendCollabRequest; 