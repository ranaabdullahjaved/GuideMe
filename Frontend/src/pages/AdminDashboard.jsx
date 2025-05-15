import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [message, setMessage] = useState("");

    const fetchPendingUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/pending-users");
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
            const res = await axios.put("http://localhost:5000/api/admin/approve-user", { id, role });
            setMessage(res.data.message);
            fetchPendingUsers();
        } catch (error) {
            console.error("Error approving user:", error);
            setMessage("Error approving user");
        }
    };

    const handleDelete = async (id, role) => {
        try {
            const res = await axios.delete("http://localhost:5000/api/admin/delete-user", { data: { id, role } });
            setMessage(res.data.message);
            fetchPendingUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            setMessage("Error deleting user");
        }
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
                                            src={`http://localhost:5000/uploads/${user.avatar}`}
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
        </div>
    );
};

export default AdminDashboard;
