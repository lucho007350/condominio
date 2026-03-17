import axios from 'axios';

// Prefer proxy in dev (/api -> vite proxy) and allow override via env.
// Examples:
// - VITE_API_BASE_URL=/api
// - VITE_API_BASE_URL=http://localhost:3001/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let _tokenPromise = null;

const getStoredUser = () => {
  try {
    const local = localStorage.getItem('user');
    if (local) return { where: 'local', user: JSON.parse(local) };
    const session = sessionStorage.getItem('user');
    if (session) return { where: 'session', user: JSON.parse(session) };
  } catch {
    // ignore
  }
  return { where: null, user: null };
};

const storeTokenOnUser = (token) => {
  const { where, user } = getStoredUser();
  if (!where || !user) return;
  const next = { ...user, token };
  try {
    if (where === 'local') localStorage.setItem('user', JSON.stringify(next));
    if (where === 'session') sessionStorage.setItem('user', JSON.stringify(next));
  } catch {
    // ignore
  }
};

const ensureToken = async () => {
  const { user } = getStoredUser();
  const existing = user?.token || user?.accessToken || user?.jwt;
  if (existing) return existing;

  if (_tokenPromise) return _tokenPromise;
  _tokenPromise = fetch('/token', { method: 'POST' })
    .then(async (r) => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || 'No se pudo obtener token');
      if (!data?.token) throw new Error('Token no viene en la respuesta');
      storeTokenOnUser(data.token);
      return data.token;
    })
    .finally(() => {
      _tokenPromise = null;
    });

  return _tokenPromise;
};

api.interceptors.request.use(async (config) => {
  config.headers = config.headers || {};

  const auth = config.headers.Authorization || config.headers.authorization;
  if (auth) return config;

  const { user } = getStoredUser();
  const token = user?.token || user?.accessToken || user?.jwt;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }

  try {
    const fresh = await ensureToken();
    config.headers.Authorization = `Bearer ${fresh}`;
  } catch {
    // no token available; proceed without Authorization
  }

  return config;
});

// Funciones de la API 
export const residentAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
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

export const unidadesAPI = {
  getAll: () => api.get('/unidades'),
  getById: (id) => api.get(`/unidades/${id}`),
  create: (data) => api.post('/unidades', data),
  update: (id, data) => api.put(`/unidades/${id}`, data),
  delete: (id) => api.delete(`/unidades/${id}`),
  unidades: () => api.get('/unidades'),
};

export default api;
