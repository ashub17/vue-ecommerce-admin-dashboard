<template>
  <div
    v-if="confirmStore.isOpen"
    class="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4"
  >
    <div
      class="w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-xl p-6"
    >
      <h3 class="text-lg font-semibold text-gray-900">
        {{ confirmStore.title }}
      </h3>

      <p class="text-sm text-gray-600 mt-2">
        {{ confirmStore.message }}
      </p>

      <div class="mt-6 flex items-center justify-end gap-3">
        <button
          @click="confirmStore.cancel()"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {{ confirmStore.cancelText }}
        </button>

        <button
          @click="confirmStore.confirm()"
          class="rounded-lg px-4 py-2 text-sm font-medium text-white"
          :class="
            confirmStore.variant === 'danger'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gray-900 hover:bg-black'
          "
        >
          {{ confirmStore.confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useConfirmStore } from '@/stores/confirm';

const confirmStore = useConfirmStore();
</script>
