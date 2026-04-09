<template>
  <div class="fixed top-4 right-4 z-[100] space-y-3 w-full max-w-sm">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in uiStore.toasts"
        :key="toast.id"
        class="rounded-2xl border shadow-lg bg-white overflow-hidden"
        :class="toastClass(toast.type)"
      >
        <div class="p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm font-semibold">{{ toast.title }}</p>
              <p class="text-sm mt-1 text-gray-600">
                {{ toast.message }}
              </p>
            </div>

            <button
              @click="uiStore.removeToast(toast.id)"
              class="text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();

function toastClass(type) {
  if (type === 'success') return 'border-green-200';
  if (type === 'error') return 'border-red-200';
  if (type === 'warning') return 'border-yellow-200';
  if (type === 'info') return 'border-blue-200';
  return 'border-gray-200';
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
