// src/pages/JobList.js (update your existing file)
import React, { useState, useEffect } from 'react';
import api from '../api';
import JobCard from '../components/JobCard';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    return (
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (locationFilter === '' || job.location.includes(locationFilter)) &&
      (typeFilter === '' || job.type === typeFilter)
    );
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container py-4" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="row mb-4">
        <div className="col-md-12">
          <h2 className="text-center mb-4" style={{ color: '#2c5530' }}>
            Find the most exciting remote-friendly jobs
          </h2>
          
          {/* Search and Filters */}
          <div className="card p-4 mb-4">
            <div className="row">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Job title or keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-control"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary w-100">Search</button>
              </div>
            </div>
          </div>

          {/* Job Cards */}
          <div className="row">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))
            ) : (
              <div className="col-12 text-center">
                <p>No jobs found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
