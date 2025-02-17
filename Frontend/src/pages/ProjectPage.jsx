// src/pages/ProjectPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ProjectPage.css";
import NewProjectForm from "../components/NewProjectForm";
import MyPostedProjects from "../components/MyPostedProjects";
import MySubmittedProposals from "../components/MySubmittedProposals";

const ProjectPage = () => {
    const [activeTab, setActiveTab] = useState("all"); // "all", "posted", "submitted"
    const [projects, setProjects] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id || user.id;

    const fetchProjects = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/projects");
            // Filter out projects posted by the current user in "all" view
            const allProjects = res.data;
            const filteredProjects = allProjects.filter(
                (proj) => String(proj.postedBy.id) !== String(userId)
            );
            setProjects(filteredProjects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="project-page">
            <h2>Projects</h2>
            <div className="project-tabs">
                <button className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>
                    All Projects
                </button>
                <button className={activeTab === "posted" ? "active" : ""} onClick={() => setActiveTab("posted")}>
                    My Posted Projects
                </button>
                <button className={activeTab === "submitted" ? "active" : ""} onClick={() => setActiveTab("submitted")}>
                    My Submitted Proposals
                </button>
            </div>
            {activeTab === "all" && (
                <>
                    <NewProjectForm onProjectAdded={fetchProjects} />
                    <div className="project-list">
                        {projects.map((project) => (
                            <div key={project._id} className="project-card" onClick={() => window.location.href = `/project/${project._id}`}>
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                <p><strong>Duration:</strong> {project.duration}</p>
                                <p><strong>Budget:</strong> ${project.budget}</p>
                                <p><strong>Skills:</strong> {project.requiredSkills.join(", ")}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {activeTab === "posted" && <MyPostedProjects user={user} />}
            {activeTab === "submitted" && <MySubmittedProposals user={user} />}
        </div>
    );
};

export default ProjectPage;
