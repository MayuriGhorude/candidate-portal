import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import JobCard from '../components/JobCard';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    datePosted: '',
    type: '',
    workExperience: '',
    salary: ''
  });

  const fetchJobs = useCallback(async () => {
    try {
      const response = await api.get('/jobs', { params: filters });
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    setLoading(true);
    fetchJobs();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a resume file first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      // Simulate upload - you can implement actual API call here
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Resume uploaded successfully!');
      setSelectedFile(null);
    } catch (error) {
      alert('Upload failed. Please try again.');
    }
    setUploading(false);
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

  return (
    <div className="d-flex">
      {/* Sidebar */}
      {user && <Sidebar />}
      
      {/* Main Content */}
      <div className="flex-grow-1" style={{ backgroundColor: '#f5f7fa', minHeight: 'calc(100vh - 80px)' }}>
        <div className="container-fluid py-5 px-4">
          {/* Hero Section */}
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold mb-4" style={{ 
              color: '#2c5530',
              fontSize: '48px',
              lineHeight: '1.2'
            }}>
              Find the most exciting<br />remote-friendly jobs
            </h1>
            <p className="lead text-muted mb-0" style={{ 
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Jobsek is our love letter to find remote or onsite work with 45,000+ Jobs. 
              Unlock your new career working from anywhere in the world.
            </p>
          </div>

          {/* Advanced Search Bar */}
          <div className="card shadow-sm mb-5 border-0" style={{ borderRadius: '20px' }}>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-lg-2">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Job title or keyword"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    style={{ 
                      borderRadius: '12px',
                      border: '2px solid #e9ecef',
                      fontSize: '16px',
                      backgroundColor: '#fff'
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Anywhere"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    style={{ 
                      borderRadius: '12px',
                      border: '2px solid #e9ecef',
                      fontSize: '16px',
                      backgroundColor: '#fff'
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <select
                    className="form-control form-control-lg"
                    name="datePosted"
                    value={filters.datePosted}
                    onChange={handleFilterChange}
                    style={{ 
                      borderRadius: '12px',
                      border: '2px solid #e9ecef',
                      fontSize: '16px',
                      backgroundColor: '#fff'
                    }}
                  >
                    <option value="">Date of posting</option>
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                  </select>
                </div>
                <div className="col-lg-2">
                  <select
                    className="form-control form-control-lg"
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    style={{ 
                      borderRadius: '12px',
                      border: '2px solid #e9ecef',
                      fontSize: '16px',
                      backgroundColor: '#fff'
                    }}
                  >
                    <option value="">Type of employment</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="col-lg-2">
                  <select
                    className="form-control form-control-lg"
                    name="workExperience"
                    value={filters.workExperience}
                    onChange={handleFilterChange}
                    style={{ 
                      borderRadius: '12px',
                      border: '2px solid #e9ecef',
                      fontSize: '16px',
                      backgroundColor: '#fff'
                    }}
                  >
                    <option value="">Work experience</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                  </select>
                </div>
                <div className="col-lg-2">
                  <button 
                    className="btn btn-lg w-100"
                    onClick={handleSearch}
                    style={{ 
                      backgroundColor: '#2c5530',
                      borderColor: '#2c5530',
                      color: 'white',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '16px'
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Resume Section - Prominent on Home Page as shown in PDF */}
          {user && (
            <div className="row mb-5">
              <div className="col-12">
                <div className="card shadow-sm border-0" style={{ 
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #2c5530 0%, #3e7b3e 100%)',
                  color: 'white'
                }}>
                  <div className="card-body p-5">
                    <div className="row align-items-center">
                      <div className="col-lg-8">
                        <div className="d-flex align-items-center mb-4">
                          <div 
                            className="rounded-circle me-4 d-flex align-items-center justify-content-center"
                            style={{ 
                              width: '80px', 
                              height: '80px',
                              backgroundColor: 'rgba(255,255,255,0.2)'
                            }}
                          >
                            <i className="fas fa-upload fa-2x text-white"></i>
                          </div>
                          <div>
                            <h3 className="fw-bold mb-2" style={{ fontSize: '28px' }}>
                              Upload your resume
                            </h3>
                            <p className="mb-0 opacity-75" style={{ fontSize: '18px' }}>
                              Upload your CV to get matching Jobs and stand out to employers
                            </p>
                          </div>
                        </div>

                        {/* File Selection Area */}
                        <div className="row align-items-center">
                          <div className="col-md-6">
                            <input
                              type="file"
                              id="resume-upload-home"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              style={{ display: 'none' }}
                            />
                            
                            {selectedFile ? (
                              <div className="d-flex align-items-center p-3 rounded" style={{ 
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                border: '2px solid rgba(255,255,255,0.3)'
                              }}>
                                <i className="fas fa-file-alt me-3 fa-2x"></i>
                                <div>
                                  <div className="fw-bold">{selectedFile.name}</div>
                                  <small className="opacity-75">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                  </small>
                                </div>
                              </div>
                            ) : (
                              <div 
                                className="border-2 border-dashed rounded p-4 text-center"
                                style={{ 
                                  borderColor: 'rgba(255,255,255,0.5)',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease'
                                }}
                                onClick={() => document.getElementById('resume-upload-home').click()}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                  e.target.style.borderColor = 'rgba(255,255,255,0.8)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = 'transparent';
                                  e.target.style.borderColor = 'rgba(255,255,255,0.5)';
                                }}
                              >
                                <i className="fas fa-cloud-upload-alt fa-3x mb-3 opacity-75"></i>
                                <div className="fw-bold mb-2">Choose your resume file</div>
                                <small className="opacity-75">Drag and drop or click to browse</small>
                              </div>
                            )}
                          </div>
                          
                          <div className="col-md-6 text-center">
                            {selectedFile ? (
                              <div className="d-grid gap-3">
                                <button 
                                  className="btn btn-light btn-lg fw-bold"
                                  onClick={handleUpload}
                                  disabled={uploading}
                                  style={{
                                    color: '#2c5530',
                                    borderRadius: '12px',
                                    padding: '16px 32px'
                                  }}
                                >
                                  {uploading ? (
                                    <>
                                      <span className="spinner-border spinner-border-sm me-2"></span>
                                      Uploading...
                                    </>
                                  ) : (
                                    <>
                                      <i className="fas fa-upload me-2"></i>
                                      Upload Resume
                                    </>
                                  )}
                                </button>
                                <button 
                                  className="btn btn-outline-light"
                                  onClick={() => setSelectedFile(null)}
                                  style={{ borderRadius: '12px' }}
                                >
                                  Choose Different File
                                </button>
                              </div>
                            ) : (
                              <button 
                                className="btn btn-light btn-lg fw-bold"
                                onClick={() => document.getElementById('resume-upload-home').click()}
                                style={{
                                  color: '#2c5530',
                                  borderRadius: '12px',
                                  padding: '16px 32px'
                                }}
                              >
                                <i className="fas fa-folder-open me-2"></i>
                                Choose File
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Upload Tips */}
                        <div className="mt-4">
                          <small className="opacity-75">
                            <i className="fas fa-info-circle me-2"></i>
                            Supported formats: PDF, DOC, DOCX • Maximum size: 5MB • 
                            Make sure your resume is up-to-date and highlights your key skills
                          </small>
                        </div>
                      </div>
                      
                      <div className="col-lg-4 text-center">
                        <div className="position-relative">
                          <i className="fas fa-briefcase fa-6x opacity-25 mb-4"></i>
                          <div className="position-absolute top-50 start-50 translate-middle">
                            <div className="bg-white rounded-circle p-3" style={{ width: '60px', height: '60px' }}>
                              <i className="fas fa-check fa-2x" style={{ color: '#2c5530' }}></i>
                            </div>
                          </div>
                        </div>
                        <h5 className="fw-bold mb-2">Get Matched</h5>
                        <p className="opacity-75 mb-0">
                          Our AI will match your skills with the best job opportunities
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Job Results */}
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#2c5530', fontSize: '24px' }}>
                  {jobs.length > 0 ? `${jobs.length} Jobs Found` : 'No Jobs Found'}
                </h2>
                <small className="text-muted">
                  Showing the most relevant opportunities for you
                </small>
              </div>
              
              {jobs.length > 0 ? (
                jobs.map(job => (
                  <JobCard key={job._id} job={job} />
                ))
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-search fa-3x text-muted mb-4"></i>
                  <h4 className="fw-bold text-muted mb-3">No jobs found</h4>
                  <p className="text-muted mb-4">
                    Try adjusting your search criteria or check back later for new opportunities.
                  </p>
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => setFilters({
                      search: '', location: '', datePosted: '', type: '', workExperience: '', salary: ''
                    })}
                    style={{
                      backgroundColor: '#2c5530',
                      borderColor: '#2c5530',
                      borderRadius: '12px'
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
