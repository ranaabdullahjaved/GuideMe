import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';

function Login() {
  const [activeTab, setActiveTab] = useState('mentee');
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
    role: 'mentee', // Default to mentee
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
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      
      const { token, user } = response.data;

      // Store token and user data in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      alert(`Welcome ${user.role === 'mentee' ? 'Mentee' : 'Mentor'}, ${user.name}!`);
      window.location.href = '/dashboard'; // Redirect to dashboard
    } catch (error) {
      console.error('Error during login:', error.response?.data?.message || 'Unexpected error');
      alert(error.response?.data?.message || 'Invalid credentials. Please try again.');
    }
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
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="emailOrUsername"
            placeholder="Email or username"
            value={formData.emailOrUsername}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
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
