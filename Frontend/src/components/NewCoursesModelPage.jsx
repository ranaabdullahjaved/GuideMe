"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewCourseModal = ({ onClose, onAddCourse }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState("");
    const [mentorSearch, setMentorSearch] = useState("");
    const [mentorResults, setMentorResults] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState("");

    const navigate = useNavigate();

    const handleMentorSearch = async (input) => {
        setMentorSearch(input);
        if (input.length >= 2) {
            try {
                const response = await fetch(`https://harmonious-creation-production.up.railway.app/api/courses/search?query=${input}`);
                const data = await response.json();
                setMentorResults(data);
            } catch (error) {
                console.error("Error searching mentors:", error);
            }
        } else {
            setMentorResults([]);
        }
    };

    const handleMentorSelect = (mentor) => {
        setSelectedMentor(mentor.email);
        setMentorSearch(mentor.name);
        setMentorResults([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Retrieve mentor from localStorage
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : {};
        const mentor = user.email;

        const newCourse = {
            title,
            description,
            cost: Number.parseFloat(cost),
            mentor: mentor,
            averageRating: 0,
            feedback: " ",
        };
        if (!selectedMentor) {
            try {
                const response = await fetch("https://harmonious-creation-production.up.railway.app/api/courses/addcourse", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newCourse),
                });

                if (response.ok) {
                    alert("Course added successfully!");
                    handleCancel();
                } else {
                    const errorData = await response.json();
                    alert(`Failed to add course: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Error adding course:", error);
                alert("Error adding course. Please try again.");
            }
        }

        if (selectedMentor) {
            // Collaborated course
            const collabRequest = {
                mentor: mentor,
                collabMentor: selectedMentor,
                title,
                description,
                cost: Number.parseFloat(cost)
            };

            try {
                const response = await fetch("https://harmonious-creation-production.up.railway.app/api/courses/addrequest", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(collabRequest),
                });

                if (response.ok) {
                    alert("Collaboration request sent successfully!");
                    //   onClose();
                    handleCancel();
                } else {
                    const errorData = await response.json();
                    alert(`Failed to send collaboration request: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Error sending collaboration request:", error);
                alert("Error sending collaboration request. Please try again.");
            }
        }
    };

    const handleCancel = () => {
        if (typeof onClose === 'function') {
            onClose();
        } else {
            navigate("/collaborations");

        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add New Course</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Course Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Course Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Course Cost"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        required
                    />

                    {/* Mentor selection field */}
                    <input
                        type="text"
                        placeholder="Search Mentor (optional for collaboration)"
                        value={mentorSearch}
                        onChange={(e) => handleMentorSearch(e.target.value)}
                    />

                    {mentorResults.length > 0 && (
                        <ul className="mentor-results">
                            {mentorResults.map((mentor) => (
                                <li key={mentor.email} onClick={() => handleMentorSelect(mentor)}>
                                    {mentor.name} - {mentor.skill}
                                </li>
                            ))}
                        </ul>
                    )}

                    <button type="submit">Add Course</button>

                    <button type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewCourseModal;
