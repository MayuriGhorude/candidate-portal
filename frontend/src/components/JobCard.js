import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
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

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title text-primary">{job.title}</h5>
            <button className="btn btn-outline-secondary btn-sm">
              <i className="far fa-heart"></i>
            </button>
          </div>
          
          <p className="card-text text-muted small">
            {job.description.length > 100 
              ? `${job.description.substring(0, 100)}...` 
              : job.description
            }
          </p>
          
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
          
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              <i className="far fa-clock me-1"></i>
              {formatTimeAgo(job.postedAt)}
            </small>
            <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
