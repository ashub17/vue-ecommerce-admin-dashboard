import { defineStore } from 'pinia';
import {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
} from '@/api/banners';

export const useBannerStore = defineStore('banner', {
  state: () => ({
    banners: [],
    banner: null,

    listLoading: false,
    loading: false,
    submitLoading: false,
    deleteLoading: false,

    meta: null,
  }),

  actions: {
    async fetchBanners(params = {}) {
      this.listLoading = true;

      try {
        const response = await getBanners(params);

        // Supports both:
        // 1) paginator directly in response.data
        // 2) wrapped paginator in response.data.data
        const payload = response.data?.data?.data
          ? response.data.data
          : response.data;

        if (Array.isArray(payload)) {
          this.banners = payload;
          this.meta = null;
        } else {
          this.banners = Array.isArray(payload?.data) ? payload.data : [];
          this.meta = payload
            ? {
                current_page: payload.current_page ?? 1,
                last_page: payload.last_page ?? 1,
                per_page: payload.per_page ?? this.banners.length ?? 0,
                total: payload.total ?? this.banners.length ?? 0,
              }
            : null;
        }

        return response;
      } finally {
        this.listLoading = false;
      }
    },

    async fetchBanner(id) {
      this.loading = true;

      try {
        const response = await getBanner(id);
        this.banner = response.data?.data || response.data || null;
        return this.banner;
      } finally {
        this.loading = false;
      }
    },

    async createBanner(payload) {
      this.submitLoading = true;

      try {
        return await createBanner(payload);
      } finally {
        this.submitLoading = false;
      }
    },

    async updateBanner(id, payload) {
      this.submitLoading = true;

      try {
        return await updateBanner(id, payload);
      } finally {
        this.submitLoading = false;
      }
    },

    async removeBanner(id) {
      this.deleteLoading = true;

      try {
        return await deleteBanner(id);
      } finally {
        this.deleteLoading = false;
      }
    },

    clearBanner() {
      this.banner = null;
    },
  },
});
