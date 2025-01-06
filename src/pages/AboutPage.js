import React, { useState } from 'react';
import '../styles/About.css';  // Import the CSS file

function About() {
  const [activeTab, setActiveTab] = useState('mission');  // State for active tab

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);  // Switch the active tab
  };

  return (
    <div className="about-container">
      {/* Header Section */}
      <div className="about-header">
        <h1>GuideMe: Navigate Your Career with Expert Mentorship</h1>
      </div>

      {/* Main Content */}
      <div className="about-body">
        <div className="about-content">
          <div className="tab-switch">
            <button
              className={`tab ${activeTab === 'mission' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('mission')}
            >
              Our Mission
            </button>
            <button
              className={`tab ${activeTab === 'vision' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('vision')}
            >
              Our Vision
            </button>
            <button
              className={`tab ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('team')}
            >
              Meet the Team
            </button>
          </div>
          <div className="about-content-text">
            {activeTab === 'mission' && (
              <p>
                GuideMe introduces an innovative platform that reshapes mentorship dynamics in the coding and software development space.
                By bridging the gap between aspiring developers and experienced mentors, the platform facilitates seamless collaboration and real-time updates.
                It fosters personalized mentorship through features such as session scheduling, code review, contract creation, and billing management.
                GuideMe empowers both mentees and mentors by optimizing availability and ensuring a productive learning environment.
              </p>
            )}
            {activeTab === 'vision' && (
              <p>
                Our vision is to create a dynamic and interconnected space where aspiring developers have the resources and expert guidance to advance their careers.
                GuideMe aims to offer a comprehensive mentorship experience that goes beyond traditional methods, ensuring a meaningful partnership between learners and mentors.
                By fostering the growth of new talents, we aspire to contribute to advancements in technology and innovation across the globe.
              </p>
            )}
            {activeTab === 'team' && (
              <div>
                <p>Meet the talented team behind GuideMe:</p>
                <ul className="team-list">
                  <li>Muhammad Hashir</li>
                  <li>Rana Abdullah Javed</li>
                  <li>Hooria Nadeem</li>
                  <li>Mr. Muhammad Usama Hassan Alvi - Project Advisor</li>
                </ul>
                <p>
                  Together, we work to bridge the gap between aspiring developers and mentors, helping them achieve personal and professional growth.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="about-footer">
        <p>&copy; 2025 GuideMe - All Rights Reserved</p>
      </div>
    </div>
  );
}

export default About;
