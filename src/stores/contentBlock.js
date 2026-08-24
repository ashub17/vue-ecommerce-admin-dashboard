import { defineStore } from 'pinia';
import {
  getContentBlocks,
  getContentBlock,
  createContentBlock,
  updateContentBlock,
  deleteContentBlock,
} from '@/api/contentBlocks';
import { unwrapItem, unwrapList } from '@/utils/apiResponse';

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
        const { items, meta } = unwrapList(response);

        this.contentBlocks = items;
        this.meta = meta;

        return response;
      } finally {
        this.listLoading = false;
      }
    },

    async fetchContentBlock(id) {
      this.loading = true;

      try {
        const response = await getContentBlock(id);
        this.contentBlock = unwrapItem(response);
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
