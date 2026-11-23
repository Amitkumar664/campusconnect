import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization Bearer token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry / 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register' &&
        window.location.pathname !== '/'
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData)
};

// Event Services
export const eventAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  register: (id, data = {}) => api.post(`/events/${id}/register`, data),
  cancelRegistration: (id, data = {}) => api.delete(`/events/${id}/register`, { data }),
  getMyRegistrations: (params) => api.get('/events/my/registrations', { params }),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getAttendees: (id) => api.get(`/events/${id}/attendees`)
};

// Booking & Digital Ticket Services
export const bookingAPI = {
  getAll: (params) => api.get('/bookings', { params }),
  getMy: (params) => api.get('/bookings/my', { params }),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason })
};

// Door Staff Ticket Verification Services
export const ticketAPI = {
  verify: (code, eventId) => api.post('/tickets/verify', { code, eventId }),
  undoCheckIn: (id) => api.post(`/tickets/${id}/undo-checkin`),
  getDoorList: (eventId, params) => api.get(`/tickets/door-list/${eventId}`, { params })
};

// Team & Hackathon / Sports Roster Services
export const teamAPI = {
  create: (data) => api.post('/teams', data),
  join: (data) => api.post('/teams/join', data),
  getMy: () => api.get('/teams/my'),
  submitProject: (id, data) => api.post(`/teams/${id}/submit`, data),
  getEventTeams: (eventId) => api.get(`/teams/event/${eventId}`)
};

// AI Analytics Services
export const analyticsAPI = {
  getOverview: (params) => api.get('/analytics/overview', { params }),
  getTrends: (params) => api.get('/analytics/trends', { params }),
  getPopularity: (params) => api.get('/analytics/popularity', { params }),
  getPredictions: () => api.get('/analytics/predictions'),
  getInsights: () => api.get('/analytics/insights'),
  exportCSV: (type) => api.get(`/analytics/export/${type}`, { responseType: 'blob' })
};

// Notification Services
export const notificationAPI = {
  getMy: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  sendBroadcast: (data) => api.post('/notifications/broadcast', data)
};

// User Administration Services
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  updateStatus: (id) => api.put(`/users/${id}/status`),
  update: (id, data) => api.put(`/users/${id}`, data)
};

export default api;
