import axios from 'axios';
import { getToken, clearAuthStorage } from '@/utils/storage';
import router from '@/router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      clearAuthStorage();

      if (router.currentRoute.value.path !== '/login') {
        await router.replace('/login');
      }
    }

    // The token is valid but the account lacks the admin role. Keep the
    // session and send the user to the dedicated forbidden screen.
    if (error.response?.status === 403) {
      if (router.currentRoute.value.path !== '/403') {
        await router.replace('/403');
      }
    }

    return Promise.reject(error);
  },
);

export default api;
