<template>
  <div
    v-if="meta"
    class="flex items-center justify-between bg-white rounded-2xl border border-gray-200 px-4 py-3"
  >
    <p class="text-sm text-gray-500">
      Page {{ meta.current_page }} of {{ meta.last_page }}
    </p>

    <div class="flex items-center gap-2">
      <button
        @click="$emit('change', meta.current_page - 1)"
        :disabled="meta.current_page <= 1"
        class="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
      >
        Prev
      </button>

      <button
        @click="$emit('change', meta.current_page + 1)"
        :disabled="meta.current_page >= meta.last_page"
        class="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  meta: {
    type: Object,
    default: null,
  },
});

defineEmits(['change']);
</script>
