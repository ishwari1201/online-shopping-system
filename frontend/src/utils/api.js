import axios from 'axios';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: '/api',
  // Ensure cookies are sent with requests (for JWT httpOnly cookie)
  withCredentials: true,
});

export default api;
