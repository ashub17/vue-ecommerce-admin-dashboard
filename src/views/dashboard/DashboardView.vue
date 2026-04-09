<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
      <p class="text-sm text-gray-500 mt-1">
        Overview of your store performance
      </p>
    </div>

    <AppLoadingState
      v-if="dashboardStore.loading"
      message="Loading dashboard..."
    />

    <template v-else>
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        <SummaryCard title="Users" :value="summary.total_users" />
        <SummaryCard title="Products" :value="summary.total_products" />
        <SummaryCard title="Categories" :value="summary.total_categories" />
        <SummaryCard title="Orders" :value="summary.total_orders" />
        <SummaryCard
          title="Revenue"
          :value="formatCurrency(summary.total_revenue)"
        />
      </div>

      <!-- Tables -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <!-- Low Stock -->
        <div class="bg-white rounded-2xl border p-5">
          <h3 class="font-semibold mb-4">Low Stock Products</h3>

          <ul v-if="dashboardStore.lowStockProducts.length" class="space-y-2">
            <li
              v-for="p in dashboardStore.lowStockProducts"
              :key="p.id"
              class="flex justify-between text-sm"
            >
              <span>{{ p.name }}</span>
              <span class="text-red-600 font-medium">
                {{ p.stock_quantity }}
              </span>
            </li>
          </ul>

          <p v-else class="text-sm text-gray-500">No low stock products</p>
        </div>

        <!-- Recent Orders -->
        <div class="bg-white rounded-2xl border p-5">
          <h3 class="font-semibold mb-4">Recent Orders</h3>

          <ul v-if="dashboardStore.recentOrders.length" class="space-y-2">
            <li
              v-for="o in dashboardStore.recentOrders"
              :key="o.id"
              class="text-sm flex justify-between"
            >
              <span>#{{ o.order_number }}</span>
              <span>{{ formatCurrency(o.total) }}</span>
            </li>
          </ul>

          <p v-else class="text-sm text-gray-500">No recent orders</p>
        </div>

        <!-- Top Selling -->
        <div class="bg-white rounded-2xl border p-5 xl:col-span-2">
          <h3 class="font-semibold mb-4">Top Selling Products</h3>

          <ul v-if="dashboardStore.topSellingProducts.length" class="space-y-2">
            <li
              v-for="p in dashboardStore.topSellingProducts"
              :key="p.product_id"
              class="flex justify-between text-sm"
            >
              <span>{{ p.product_name }}</span>
              <span>
                {{ p.total_quantity_sold }} sold •
                {{ formatCurrency(p.total_sales) }}
              </span>
            </li>
          </ul>

          <p v-else class="text-sm text-gray-500">No sales data</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useDashboardStore } from '@/stores/dashboard';
import { useNotify } from '@/composables/useNotify';
import { formatCurrency } from '@/utils/helpers';
import AppLoadingState from '@/components/feedback/AppLoadingState.vue';
import SummaryCard from '@/components/dashboard/SummaryCard.vue';

const dashboardStore = useDashboardStore();
const notify = useNotify();

const summary = dashboardStore.summary;

onMounted(async () => {
  try {
    await dashboardStore.fetchDashboard();
  } catch (error) {
    notify.error('Failed to load dashboard.');
  }
});
</script>
