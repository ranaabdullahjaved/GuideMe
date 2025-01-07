import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import SignUp from './pages/SignupPage';
// import Dashboard from './pages/Dashboard';
import MentorSearch from './pages/MentorSearchPage';
import Profile from './pages/ProfilePage';
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< HomePage/>} />
        <Route path="/login" element={< Login/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mentorsearch" element={<MentorSearch />} />
        {/* Protected Routes */}
        {/* <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
              <MentorSearch />
            // </ProtectedRoute>
          }
        /> */}
      
        
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
