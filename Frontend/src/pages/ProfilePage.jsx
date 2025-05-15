// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import PasswordModal from "../components/PasswordModal";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser._id || storedUser.id;
  const role = storedUser.role;

  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile/${userId}/${role}`);
        if (res.data.user) {
          setProfileData(res.data.user);
          setFormData({
            name: res.data.user.name || "",
            email: res.data.user.email || "",
            skill: res.data.user.skill || "",
            education: res.data.user.education || "",
            yearsExperience: res.data.user.yearsExperience || "",
            linkedin: res.data.user.linkedin || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [userId, role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("id", userId);
      payload.append("role", role);
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });
      if (avatarFile) {
        payload.append("avatar", avatarFile);
      }
      const res = await axios.put("http://localhost:5000/api/profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
      const updatedUser = res.data.user;
      localStorage.setItem("user", JSON.stringify({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        skill: updatedUser.skill,
        education: updatedUser.education,
        yearsExperience: updatedUser.yearsExperience,
        linkedin: updatedUser.linkedin,
        avatar: updatedUser.avatar,
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Edit Profile</h2>
        </div>
        {message && <p className="profile-message">{message}</p>}
        {profileData?.avatar && (
          <img
            src={`http://localhost:5000/uploads/${profileData.avatar}`}
            alt="Avatar"
            className="profile-avatar"
          />
        )}
        <label className="avatar-label">Change Profile Picture</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="avatar-input" />
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-field">
            <label>Name*</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="profile-field">
            <label>Email*</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="profile-field">
            <label>Skill*</label>
            <input type="text" name="skill" value={formData.skill} onChange={handleChange} required />
          </div>
          {role === "mentor" && (
            <>
              <div className="profile-field">
                <label>Education*</label>
                <input type="text" name="education" value={formData.education} onChange={handleChange} required />
              </div>
              <div className="profile-field">
                <label>Years of Experience*</label>
                <input type="number" name="yearsExperience" value={formData.yearsExperience} onChange={handleChange} required />
              </div>
              <div className="profile-field">
                <label>LinkedIn*</label>
                <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} required />
              </div>
            </>
          )}
          <button type="submit" className="save-changes-btn">Save Changes</button>
        </form>
        <button onClick={() => setShowPasswordModal(true)} className="change-pass-cta">
          Change Password
        </button>
      </div>
      {
        showPasswordModal && (
          <PasswordModal onClose={() => setShowPasswordModal(false)} userId={userId} role={role} />
        )
      }
    </div >
  );
};

export default ProfilePage;
