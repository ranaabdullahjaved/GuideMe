import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const fetchPendingUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/admin/pending-users`);
            setPendingUsers(res.data);
        } catch (error) {
            console.error("Error fetching pending users:", error);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const handleApprove = async (id, role) => {
        try {
            const res = await axios.put(`${API_URL}/api/admin/approve-user`, { id, role });
            setMessage(res.data.message);
            fetchPendingUsers();
            setShowDetailsModal(false);
        } catch (error) {
            console.error("Error approving user:", error);
            setMessage("Error approving user");
        }
    };

    const handleDelete = async (id, role) => {
        try {
            const res = await axios.delete(`${API_URL}/api/admin/delete-user`, { data: { id, role } });
            setMessage(res.data.message);
            fetchPendingUsers();
            setShowDetailsModal(false);
        } catch (error) {
            console.error("Error deleting user:", error);
            setMessage("Error deleting user");
        }
    };

    const handleShowDetails = (user) => {
        setSelectedUser(user);
        setShowDetailsModal(true);
    };

    const renderUserDetails = () => {
        if (!selectedUser) return null;
        
        return (
            <div className="user-details-modal">
                <div className="user-details-content">
                    <div className="user-details-header">
                        <h2>{selectedUser.name}&apos;s Profile Details</h2>
                        <button className="close-modal-btn" onClick={() => setShowDetailsModal(false)}>×</button>
                    </div>
                    
                    <div className="user-details-body">
                        <div className="user-profile-section">
                            {selectedUser.avatar && (
                                <img 
                                    src={`${API_URL}/uploads/${selectedUser.avatar}`} 
                                    alt="Avatar" 
                                    className="user-details-avatar" 
                                />
                            )}
                            <div className="user-basic-info">
                                <h3>{selectedUser.name}</h3>
                                <p className="user-role">{selectedUser.role}</p>
                                <p className="user-email">{selectedUser.email}</p>
                                <p className="user-skill"><strong>Skill/Interest:</strong> {selectedUser.skill}</p>
                            </div>
                        </div>
                        
                        {selectedUser.role === "mentor" && (
                            <div className="mentor-specific-details">
                                <h3>Mentor Qualifications</h3>
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Education:</span>
                                        <span className="detail-value">{selectedUser.education}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Years Experience:</span>
                                        <span className="detail-value">{selectedUser.yearsExperience}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">LinkedIn:</span>
                                        <a href={selectedUser.linkedin} target="_blank" rel="noopener noreferrer" className="detail-link">
                                            {selectedUser.linkedin}
                                        </a>
                                    </div>
                                    {selectedUser.github && (
                                        <div className="detail-item">
                                            <span className="detail-label">GitHub:</span>
                                            <a href={selectedUser.github} target="_blank" rel="noopener noreferrer" className="detail-link">
                                                {selectedUser.github}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Documents and Certificates */}
                                <div className="documents-section">
                                    <h3>Documents</h3>
                                    <div className="documents-grid">
                                        {selectedUser.educationCertificate && (
                                            <div className="document-item">
                                                <span className="document-label">Education Certificate:</span>
                                                <a 
                                                    href={`${API_URL}/uploads/${selectedUser.educationCertificate}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="view-document-btn"
                                                >
                                                    View Certificate
                                                </a>
                                            </div>
                                        )}
                                        {selectedUser.workExperienceLetter && (
                                            <div className="document-item">
                                                <span className="document-label">Work Experience Letter:</span>
                                                <a 
                                                    href={`${API_URL}/uploads/${selectedUser.workExperienceLetter}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="view-document-btn"
                                                >
                                                    View Letter
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* References */}
                                {selectedUser.references && selectedUser.references.length > 0 && (
                                    <div className="references-section">
                                        <h3>References</h3>
                                        <div className="references-list">
                                            {selectedUser.references.map((ref, index) => (
                                                <div className="reference-item" key={index}>
                                                    <span className="reference-name">{ref.name}</span>
                                                    <span className="reference-email">{ref.email}</span>
                                                    {ref.phone && <span className="reference-phone">{ref.phone}</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="user-details-actions">
                        <button 
                            onClick={() => handleApprove(selectedUser._id, selectedUser.role)} 
                            className="approve-detail-btn"
                        >
                            Approve
                        </button>
                        <button 
                            onClick={() => handleDelete(selectedUser._id, selectedUser.role)} 
                            className="delete-detail-btn"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-dashboard">
            <h2>Pending User Approvals</h2>
            {message && <p className="admin-message">{message}</p>}
            {pendingUsers.length === 0 ? (
                <p>No pending users.</p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingUsers.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    {user.avatar ? (
                                        <img
                                            src={`${API_URL}/uploads/${user.avatar}`}
                                            alt="Avatar"
                                            className="admin-avatar"
                                        />
                                    ) : (
                                        <div className="admin-avatar-placeholder">N/A</div>
                                    )}
                                </td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button onClick={() => handleShowDetails(user)} className="view-details-btn">
                                        View Details
                                    </button>
                                    <button onClick={() => handleApprove(user._id, user.role)} className="approve-btn">
                                        Approve
                                    </button>
                                    <button onClick={() => handleDelete(user._id, user.role)} className="delete-btn">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            {showDetailsModal && renderUserDetails()}
        </div>
    );
};

export default AdminDashboard;
