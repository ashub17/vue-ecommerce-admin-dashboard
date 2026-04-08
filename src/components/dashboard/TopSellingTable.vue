<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm">
    <div class="p-4 border-b border-gray-200">
      <h3 class="font-semibold text-gray-900">Top Selling Products</h3>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left text-gray-600">
          <tr>
            <th class="px-4 py-3">Product</th>
            <th class="px-4 py-3">Sold</th>
            <th class="px-4 py-3">Revenue</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in items"
            :key="product.id"
            class="border-t border-gray-100"
          >
            <td class="px-4 py-3">{{ product.name }}</td>
            <td class="px-4 py-3">{{ product.total_sold }}</td>
            <td class="px-4 py-3">{{ product.total_revenue }}</td>
          </tr>

          <tr v-if="!items.length">
            <td colspan="3" class="px-4 py-6 text-center text-gray-500">
              No top selling products found
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
