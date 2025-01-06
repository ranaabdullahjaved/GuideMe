// src/ProfilePage.js
import React from 'react';
import './Styles/ProfilePage.css';

const ProfilePage = () => {
    const user = {
        name: "John Doe",
        age: 22,
        email: "john.doe@example.com",
        courses: [
            "Introduction to Computer Science",
            "Data Structures",
            "Algorithms",
            "Database Management"
        ],
        mentors: [
            "Dr. Smith - Computer Science Department",
            "Mr. Williams - Software Engineering"
        ]
    };

    return (
        <div className="container">
            <header>
                <h1>User Profile</h1>
            </header>
            
            <section className="profile-info">
                <div className="profile-detail">
                    <h2>Personal Information</h2>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Age:</strong> {user.age}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
                
                <div className="profile-courses">
                    <h2>Enrolled Courses</h2>
                    <ul className="courses-list">
                        {user.courses.map((course, index) => (
                            <li key={index}>{course}</li>
                        ))}
                    </ul>
                </div>
                
                <div className="profile-mentors">
                    <h2>Mentors</h2>
                    <ul className="mentor-list">
                        {user.mentors.map((mentor, index) => (
                            <li key={index}>{mentor}</li>
                        ))}
                    </ul>
                </div>
            </section>
            
            <footer>
                <p>Profile Page - All Rights Reserved</p>
            </footer>
        </div>
    );
};

export default ProfilePage;
