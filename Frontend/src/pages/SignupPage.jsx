import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SignUp.css';

function SignUp() {
  const [activeTab, setActiveTab] = useState('mentee'); // State to track the active tab
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    skill: '',
    role: 'mentee', // Default to 'mentee'
  });

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setFormData({ ...formData, role: tab });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', formData);
      alert('Sign up successful!');
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Something went wrong. Please try again.');
    }
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
            className={`tab ${activeTab === 'mentee' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('mentee')}
          >
            I'm a mentee
          </button>
          <button
            className={`tab ${activeTab === 'mentor' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('mentor')}
          >
            I'm a mentor
          </button>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="text" name="skill" placeholder="Skill" value={formData.skill} onChange={handleChange} required />
          <button type="submit" className="signup-btn">Sign up</button>
        </form>
        <div className="or-divider">
          <span>Or</span>
        </div>
        <button className="google-signup-btn">Sign up with Google</button>
        <div className="signup-links">
          <p>
            Already have an account?{' '}
            <a href="/">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
