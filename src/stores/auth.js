import { defineStore } from 'pinia';
import { loginRequest, meRequest, logoutRequest } from '@/api/auth';
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
    isAdmin: (state) => state.user?.role === 'admin',
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

    async fetchMe() {
      try {
        const response = await meRequest();
        this.user = response.data;
        setUser(response.data);
        return response.data;
      } catch (error) {
        this.logoutLocal();
        throw error;
      }
    },

    async initializeAuth() {
      if (!this.token) return;

      if (!this.user) {
        await this.fetchMe();
      }
    },

    async logout() {
      try {
        await logoutRequest();
      } catch (error) {
        // ignore network/logout endpoint failure
      } finally {
        this.logoutLocal();
      }
    },

    logoutLocal() {
      this.token = null;
      this.user = null;
      clearAuthStorage();
    },
  },
});
