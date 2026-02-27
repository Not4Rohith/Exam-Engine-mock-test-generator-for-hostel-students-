import api from './axiosConfig';

export const submitReport = async (reportData) => {
  return await api.post('/reports', reportData);
};

export const submitFeedback = async (feedbackData) => {
  return await api.post('/feedback', feedbackData);
};