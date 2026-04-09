import { defineStore } from 'pinia';
import { getOrders, getOrder, updateOrder } from '@/api/orders';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    order: null,

    listLoading: false,
    loading: false,
    submitLoading: false,

    meta: null,
  }),

  actions: {
    async fetchOrders(params = {}) {
      this.listLoading = true;

      try {
        const response = await getOrders(params);
        const data = response.data;

        if (Array.isArray(data)) {
          this.orders = data;
          this.meta = null;
        } else {
          this.orders = data.data || [];
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

    async fetchOrder(id) {
      this.loading = true;

      try {
        const response = await getOrder(id);
        this.order = response.data?.data || response.data;
        return this.order;
      } finally {
        this.loading = false;
      }
    },

    async updateOrder(id, payload) {
      this.submitLoading = true;

      try {
        const response = await updateOrder(id, payload);
        this.order = response.data?.data || response.data || this.order;
        return response;
      } finally {
        this.submitLoading = false;
      }
    },

    clearOrder() {
      this.order = null;
    },
  },
});
