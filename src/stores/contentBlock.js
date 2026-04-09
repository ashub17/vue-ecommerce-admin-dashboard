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
        const data = response.data;

        if (Array.isArray(data)) {
          this.contentBlocks = data;
          this.meta = null;
        } else {
          this.contentBlocks = data.data || [];
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

    async fetchContentBlock(id) {
      this.loading = true;

      try {
        const response = await getContentBlock(id);
        this.contentBlock = response.data?.data || response.data;
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
