// src/components/ProposalModal.jsx
import React, { useState } from "react";
import axios from "axios";
import "../styles/ProposalModal.css";

const ProposalModal = ({ projectId, onClose }) => {
    const [proposalText, setProposalText] = useState("");
    const [proposedBudget, setProposedBudget] = useState("");
    const [timeline, setTimeline] = useState("");
    const [message, setMessage] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));

    if (user.role === "admin") {
        return (
            <div className="proposal-modal-backdrop">
                <div className="proposal-modal-content">
                    <h2>Submit Proposal</h2>
                    <p>Admins cannot apply to projects.</p>
                    <button className="cancel-proposal-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                projectId,
                applicantId: user._id || user.id,
                applicantRole: user.role,
                proposalText,
                proposedBudget,
                timeline,
            };
            const res = await axios.post("http://localhost:5000/api/proposals", payload);
            setMessage(res.data.message);
            setTimeout(() => onClose(), 1500);
        } catch (error) {
            console.error("Error submitting proposal:", error);
            setMessage("Error submitting proposal");
        }
    };

    return (
        <div className="proposal-modal-backdrop">
            <div className="proposal-modal-content">
                <h2>Submit Proposal</h2>
                {message && <p className="proposal-message">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <textarea
                        placeholder="Your proposal..."
                        value={proposalText}
                        onChange={(e) => setProposalText(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Proposed Budget"
                        value={proposedBudget}
                        onChange={(e) => setProposedBudget(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Timeline (e.g., 2 weeks)"
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        required
                    />
                    <div className="proposal-modal-buttons">
                        <button type="submit" className="submit-proposal-btn">Submit Proposal</button>
                        <button type="button" className="cancel-proposal-btn" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProposalModal;
