// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import MentorSearchPage from './pages/MentorSearchPage';
import ProfilePage from './pages/ProfilePage';
import About from './pages/AboutPage';
import ChatListPage from './pages/ChatListPage';
import ChatPage from './pages/ChatPage'
import Webinar from './pages/Webinar';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './components/CoursesDetailPage';
import FeedbackModal from './components/Feeedsback';
import EditCoursePage from './components/EditsCourseDetail';
import CollaborationRequestsPage from './pages/CollabRequest';
import NewCourseModal from './components/NewCoursesModelPage';

import ProjectPage from './pages/ProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

import ProjectProposalsPage from "./pages/ProjectProposalsPage";



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/webinar" element={<Webinar />} />
        <Route path="/chat" element={<ChatListPage />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
        {/* <Route path="/edit-course/:id" element={<EditCoursePage/>}/> */}

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/projects" element={<ProtectedRoute><ProjectPage /></ProtectedRoute>} />
        <Route path="/project/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <CoursesPage/>
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/collaborations"
          element={
            <ProtectedRoute>
              <CollaborationRequestsPage/>
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/collaborations"
          element={
            <ProtectedRoute>
              <CollaborationRequestsPage/>
            </ProtectedRoute>
          }
        />
        <Route
          path="//course/:id"
          element={
            <ProtectedRoute>
              <CourseDetailPage userRole="mentee" />
            </ProtectedRoute>
          }
        />

        <Route path="/project/:id/proposals" element={<ProtectedRoute><ProjectProposalsPage /></ProtectedRoute>} />


        <Route
          path="/course-feedback/:id"
          element={
            <ProtectedRoute>
              <CourseDetailPage userRole="mentor" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/givefeedback/:id"
          element={
            <ProtectedRoute>
              <FeedbackModal userRole="mentee" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-course/:id"
          element={
            <ProtectedRoute>
              <EditCoursePage userRole="mentee" />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

        <Route
          path="/mentorsearch"
          element={
            <ProtectedRoute>
              <MentorSearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addcourse"
          element={
            <ProtectedRoute>
              <NewCourseModal />
            </ProtectedRoute>
          }
        />
        

        {/* Fallback: redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
