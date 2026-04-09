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

        // Supports both:
        // 1) Laravel paginator directly in response.data
        // 2) Wrapped paginator in response.data.data
        const payload = response.data?.data?.data
          ? response.data.data
          : response.data;

        if (Array.isArray(payload)) {
          this.orders = payload;
          this.meta = null;
        } else {
          this.orders = Array.isArray(payload?.data) ? payload.data : [];
          this.meta = payload
            ? {
                current_page: payload.current_page ?? 1,
                last_page: payload.last_page ?? 1,
                per_page: payload.per_page ?? this.orders.length ?? 0,
                total: payload.total ?? this.orders.length ?? 0,
              }
            : null;
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

        // Supports:
        // 1) response.data = order
        // 2) response.data.data = order
        this.order = response.data?.data || response.data || null;

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
