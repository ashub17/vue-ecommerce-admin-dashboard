<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          Order #{{ orderData?.id || route.params.id }}
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

    <AppLoadingState v-if="orderStore.loading" message="Loading order..." />

    <template v-else-if="orderData">
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
                  #{{ orderData.id }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Order Number</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{ orderData.order_number || '-' }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Customer</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{
                    orderData.user?.name || shippingAddress?.full_name || '-'
                  }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Customer Email</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{ orderData.user?.email || '-' }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Order Status</p>
                <div class="mt-1">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="orderStatusBadgeClass(orderData.status)"
                  >
                    {{ orderData.status }}
                  </span>
                </div>
              </div>

              <div>
                <p class="text-gray-500">Payment Status</p>
                <div class="mt-1">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="paymentStatusBadgeClass(orderData.payment_status)"
                  >
                    {{ orderData.payment_status }}
                  </span>
                </div>
              </div>

              <div>
                <p class="text-gray-500">Subtotal</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{ formatCurrency(orderData.subtotal) }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Shipping Fee</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{ formatCurrency(orderData.shipping_fee) }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Tax</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{ formatCurrency(orderData.tax) }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Total Amount</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{
                    formatCurrency(orderData.total_amount || orderData.total)
                  }}
                </p>
              </div>

              <div>
                <p class="text-gray-500">Placed At</p>
                <p class="font-medium text-gray-900 mt-1">
                  {{ orderData.created_at || '-' }}
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
            >
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Shipping Address
              </h3>

              <div class="space-y-3 text-sm">
                <div>
                  <p class="text-gray-500">Full Name</p>
                  <p class="font-medium text-gray-900 mt-1">
                    {{ shippingAddress?.full_name || '-' }}
                  </p>
                </div>

                <div>
                  <p class="text-gray-500">Phone</p>
                  <p class="font-medium text-gray-900 mt-1">
                    {{ shippingAddress?.phone || '-' }}
                  </p>
                </div>

                <div>
                  <p class="text-gray-500">Address</p>
                  <p class="font-medium text-gray-900 mt-1">
                    {{ formatAddress(shippingAddress) }}
                  </p>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
            >
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Billing Address
              </h3>

              <div class="space-y-3 text-sm">
                <div>
                  <p class="text-gray-500">Full Name</p>
                  <p class="font-medium text-gray-900 mt-1">
                    {{ billingAddress?.full_name || '-' }}
                  </p>
                </div>

                <div>
                  <p class="text-gray-500">Phone</p>
                  <p class="font-medium text-gray-900 mt-1">
                    {{ billingAddress?.phone || '-' }}
                  </p>
                </div>

                <div>
                  <p class="text-gray-500">Address</p>
                  <p class="font-medium text-gray-900 mt-1">
                    {{ formatAddress(billingAddress) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <OrderItemsTable :items="orderItems" />
        </div>

        <div class="space-y-6">
          <OrderStatusForm
            :initial-values="orderData"
            :loading="orderStore.submitLoading"
            :errors="errors"
            @submit="handleUpdate"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import { useFormErrors } from '@/composables/useFormErrors';
import { useNotify } from '@/composables/useNotify';
import { formatCurrency } from '@/utils/helpers';
import {
  orderStatusBadgeClass,
  paymentStatusBadgeClass,
} from '@/utils/orderHelpers';
import OrderStatusForm from '@/components/orders/OrderStatusForm.vue';
import OrderItemsTable from '@/components/orders/OrderItemsTable.vue';
import AppLoadingState from '@/components/feedback/AppLoadingState.vue';

const route = useRoute();
const orderStore = useOrderStore();
const notify = useNotify();

const { errors, clearErrors, getErrorMessage } = useFormErrors();

const orderData = computed(() =>
  orderStore.order && typeof orderStore.order === 'object'
    ? orderStore.order
    : null,
);

const shippingAddress = computed(
  () => orderData.value?.shipping_address || null,
);
const billingAddress = computed(() => orderData.value?.billing_address || null);
const orderItems = computed(() =>
  Array.isArray(orderData.value?.items)
    ? orderData.value.items.filter((item) => item && typeof item === 'object')
    : [],
);

onMounted(async () => {
  try {
    await orderStore.fetchOrder(route.params.id);
  } catch (error) {
    notify.error(error.response?.data?.message || 'Failed to load order.');
  }
});

onUnmounted(() => {
  orderStore.clearOrder();
});

function formatAddress(address) {
  if (!address) return '-';

  return [
    address.address_line1,
    address.address_line2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ]
    .filter(Boolean)
    .join(', ');
}

async function handleUpdate(payload) {
  clearErrors();

  try {
    await orderStore.updateOrder(route.params.id, payload);
    notify.success('Order updated successfully.');
    await orderStore.fetchOrder(route.params.id);
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to update order.');
    if (message) notify.error(message);
  }
}
</script>
