import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';

const Favorites = () => {
  const { user } = useAuth();
  const [favoriteJobs, setFavoriteJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingJobId, setRemovingJobId] = useState(null);

  // Wrap fetchFavoriteJobs in useCallback to fix ESLint warning
  const fetchFavoriteJobs = useCallback(() => {
    try {
      if (user) {
        // Get favorites from localStorage for this user
        const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
        setFavoriteJobs(favorites);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorite jobs:', error);
      setFavoriteJobs([]);
      setLoading(false);
    }
  }, [user]);

  // Fixed useEffect with proper dependencies
  useEffect(() => {
    fetchFavoriteJobs();
  }, [fetchFavoriteJobs]);

  const handleRemoveFavorite = async (jobId, jobTitle) => {
    if (window.confirm(`Are you sure you want to remove "${jobTitle}" from your favorites?`)) {
      setRemovingJobId(jobId);
      
      try {
        // Remove from localStorage
        const currentFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
        const updatedFavorites = currentFavorites.filter(job => job._id !== jobId);
        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavorites));
        
        // Update state
        setFavoriteJobs(updatedFavorites);
        
        // Simulate API call delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        alert('Job removed from favorites successfully!');
        
      } catch (error) {
        console.error('Error removing favorite:', error);
        alert('Error removing job from favorites. Please try again.');
      } finally {
        setRemovingJobId(null);
      }
    }
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

  return (
    <div className="d-flex">
      {/* Sidebar */}
      {user && <Sidebar />}
      
      {/* Main Content */}
      <div className="flex-grow-1" style={{ backgroundColor: '#f5f7fa', minHeight: 'calc(100vh - 80px)' }}>
        <div className="container-fluid py-5 px-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h1 className="display-6 fw-bold mb-2" style={{ color: '#2c5530' }}>
                Your Favorite Jobs
              </h1>
              <p className="text-muted mb-0" style={{ fontSize: '18px' }}>
                Jobs you've saved for later review
              </p>
            </div>
            <div className="d-flex align-items-center">
              <i className="fas fa-heart fa-2x me-3" style={{ color: '#e91e63' }}></i>
              <div>
                <div className="fw-bold" style={{ fontSize: '24px', color: '#2c5530' }}>
                  {favoriteJobs.length}
                </div>
                <small className="text-muted">Saved Jobs</small>
              </div>
            </div>
          </div>

          {/* Favorites Stats Cards */}
          <div className="row mb-5">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <div className="card-body text-center p-4">
                  <div 
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{ width: '60px', height: '60px', backgroundColor: '#e3f2fd' }}
                  >
                    <i className="fas fa-heart fa-xl" style={{ color: '#1976d2' }}></i>
                  </div>
                  <h3 className="fw-bold mb-1" style={{ color: '#2c5530' }}>
                    {favoriteJobs.length}
                  </h3>
                  <p className="text-muted mb-0">Total Favorites</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <div className="card-body text-center p-4">
                  <div 
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{ width: '60px', height: '60px', backgroundColor: '#e8f5e8' }}
                  >
                    <i className="fas fa-clock fa-xl" style={{ color: '#388e3c' }}></i>
                  </div>
                  <h3 className="fw-bold mb-1" style={{ color: '#2c5530' }}>
                    {favoriteJobs.filter(job => {
                      const daysSince = Math.ceil(Math.abs(new Date() - new Date(job.postedAt)) / (1000 * 60 * 60 * 24));
                      return daysSince <= 7;
                    }).length}
                  </h3>
                  <p className="text-muted mb-0">Recently Added</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <div className="card-body text-center p-4">
                  <div 
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{ width: '60px', height: '60px', backgroundColor: '#fff3e0' }}
                  >
                    <i className="fas fa-star fa-xl" style={{ color: '#ff9800' }}></i>
                  </div>
                  <h3 className="fw-bold mb-1" style={{ color: '#2c5530' }}>
                    85%
                  </h3>
                  <p className="text-muted mb-0">Match Score</p>
                </div>
              </div>
            </div>
          </div>

          {/* Favorite Jobs List */}
          <div className="row">
            <div className="col-12">
              {favoriteJobs.length > 0 ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold" style={{ color: '#2c5530' }}>
                      Saved Jobs ({favoriteJobs.length})
                    </h3>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm" 
                        style={{ borderRadius: '20px' }}
                        onClick={() => {
                          const sorted = [...favoriteJobs].sort((a, b) => a.title.localeCompare(b.title));
                          setFavoriteJobs(sorted);
                        }}
                      >
                        <i className="fas fa-sort-alpha-down me-2"></i>
                        Sort A-Z
                      </button>
                      <button 
                        className="btn btn-outline-primary btn-sm" 
                        style={{ borderRadius: '20px' }}
                        onClick={() => {
                          const sorted = [...favoriteJobs].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
                          setFavoriteJobs(sorted);
                        }}
                      >
                        <i className="fas fa-calendar-alt me-2"></i>
                        Sort by Date
                      </button>
                    </div>
                  </div>
                  
                  {/* Display actual favorite jobs */}
                  {favoriteJobs.map(job => (
                    <div key={job._id} className="card shadow-sm mb-4 border-0" style={{ 
                      borderRadius: '20px',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}>
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            {/* Job Title with Remove Button */}
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <h5 className="card-title mb-0 fw-bold" style={{ 
                                color: '#2c5530',
                                fontSize: '24px'
                              }}>
                                {job.title}
                              </h5>
                              
                              {/* Remove Button */}
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleRemoveFavorite(job._id, job.title)}
                                disabled={removingJobId === job._id}
                                style={{
                                  borderRadius: '25px',
                                  padding: '8px 16px',
                                  fontWeight: '600',
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                {removingJobId === job._id ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Removing...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-trash me-2"></i>
                                    Remove
                                  </>
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

                            {/* Bottom Row */}
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
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
                                    {job.company || 'Nottingham Building Society'}
                                  </span>
                                  <span className="text-muted fw-medium" style={{ fontSize: '14px' }}>
                                    {formatTimeAgo(job.postedAt)}
                                  </span>
                                </div>
                              </div>
                              
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
                  ))}
                </>
              ) : (
                <div className="text-center py-5">
                  <div 
                    className="rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center"
                    style={{ width: '120px', height: '120px', backgroundColor: '#f5f5f5' }}
                  >
                    <i className="far fa-heart fa-4x text-muted"></i>
                  </div>
                  <h3 className="fw-bold mb-3" style={{ color: '#2c5530' }}>
                    No Favorite Jobs Yet
                  </h3>
                  <p className="text-muted mb-4" style={{ fontSize: '18px', maxWidth: '400px', margin: '0 auto' }}>
                    Start building your favorites list by clicking the heart icon on jobs you're interested in.
                  </p>
                  <Link 
                    to="/jobs" 
                    className="btn btn-primary btn-lg"
                    style={{
                      backgroundColor: '#2c5530',
                      borderColor: '#2c5530',
                      borderRadius: '25px',
                      padding: '12px 30px'
                    }}
                  >
                    <i className="fas fa-search me-2"></i>
                    Browse Jobs
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Clear All Favorites */}
          {favoriteJobs.length > 0 && (
            <div className="row mt-5">
              <div className="col-12">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #2c5530 0%, #3e7b3e 100%)' }}>
                  <div className="card-body p-4 text-white">
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <h4 className="fw-bold mb-2">Ready to Apply?</h4>
                        <p className="mb-0 opacity-75">
                          You have {favoriteJobs.length} saved jobs. Don't wait too long - great opportunities get filled quickly!
                        </p>
                      </div>
                      <div className="col-md-4 text-end">
                        <button 
                          className="btn btn-outline-light fw-bold"
                          style={{ borderRadius: '25px', padding: '10px 20px' }}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove all ${favoriteJobs.length} jobs from favorites?`)) {
                              localStorage.setItem(`favorites_${user.id}`, JSON.stringify([]));
                              setFavoriteJobs([]);
                              alert('All favorites cleared successfully!');
                            }
                          }}
                        >
                          <i className="fas fa-trash me-2"></i>
                          Clear All Favorites
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
