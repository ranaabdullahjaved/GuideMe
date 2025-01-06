import React, { useState } from "react";
import "./Styles/MentorSearchPage.css";

const MentorSearchPage = () => {
  // Simulating mentor data
  const [mentors, setMentors] = useState([
    {
      id: 1,
      name: "Abhishek Jakhar",
      role: "Senior Software Engineer at Coinbase",
      skills: ["React", "CSS", "JavaScript", "Web Development"],
      image: "https://via.placeholder.com/80",
    },
    {
      id: 2,
      name: "Abhishek Koserwal",
      role: "Principal Software Engineer at Red Hat",
      skills: ["Product Management", "Career Growth", "Startup"],
      image: "https://via.placeholder.com/80",
    },
    {
      id: 3,
      name: "John Doe",
      role: "Frontend Developer at Google",
      skills: ["React", "TypeScript", "GraphQL"],
      image: "https://via.placeholder.com/80",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // Filter mentors based on search term
  const filteredMentors = mentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.skills.some((skill) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="mentor-search-page">
      <h1>Find Your Mentor</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, role, or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mentor-list">
        {filteredMentors.map((mentor) => (
          <div className="mentor-card" key={mentor.id}>
            <img
              src={mentor.image}
              alt={mentor.name}
              className="mentor-image"
            />
            <div className="mentor-info">
              <h2>{mentor.name}</h2>
              <p>{mentor.role}</p>
              <p>
                <strong>Skills:</strong> {mentor.skills.join(", ")}
              </p>
              <button className="view-profile">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorSearchPage;
