import React, { useState, useEffect } from 'react';
import api from '../api';
import JobCard from '../components/JobCard';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs', { params: filters });
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

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
    <div className="container py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold" style={{ color: '#2c5530' }}>
          Find the most exciting remote-friendly jobs
        </h1>
        <p className="lead text-muted">
          Jobsek is our love letter to find remote or onsite work with 45,000+ Jobs. 
          Unlock your new career working from anywhere in the world.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card shadow mb-5">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Job title or keyword"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-control form-control-lg"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">Type of employment</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-primary btn-lg w-100"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Job Results */}
      <div className="row">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h4>No jobs found</h4>
            <p className="text-muted">Try adjusting your search criteria or check back later for new opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
