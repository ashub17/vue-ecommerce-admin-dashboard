<template>
  <header
    class="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between"
  >
    <div class="flex items-center gap-3">
      <button
        class="lg:hidden inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2"
        @click="$emit('toggle-sidebar')"
      >
        ☰
      </button>
      <h1 class="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
    </div>

    <div class="flex items-center gap-3">
      <div class="text-right hidden sm:block">
        <p class="text-sm font-medium text-gray-900">
          {{ authStore.user?.name }}
        </p>
        <p class="text-xs text-gray-500">{{ authStore.user?.email }}</p>
      </div>

      <button
        @click="handleLogout"
        class="rounded-lg bg-red-500 text-white px-4 py-2 text-sm hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

defineEmits(['toggle-sidebar']);

const router = useRouter();
const authStore = useAuthStore();

async function handleLogout() {
  await authStore.logout();
  router.push('/login');
}
</script>
