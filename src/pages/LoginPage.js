import React, { useState } from 'react';
import '../styles/Login.css';  // Import the CSS file

function Login() {
  const [activeTab, setActiveTab] = useState('mentee'); // State to track the active tab

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);  // Update the active tab on click
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo">
          <svg className="logo-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22h20L12 2z" fill="#fff" />
            <path d="M12 8v8m-4-4h8" stroke="#fff" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="login-right">
        <h2>Log in</h2>
        <div className="tab-switch">
          <button
            className={`tab ${activeTab === 'mentee' ? 'active' : ''}`}  // Add active class based on state
            onClick={() => handleTabSwitch('mentee')}
          >
            I'm a mentee
          </button>
          <button
            className={`tab ${activeTab === 'mentor' ? 'active' : ''}`}  // Add active class based on state
            onClick={() => handleTabSwitch('mentor')}
          >
            I'm a mentor
          </button>
        </div>
        <form className="login-form">
          <input type="text" placeholder="Email or username" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="login-btn">Log in</button>
        </form>
        <div className="or-divider">
          <span>Or</span>
        </div>
        <button className="google-login-btn">Log in with Google</button>
        <div className="login-links">
          <a href="/forgot-password">Forgot password?</a>
          <p>
            Don’t have an account?{' '}
            <a href="/signup-mentee">Sign up as a mentee</a> or{' '}
            <a href="/signup-mentor">apply to be a mentor</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
