import { defineStore } from 'pinia';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/api/products';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    product: null,

    loading: false,
    listLoading: false,
    submitLoading: false,
    deleteLoading: false,

    meta: null,
  }),

  actions: {
    async fetchProducts(params = {}) {
      this.listLoading = true;

      try {
        const response = await getProducts(params);
        const data = response.data;

        if (Array.isArray(data)) {
          this.products = data;
          this.meta = null;
        } else {
          this.products = data.data || [];
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

    async fetchProduct(id) {
      this.loading = true;

      try {
        const response = await getProduct(id);
        this.product = response.data?.data || response.data;
        return this.product;
      } finally {
        this.loading = false;
      }
    },

    async createProduct(payload) {
      this.submitLoading = true;

      try {
        return await createProduct(payload);
      } finally {
        this.submitLoading = false;
      }
    },

    async updateProduct(id, payload) {
      this.submitLoading = true;

      try {
        return await updateProduct(id, payload);
      } finally {
        this.submitLoading = false;
      }
    },

    async removeProduct(id) {
      this.deleteLoading = true;

      try {
        return await deleteProduct(id);
      } finally {
        this.deleteLoading = false;
      }
    },

    clearProduct() {
      this.product = null;
    },
  },
});
