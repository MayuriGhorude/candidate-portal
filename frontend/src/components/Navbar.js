import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/jobs', label: 'Open Jobs' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact Us' }
  ];

  // Fixed isActive function - no longer overlapping
  const isActive = (path) => {
    // Exact match for all paths
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ 
      backgroundColor: '#2c5530',
      minHeight: '80px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div className="container-fluid px-4">
        {/* Brand */}
        <Link className="navbar-brand text-white fw-bold" to="/" style={{ fontSize: '24px' }}>
          Nottingham Building Society
        </Link>
        
        <div className="d-flex align-items-center">
          {/* Navigation Links with Fixed Hover Effects */}
          <ul className="navbar-nav me-auto d-flex flex-row">
            {navItems.map((item, index) => (
              <li key={index} className="nav-item me-4">
                <Link 
                  className={`nav-link fw-medium position-relative ${
                    isActive(item.path) ? 'text-white' : 'text-white'
                  }`}
                  to={item.path}
                  style={{ 
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    opacity: isActive(item.path) ? '1' : '0.8',
                    fontWeight: isActive(item.path) ? '700' : '500' // Only active link is bold
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) { // Only hover effect if not active
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
                      e.target.style.fontWeight = '600';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) { // Reset hover effect if not active
                      e.target.style.opacity = '0.8';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.textShadow = 'none';
                      e.target.style.fontWeight = '500';
                    }
                  }}
                >
                  {item.label}
                  {/* Active indicator - only shows for current page */}
                  {isActive(item.path) && (
                    <span 
                      className="position-absolute bottom-0 start-50 translate-middle-x"
                      style={{
                        width: '30px',
                        height: '3px',
                        backgroundColor: '#fff',
                        borderRadius: '2px',
                        bottom: '-8px'
                      }}
                    ></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* User Profile or Login */}
          {user ? (
            <div className="d-flex align-items-center">
              {/* User Info */}
              <div className="text-white me-3 text-end">
                <div className="fw-bold" style={{ fontSize: '16px' }}>
                  {user.firstName} {user.lastName}
                </div>
                <div style={{ fontSize: '14px', opacity: '0.8' }}>
                  {user.email}
                </div>
              </div>
              
              {/* User Avatar & Dropdown */}
              <div className="dropdown">
                <button 
                  className="btn btn-link p-0" 
                  type="button" 
                  data-bs-toggle="dropdown"
                  style={{ 
                    border: 'none',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center" 
                    style={{ 
                      width: '45px', 
                      height: '45px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      border: '2px solid rgba(255,255,255,0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="fas fa-user text-white" style={{ fontSize: '18px' }}></i>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg" style={{ borderRadius: '12px' }}>
                  <li>
                    <Link 
                      className="dropdown-item fw-medium"
                      to="/dashboard"
                      style={{ transition: 'background-color 0.2s ease' }}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item fw-medium text-danger"
                      onClick={handleLogout}
                      style={{ transition: 'background-color 0.2s ease' }}
                    >
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="d-flex gap-3">
              <Link 
                className="btn btn-outline-light fw-medium" 
                to="/login"
                style={{
                  borderRadius: '8px',
                  padding: '8px 20px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Login
              </Link>
              <Link 
                className="btn btn-light fw-medium" 
                to="/register"
                style={{
                  borderRadius: '8px',
                  padding: '8px 20px',
                  fontSize: '16px',
                  color: '#2c5530',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
