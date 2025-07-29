import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#2c5530' }}>
      <div className="container">
        <Link className="navbar-brand text-white fw-bold" to="/">
          Nottingham Building Society
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/jobs">Open Jobs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/about">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/contact">Contact Us</Link>
            </li>
          </ul>
          
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown">
                    {user.firstName || user.email}
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
                    {user.role === 'student' && (
                      <>
                        <li><Link className="dropdown-item" to="/favorites">Favorites</Link></li>
                        <li><Link className="dropdown-item" to="/interview-prep">Interview Prep</Link></li>
                      </>
                    )}
                    {user.role === 'admin' && (
                      <li><Link className="dropdown-item" to="/admin">Admin Panel</Link></li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/register">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
