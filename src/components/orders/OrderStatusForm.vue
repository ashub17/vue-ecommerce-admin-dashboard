<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Update Order</h3>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Order Status
          </label>
          <select
            v-model="form.status"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option
              v-for="status in orderStatusOptions"
              :key="status"
              :value="status"
            >
              {{ status }}
            </option>
          </select>
          <p v-if="errors.status" class="text-sm text-red-500 mt-1">
            {{ errors.status[0] || errors.status }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Payment Status
          </label>
          <select
            v-model="form.payment_status"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option
              v-for="status in paymentStatusOptions"
              :key="status"
              :value="status"
            >
              {{ status }}
            </option>
          </select>
          <p v-if="errors.payment_status" class="text-sm text-red-500 mt-1">
            {{ errors.payment_status[0] || errors.payment_status }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center justify-center rounded-lg bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-black disabled:opacity-50"
        >
          {{ loading ? 'Updating...' : 'Update Order' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import {
  ORDER_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from '@/utils/orderHelpers';

const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({}),
  },
  loading: Boolean,
  errors: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['submit']);

const form = reactive({
  status: 'pending',
  payment_status: 'unpaid',
});

const orderStatusOptions = ORDER_STATUS_OPTIONS;
const paymentStatusOptions = PAYMENT_STATUS_OPTIONS;

watch(
  () => props.initialValues,
  (values) => {
    form.status = values?.status ?? 'pending';
    form.payment_status = values?.payment_status ?? 'unpaid';
  },
  { immediate: true, deep: true },
);

function handleSubmit() {
  emit('submit', {
    status: form.status,
    payment_status: form.payment_status,
  });
}
</script>
