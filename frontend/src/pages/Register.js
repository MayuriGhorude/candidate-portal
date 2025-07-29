import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });
    
    if (result.success) {
      navigate('/login', { 
        state: { message: 'Registration successful! Please login.' }
      });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0" style={{ 
              borderRadius: '20px',
              overflow: 'hidden'
            }}>
              <div className="card-body p-5" style={{ backgroundColor: '#fff' }}>
                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-3" style={{ 
                    color: '#2c5530',
                    fontSize: '32px'
                  }}>
                    Sign Up
                  </h2>
                  <p className="text-muted mb-0" style={{ fontSize: '16px' }}>
                    Create your account to get started
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert" style={{ borderRadius: '12px' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Name Fields */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="firstName" className="form-label fw-semibold text-dark mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        style={{ 
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa',
                          border: '2px solid #e9ecef',
                          fontSize: '16px',
                          padding: '16px 20px'
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="lastName" className="form-label fw-semibold text-dark mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        style={{ 
                          borderRadius: '12px',
                          backgroundColor: '#f8f9fa',
                          border: '2px solid #e9ecef',
                          fontSize: '16px',
                          padding: '16px 20px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold text-dark mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{ 
                        borderRadius: '12px',
                        backgroundColor: '#f8f9fa',
                        border: '2px solid #e9ecef',
                        fontSize: '16px',
                        padding: '16px 20px'
                      }}
                    />
                  </div>

                  {/* Password Fields */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold text-dark mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{ 
                        borderRadius: '12px',
                        backgroundColor: '#f8f9fa',
                        border: '2px solid #e9ecef',
                        fontSize: '16px',
                        padding: '16px 20px'
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label fw-semibold text-dark mb-2">
                      Re-enter password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      style={{ 
                        borderRadius: '12px',
                        backgroundColor: '#f8f9fa',
                        border: '2px solid #e9ecef',
                        fontSize: '16px',
                        padding: '16px 20px'
                      }}
                    />
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      <label className="form-check-label text-dark fw-medium" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <Link 
                      to="/forgot-password" 
                      className="text-decoration-none fw-medium"
                      style={{ color: '#2c5530' }}
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    className="btn btn-lg w-100 mb-4"
                    disabled={loading}
                    style={{ 
                      backgroundColor: '#2c5530',
                      borderColor: '#2c5530',
                      color: 'white',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '18px',
                      padding: '16px'
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Register'}
                  </button>

                  {/* Login Link */}
                  <div className="text-center mb-4">
                    <p className="text-muted mb-2">Already have an account?</p>
                    <Link 
                      to="/login" 
                      className="btn btn-outline-primary w-100 btn-lg"
                      style={{
                        borderColor: '#2c5530',
                        color: '#2c5530',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '18px',
                        padding: '16px'
                      }}
                    >
                      Login
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
