import axios from 'axios';

// Added a fallback to ensure it never undefined-crashes the app
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://exam-engine-mock-test-generator-for.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;