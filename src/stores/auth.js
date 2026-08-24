import { defineStore } from 'pinia';
import { loginRequest, logoutRequest, meRequest } from '@/api/auth';
import { unwrapItem } from '@/utils/apiResponse';
import {
  setToken,
  getToken,
  setUser,
  getUser,
  clearAuthStorage,
} from '@/utils/storage';

function roleNames(user) {
  return (user?.roles || []).map((role) =>
    typeof role === 'string' ? role : role.name,
  );
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getToken() || null,
    user: getUser() || null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    roles: (state) => roleNames(state.user),
    isAdmin: (state) => roleNames(state.user).includes('admin'),
  },

  actions: {
    async login(form) {
      this.loading = true;

      try {
        const response = await loginRequest(form);

        const token = response.data?.token;
        const user = unwrapItem(response);

        if (!token || !user) {
          throw new Error('Invalid login response');
        }

        if (!roleNames(user).includes('admin')) {
          clearAuthStorage();

          throw new Error(
            'This account does not have access to the admin dashboard.',
          );
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

    // Refreshes the cached user so a role revoked server-side is reflected in
    // the client-side route guards on the next navigation.
    async fetchMe() {
      if (!this.token) {
        return null;
      }

      try {
        const response = await meRequest();
        const user = unwrapItem(response);

        if (user) {
          this.user = user;
          setUser(user);
        }

        return user;
      } catch (error) {
        // 401 is already handled by the axios interceptor.
        return null;
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
