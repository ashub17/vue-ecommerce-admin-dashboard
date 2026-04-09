<template>
  <div
    class="bg-white rounded-2xl border border-gray-200 p-6 text-center text-gray-500"
  >
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Loading...',
  },
});
</script>
