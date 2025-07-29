import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const JobCard = ({ job }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Check if this job is already favorited when component loads
  useEffect(() => {
    if (user) {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
      setIsFavorited(favorites.some(fav => fav._id === job._id));
    }
  }, [user, job._id]);

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

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);

    try {
      // Get current favorites from localStorage
      const currentFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
      
      if (isFavorited) {
        // Remove from favorites
        const updatedFavorites = currentFavorites.filter(fav => fav._id !== job._id);
        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavorites));
        setIsFavorited(false);
        alert('Job removed from favorites!');
      } else {
        // Add to favorites
        const updatedFavorites = [...currentFavorites, job];
        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavorites));
        setIsFavorited(true);
        alert('Job added to favorites!');
      }

      // Navigate to favorites page after a short delay
      setTimeout(() => {
        navigate('/favorites');
      }, 1000);

    } catch (error) {
      console.error('Error updating favorites:', error);
      alert('Error updating favorites. Please try again.');
    }

    setFavoriteLoading(false);
  };

  return (
    <div className="card shadow-sm mb-4 border-0" style={{ 
      borderRadius: '20px',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            {/* Job Title with Functional Heart Icon */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="card-title mb-0 fw-bold" style={{ 
                color: '#2c5530',
                fontSize: '24px'
              }}>
                {job.title}
              </h5>
              <button 
                className={`btn border-0 p-2 ${favoriteLoading ? 'disabled' : ''}`}
                onClick={handleFavoriteClick}
                disabled={favoriteLoading}
                style={{
                  backgroundColor: isFavorited ? '#ffebee' : 'transparent',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  transform: favoriteLoading ? 'scale(0.9)' : 'scale(1)'
                }}
              >
                {favoriteLoading ? (
                  <div className="spinner-border spinner-border-sm" role="status" style={{ width: '20px', height: '20px' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <i 
                    className={isFavorited ? 'fas fa-heart' : 'far fa-heart'} 
                    style={{ 
                      fontSize: '20px', 
                      color: isFavorited ? '#e91e63' : '#ccc',
                      transition: 'color 0.3s ease'
                    }}
                  ></i>
                )}
              </button>
            </div>
            
            {/* Job Description */}
            <p className="card-text text-muted mb-4" style={{ 
              fontSize: '16px',
              lineHeight: '1.6'
            }}>
              {job.description.length > 150 
                ? `${job.description.substring(0, 150)}...` 
                : job.description
              }
            </p>

            {/* Tags */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="badge px-3 py-2" style={{ 
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '20px'
              }}>
                UX
              </span>
              <span className="badge px-3 py-2" style={{ 
                backgroundColor: '#f3e5f5',
                color: '#7b1fa2',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '20px'
              }}>
                Work at Office
              </span>
              <span className="badge px-3 py-2" style={{ 
                backgroundColor: '#e8f5e8',
                color: '#388e3c',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '20px'
              }}>
                {job.location}
              </span>
            </div>

            {/* Bottom Row - Company Info and Actions */}
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                {/* Company Logo Placeholder */}
                <div 
                  className="rounded me-3 d-flex align-items-center justify-content-center"
                  style={{ 
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#ff6b35'
                  }}
                >
                  <span className="text-white fw-bold" style={{ fontSize: '12px' }}>i</span>
                </div>
                <div>
                  <span className="text-muted me-3 fw-medium" style={{ fontSize: '14px' }}>
                    indeed
                  </span>
                  <span className="text-muted fw-medium" style={{ fontSize: '14px' }}>
                    {formatTimeAgo(job.postedAt)}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="d-flex gap-3">
                <button 
                  className="btn btn-link text-muted p-0"
                  style={{ 
                    fontSize: '14px',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  Report
                </button>
                <Link 
                  to={`/jobs/${job._id}`} 
                  className="btn btn-primary px-4 py-2"
                  style={{ 
                    backgroundColor: '#2c5530',
                    borderColor: '#2c5530',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: '25px',
                    textDecoration: 'none'
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
