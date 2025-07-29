import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/jobs');
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
          <div className="col-md-5">
            <div className="card shadow-lg border-0" style={{ 
              borderRadius: '20px',
              overflow: 'hidden'
            }}>
              <div className="card-body p-5" style={{ backgroundColor: '#fff' }}>
                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-3" style={{ 
                    color: '#2c5530',
                    fontSize: '28px'
                  }}>
                    Welcome to the Nottingham Building Society
                  </h2>
                  <p className="text-muted mb-0" style={{ fontSize: '16px' }}>
                    If you already have an account, please sign in below.
                  </p>
                </div>

                {/* Role Toggle Buttons */}
                <div className="d-flex gap-0 mb-4" style={{ 
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <button 
                    type="button"
                    className={`btn flex-fill py-3 ${formData.role === 'admin' ? 'btn-primary' : 'btn-outline-light'}`}
                    onClick={() => handleRoleChange('admin')}
                    style={{
                      backgroundColor: formData.role === 'admin' ? '#2c5530' : 'transparent',
                      borderColor: 'transparent',
                      color: formData.role === 'admin' ? 'white' : '#6c757d',
                      fontWeight: '600',
                      fontSize: '16px'
                    }}
                  >
                    Admin
                  </button>
                  <button 
                    type="button"
                    className={`btn flex-fill py-3 ${formData.role === 'student' ? 'btn-primary' : 'btn-outline-light'}`}
                    onClick={() => handleRoleChange('student')}
                    style={{
                      backgroundColor: formData.role === 'student' ? '#2c5530' : 'transparent',
                      borderColor: 'transparent',
                      color: formData.role === 'student' ? 'white' : '#6c757d',
                      fontWeight: '600',
                      fontSize: '16px'
                    }}
                  >
                    Student
                  </button>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert" style={{ borderRadius: '12px' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold text-dark mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      name="email"
                      placeholder="enter your email"
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

                  {/* Password Field */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold text-dark mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      name="password"
                      placeholder="enter your password"
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

                  {/* Login Button */}
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
                    {loading ? 'Logging in...' : 'Login'}
                  </button>

                  {/* Sign Up Button */}
                  <div className="text-center mb-4">
                    <Link 
                      to="/register" 
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
                      Sign Up
                    </Link>
                  </div>

                  {/* OR Divider */}
                  <div className="text-center my-4">
                    <span className="text-muted fw-medium">OR</span>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="d-grid gap-3">
                    <button 
                      type="button" 
                      className="btn btn-outline-danger btn-lg"
                      style={{
                        borderRadius: '12px',
                        fontWeight: '600',
                        padding: '12px'
                      }}
                    >
                      <i className="fab fa-google me-3"></i>Sign-Up with Google
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-primary btn-lg"
                      style={{
                        borderRadius: '12px',
                        fontWeight: '600',
                        padding: '12px'
                      }}
                    >
                      <i className="fab fa-facebook me-3"></i>Sign with Facebook
                    </button>
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

export default Login;
