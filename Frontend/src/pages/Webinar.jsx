// src/pages/Webinar.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Webinar.css";

const Webinar = () => {
  const [webinars, setWebinars] = useState([]);
  const [filter, setFilter] = useState("upcoming"); // "upcoming", "7days", or "6months"
  const [showForm, setShowForm] = useState(false);
  const [editingWebinar, setEditingWebinar] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    hostName: "",
    date: "",
    duration: "",
    link: "",
    type: "live",
    topic: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Get user info to know if admin (only admin can add webinars)
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchWebinars = async () => {
    try {
      // If filter is "upcoming", we pass no filter query (or empty string)
      const params = filter === "upcoming" ? {} : { filter };
      const res = await axios.get(`${API_URL}/api/webinars`, { params });
      setWebinars(res.data);
    } catch (error) {
      console.error("Error fetching webinars:", error);
    }
  };

  useEffect(() => {
    fetchWebinars();
  }, [filter]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      hostName: "",
      date: "",
      duration: "",
      link: "",
      type: "live",
      topic: "",
    });
    setImageFile(null);
    setEditingWebinar(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleEdit = (webinar) => {
    // Format the date to be compatible with datetime-local input
    const formattedDate = new Date(webinar.date).toISOString().slice(0, 16);
    
    setFormData({
      title: webinar.title,
      description: webinar.description,
      hostName: webinar.hostName,
      date: formattedDate,
      duration: webinar.duration,
      link: webinar.link,
      type: webinar.type,
      topic: webinar.topic || "",
    });
    setEditingWebinar(webinar._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (webinarId) => {
    if (!confirm("Are you sure you want to delete this webinar?")) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/api/webinars/${webinarId}`);
      setMessage("Webinar deleted successfully");
      fetchWebinars();
    } catch (error) {
      console.error("Error deleting webinar:", error);
      setMessage("Error deleting webinar");
    }
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

      if (editingWebinar) {
        // Update existing webinar
        await axios.put(`${API_URL}/api/webinars/${editingWebinar}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Webinar updated successfully");
      } else {
        // Add new webinar
        await axios.post(`${API_URL}/api/webinars`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Webinar added successfully");
      }
      
      fetchWebinars(); // refresh the webinar list
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error with webinar:", error);
      setMessage(editingWebinar ? "Error updating webinar" : "Error adding webinar");
    }
  };

  // Function to format duration in a readable way
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return remainingMins 
      ? `${hours} hour${hours > 1 ? 's' : ''} ${remainingMins} minute${remainingMins > 1 ? 's' : ''}` 
      : `${hours} hour${hours > 1 ? 's' : ''}`;
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

      {message && <div className="message">{message}</div>}

      {user && user.role === "admin" && (
        <div className="admin-add-webinar">
          <button onClick={() => {
            if (showForm) {
              resetForm();
            }
            setShowForm(!showForm);
          }} className="add-webinar-btn">
            {showForm ? "Cancel" : "Add Webinar"}
          </button>
          {showForm && (
            <form onSubmit={handleSubmit} className="webinar-form">
              <h2>{editingWebinar ? "Edit Webinar" : "Add New Webinar"}</h2>
              
              <label>Webinar Title:</label>
              <input
                type="text"
                name="title"
                placeholder="Webinar Title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              
              <label>Host Name:</label>
              <input
                type="text"
                name="hostName"
                placeholder="Host Name"
                value={formData.hostName}
                onChange={handleInputChange}
                required
              />
              
              <label>Description:</label>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              
              <label>Start Date and Time:</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              
              <label>Duration (minutes):</label>
              <input
                type="number"
                name="duration"
                placeholder="Duration in minutes"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                required
              />
              
              <label>Meeting Link:</label>
              <input
                type="url"
                name="link"
                placeholder="Meeting Link (URL)"
                value={formData.link}
                onChange={handleInputChange}
                required
              />
              
              <label>Type:</label>
              <select name="type" value={formData.type} onChange={handleInputChange} required>
                <option value="live">Live</option>
                <option value="recorded">Recorded</option>
              </select>
              
              <label>Topic (optional):</label>
              <input
                type="text"
                name="topic"
                placeholder="Topic"
                value={formData.topic}
                onChange={handleInputChange}
              />
              
              <label>Webinar Thumbnail (optional):</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              
              <button type="submit" className="submit-webinar-btn">
                {editingWebinar ? "Update Webinar" : "Add Webinar"}
              </button>
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
                src={`${API_URL}/uploads/${webinar.image}`}
                alt="Webinar Thumbnail"
                className="result-image"
              />
            ) : (
              <div className="result-image-placeholder">No Image</div>
            )}
            <div className="result-content">
              <h3 className="result-title">{webinar.title}</h3>
              <p className="result-host">Host: {webinar.hostName}</p>
              <p className="result-description">{webinar.description}</p>
              <div className="result-details">
                <p className="result-type">Type: {webinar.type === "live" ? "Live" : "Recorded"}</p>
                <p className="result-date">Starts: {new Date(webinar.date).toLocaleString()}</p>
                <p className="result-duration">Duration: {formatDuration(webinar.duration)}</p>
              </div>
              <div className="result-actions">
                <a href={webinar.link} target="_blank" rel="noopener noreferrer" className="join-link">
                  {new Date(webinar.date) > new Date() ? "Join Webinar" : "Watch Recording"}
                </a>
                {user && user.role === "admin" && (
                  <>
                    <button onClick={() => handleEdit(webinar)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(webinar._id)} className="delete-btn">Delete</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Webinar;
