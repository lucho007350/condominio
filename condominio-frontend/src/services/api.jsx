import axios from 'axios';

// Configuración para tu backend local
const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTHVpcyBGZWxpcGUiLCJleHAiOjE3NzEzNTI3ODgxOTQsImlhdCI6MTc3MTM1MjY2OH0.-txALjcpjU3pDwT70Lsy0IVBFElIWS3L_lhHmfdhoXI',
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

export const requestAPI = {
  getAll: () => api.get('/requests'),
  create: (data) => api.post('/requests', data),
  updateStatus: (id, status) => api.put(`/requests/${id}/status`, { status }),
  delete: (id) => api.delete(`/requests/${id}`),
};

export default api;