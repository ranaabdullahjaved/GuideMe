"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/Navbar.css"

const Navbar = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user"))
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        navigate("/login")
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to="/">GuideMe</Link>
                </div>

                {/* Hamburger menu button */}
                <button className={`hamburger ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>

                {/* Mobile menu */}
                <div className={`navbar-mobile ${isMenuOpen ? "active" : ""}`}>
                    <ul className="navbar-links">
                        <li>
                            <Link to="/" onClick={() => setIsMenuOpen(false)}>
                                Home
                            </Link>
                        </li>
                        {!user && (
                            <li>
                                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                                    Sign Up
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/webinar" onClick={() => setIsMenuOpen(false)}>
                                Webinar
                            </Link>

                        </li>
                        <li>
                            <Link to="/projects" onClick={() => setIsMenuOpen(false)}>
                                Projects
                            </Link>
                        </li>
                        <li>
                            <Link to="/chat" onClick={() => setIsMenuOpen(false)}>
                                Chat
                            </Link>
                        </li>
                        <li>
                            <Link to="/courses" onClick={() => setIsMenuOpen(false)}>
                                Courses
                            </Link>
                        </li>
                        {user && (
                            <>
                                {/* <li>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                </li> */}
                                {/* <li>
                  <Link to="/mentorsearch" onClick={() => setIsMenuOpen(false)}>
                    Mentor Search
                  </Link>
                </li> */}
                                {user.role !== 'mentee' && (
                                    <li>
                                        <Link to="/collaborations" onClick={() => setIsMenuOpen(false)}>
                                            Collaborations
                                        </Link>
                                    </li>)}
                                <li>
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                                        Profile
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <div className="navbar-user">
                        {user ? (
                            <>
                                <div className="user-info">
                                    {user.avatar && (
                                        <img
                                            src={`http://localhost:5000/uploads/${user.avatar}`}
                                            alt="User Avatar"
                                            className="navbar-avatar"
                                        />
                                    )}
                                    <span>{`${user.role}: ${user.name}`}</span>
                                </div>
                                <button onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar

