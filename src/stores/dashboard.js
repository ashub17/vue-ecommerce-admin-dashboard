import { defineStore } from 'pinia';
import { getAdminDashboard } from '@/api/dashboard';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    loading: false,
    stats: {
      total_users: 0,
      total_products: 0,
      total_categories: 0,
      total_orders: 0,
      total_revenue: 0,
    },
    lowStockProducts: [],
    recentOrders: [],
    topSellingProducts: [],
  }),

  actions: {
    async fetchDashboard() {
      this.loading = true;

      try {
        const response = await getAdminDashboard();
        const data = response.data;

        this.stats = {
          total_users: data.total_users ?? 0,
          total_products: data.total_products ?? 0,
          total_categories: data.total_categories ?? 0,
          total_orders: data.total_orders ?? 0,
          total_revenue: data.total_revenue ?? 0,
        };

        this.lowStockProducts = data.low_stock_products ?? [];
        this.recentOrders = data.recent_orders ?? [];
        this.topSellingProducts = data.top_selling_products ?? [];
      } finally {
        this.loading = false;
      }
    },
  },
});
