import api from './axiosConfig';

export const downloadTestPdf = async (testId) => {
  const response = await api.get(`/pdf/download/${testId}`, {
    responseType: 'blob', // Crucial for file downloads
  });
  return response.data;
};