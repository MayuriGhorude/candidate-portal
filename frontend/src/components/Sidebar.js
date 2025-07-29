import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!user) return null;

  const sidebarItems = [
    { path: '/jobs', icon: 'fas fa-search', label: 'Search Job' },
    { path: '/favorites', icon: 'fas fa-heart', label: 'Favorites' },
    { path: '/interview-prep', icon: 'fas fa-graduation-cap', label: 'Interview prep' },
    { path: '/dashboard', icon: 'fas fa-chart-line', label: 'Dashboards' }
  ];

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
      // You can implement the actual upload API call here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated upload
      alert('Resume uploaded successfully!');
      setSelectedFile(null);
    } catch (error) {
      alert('Upload failed. Please try again.');
    }
    setUploading(false);
  };

  return (
    <div 
      className="bg-light border-end" 
      style={{ 
        width: '280px', 
        minHeight: 'calc(100vh - 80px)',
        boxShadow: '2px 0 10px rgba(0,0,0,0.05)'
      }}
    >
      <div className="p-4">
        {/* Company Info Card */}
        <div className="text-center mb-4">
          <h5 className="fw-bold" style={{ color: '#2c5530', fontSize: '18px' }}>
            Nottingham Building Society
          </h5>
        </div>

        {/* User Profile Card */}
        <div className="card mb-4 shadow-sm border-0" style={{ borderRadius: '16px' }}>
          <div className="card-body text-center p-4">
            <div 
              className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
              style={{ 
                width: '70px', 
                height: '70px',
                backgroundColor: '#2c5530'
              }}
            >
              <i className="fas fa-user fa-2x text-white"></i>
            </div>
            <h6 className="card-title mb-1 fw-bold" style={{ fontSize: '16px' }}>
              {user.firstName} {user.lastName}
            </h6>
            <p className="card-text text-muted mb-0" style={{ fontSize: '14px' }}>
              {user.email}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mb-4">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`d-flex align-items-center text-decoration-none p-3 mb-2 rounded-3 ${
                location.pathname === item.path ? 'text-white' : 'text-dark'
              }`}
              style={{
                backgroundColor: location.pathname === item.path ? '#2c5530' : 'transparent',
                fontWeight: location.pathname === item.path ? '600' : '500',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
            >
              <i className={`${item.icon} me-3`} style={{ fontSize: '18px', width: '20px' }}></i>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Enhanced Upload Resume Card - Exact Match from PDF */}
        <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
          <div className="card-body text-center p-4">
            <div 
              className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
              style={{ 
                width: '60px', 
                height: '60px',
                backgroundColor: '#e3f2fd'
              }}
            >
              <i className="fas fa-upload fa-xl" style={{ color: '#1976d2' }}></i>
            </div>
            <h6 className="card-title fw-bold mb-2" style={{ fontSize: '18px', color: '#2c5530' }}>
              Upload your resume
            </h6>
            <p className="card-text text-muted mb-4" style={{ fontSize: '14px', lineHeight: '1.4' }}>
              Upload your CV to get matching Jobs
            </p>

            {/* File Input - Hidden */}
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {/* Selected File Display */}
            {selectedFile && (
              <div className="mb-3 p-2 bg-light rounded" style={{ fontSize: '13px' }}>
                <i className="fas fa-file-alt me-2 text-primary"></i>
                {selectedFile.name}
              </div>
            )}

            {/* Action Buttons */}
            <div className="d-grid gap-2">
              <button 
                className="btn fw-medium"
                onClick={() => document.getElementById('resume-upload').click()}
                style={{
                  backgroundColor: selectedFile ? '#28a745' : '#2c5530',
                  borderColor: selectedFile ? '#28a745' : '#2c5530',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px'
                }}
              >
                <i className={`fas ${selectedFile ? 'fa-check' : 'fa-folder-open'} me-2`}></i>
                {selectedFile ? 'File Selected' : 'Choose File'}
              </button>

              {selectedFile && (
                <button 
                  className="btn btn-primary fw-medium"
                  onClick={handleUpload}
                  disabled={uploading}
                  style={{
                    backgroundColor: '#007bff',
                    borderColor: '#007bff',
                    borderRadius: '12px',
                    padding: '10px 16px',
                    fontSize: '14px'
                  }}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-cloud-upload-alt me-2"></i>
                      Upload Resume
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Upload Status */}
            <div className="mt-3">
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Supported formats: PDF, DOC, DOCX
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
