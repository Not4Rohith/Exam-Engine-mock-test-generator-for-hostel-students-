import api from './axiosConfig';

export const checkServerHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data.status === 'active';
  } catch (error) {
    return false;
  }
};