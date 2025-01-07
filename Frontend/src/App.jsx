import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import SignUp from './pages/SignupPage';
// import Dashboard from './pages/Dashboard';
import MentorSearch from './pages/MentorSearchPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
              <MentorSearch />
            // </ProtectedRoute>
          }
        />
      
        
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
