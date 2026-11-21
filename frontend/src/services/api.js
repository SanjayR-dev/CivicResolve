import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

export const getComplaints = async (params = {}) => {
  const response = await api.get('/complaints', { params });
  return response.data;
};

export const getComplaintById = async (id) => {
  const response = await api.get(`/complaints/${encodeURIComponent(id)}`);
  return response.data;
};

export const submitComplaint = async (formDataOrObject) => {
  let headers = {};
  if (formDataOrObject instanceof FormData) {
    headers['Content-Type'] = 'multipart/form-data';
  }
  const response = await api.post('/complaints', formDataOrObject, { headers });
  return response.data;
};

export const analyzeComplaintAI = async (formDataOrObject) => {
  let headers = {};
  if (formDataOrObject instanceof FormData) {
    headers['Content-Type'] = 'multipart/form-data';
  }
  const response = await api.post('/complaints/analyze', formDataOrObject, { headers });
  return response.data;
};

export const updateComplaintStatus = async (id, payload) => {
  const response = await api.patch(`/complaints/${encodeURIComponent(id)}`, payload);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export const getHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
