import axios from 'axios';
import { ContactData, FeedbackData } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const submitContact = async (data: ContactData) => {
  const response = await api.post('/contact', data);
  return response.data;
};

export const submitFeedback = async (data: FeedbackData) => {
  const response = await api.post('/feedback', data);
  return response.data;
};

export default api;
