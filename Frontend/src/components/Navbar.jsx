import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; // Updated styling

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to="/">GuideMe</Link>
                </div>
                <ul className="navbar-links">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/signup">Sign Up</Link>
                    </li>
                    <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/mentorsearch">Mentor Search</Link>
                    </li>
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/webinar">Webinar</Link>
                    </li>
                    <li>
                        <Link to="/chat">Chat</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;