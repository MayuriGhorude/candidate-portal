import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
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

  // Wrap fetchJobDetail in useCallback to fix ESLint warning
  const fetchJobDetail = useCallback(async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job details:', error);
      setLoading(false);
    }
  }, [id]);

  // Wrap checkApplicationStatus in useCallback to fix ESLint warning
  const checkApplicationStatus = useCallback(async () => {
    try {
      const response = await api.get('/applications/my-applications');
      const hasAppliedToJob = response.data.some(app => app.job._id === id);
      setHasApplied(hasAppliedToJob);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  }, [id]);

  // Fixed useEffect with proper dependencies
  useEffect(() => {
    fetchJobDetail();
    if (user && user.role === 'student') {
      checkApplicationStatus();
    }
  }, [id, user, fetchJobDetail, checkApplicationStatus]);

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
    
    if (diffDays <= 4) return `${diffDays} Days ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="d-flex">
        {user && <Sidebar />}
        <div className="flex-grow-1 d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="d-flex">
        {user && <Sidebar />}
        <div className="flex-grow-1 container py-5 text-center">
          <h2>Job not found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/jobs')}>
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      {user && <Sidebar />}
      
      {/* Main Content - Single Column Layout */}
      <div className="flex-grow-1" style={{ backgroundColor: '#f5f7fa', minHeight: 'calc(100vh - 80px)' }}>
        <div className="container py-5 px-4">
          <div className="row justify-content-center">
            {/* Single Column Content */}
            <div className="col-lg-10">
              <div className="card shadow-sm mb-4 border-0" style={{ borderRadius: '20px' }}>
                <div className="card-body p-5">
                  {/* Job Header */}
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="flex-grow-1">
                      <h1 className="display-6 fw-bold mb-3" style={{ color: '#2c5530', fontSize: '36px' }}>
                        {job.title}
                      </h1>
                      
                      {/* Location and Type Info */}
                      <div className="mb-3">
                        <span className="me-3" style={{ fontSize: '18px', color: '#666' }}>
                          <i className="fas fa-map-marker-alt me-2"></i>
                          {job.location}
                        </span>
                        <span className="me-3" style={{ fontSize: '18px', color: '#666' }}>
                          •
                        </span>
                        <span className="me-3" style={{ fontSize: '18px', color: '#666' }}>
                          {formatTimeAgo(job.postedAt)}
                        </span>
                        <span className="me-3" style={{ fontSize: '18px', color: '#666' }}>
                          •
                        </span>
                        <span style={{ fontSize: '18px', color: '#666' }}>
                          Over 100 applicants
                        </span>
                      </div>

                      {/* Status Badges */}
                      <div className="mb-4">
                        <span className="badge me-2 px-3 py-2" style={{ 
                          backgroundColor: '#e8f5e8', 
                          color: '#388e3c',
                          fontSize: '14px',
                          fontWeight: '500',
                          borderRadius: '20px'
                        }}>
                          <i className="fas fa-star me-1"></i>
                          Promoted by hirer
                        </span>
                        <span className="badge me-2 px-3 py-2" style={{ 
                          backgroundColor: '#e3f2fd', 
                          color: '#1976d2',
                          fontSize: '14px',
                          fontWeight: '500',
                          borderRadius: '20px'
                        }}>
                          Actively reviewing applicants
                        </span>
                      </div>

                      {/* Job Type Tags */}
                      <div className="mb-4">
                        <span className="badge bg-success me-2 px-3 py-2" style={{ fontSize: '14px', borderRadius: '15px' }}>
                          Full-Time
                        </span>
                        <span className="badge bg-primary me-2 px-3 py-2" style={{ fontSize: '14px', borderRadius: '15px' }}>
                          Part-Time
                        </span>
                        <span className="badge bg-info px-3 py-2" style={{ fontSize: '14px', borderRadius: '15px' }}>
                          On-Site
                        </span>
                      </div>
                    </div>
                    
                    {/* Save Button */}
                    <button className="btn btn-outline-light border-0 p-3" style={{ borderRadius: '50%' }}>
                      <i className="far fa-heart" style={{ fontSize: '24px', color: '#ccc' }}></i>
                    </button>
                  </div>

                  {/* Job Description */}
                  <div className="mb-5">
                    <h3 className="fw-bold mb-4" style={{ color: '#2c5530', fontSize: '24px' }}>
                      Job Description
                    </h3>
                    <div className="job-description" style={{ fontSize: '16px', lineHeight: '1.7', color: '#555' }}>
                      {job.description.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-3">{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  {/* Apply for This Job Section - Inline Below Description */}
                  <div className="mb-5 p-4 rounded-4" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                    <h4 className="mb-4 fw-bold d-flex align-items-center" style={{ color: '#2c5530', fontSize: '24px' }}>
                      <i className="fas fa-paper-plane me-3"></i>
                      Apply for this job
                    </h4>
                    
                    {!user ? (
                      <div className="text-center py-4">
                        <p className="mb-4" style={{ fontSize: '18px', color: '#666' }}>
                          Please login to apply for this job
                        </p>
                        <div className="d-flex gap-3 justify-content-center">
                          <button 
                            className="btn btn-lg px-5"
                            onClick={() => navigate('/login')}
                            style={{
                              backgroundColor: '#2c5530',
                              borderColor: '#2c5530',
                              color: 'white',
                              borderRadius: '25px',
                              fontWeight: '600'
                            }}
                          >
                            Login to Apply
                          </button>
                          <button 
                            className="btn btn-outline-primary btn-lg px-5"
                            onClick={() => navigate('/register')}
                            style={{
                              borderColor: '#2c5530',
                              color: '#2c5530',
                              borderRadius: '25px',
                              fontWeight: '600'
                            }}
                          >
                            Sign Up
                          </button>
                        </div>
                      </div>
                    ) : hasApplied ? (
                      <div className="alert alert-success border-0 text-center py-4" style={{ borderRadius: '15px', fontSize: '18px' }}>
                        <i className="fas fa-check-circle fa-2x mb-3 d-block"></i>
                        <strong>Application Submitted Successfully!</strong>
                        <p className="mb-0 mt-2">You have already applied for this job. We'll be in touch soon.</p>
                      </div>
                    ) : user.role === 'admin' ? (
                      <div className="alert alert-info border-0 text-center py-4" style={{ borderRadius: '15px', fontSize: '18px' }}>
                        <i className="fas fa-info-circle fa-2x mb-3 d-block"></i>
                        <strong>Admin Account</strong>
                        <p className="mb-0 mt-2">Admins cannot apply for jobs. Switch to a student account to apply.</p>
                      </div>
                    ) : !showApplicationForm ? (
                      <div className="text-center py-4">
                        <button 
                          className="btn btn-lg px-5 py-3"
                          onClick={() => setShowApplicationForm(true)}
                          style={{
                            backgroundColor: '#2c5530',
                            borderColor: '#2c5530',
                            color: 'white',
                            borderRadius: '25px',
                            fontWeight: '600',
                            fontSize: '18px'
                          }}
                        >
                          <i className="fas fa-paper-plane me-2"></i>
                          Apply Now
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApply} className="row g-4">
                        <div className="col-md-6">
                          <label htmlFor="cv" className="form-label fw-semibold h5">
                            Upload CV/Resume *
                          </label>
                          <input
                            type="file"
                            className="form-control form-control-lg"
                            id="cv"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            required
                            style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                          />
                          <small className="text-muted">PDF, DOC, or DOCX files only</small>
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="message" className="form-label fw-semibold h5">
                            Cover Letter (Optional)
                          </label>
                          <textarea
                            className="form-control form-control-lg"
                            id="message"
                            name="message"
                            rows="4"
                            placeholder="Tell us why you're interested in this role..."
                            value={applicationData.message}
                            onChange={handleInputChange}
                            style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
                          />
                        </div>

                        <div className="col-12 text-center pt-3">
                          <div className="d-flex gap-3 justify-content-center">
                            <button 
                              type="submit" 
                              className="btn btn-lg px-5"
                              disabled={applying}
                              style={{
                                backgroundColor: '#2c5530',
                                borderColor: '#2c5530',
                                color: 'white',
                                borderRadius: '25px',
                                fontWeight: '600'
                              }}
                            >
                              {applying ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2"></span>
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-paper-plane me-2"></i>
                                  Submit Application
                                </>
                              )}
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary btn-lg px-5"
                              onClick={() => setShowApplicationForm(false)}
                              style={{ borderRadius: '25px', fontWeight: '600' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Meet the Hiring Team Section - Inline Below Apply Section */}
                  <div className="mb-5 p-4 rounded-4" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                    <h4 className="mb-4 fw-bold d-flex align-items-center" style={{ color: '#2c5530', fontSize: '24px' }}>
                      <i className="fas fa-users me-3"></i>
                      Meet the hiring team
                    </h4>
                    
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center mb-3 mb-md-0">
                        <div 
                          className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                          style={{ 
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#2c5530'
                          }}
                        >
                          <i className="fas fa-user text-white fa-2x"></i>
                        </div>
                      </div>
                      <div className="col-md-7">
                        <div className="d-flex align-items-center mb-2">
                          <h5 className="mb-0 fw-bold me-3">Emma Watson</h5>
                          <small className="text-white px-2 py-1 rounded fw-bold" style={{ 
                            backgroundColor: '#0066cc', 
                            fontSize: '12px' 
                          }}>
                            3rd
                          </small>
                        </div>
                        <p className="text-muted mb-0" style={{ 
                          lineHeight: '1.6',
                          fontSize: '16px'
                        }}>
                          Digital Transformation | Digital Strategy | AI | ML | Managed Staffing 
                          Solutions | Managed Service Provider/Recruitment Process 
                          Outsourcing/Contingent Workforce Outsourcing | Product 
                          Development | Angel
                        </p>
                      </div>
                      <div className="col-md-3 text-center text-md-end">
                        <button 
                          className="btn btn-outline-primary btn-lg px-4"
                          style={{ 
                            borderRadius: '25px',
                            borderColor: '#2c5530',
                            color: '#2c5530',
                            fontWeight: '600'
                          }}
                        >
                          <i className="fas fa-envelope me-2"></i>
                          Message
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Requirements Section */}
                  <div className="mb-5">
                    <h3 className="fw-bold mb-4" style={{ color: '#2c5530', fontSize: '24px' }}>
                      Requirements
                    </h3>
                    <ul className="list-unstyled">
                      <li className="mb-3 d-flex align-items-start">
                        <i className="fas fa-check-circle text-success me-3 mt-1" style={{ fontSize: '18px' }}></i>
                        <span style={{ fontSize: '16px', lineHeight: '1.6' }}>
                          2+ years of experience in relevant field
                        </span>
                      </li>
                      <li className="mb-3 d-flex align-items-start">
                        <i className="fas fa-check-circle text-success me-3 mt-1" style={{ fontSize: '18px' }}></i>
                        <span style={{ fontSize: '16px', lineHeight: '1.6' }}>
                          Strong portfolio demonstrating skills
                        </span>
                      </li>
                      <li className="mb-3 d-flex align-items-start">
                        <i className="fas fa-check-circle text-success me-3 mt-1" style={{ fontSize: '18px' }}></i>
                        <span style={{ fontSize: '16px', lineHeight: '1.6' }}>
                          Excellent communication skills
                        </span>
                      </li>
                      <li className="mb-3 d-flex align-items-start">
                        <i className="fas fa-check-circle text-success me-3 mt-1" style={{ fontSize: '18px' }}></i>
                        <span style={{ fontSize: '16px', lineHeight: '1.6' }}>
                          Team collaboration experience
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
