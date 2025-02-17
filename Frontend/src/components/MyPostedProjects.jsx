// src/components/MyPostedProjects.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MyPostedProjects.css";

const MyPostedProjects = ({ user }) => {
    const [projects, setProjects] = useState([]);

    const fetchMyProjects = async () => {
        try {
            const userId = user._id || user.id;
            const res = await axios.get(`http://localhost:5000/api/projects/my?userId=${userId}&role=${user.role}`);
            setProjects(res.data);
        } catch (error) {
            console.error("Error fetching my projects:", error);
        }
    };

    useEffect(() => {
        fetchMyProjects();
    }, [user]);

    const viewProposals = (projectId) => {
        window.location.href = `/project/${projectId}/proposals`;
    };

    return (
        <div className="my-posted-projects">
            <h3>My Posted Projects</h3>
            {projects.length === 0 ? (
                <p>You haven't posted any projects yet.</p>
            ) : (
                projects.map((project) => (
                    <div key={project._id} className="posted-project-card">
                        <h4>{project.title}</h4>
                        <p>{project.description}</p>
                        <button onClick={() => viewProposals(project._id)}>View Proposals</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyPostedProjects;
