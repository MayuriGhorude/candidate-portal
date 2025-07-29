import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    favoriteJobs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'student') {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/my-applications');
      setApplications(response.data);
      setStats({
        totalApplications: response.data.length,
        pendingApplications: response.data.filter(app => !app.status || app.status === 'pending').length,
        favoriteJobs: 0 // Will implement favorites later
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const appDate = new Date(date);
    const diffTime = Math.abs(now - appDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2">Welcome back, {user?.firstName || 'Student'}!</h1>
              <p className="text-muted">Track your job applications and manage your career journey</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card text-center border-primary">
                <div className="card-body">
                  <i className="fas fa-paper-plane fa-2x text-primary mb-2"></i>
                  <h3 className="text-primary">{stats.totalApplications}</h3>
                  <p className="text-muted mb-0">Total Applications</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center border-warning">
                <div className="card-body">
                  <i className="fas fa-clock fa-2x text-warning mb-2"></i>
                  <h3 className="text-warning">{stats.pendingApplications}</h3>
                  <p className="text-muted mb-0">Pending Review</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center border-danger">
                <div className="card-body">
                  <i className="fas fa-heart fa-2x text-danger mb-2"></i>
                  <h3 className="text-danger">{stats.favoriteJobs}</h3>
                  <p className="text-muted mb-0">Saved Jobs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Your Applications</h4>
              <Link to="/jobs" className="btn btn-primary btn-sm">
                Browse More Jobs
              </Link>
            </div>
            <div className="card-body">
              {applications.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Applied</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map(application => (
                        <tr key={application._id}>
                          <td>
                            <strong>{application.job.title}</strong>
                            <br />
                            <small className="text-muted">{application.job.type}</small>
                          </td>
                          <td>{application.job.company || 'Nottingham Building Society'}</td>
                          <td>{application.job.location}</td>
                          <td>{formatTimeAgo(application.appliedAt)}</td>
                          <td>
                            <span className="badge bg-warning">
                              {application.status || 'Under Review'}
                            </span>
                          </td>
                          <td>
                            <Link 
                              to={`/jobs/${application.job._id}`}
                              className="btn btn-outline-primary btn-sm"
                            >
                              View Job
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <h5>No applications yet</h5>
                  <p className="text-muted">Start applying to jobs to see them here</p>
                  <Link to="/jobs" className="btn btn-primary">
                    Browse Jobs
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          {/* Profile Card */}
          <div className="card shadow mb-4">
            <div className="card-body text-center">
              <div className="bg-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="fas fa-user fa-2x text-white"></i>
              </div>
              <h5>{user?.firstName} {user?.lastName}</h5>
              <p className="text-muted">{user?.email}</p>
              <button className="btn btn-outline-primary btn-sm">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card shadow mb-4">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="list-group list-group-flush">
              <Link to="/jobs" className="list-group-item list-group-item-action">
                <i className="fas fa-search me-2"></i>
                Browse Jobs
              </Link>
              <Link to="/favorites" className="list-group-item list-group-item-action">
                <i className="fas fa-heart me-2"></i>
                Saved Jobs
              </Link>
              <Link to="/interview-prep" className="list-group-item list-group-item-action">
                <i className="fas fa-graduation-cap me-2"></i>
                Interview Prep
              </Link>
              <Link to="/profile" className="list-group-item list-group-item-action">
                <i className="fas fa-user me-2"></i>
                Update Profile
              </Link>
            </div>
          </div>

          {/* Upload Resume */}
          <div className="card shadow">
            <div className="card-body text-center">
              <i className="fas fa-upload fa-2x text-primary mb-3"></i>
              <h6>Upload your resume</h6>
              <p className="text-muted small">Upload your CV to get matching Jobs</p>
              <button className="btn btn-primary btn-sm">
                Choose File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
