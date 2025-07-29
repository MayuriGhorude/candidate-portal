import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import Dashboard from './pages/Dashboard';
import AdminJobs from './pages/AdminJobs';
import Favorites from './pages/Favorites'; // Import the new Favorites component
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router 
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={
              <div className="container py-5">
                <h2 style={{ color: '#2c5530' }}>About Nottingham Building Society</h2>
                <p>Welcome to our careers portal. We're committed to helping you find your next opportunity.</p>
              </div>
            } />
            <Route path="/contact" element={
              <div className="container py-5">
                <h2 style={{ color: '#2c5530' }}>Contact Us</h2>
                <p>Get in touch with our recruitment team for any queries.</p>
              </div>
            } />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute role="admin">
                  <AdminJobs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/favorites" 
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/interview-prep" 
              element={
                <ProtectedRoute>
                  <div className="d-flex">
                    <div className="container py-5"><h2>Interview Preparation</h2><p>Resources and tips for your interviews.</p></div>
                  </div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
