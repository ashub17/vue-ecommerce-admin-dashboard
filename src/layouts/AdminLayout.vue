<template>
  <div class="min-h-screen bg-gray-100 flex">
    <AdminSidebar :sidebar-open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex-1 flex flex-col min-w-0">
      <AdminNavbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="p-4 md:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AdminSidebar from '@/components/layout/AdminSidebar.vue';
import AdminNavbar from '@/components/layout/AdminNavbar.vue';

const sidebarOpen = ref(false);
</script>
