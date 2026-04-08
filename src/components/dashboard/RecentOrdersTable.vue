<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm">
    <div class="p-4 border-b border-gray-200">
      <h3 class="font-semibold text-gray-900">Recent Orders</h3>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left text-gray-600">
          <tr>
            <th class="px-4 py-3">Order #</th>
            <th class="px-4 py-3">Customer</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in items"
            :key="order.id"
            class="border-t border-gray-100"
          >
            <td class="px-4 py-3">#{{ order.id }}</td>
            <td class="px-4 py-3">
              {{ order.customer_name || order.user?.name }}
            </td>
            <td class="px-4 py-3">{{ order.status }}</td>
            <td class="px-4 py-3">{{ order.total_amount }}</td>
          </tr>

          <tr v-if="!items.length">
            <td colspan="4" class="px-4 py-6 text-center text-gray-500">
              No recent orders found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
</script>
