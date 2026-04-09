import { defineStore } from 'pinia';
import { loginRequest, logoutRequest } from '@/api/auth';
import {
  setToken,
  getToken,
  setUser,
  getUser,
  clearAuthStorage,
} from '@/utils/storage';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getToken() || null,
    user: getUser() || null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(form) {
      this.loading = true;

      try {
        const response = await loginRequest(form);

        const token = response.data?.token;
        const user = response.data?.user;

        if (!token || !user) {
          throw new Error('Invalid login response');
        }

        this.token = token;
        this.user = user;

        setToken(token);
        setUser(user);

        return response;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await logoutRequest();
      } catch (error) {
        // ignore logout endpoint/network failure
      } finally {
        this.logoutLocal();
      }
    },

    logoutLocal() {
      this.token = null;
      this.user = null;
      this.loading = false;
      clearAuthStorage();
    },
  },
});
