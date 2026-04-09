<template>
  <div
    v-if="sidebarOpen"
    class="fixed inset-0 bg-black/40 z-30 lg:hidden"
    @click="$emit('close')"
  ></div>

  <aside
    class="fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200"
    :class="
      sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    "
  >
    <div class="h-16 flex items-center px-6 border-b border-gray-200">
      <h2 class="text-lg font-bold text-gray-900">Admin Panel</h2>
    </div>

    <nav class="p-4 space-y-1">
      <RouterLink
        v-for="item in menuItems"
        :key="item.name"
        :to="item.to"
        class="block px-4 py-2.5 rounded-lg text-sm font-medium transition"
        :class="
          isActive(item)
            ? 'bg-gray-900 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        "
      >
        {{ item.name }}
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router';

defineProps({
  sidebarOpen: Boolean,
});

defineEmits(['close']);

const route = useRoute();

const menuItems = [
  { name: 'Dashboard', to: '/dashboard', match: /^\/dashboard/ },
  { name: 'Categories', to: '/categories', match: /^\/categories/ },
  { name: 'Products', to: '/products', match: /^\/products/ },
  { name: 'Orders', to: '/orders', match: /^\/orders/ },
  { name: 'Banners', to: '/banners', match: /^\/banners/ },
  { name: 'Content Blocks', to: '/content-blocks', match: /^\/content-blocks/ },
];

function isActive(item) {
  return item.match.test(route.path);
}
</script>
