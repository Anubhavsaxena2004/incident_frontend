import axios from 'axios';

let BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://52.63.212.154';

// If running on HTTPS (e.g. Vercel) but BASE_URL is insecure HTTP, use relative path to route via vercel.json proxy
if (typeof window !== 'undefined' && window.location.protocol === 'https:' && BASE_URL.startsWith('http://')) {
  BASE_URL = '';
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto Refresh Token on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if 401 unauthorized and not already retried
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes('/users/login/') || originalRequest.url.includes('/users/register/')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        isRefreshing = false;
        localStorage.clear();
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}/api/users/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem('access_token', newAccessToken);
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.clear();
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// API Service Endpoints

// 1. Register User
export const registerUser = async (userData) => {
  const response = await api.post('/api/users/register/', userData);
  return response.data;
};

// 2. Login User
export const loginUser = async (credentials) => {
  const response = await api.post('/api/users/login/', credentials);
  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access);
  }
  if (response.data.refresh) {
    localStorage.setItem('refresh_token', response.data.refresh);
  }
  if (response.data.user) {
    localStorage.setItem('user_info', JSON.stringify(response.data.user));
  }
  return response.data;
};

// 3. Refresh Token
export const refreshAuthToken = async (refresh) => {
  const response = await api.post('/api/users/token/refresh/', { refresh });
  return response.data;
};

// 4. Logout User
export const logoutUser = async () => {
  const refresh = localStorage.getItem('refresh_token');
  try {
    if (refresh) {
      await api.post('/api/users/logout/', { refresh });
    }
  } catch (err) {
    console.warn('Logout server notification failed', err);
  } finally {
    localStorage.clear();
    window.dispatchEvent(new Event('auth:logout'));
  }
};

// 5. Get Current User
export const getCurrentUser = async () => {
  const response = await api.get('/api/users/me/');
  return response.data;
};

// 6. Create Incident
export const createIncident = async (incidentData) => {
  const response = await api.post('/api/incidents/', incidentData);
  return response.data;
};

// 7. Get All Incidents
export const getIncidents = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.search) params.append('search', filters.search);
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await api.get(`/api/incidents/${queryString}`);
  return response.data;
};

// 8. Get Incident by ID
export const getIncidentById = async (id) => {
  const response = await api.get(`/api/incidents/${id}/`);
  return response.data;
};

// 9. Update Incident
export const updateIncident = async (id, updateData) => {
  const response = await api.patch(`/api/incidents/${id}/`, updateData);
  return response.data;
};

// 10. Delete Incident
export const deleteIncident = async (id) => {
  const response = await api.delete(`/api/incidents/${id}/`);
  return response.data;
};

// 11. Get Incident Timeline
export const getIncidentTimeline = async (id) => {
  const response = await api.get(`/api/incidents/${id}/timeline/`);
  return response.data;
};

// 12. Get Incident Assignment History
export const getIncidentAssignments = async (id) => {
  const response = await api.get(`/api/incidents/${id}/assignments/`);
  return response.data;
};

export default api;
