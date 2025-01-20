import React from "react";
import "../styles/Webinar.css";

const Webinar = () => {
  return (
    <div className="container">
      {/* Filter Section */}
      <div className="filter-section">
        <select className="filter-dropdown" defaultValue="">
          <option value="" disabled>
            Webinar Type
          </option>
          <option value="live">Live</option>
          <option value="recorded">Recorded</option>
        </select>
        <select className="filter-dropdown" defaultValue="">
          <option value="" disabled>
            Date
          </option>
          <option value="today">Today</option>
          <option value="this-week">This Week</option>
        </select>
        <select className="filter-dropdown" defaultValue="">
          <option value="" disabled>
            Topic
          </option>
          <option value="sustainability">Sustainability</option>
          <option value="technology">Technology</option>
        </select>
        <div className="search-bar">
          <input type="text" placeholder="Search" className="search-input" />
          <button className="search-button">🔍</button>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <p className="results-count">388 results found</p>
        <div className="result-card">
          <img
            src="https://via.placeholder.com/150"
            alt="Webinar"
            className="result-image"
          />
          <div className="result-content">
            <h3 className="result-title">
              SGS CSRD Pre-Assurance: A Precursor to Pinpoint Gaps and
              Weaknesses Before Full Assurance
            </h3>
            <p className="result-description">
              Our webinar explores the Corporate Sustainability Reporting
              Directive (CSRD), SGS CSRD Pre-Assurance and its purpose and
              benefits for peace of mind assurance.
            </p>
            <p className="result-type">Type: Webinar-Live</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Webinar;
