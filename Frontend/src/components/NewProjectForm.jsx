// src/components/NewProjectForm.jsx
import React, { useState } from "react";
import axios from "axios";
import "../styles/NewProjectForm.css";

const NewProjectForm = ({ onProjectAdded }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "",
        budget: "",
        requiredSkills: "",
    });
    const user = JSON.parse(localStorage.getItem("user"));

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                postedById: user._id || user.id,
                postedByRole: user.role,
            };
            const res = await axios.post("http://localhost:5000/api/projects", payload);
            alert(res.data.message);
            onProjectAdded();
            setFormData({
                title: "",
                description: "",
                duration: "",
                budget: "",
                requiredSkills: "",
            });
        } catch (error) {
            console.error("Error creating project:", error);
            alert("Error creating project");
        }
    };

    return (
        <form className="new-project-form" onSubmit={handleSubmit}>
            <h3>Add New Project</h3>
            <input type="text" name="title" placeholder="Project Title" value={formData.title} onChange={handleChange} required />
            <textarea name="description" placeholder="Project Description" value={formData.description} onChange={handleChange} required />
            <input type="text" name="duration" placeholder="Duration (e.g., 2 weeks)" value={formData.duration} onChange={handleChange} required />
            <input type="number" name="budget" placeholder="Budget" value={formData.budget} onChange={handleChange} required />
            <input type="text" name="requiredSkills" placeholder="Required Skills (comma separated)" value={formData.requiredSkills} onChange={handleChange} required />
            <button type="submit">Add Project</button>
        </form>
    );
};

export default NewProjectForm;
