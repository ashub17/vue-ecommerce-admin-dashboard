import { defineStore } from 'pinia';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/api/products';
import { unwrapItem, unwrapList } from '@/utils/apiResponse';

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
        const { items, meta } = unwrapList(response);

        this.products = items;
        this.meta = meta;

        return response;
      } finally {
        this.listLoading = false;
      }
    },

    async fetchProduct(id) {
      this.loading = true;

      try {
        const response = await getProduct(id);
        this.product = unwrapItem(response);
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
