// src/components/PasswordModal.jsx
import React, { useState } from "react";
import axios from "axios";
import "../styles/PasswordModal.css";

const PasswordModal = ({ onClose, userId, role }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    try {
      const res = await axios.put("http://localhost:5000/api/profile/password", {
        id: userId,
        role,
        currentPassword,
        newPassword,
        confirmNewPassword
      });
      setMessage(res.data.message);
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      console.error("Error updating password:", err.response?.data?.message || err.message);
      setMessage(err.response?.data?.message || "Error updating password");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content animate-modal">
        <h2>Change Password</h2>
        {message && <p className="pm-message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="pm-field">
            <label>Current Password:</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="pm-field">
            <label>New Password:</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <div className="pm-field">
            <label>Confirm New Password:</label>
            <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
          </div>
          <div className="pm-buttons">
            <button type="submit" className="update-btn">Update Password</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
