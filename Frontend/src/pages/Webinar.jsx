// src/pages/Webinar.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Webinar.css";

const Webinar = () => {
  const [webinars, setWebinars] = useState([]);
  const [filter, setFilter] = useState("upcoming"); // "upcoming", "7days", or "6months"
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    type: "live",
    topic: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  // Get user info to know if admin (only admin can add webinars)
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchWebinars = async () => {
    try {
      // If filter is "upcoming", we pass no filter query (or empty string)
      const params = filter === "upcoming" ? {} : { filter };
      const res = await axios.get("https://harmonious-creation-production.up.railway.app/api/webinars", { params });
      setWebinars(res.data);
    } catch (error) {
      console.error("Error fetching webinars:", error);
    }
  };

  useEffect(() => {
    fetchWebinars();
  }, [filter]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });
      if (imageFile) {
        payload.append("image", imageFile);
      }
      const res = await axios.post("https://harmonious-creation-production.up.railway.app/api/webinars", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
      fetchWebinars(); // refresh the webinar list
      setShowForm(false);
    } catch (error) {
      console.error("Error adding webinar:", error);
      setMessage("Error adding webinar");
    }
  };

  return (
    <div className="container">
      <div className="filter-section">
        <label htmlFor="filterSelect">Filter By:</label>
        <select
          id="filterSelect"
          className="filter-dropdown"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="upcoming">Upcoming</option>
          <option value="7days">Past 7 Days</option>
          <option value="6months">Past 6 Months</option>
        </select>
      </div>

      {user && user.role === "admin" && (
        <div className="admin-add-webinar">
          <button onClick={() => setShowForm(!showForm)} className="add-webinar-btn">
            {showForm ? "Cancel" : "Add Webinar"}
          </button>
          {showForm && (
            <form onSubmit={handleSubmit} className="webinar-form">
              <input
                type="text"
                name="title"
                placeholder="Webinar Title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              <select name="type" value={formData.type} onChange={handleInputChange} required>
                <option value="live">Live</option>
                <option value="recorded">Recorded</option>
              </select>
              <input
                type="text"
                name="topic"
                placeholder="Topic (optional)"
                value={formData.topic}
                onChange={handleInputChange}
              />
              <label>Webinar Thumbnail (optional):</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <button type="submit" className="submit-webinar-btn">Add Webinar</button>
              {message && <p className="webinar-message">{message}</p>}
            </form>
          )}
        </div>
      )}

      <div className="results-section">
        <p className="results-count">{webinars.length} webinars found</p>
        {webinars.map((webinar) => (
          <div key={webinar._id} className="result-card">
            {webinar.image ? (
              <img
                src={`https://harmonious-creation-production.up.railway.app/uploads/${webinar.image}`}
                alt="Webinar Thumbnail"
                className="result-image"
              />
            ) : (
              <div className="result-image-placeholder">No Image</div>
            )}
            <div className="result-content">
              <h3 className="result-title">{webinar.title}</h3>
              <p className="result-description">{webinar.description}</p>
              <p className="result-type">Type: {webinar.type === "live" ? "Live" : "Recorded"}</p>
              <p className="result-date">{new Date(webinar.date).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Webinar;
