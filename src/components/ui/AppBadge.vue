<template>
  <span
    class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
    :class="badgeClass"
  >
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'gray',
  },
});

const badgeClass = computed(() => {
  const map = {
    gray: 'bg-gray-100 text-gray-600',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return map[props.variant] || map.gray;
});
</script>
