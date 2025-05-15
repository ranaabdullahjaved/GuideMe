// src/pages/ProjectProposalsPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProjectProposalsPage.css";

const ProjectProposalsPage = () => {
    const { id } = useParams(); // project id
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`https://harmonious-creation-production.up.railway.app/api/projects/${id}`);
                setProject(res.data);
            } catch (err) {
                console.error("Error fetching project details:", err);
                setError("Error fetching project details");
            }
        };

        const fetchProposals = async () => {
            try {
                const res = await axios.get(`https://harmonious-creation-production.up.railway.app/api/proposals/project/${id}`);
                setProposals(res.data);
            } catch (err) {
                console.error("Error fetching proposals:", err);
                setError("Error fetching proposals");
            }
        };

        fetchProject();
        fetchProposals();
    }, [id]);

    // Only allow the project owner to view proposals
    if (project && String(project.postedBy.id) !== String(user._id || user.id)) {
        return (
            <div className="project-proposals-page">
                <h2>Access Denied</h2>
                <p>You are not authorized to view proposals for this project.</p>
                <button onClick={() => navigate("/projects")} className="back-btn">
                    Back to Projects
                </button>
            </div>
        );
    }

    const refreshProposals = async () => {
        try {
            const res = await axios.get(`https://harmonious-creation-production.up.railway.app/api/proposals/project/${id}`);
            setProposals(res.data);
        } catch (err) {
            console.error("Error refreshing proposals:", err);
        }
    };

    const handleApprove = async (proposalId) => {
        try {
            const res = await axios.put(`https://harmonious-creation-production.up.railway.app/api/proposals/${proposalId}/approve`);
            setMessage(res.data.message);
            await refreshProposals();
        } catch (error) {
            console.error("Error approving proposal:", error);
            setMessage("Error approving proposal");
        }
    };

    const handleDelete = async (proposalId) => {
        try {
            const res = await axios.delete(`https://harmonious-creation-production.up.railway.app/api/proposals/${proposalId}`);
            setMessage(res.data.message);
            await refreshProposals();
        } catch (error) {
            console.error("Error deleting proposal:", error);
            setMessage("Error deleting proposal");
        }
    };

    const handleStartChat = async (proposal) => {
        try {
            let menteeId, mentorId;
            if (project.postedBy.role === "mentee") {
                // Project posted by mentee, applicant must be mentor
                menteeId = project.postedBy.id;
                mentorId = proposal.applicant.id;
            } else if (project.postedBy.role === "mentor") {
                // Project posted by mentor, applicant must be mentee
                menteeId = proposal.applicant.id;
                mentorId = project.postedBy.id;
            }
            const res = await axios.post("https://harmonious-creation-production.up.railway.app/api/chat/conversations", { menteeId, mentorId });
            navigate(`/chat/${res.data._id}`);
        } catch (error) {
            console.error("Error starting chat:", error);
            setMessage("Error starting chat");
        }
    };

    return (
        <div className="project-proposals-page">
            {project ? (
                <>
                    <h2>Proposals for: {project.title}</h2>
                    <p>{project.description}</p>
                </>
            ) : (
                <p>Loading project details...</p>
            )}
            {error && <p className="error">{error}</p>}
            {message && <p className="message">{message}</p>}
            {proposals.length === 0 ? (
                <p>No proposals submitted yet.</p>
            ) : (
                <table className="proposal-table">
                    <thead>
                        <tr>
                            <th>Applicant</th>
                            <th>Proposal</th>
                            <th>Budget</th>
                            <th>Timeline</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proposals.map((proposal) => (
                            <tr key={proposal._id}>
                                <td>
                                    {proposal.applicantInfo ? (
                                        <div className="applicant-info">
                                            {proposal.applicantInfo.avatar ? (
                                                <img
                                                    src={`https://harmonious-creation-production.up.railway.app/uploads/${proposal.applicantInfo.avatar}`}
                                                    alt={proposal.applicantInfo.name}
                                                    className="proposal-avatar"
                                                />
                                            ) : (
                                                <div className="proposal-avatar-placeholder">
                                                    {proposal.applicantInfo.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span>{proposal.applicantInfo.name}</span>
                                        </div>
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                                <td>{proposal.proposalText}</td>
                                <td>${proposal.proposedBudget}</td>
                                <td>{proposal.timeline}</td>
                                <td>{proposal.status}</td>
                                <td>
                                    {proposal.status === "pending" && (
                                        <>
                                            <button className="approve-btn" onClick={() => handleApprove(proposal._id)}>
                                                Approve
                                            </button>
                                            <button className="delete-btn" onClick={() => handleDelete(proposal._id)}>
                                                Delete
                                            </button>
                                        </>
                                    )}
                                    {proposal.status === "accepted" && (
                                        <button className="chat-btn" onClick={() => handleStartChat(proposal)}>
                                            Start Chat
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button onClick={() => navigate("/projects")} className="back-btn">
                Back to Projects
            </button>
        </div>
    );
};

export default ProjectProposalsPage;
