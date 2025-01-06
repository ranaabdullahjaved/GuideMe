import React, { useState } from 'react';
import '../styles/SignUp.css';

function SignUp() {
  const [activeTab, setActiveTab] = useState('mentee'); // State to track the active tab

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);  // Update the active tab on click
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="logo">
          <svg className="logo-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22h20L12 2z" fill="#fff" />
            <path d="M12 8v8m-4-4h8" stroke="#fff" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="signup-right">
        <h2>Sign up</h2>
        <div className="tab-switch">
          <button
            className={`tab ${activeTab === 'mentee' ? 'active' : ''}`} // Add active class based on state
            onClick={() => handleTabSwitch('mentee')}
          >
            I'm a mentee
          </button>
          <button
            className={`tab ${activeTab === 'mentor' ? 'active' : ''}`} // Add active class based on state
            onClick={() => handleTabSwitch('mentor')}
          >
            I'm a mentor
          </button>
        </div>
        <form className="signup-form">
          <input type="text" placeholder="Full name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="signup-btn">Sign up</button>
        </form>
        <div className="or-divider">
          <span>Or</span>
        </div>
        <button className="google-signup-btn">Sign up with Google</button>
        <div className="signup-links">
          <p>
            Already have an account?{' '}
            <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
