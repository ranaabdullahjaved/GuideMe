import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MentorSearchPage.css";

const MentorSearchPage = () => {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch mentors from backend based on search term
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/search`, {
          params: { searchTerm }, // Pass searchTerm as query parameter
        });
        setMentors(response.data);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };

    if (searchTerm.trim() !== "") {
      fetchMentors();
    } else {
      setMentors([]); // Clear mentors when searchTerm is empty
    }
  }, [searchTerm]);

  return (
    <div className="mentor-search-page">
      <h1>Find Your Mentor</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mentor-list">
        {mentors.length > 0 ? (
          mentors.map((mentor, index) => (
            <div className="mentor-card" key={index}>
              <div className="mentor-info">
                <h2>{mentor.name}</h2>
                <p>{mentor.role}</p>
                <p>
                  <strong>Skills:</strong> {mentor.skill}
                </p>
                <p>
                  <strong>Email:</strong> {mentor.email}
                </p>
                <button className="view-profile">View Profile</button>
              </div>
            </div>
          ))
        ) : (
          <p>No mentors found. Try searching for a different term.</p>
        )}
      </div>
    </div>
  );
};

export default MentorSearchPage;
