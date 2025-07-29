import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import JobCard from '../components/JobCard';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const JobList = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
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

          {/* Job Results */}
          <div className="row">
            <div className="col-12">
              {jobs.length > 0 ? (
                jobs.map(job => (
                  <JobCard key={job._id} job={job} />
                ))
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-search fa-3x text-muted mb-3"></i>
                  <h4>No jobs found</h4>
                  <p className="text-muted">Try adjusting your search criteria or check back later for new opportunities.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
