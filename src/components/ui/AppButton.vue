<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
    :class="variantClass"
  >
    <span v-if="loading">{{ loadingText }}</span>
    <span v-else>
      <slot />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary',
  },
  disabled: Boolean,
  loading: Boolean,
  loadingText: {
    type: String,
    default: 'Processing...',
  },
});

const variantClass = computed(() => {
  if (props.variant === 'secondary') {
    return 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50';
  }

  if (props.variant === 'danger') {
    return 'bg-red-500 text-white hover:bg-red-600';
  }

  return 'bg-gray-900 text-white hover:bg-black';
});
</script>
