import axios from 'axios';

// Configuración para tu backend local
const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTHVpcyBGZWxpcGUiLCJleHAiOjE3NzIzODAyNzQzNjEsImlhdCI6MTc3MjM4MDE1NH0.2MAdK48nB8LdstE9MHFUXtpYE5VEBDsNiKyIt4mukY4',
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
  getAll: () => api.get('/pagos'),
  getById: (id) => api.get(`/pagos/${id}`),
  create: (data) => api.post('/pagos', data),
  update: (id, data) => api.put(`/pagos/${id}`, data),
  delete: (id) => api.delete(`/pagos/${id}`),
  pagos: () => api.get('/pagos'),
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
};

export const facturasAPI = {
  getAll: () => api.get('/facturas'),
  getById: (id) => api.get(`/facturas/${id}`),
  create: (data) => api.post('/facturas', data),
  update: (id, data) => api.put(`/facturas/${id}`, data),
  delete: (id) => api.delete(`/facturas/${id}`),
  facturas: () => api.get('/facturas'),
};

export const ingresosAPI = {
  getAll: () => api.get('/ingresos'),
  getById: (id) => api.get(`/ingresos/${id}`),
  create: (data) => api.post('/ingresos', data),
  update: (id, data) => api.put(`/ingresos/${id}`, data),
  delete: (id) => api.delete(`/ingresos/${id}`),
  ingresos: () => api.get('/ingresos'),
};

export const requestAPI = {
  getAll: () => api.get('/requests'),
  create: (data) => api.post('/requests', data),
  updateStatus: (id, status) => api.put(`/requests/${id}/status`, { status }),
  delete: (id) => api.delete(`/requests/${id}`),
};

export const egresosAPI = {
  getAll: () => api.get('/egresos'),
  getById: (id) => api.get(`/egresos/${id}`),
  create: (data) => api.post('/egresos', data),
  update: (id, data) => api.put(`/egresos/${id}`, data),
  delete: (id) => api.delete(`/egresos/${id}`),
  egresos: () => api.get('/egresos'),
};

export const residentesAPI = {
  getAll: () => api.get('/residentes'),
  getById: (id) => api.get(`/residentes/${id}`),
  create: (data) => api.post('/residentes', data),
  update: (id, data) => api.put(`/residentes/${id}`, data),
  delete: (id) => api.delete(`/residentes/${id}`),
  residentes: () => api.get('/residentes'),
};

export const documentosAPI = {
  getAll: () => api.get('/residentes'),
  getById: (id) => api.get(`/residentes/${id}`),
  create: (data) => api.post('/residentes', data),
  update: (id, data) => api.put(`/residentes/${id}`, data),
  delete: (id) => api.delete(`/residentes/${id}`),
  residentes: () => api.get('/residentes'),
};


export default api;