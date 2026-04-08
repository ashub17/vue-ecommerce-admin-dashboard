import { defineStore } from 'pinia';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/api/categories';

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
        const data = response.data;

        if (Array.isArray(data)) {
          this.categories = data;
          this.meta = null;
        } else {
          this.categories = data.data || [];
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

    async fetchCategory(id) {
      this.loading = true;

      try {
        const response = await getCategory(id);
        this.category = response.data?.data || response.data;
        return this.category;
      } finally {
        this.loading = false;
      }
    },

    async createCategory(payload) {
      this.submitLoading = true;

      try {
        const response = await createCategory(payload);
        return response;
      } finally {
        this.submitLoading = false;
      }
    },

    async updateCategory(id, payload) {
      this.submitLoading = true;

      try {
        const response = await updateCategory(id, payload);
        return response;
      } finally {
        this.submitLoading = false;
      }
    },

    async removeCategory(id) {
      this.deleteLoading = true;

      try {
        const response = await deleteCategory(id);
        return response;
      } finally {
        this.deleteLoading = false;
      }
    },

    clearCategory() {
      this.category = null;
    },
  },
});
