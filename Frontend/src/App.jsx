import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import SignUp from './pages/SignupPage';
import Dashboard from './pages/Dashboard'
import MentorSearchPage from './pages/MentorSearchPage'
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import About from './pages/AboutPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage';
import Webinar from './pages/Webinar';
import HomePage from './pages/HomePage';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/webinar" element={<Webinar />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Protected Routes */}
        <Route
          path="/mentorsearch"
          element={
            // <ProtectedRoute>
            <MentorSearchPage />
            // </ProtectedRoute>
          }
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}
export default App;