<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Banners</h2>
        <p class="text-sm text-gray-500 mt-1">
          Manage homepage and promotional banners
        </p>
      </div>

      <RouterLink
        to="/banners/create"
        class="inline-flex items-center justify-center rounded-lg bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-black"
      >
        Add Banner
      </RouterLink>
    </div>

    <AppTable>
      <thead class="bg-gray-50 text-left text-gray-600">
        <tr>
          <th class="px-4 py-3">#</th>
          <th class="px-4 py-3">Image</th>
          <th class="px-4 py-3">Title</th>
          <th class="px-4 py-3">Button</th>
          <th class="px-4 py-3">Sort Order</th>
          <th class="px-4 py-3">Status</th>
          <th class="px-4 py-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="bannerStore.listLoading">
          <td colspan="7" class="px-4 py-6 text-center text-gray-500">
            Loading banners...
          </td>
        </tr>

        <tr
          v-for="(banner, index) in safeBanners"
          :key="banner.id"
          class="border-t border-gray-100"
        >
          <td class="px-4 py-3 text-gray-600">
            {{ rowNumber(index) }}
          </td>

          <td class="px-4 py-3">
            <img
              v-if="banner.image || banner.image_url"
              :src="banner.image_url || buildImageUrl(banner.image)"
              alt="Banner"
              class="h-16 w-28 rounded-xl object-cover border border-gray-200"
            />
            <div
              v-else
              class="h-16 w-28 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400"
            >
              No image
            </div>
          </td>

          <td class="px-4 py-3">
            <div class="font-medium text-gray-900">{{ banner.title }}</div>
            <div
              v-if="banner.subtitle"
              class="text-xs text-gray-500 mt-1 line-clamp-2"
            >
              {{ banner.subtitle }}
            </div>
          </td>

          <td class="px-4 py-3 text-gray-600">
            <div>{{ banner.button_text || '-' }}</div>
            <div v-if="banner.button_link" class="text-xs text-gray-500 mt-1">
              {{ banner.button_link }}
            </div>
          </td>

          <td class="px-4 py-3 text-gray-600">
            {{ banner.sort_order ?? '-' }}
          </td>

          <td class="px-4 py-3">
            <AppBadge :variant="banner.is_active ? 'green' : 'gray'">
              {{ banner.is_active ? 'Active' : 'Inactive' }}
            </AppBadge>
          </td>

          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <RouterLink
                :to="`/banners/${banner.id}/edit`"
                class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit
              </RouterLink>

              <button
                @click="handleDelete(banner)"
                class="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="!bannerStore.listLoading && !bannerStore.banners.length">
          <td colspan="7" class="px-4 py-6 text-center text-gray-500">
            No banners found
          </td>
        </tr>
      </tbody>
    </AppTable>

    <AppPagination :meta="bannerStore.meta" @change="goToPage" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useBannerStore } from '@/stores/banner';
import { useConfirm } from '@/composables/useConfirm';
import { useNotify } from '@/composables/useNotify';
import { buildImageUrl } from '@/utils/helpers';
import AppTable from '@/components/ui/AppTable.vue';
import AppPagination from '@/components/ui/AppPagination.vue';
import AppBadge from '@/components/ui/AppBadge.vue';

const bannerStore = useBannerStore();
const { confirm } = useConfirm();
const notify = useNotify();
const page = ref(1);

const safeBanners = computed(() =>
  Array.isArray(bannerStore.banners)
    ? bannerStore.banners.filter(
        (banner) => banner && typeof banner === 'object',
      )
    : [],
);

onMounted(() => {
  fetchBanners();
});

async function fetchBanners() {
  try {
    await bannerStore.fetchBanners({ page: page.value });
  } catch (error) {
    notify.error(error.response?.data?.message || 'Failed to load banners.');
  }
}

async function goToPage(nextPage) {
  if (!nextPage) return;
  if (
    bannerStore.meta &&
    (nextPage < 1 || nextPage > bannerStore.meta.last_page)
  )
    return;

  page.value = nextPage;
  await fetchBanners();
}

function rowNumber(index) {
  if (!bannerStore.meta) return index + 1;
  return (
    (bannerStore.meta.current_page - 1) * bannerStore.meta.per_page + index + 1
  );
}

async function handleDelete(banner) {
  const confirmed = await confirm({
    title: 'Delete Banner',
    message: `Are you sure you want to delete "${banner.title}"?`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
  });

  if (!confirmed) return;

  try {
    await bannerStore.removeBanner(banner.id);
    notify.success('Banner deleted successfully.');
    await fetchBanners();
  } catch (error) {
    notify.error(error.response?.data?.message || 'Failed to delete banner.');
  }
}
</script>
