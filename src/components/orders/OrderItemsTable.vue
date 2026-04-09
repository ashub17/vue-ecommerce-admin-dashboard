<template>
  <div
    class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
  >
    <div class="p-4 border-b border-gray-200">
      <h3 class="font-semibold text-gray-900">Order Items</h3>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left text-gray-600">
          <tr>
            <th class="px-4 py-3">Product</th>
            <th class="px-4 py-3">SKU</th>
            <th class="px-4 py-3">Price</th>
            <th class="px-4 py-3">Qty</th>
            <th class="px-4 py-3">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            class="border-t border-gray-100"
          >
            <td class="px-4 py-3">
              {{ item.product_name || item.name || item.product?.name || '-' }}
            </td>
            <td class="px-4 py-3 text-gray-600">
              {{ item.product?.sku || item.product_sku || item.sku || '-' }}
            </td>
            <td class="px-4 py-3 text-gray-600">
              {{ formatCurrency(item.product_price || item.price || 0) }}
            </td>
            <td class="px-4 py-3 text-gray-600">
              {{ item.quantity || 0 }}
            </td>
            <td class="px-4 py-3 font-medium text-gray-900">
              {{ formatCurrency(item.subtotal || 0) }}
            </td>
          </tr>

          <tr v-if="!items.length">
            <td colspan="5" class="px-4 py-6 text-center text-gray-500">
              No order items found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/helpers';

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
</script>
