import { defineStore } from 'pinia';
import {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
} from '@/api/banners';
import { unwrapItem, unwrapList } from '@/utils/apiResponse';

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
        const { items, meta } = unwrapList(response);

        this.banners = items;
        this.meta = meta;

        return response;
      } finally {
        this.listLoading = false;
      }
    },

    async fetchBanner(id) {
      this.loading = true;

      try {
        const response = await getBanner(id);
        this.banner = unwrapItem(response);
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
