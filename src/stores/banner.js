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
        const data = response.data;

        if (Array.isArray(data)) {
          this.banners = data;
          this.meta = null;
        } else {
          this.banners = data.data || [];
          this.meta = {
            current_page: data.current_page,
            last_page: data.last_page,
            per_page: data.per_page,
            total: data.total,
          };
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
        this.banner = response.data?.data || response.data;
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
