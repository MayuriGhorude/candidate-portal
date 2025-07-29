import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const AdminJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    type: 'Full-Time',
    company: 'Nottingham Building Society'
  });

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchJobs();
      fetchApplications();
    }
  }, [user]);

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

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', jobForm);
      setShowAddJobModal(false);
      setJobForm({
        title: '',
        description: '',
        location: '',
        type: 'Full-Time',
        company: 'Nottingham Building Society'
      });
      fetchJobs();
      alert('Job posted successfully!');
    } catch (error) {
      alert('Error posting job: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      description: job.description,
      location: job.location,
      type: job.type,
      company: job.company || 'Nottingham Building Society'
    });
    setShowAddJobModal(true);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/jobs/${editingJob._id}`, jobForm);
      setShowAddJobModal(false);
      setEditingJob(null);
      setJobForm({
        title: '',
        description: '',
        location: '',
        type: 'Full-Time',
        company: 'Nottingham Building Society'
      });
      fetchJobs();
      alert('Job updated successfully!');
    } catch (error) {
      alert('Error updating job: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/jobs/${jobId}`);
        fetchJobs();
        alert('Job deleted successfully!');
      } catch (error) {
        alert('Error deleting job: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  const getJobApplications = (jobId) => {
    return applications.filter(app => app.job._id === jobId);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Admin Dashboard</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddJobModal(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Post New Job
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center border-primary">
            <div className="card-body">
              <i className="fas fa-briefcase fa-2x text-primary mb-2"></i>
              <h3 className="text-primary">{jobs.length}</h3>
              <p className="text-muted mb-0">Total Jobs</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-success">
            <div className="card-body">
              <i className="fas fa-users fa-2x text-success mb-2"></i>
              <h3 className="text-success">{applications.length}</h3>
              <p className="text-muted mb-0">Total Applications</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-warning">
            <div className="card-body">
              <i className="fas fa-eye fa-2x text-warning mb-2"></i>
              <h3 className="text-warning">
                {applications.filter(app => !app.status || app.status === 'pending').length}
              </h3>
              <p className="text-muted mb-0">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center border-info">
            <div className="card-body">
              <i className="fas fa-chart-line fa-2x text-info mb-2"></i>
              <h3 className="text-info">
                {applications.length > 0 ? Math.round(applications.length / jobs.length) : 0}
              </h3>
              <p className="text-muted mb-0">Avg per Job</p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Management */}
      <div className="card shadow">
        <div className="card-header">
          <h4 className="mb-0">Posted Jobs</h4>
        </div>
        <div className="card-body">
          {jobs.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Applications</th>
                    <th>Posted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job._id}>
                      <td>
                        <strong>{job.title}</strong>
                        <br />
                        <small className="text-muted">
                          {job.description.substring(0, 50)}...
                        </small>
                      </td>
                      <td>{job.location}</td>
                      <td>
                        <span className="badge bg-primary">{job.type}</span>
                      </td>
                      <td>
                        <span className="badge bg-success">
                          {getJobApplications(job._id).length} applications
                        </span>
                      </td>
                      <td>
                        {new Date(job.postedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleEditJob(job)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteJob(job._id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="fas fa-briefcase fa-3x text-muted mb-3"></i>
              <h5>No jobs posted yet</h5>
              <p className="text-muted">Start by posting your first job</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddJobModal(true)}
              >
                Post New Job
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Job Modal */}
      {showAddJobModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingJob ? 'Edit Job' : 'Post New Job'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setShowAddJobModal(false);
                    setEditingJob(null);
                    setJobForm({
                      title: '',
                      description: '',
                      location: '',
                      type: 'Full-Time',
                      company: 'Nottingham Building Society'
                    });
                  }}
                ></button>
              </div>
              <form onSubmit={editingJob ? handleUpdateJob : handleAddJob}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Job Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={jobForm.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Job Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="6"
                      value={jobForm.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="location" className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        id="location"
                        name="location"
                        value={jobForm.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="type" className="form-label">Job Type</label>
                      <select
                        className="form-control"
                        id="type"
                        name="type"
                        value={jobForm.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="company" className="form-label">Company</label>
                    <input
                      type="text"
                      className="form-control"
                      id="company"
                      name="company"
                      value={jobForm.company}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddJobModal(false);
                      setEditingJob(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingJob ? 'Update Job' : 'Post Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
