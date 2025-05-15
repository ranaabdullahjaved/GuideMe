// src/pages/ProjectDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProposalModal from "../components/ProposalModal";
import "../styles/ProjectDetailPage.css";

const ProjectDetailPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [showProposalModal, setShowProposalModal] = useState(false);

    const fetchProject = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/projects/${id}`);
            setProject(res.data);
        } catch (error) {
            console.error("Error fetching project:", error);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

    return (
        <div className="project-detail-page">
            {project ? (
                <>
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>
                    <p><strong>Duration:</strong> {project.duration}</p>
                    <p><strong>Budget:</strong> ${project.budget}</p>
                    <p><strong>Required Skills:</strong> {project.requiredSkills.join(", ")}</p>
                    <button onClick={() => setShowProposalModal(true)} className="apply-btn">
                        Apply to Project
                    </button>
                    {showProposalModal && (
                        <ProposalModal projectId={project._id} onClose={() => setShowProposalModal(false)} />
                    )}
                </>
            ) : (
                <p>Loading project details...</p>
            )}
        </div>
    );
};

export default ProjectDetailPage;
