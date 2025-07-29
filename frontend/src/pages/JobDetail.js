import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    cv: null,
    message: ''
  });
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetail();
    if (user && user.role === 'student') {
      checkApplicationStatus();
    }
  }, [id, user]);

  const fetchJobDetail = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job details:', error);
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await api.get('/applications/my-applications');
      const hasAppliedToJob = response.data.some(app => app.job._id === id);
      setHasApplied(hasAppliedToJob);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleFileChange = (e) => {
    setApplicationData(prev => ({
      ...prev,
      cv: e.target.files[0]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setApplying(true);
    const formData = new FormData();
    if (applicationData.cv) {
      formData.append('cv', applicationData.cv);
    }
    formData.append('message', applicationData.message);

    try {
      await api.post(`/applications/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setHasApplied(true);
      setShowApplicationForm(false);
      alert('Application submitted successfully!');
    } catch (error) {
      alert('Error submitting application: ' + (error.response?.data?.message || 'Unknown error'));
    }
    setApplying(false);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const jobDate = new Date(date);
    const diffTime = Math.abs(now - jobDate);
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

  if (!job) {
    return (
      <div className="container py-5 text-center">
        <h2>Job not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/jobs')}>
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1 className="h2 text-primary mb-2">{job.title}</h1>
                  <div className="mb-3">
                    <span className="badge bg-light text-dark me-2">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {job.location}
                    </span>
                    <span className="badge bg-primary me-2">{job.type}</span>
                    <span className="badge bg-secondary">
                      {job.company || 'Nottingham Building Society'}
                    </span>
                  </div>
                  <p className="text-muted">
                    <i className="far fa-clock me-1"></i>
                    Posted {formatTimeAgo(job.postedAt)} • Over 100 applicants
                  </p>
                </div>
                <button className="btn btn-outline-secondary">
                  <i className="far fa-heart"></i> Save
                </button>
              </div>

              <div className="mb-4">
                <h3>Job Description</h3>
                <div className="job-description">
                  {job.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3">{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3>Requirements</h3>
                <ul className="list-unstyled">
                  <li className="mb-2"><i className="fas fa-check text-success me-2"></i>2+ years of experience in relevant field</li>
                  <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Strong portfolio demonstrating skills</li>
                  <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Excellent communication skills</li>
                  <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Team collaboration experience</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow mb-4">
            <div className="card-body p-4">
              <h4 className="mb-3">Apply for this job</h4>
              
              {!user ? (
                <div className="text-center">
                  <p>Please login to apply for this job</p>
                  <button 
                    className="btn btn-primary w-100 mb-2"
                    onClick={() => navigate('/login')}
                  >
                    Login to Apply
                  </button>
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate('/register')}
                  >
                    Sign Up
                  </button>
                </div>
              ) : hasApplied ? (
                <div className="alert alert-success">
                  <i className="fas fa-check-circle me-2"></i>
                  You have already applied for this job
                </div>
              ) : user.role === 'admin' ? (
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  Admins cannot apply for jobs
                </div>
              ) : !showApplicationForm ? (
                <button 
                  className="btn btn-primary w-100"
                  onClick={() => setShowApplicationForm(true)}
                >
                  Apply Now
                </button>
              ) : (
                <form onSubmit={handleApply}>
                  <div className="mb-3">
                    <label htmlFor="cv" className="form-label">Upload CV/Resume</label>
                    <input
                      type="file"
                      className="form-control"
                      id="cv"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                    />
                    <small className="text-muted">PDF, DOC, or DOCX files only</small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">Cover Letter (Optional)</label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      rows="4"
                      placeholder="Tell us why you're interested in this role..."
                      value={applicationData.message}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={applying}
                    >
                      {applying ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setShowApplicationForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="card shadow">
            <div className="card-body p-4">
              <h4 className="mb-3">Meet the hiring team</h4>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '50px', height: '50px' }}>
                  <i className="fas fa-user text-white"></i>
                </div>
                <div>
                  <h6 className="mb-0">Emma Watson</h6>
                  <small className="text-muted">HR Manager</small>
                </div>
              </div>
              <p className="small text-muted">
                Digital Transformation | Digital Strategy | AI | ML | Managed Staffing Solutions
              </p>
              <button className="btn btn-outline-primary btn-sm">
                <i className="fas fa-envelope me-1"></i>
                Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
