// src/pages/SignupPage.jsx
import { useState } from "react";
import axios from "axios";
import '../styles/SignUp.css';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [activeTab, setActiveTab] = useState("mentee");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skill: "",
    role: "mentee",
    yearsExperience: "",
    linkedin: "",
    education: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setFormData({ ...formData, role: tab });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }
      await axios.post("http://localhost:5000/api/auth/signup", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Sign up successful!");
      navigate('/login');
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="logo">
          <svg className="logo-icon" viewBox="0 0 24 24">
            <path d="M12 2L2 22h20L12 2z" fill="#fff" />
            <path d="M12 8v8m-4-4h8" stroke="#fff" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="signup-right">
        <div className="signup-content">
          <h2>Sign up</h2>
          <div className="tab-switch">
            <button className={`tab ${activeTab === "mentee" ? "active" : ""}`} onClick={() => handleTabSwitch("mentee")}>
              I'm a mentee
            </button>
            <button className={`tab ${activeTab === "mentor" ? "active" : ""}`} onClick={() => handleTabSwitch("mentor")}>
              I'm a mentor
            </button>
          </div>
          <form className="signup-form" onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="text" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" autoComplete="current-password" value={formData.password} onChange={handleChange} required />
            <input type="text" name="skill" placeholder="Skill" value={formData.skill} onChange={handleChange} required />
            {activeTab === "mentor" && (
              <div className="mentor-fields">
                <input type="number" name="yearsExperience" placeholder="Years of experience" value={formData.yearsExperience} onChange={handleChange} required />
                <input type="url" name="linkedin" placeholder="LinkedIn profile URL" value={formData.linkedin} onChange={handleChange} required />
                <input type="text" name="education" placeholder="Education" value={formData.education} onChange={handleChange} required />
              </div>
            )}
            <label htmlFor="avatarFile">Profile Image</label>
            <input type="file" id="avatarFile" accept="image/*" onChange={handleFileChange} />
            <button type="submit" className="signup-btn">Sign up</button>
          </form>
          <div className="or-divider">
            <span>Or</span>
          </div>
          <button className="google-signup-btn">Sign up with Google</button>
          <div className="signup-links">
            <p>Already have an account? <a href="/login">Log in</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
