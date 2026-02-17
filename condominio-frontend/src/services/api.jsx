import axios from 'axios';

// Configuración para tu backend local
const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTHVpcyBGZWxpcGUiLCJleHAiOjE3NzEzNTkxMDU4MDQsImlhdCI6MTc3MTM1ODk4NX0.6RA6T8xMmwEeom1Hyo8IGRjyurlEPepdfyJwI2DiJKY',
    'Content-Type': 'application/json',
  },
});

// Funciones de la API 
export const residentAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  unidades: () => api.get('/unidades'),// cambio con el parsero
};

export const paymentAPI = {
  getAll: () => api.get('/payments'),
  create: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  delete: (id) => api.delete(`/payments/${id}`),
};

// Comunicaciones del condominio
export const communicationAPI = {
  getAll: () => api.get('/comunicaciones'),
  getById: (id) => api.get(`/comunicaciones/${id}`),
  create: (data) => api.post('/comunicaciones', data),
  update: (id, data) => api.put(`/comunicaciones/${id}`, data),
  delete: (id) => api.delete(`/comunicaciones/${id}`),
  communication: () => api.get('/comunicaciones'),

};

export const empleadosAPI = {
  getAll: () => api.get('/empleados'),
  getById: (id) => api.get(`/empleados/${id}`),
  create: (data) => api.post('/empleados', data),
  update: (id, data) => api.put(`/empleados/${id}`, data),
  delete: (id) => api.delete(`/empleados/${id}`),
  empleados: () => api.get('/empleados'),
}

export const requestAPI = {
  getAll: () => api.get('/requests'),
  create: (data) => api.post('/requests', data),
  updateStatus: (id, status) => api.put(`/requests/${id}/status`, { status }),
  delete: (id) => api.delete(`/requests/${id}`),
};

export default api;