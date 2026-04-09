<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Orders</h2>
      <p class="text-sm text-gray-500 mt-1">
        Manage customer orders and payment statuses
      </p>
    </div>

    <div
      class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-left text-gray-600">
            <tr>
              <th class="px-4 py-3">#</th>
              <th class="px-4 py-3">Order ID</th>
              <th class="px-4 py-3">Customer</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Payment</th>
              <th class="px-4 py-3">Total</th>
              <th class="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="orderStore.listLoading">
              <td colspan="7" class="px-4 py-6 text-center text-gray-500">
                Loading orders...
              </td>
            </tr>

            <tr
              v-for="(order, index) in orderStore.orders"
              :key="order.id"
              class="border-t border-gray-100"
            >
              <td class="px-4 py-3 text-gray-600">
                {{ rowNumber(index) }}
              </td>

              <td class="px-4 py-3 font-medium text-gray-900">
                #{{ order.id }}
              </td>

              <td class="px-4 py-3 text-gray-600">
                {{
                  order.user?.name ||
                  order.customer_name ||
                  order.shipping_name ||
                  '-'
                }}
              </td>

              <td class="px-4 py-3">
                <AppBadge
                  :variant="
                    badgeVariantFromClass(orderStatusBadgeClass(order.status))
                  "
                >
                  {{ order.status }}
                </AppBadge>
              </td>

              <td class="px-4 py-3">
                <span
                  class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="paymentStatusBadgeClass(order.payment_status)"
                >
                  {{ order.payment_status }}
                </span>
              </td>

              <td class="px-4 py-3 text-gray-600">
                {{ formatCurrency(order.total_amount || order.total) }}
              </td>

              <td class="px-4 py-3">
                <RouterLink
                  :to="`/orders/${order.id}`"
                  class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  View
                </RouterLink>
              </td>
            </tr>

            <tr v-if="!orderStore.listLoading && !orderStore.orders.length">
              <td colspan="7" class="px-4 py-6 text-center text-gray-500">
                No orders found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AppPagination :meta="orderStore.meta" @change="goToPage" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useOrderStore } from '@/stores/order';
import { formatCurrency } from '@/utils/helpers';
import {
  orderStatusBadgeClass,
  paymentStatusBadgeClass,
} from '@/utils/orderHelpers';
import AppPagination from '@/components/ui/AppPagination.vue';
import AppBadge from '@/components/ui/AppBadge.vue';

const orderStore = useOrderStore();
const page = ref(1);

const currentPage = computed(() => orderStore.meta?.current_page || page.value);

onMounted(() => {
  fetchOrders();
});

async function fetchOrders() {
  await orderStore.fetchOrders({ page: page.value });
}

async function goToPage(nextPage) {
  page.value = nextPage;
  await fetchOrders();
}

function rowNumber(index) {
  if (!orderStore.meta) return index + 1;
  return (
    (orderStore.meta.current_page - 1) * orderStore.meta.per_page + index + 1
  );
}
</script>
