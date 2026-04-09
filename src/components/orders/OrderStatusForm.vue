<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Update Order</h3>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AppSelect
          v-model="form.status"
          label="Order Status"
          :options="orderStatusOptions"
          :error="errors.status?.[0] || errors.status"
        />

        <AppSelect
          v-model="form.payment_status"
          label="Payment Status"
          :options="paymentStatusOptions"
          :error="errors.payment_status?.[0] || errors.payment_status"
        />
      </div>

      <div class="flex items-center gap-3">
        <AppButton type="submit" :loading="loading" loading-text="Updating...">
          Update Order
        </AppButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import AppSelect from '@/components/ui/AppSelect.vue';
import AppButton from '@/components/ui/AppButton.vue';
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

const orderStatusOptions = ORDER_STATUS_OPTIONS.map((status) => ({
  label: status,
  value: status,
}));

const paymentStatusOptions = PAYMENT_STATUS_OPTIONS.map((status) => ({
  label: status,
  value: status,
}));

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
