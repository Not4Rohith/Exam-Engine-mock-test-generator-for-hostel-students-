import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://exam-engine-mock-test-generator-for.onrender.com';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Automatically handles the /api prefix for everyone
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;