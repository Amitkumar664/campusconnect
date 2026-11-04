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
      // If unauthenticated, clear token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
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
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData)
};

// Faculty Services
export const facultyAPI = {
  getAll: (params) => api.get('/faculty', { params }),
  getById: (id) => api.get(`/faculty/${id}`),
  getSlots: (id, date) => api.get(`/faculty/${id}/slots`, { params: { date } }),
  updateAvailability: (data) => api.put('/faculty/availability', data),
  blockDate: (date) => api.post('/faculty/block-date', { date }),
  unblockDate: (date) => api.delete('/faculty/block-date', { data: { date } })
};

// Resource Services
export const resourceAPI = {
  getAll: (params) => api.get('/resources', { params }),
  getById: (id) => api.get(`/resources/${id}`),
  getAvailability: (id, date) => api.get(`/resources/${id}/availability`, { params: { date } }),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`)
};

// Booking Services (Conflict Detection included)
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMy: (params) => api.get('/bookings/my', { params }),
  getFacultySessions: (params) => api.get('/bookings/faculty-sessions', { params }),
  getAll: (params) => api.get('/bookings', { params }),
  updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason })
};

// Event Services
export const eventAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  register: (id) => api.post(`/events/${id}/register`),
  cancelRegistration: (id) => api.delete(`/events/${id}/register`),
  getMyRegistrations: () => api.get('/events/my/registrations'),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getAttendees: (id) => api.get(`/events/${id}/attendees`)
};

// Analytics Services
export const analyticsAPI = {
  getOverview: (params) => api.get('/analytics/overview', { params }),
  getTrends: (params) => api.get('/analytics/booking-trends', { params }),
  getResourceUtilization: () => api.get('/analytics/resource-utilization'),
  getEventPerformance: () => api.get('/analytics/event-performance'),
  getFacultyDemand: () => api.get('/analytics/faculty-demand'),
  exportCSV: (type) => api.get(`/analytics/export/${type}`, { responseType: 'blob' })
};

// Notification Services
export const notificationAPI = {
  getMy: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all')
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

