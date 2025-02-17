// src/components/MySubmittedProposals.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MySubmittedProposals.css";
import { useNavigate } from "react-router-dom";

const MySubmittedProposals = ({ user }) => {
    const [proposals, setProposals] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const fetchMyProposals = async () => {
        try {
            const applicantId = user._id || user.id;
            const res = await axios.get(
                `http://localhost:5000/api/proposals/my?applicantId=${applicantId}&applicantRole=${user.role}`
            );
            setProposals(res.data);
        } catch (error) {
            console.error("Error fetching my proposals:", error);
        }
    };

    useEffect(() => {
        fetchMyProposals();
    }, [user]);

    const handleStartChat = async (proposal) => {
        try {
            // First, fetch the project details to know who posted it
            const projectRes = await axios.get(`http://localhost:5000/api/projects/${proposal.projectId}`);
            const project = projectRes.data;
            let menteeId, mentorId;
            // If the project was posted by a mentee, the applicant is a mentor
            if (project.postedBy.role === "mentee") {
                menteeId = project.postedBy.id;
                mentorId = user._id || user.id; // current user (applicant)
            } else if (project.postedBy.role === "mentor") {
                // If the project was posted by a mentor, the applicant is a mentee
                menteeId = user._id || user.id;
                mentorId = project.postedBy.id;
            }
            // Create or fetch conversation using your chat endpoint
            const convRes = await axios.post("http://localhost:5000/api/chat/conversations", { menteeId, mentorId });
            navigate(`/chat/${convRes.data._id}`);
        } catch (error) {
            console.error("Error starting chat:", error);
            setMessage("Error starting chat");
        }
    };

    return (
        <div className="my-submitted-proposals">
            <h3>My Submitted Proposals</h3>
            {message && <p className="proposal-message">{message}</p>}
            {proposals.length === 0 ? (
                <p>You haven't submitted any proposals yet.</p>
            ) : (
                proposals.map((proposal) => (
                    <div key={proposal._id} className="proposal-card">
                        <div className="proposal-header">
                            <span className="proposal-project-id">Project ID: {proposal.projectId}</span>
                            <span className="proposal-status">Status: {proposal.status}</span>
                        </div>
                        <p className="proposal-text"><strong>Proposal:</strong> {proposal.proposalText}</p>
                        <p className="proposal-budget"><strong>Budget:</strong> ${proposal.proposedBudget}</p>
                        <p className="proposal-timeline"><strong>Timeline:</strong> {proposal.timeline}</p>
                        {proposal.status === "accepted" && (
                            <button className="start-chat-btn" onClick={() => handleStartChat(proposal)}>
                                Start Chat
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default MySubmittedProposals;
