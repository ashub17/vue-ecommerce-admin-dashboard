<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
      <p class="text-sm text-gray-500 mt-1">
        Overview of your store performance
      </p>
    </div>

    <div
      v-if="dashboardStore.loading"
      class="bg-white rounded-2xl border border-gray-200 p-6"
    >
      Loading dashboard...
    </div>

    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Users"
          :value="dashboardStore.stats.total_users"
        />
        <StatCard
          title="Total Products"
          :value="dashboardStore.stats.total_products"
        />
        <StatCard
          title="Total Categories"
          :value="dashboardStore.stats.total_categories"
        />
        <StatCard
          title="Total Orders"
          :value="dashboardStore.stats.total_orders"
        />
        <StatCard
          title="Total Revenue"
          :value="formatCurrency(dashboardStore.stats.total_revenue)"
        />
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <LowStockTable :items="dashboardStore.lowStockProducts" />
        <RecentOrdersTable :items="dashboardStore.recentOrders" />
      </div>

      <TopSellingTable :items="dashboardStore.topSellingProducts" />
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useDashboardStore } from '@/stores/dashboard';
import StatCard from '@/components/dashboard/StatCard.vue';
import LowStockTable from '@/components/dashboard/LowStockTable.vue';
import RecentOrdersTable from '@/components/dashboard/RecentOrdersTable.vue';
import TopSellingTable from '@/components/dashboard/TopSellingTable.vue';

const dashboardStore = useDashboardStore();

onMounted(() => {
  dashboardStore.fetchDashboard();
});

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}
</script>
