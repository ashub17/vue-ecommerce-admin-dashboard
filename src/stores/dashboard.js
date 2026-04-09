import { defineStore } from 'pinia';
import { getDashboard } from '@/api/dashboard';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    summary: {
      total_users: 0,
      total_products: 0,
      total_categories: 0,
      total_orders: 0,
      total_revenue: 0,
    },

    lowStockProducts: [],
    recentOrders: [],
    topSellingProducts: [],

    loading: false,
  }),

  actions: {
    async fetchDashboard() {
      this.loading = true;

      try {
        const response = await getDashboard();

        // unwrap response
        const payload = response.data?.data || {};

        this.summary = payload.summary || {};

        this.lowStockProducts = Array.isArray(payload.low_stock_products)
          ? payload.low_stock_products
          : [];

        this.recentOrders = Array.isArray(payload.recent_orders)
          ? payload.recent_orders
          : [];

        this.topSellingProducts = Array.isArray(payload.top_selling_products)
          ? payload.top_selling_products
          : [];

        return response;
      } finally {
        this.loading = false;
      }
    },
  },
});
