import { defineStore } from 'pinia';
import {
  getContentBlocks,
  getContentBlock,
  createContentBlock,
  updateContentBlock,
  deleteContentBlock,
} from '@/api/contentBlocks';

export const useContentBlockStore = defineStore('contentBlock', {
  state: () => ({
    contentBlocks: [],
    contentBlock: null,

    listLoading: false,
    loading: false,
    submitLoading: false,
    deleteLoading: false,

    meta: null,
  }),

  actions: {
    async fetchContentBlocks(params = {}) {
      this.listLoading = true;

      try {
        const response = await getContentBlocks(params);

        // Supports both:
        // 1) paginator directly in response.data
        // 2) wrapped paginator in response.data.data
        const payload = response.data?.data?.data
          ? response.data.data
          : response.data;

        if (Array.isArray(payload)) {
          this.contentBlocks = payload;
          this.meta = null;
        } else {
          this.contentBlocks = Array.isArray(payload?.data) ? payload.data : [];
          this.meta = payload
            ? {
                current_page: payload.current_page ?? 1,
                last_page: payload.last_page ?? 1,
                per_page: payload.per_page ?? this.contentBlocks.length ?? 0,
                total: payload.total ?? this.contentBlocks.length ?? 0,
              }
            : null;
        }

        return response;
      } finally {
        this.listLoading = false;
      }
    },

    async fetchContentBlock(id) {
      this.loading = true;

      try {
        const response = await getContentBlock(id);
        this.contentBlock = response.data?.data || response.data || null;
        return this.contentBlock;
      } finally {
        this.loading = false;
      }
    },

    async createContentBlock(payload) {
      this.submitLoading = true;

      try {
        return await createContentBlock(payload);
      } finally {
        this.submitLoading = false;
      }
    },

    async updateContentBlock(id, payload) {
      this.submitLoading = true;

      try {
        return await updateContentBlock(id, payload);
      } finally {
        this.submitLoading = false;
      }
    },

    async removeContentBlock(id) {
      this.deleteLoading = true;

      try {
        return await deleteContentBlock(id);
      } finally {
        this.deleteLoading = false;
      }
    },

    clearContentBlock() {
      this.contentBlock = null;
    },
  },
});
