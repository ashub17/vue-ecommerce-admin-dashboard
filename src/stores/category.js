import { defineStore } from 'pinia';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/api/categories';
import { unwrapItem, unwrapList } from '@/utils/apiResponse';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    category: null,

    loading: false,
    listLoading: false,
    submitLoading: false,
    deleteLoading: false,

    meta: null,
  }),

  actions: {
    async fetchCategories(params = {}) {
      this.listLoading = true;

      try {
        const response = await getCategories(params);
        const { items, meta } = unwrapList(response);

        this.categories = items;
        this.meta = meta;

        return response;
      } finally {
        this.listLoading = false;
      }
    },

    async fetchCategory(id) {
      this.loading = true;

      try {
        const response = await getCategory(id);
        this.category = unwrapItem(response);
        return this.category;
      } finally {
        this.loading = false;
      }
    },

    async createCategory(payload) {
      this.submitLoading = true;

      try {
        return await createCategory(payload);
      } finally {
        this.submitLoading = false;
      }
    },

    async updateCategory(id, payload) {
      this.submitLoading = true;

      try {
        return await updateCategory(id, payload);
      } finally {
        this.submitLoading = false;
      }
    },

    async removeCategory(id) {
      this.deleteLoading = true;

      try {
        return await deleteCategory(id);
      } finally {
        this.deleteLoading = false;
      }
    },

    clearCategory() {
      this.category = null;
    },
  },
});
