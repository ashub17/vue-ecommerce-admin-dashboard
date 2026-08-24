import { defineStore } from 'pinia';
import { getOrders, getOrder, updateOrder } from '@/api/orders';
import { unwrapItem, unwrapList } from '@/utils/apiResponse';

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
        const { items, meta } = unwrapList(response);

        this.orders = items;
        this.meta = meta;

        return response;
      } finally {
        this.listLoading = false;
      }
    },

    async fetchOrder(id) {
      this.loading = true;

      try {
        const response = await getOrder(id);
        this.order = unwrapItem(response);
        return this.order;
      } finally {
        this.loading = false;
      }
    },

    async updateOrder(id, payload) {
      this.submitLoading = true;

      try {
        const response = await updateOrder(id, payload);
        this.order = unwrapItem(response) ?? this.order;
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
