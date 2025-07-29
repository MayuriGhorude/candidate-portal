import axios from 'axios';

const api = axios.create({
  baseURL: 'http://34.44.127.42:5000/api'  // Use your server IP
});

// Add authorization header if token exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
