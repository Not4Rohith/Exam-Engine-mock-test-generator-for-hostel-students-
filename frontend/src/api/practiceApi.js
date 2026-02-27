import api from './axiosConfig';

export const getPracticeQuestions = async (subject, topics) => {
  const response = await api.get('/practice/questions', { params: { subject, topics } });
  return response.data;
};