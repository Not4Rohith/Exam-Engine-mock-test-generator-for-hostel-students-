import api from './axiosConfig';

export const generateMockTest = async (config) => {
  const response = await api.post('/mock/generate', config);
  return response.data;
};

export const getMockStats = async () => {
  const response = await api.get('/mock/stats');
  return response.data;
};