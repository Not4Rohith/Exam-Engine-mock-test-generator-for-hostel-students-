import axios from 'axios';

// Defaults to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const checkServerHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health/`);
    return response.data.status === 'active';
  } catch (error) {
    return false;
  }
};