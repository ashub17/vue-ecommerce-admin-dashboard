<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          Order #{{ orderStore.order?.id || route.params.id }}
        </h2>
        <p class="text-sm text-gray-500 mt-1">View and update order details</p>
      </div>

      <RouterLink
        to="/orders"
        class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Back to Orders
      </RouterLink>
    </div>

    <div
      v-if="orderStore.loading"
      class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-gray-500"
    >
      Loading order...
    </div>

    <template v-else-if="orderStore.order">
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div class="xl:col-span-2 space-y-6">
          <div
            class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
              <div>
                <p class="text-gray-500">Order ID</p>
                <p class="font-medium text-gray-900 mt-1">
                  #{{ orderStore.order.id }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Customer</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{
                    orderStore.order.user?.name ||
                    orderStore.order.customer_name ||
                    '-'
                  }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Order Status</p>
                <div class="mt-1">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="orderStatusBadgeClass(orderStore.order.status)"
                  >
                    {{ orderStore.order.status }}
                  </span>
                </div>
              </div>

              <div>
                <p class="text-gray-500">Payment Status</p>
                <div class="mt-1">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="
                      paymentStatusBadgeClass(orderStore.order.payment_status)
                    "
                  >
                    {{ orderStore.order.payment_status }}
                  </span>
                </div>
              </div>

              <div>
                <p class="text-gray-500">Total Amount</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{
                    formatCurrency(
                      orderStore.order.total_amount || orderStore.order.total,
                    )
                  }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Placed At</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{ formatDateTime(orderStore.order.created_at) }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Customer & Shipping
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p class="text-gray-500">Name</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{
                    orderStore.order.shipping_name ||
                    orderStore.order.user?.name ||
                    '-'
                  }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Email</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{
                    orderStore.order.shipping_email ||
                    orderStore.order.user?.email ||
                    '-'
                  }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Phone</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{ orderStore.order.shipping_phone || '-' }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Address</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{ orderStore.order.shipping_address || '-' }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Billing Address</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{ orderStore.order.billing_address || '-' }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Notes</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{ orderStore.order.notes || '-' }}
                </p>
              </div>
            </div>
          </div>

          <OrderItemsTable
            :items="
              orderStore.order.items || orderStore.order.order_items || []
            "
          />
        </div>

        <div class="space-y-6">
          <OrderStatusForm
            :initial-values="orderStore.order"
            :loading="orderStore.submitLoading"
            :errors="errors"
            @submit="handleUpdate"
          />

          <div
            v-if="successMessage"
            class="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {{ successMessage }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import {
  orderStatusBadgeClass,
  paymentStatusBadgeClass,
} from '@/utils/orderHelpers';
import OrderStatusForm from '@/components/orders/OrderStatusForm.vue';
import OrderItemsTable from '@/components/orders/OrderItemsTable.vue';
import { formatCurrency, formatDateTime } from '@/utils/helpers';

const route = useRoute();
const orderStore = useOrderStore();
const errors = ref({});
const successMessage = ref('');

onMounted(() => {
  orderStore.fetchOrder(route.params.id);
});

onUnmounted(() => {
  orderStore.clearOrder();
});

async function handleUpdate(payload) {
  errors.value = {};
  successMessage.value = '';

  try {
    await orderStore.updateOrder(route.params.id, payload);
    successMessage.value = 'Order updated successfully.';
    await orderStore.fetchOrder(route.params.id);
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    } else {
      alert(error.response?.data?.message || 'Failed to update order.');
    }
  }
}
</script>
