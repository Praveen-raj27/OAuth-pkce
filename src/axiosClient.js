import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.googleapis.com/calendar/v3/calendars/primary',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired
      // Refresh token / logout / redirect
    }

    return Promise.reject(error);
  }
);

export default api;