<template>
  <div class="bg-white rounded-2xl border p-5 shadow-sm">
    <p class="text-sm text-gray-500">{{ title }}</p>
    <p class="text-2xl font-bold text-gray-900 mt-2">
      {{ value }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
});
</script>
