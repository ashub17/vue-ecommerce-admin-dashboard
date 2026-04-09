<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Content Blocks</h2>
        <p class="text-sm text-gray-500 mt-1">
          Manage dynamic CMS content sections
        </p>
      </div>

      <RouterLink
        to="/content-blocks/create"
        class="inline-flex items-center justify-center rounded-lg bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-black"
      >
        Add Content Block
      </RouterLink>
    </div>

    <AppTable>
      <thead class="bg-gray-50 text-left text-gray-600">
        <tr>
          <th class="px-4 py-3">#</th>
          <th class="px-4 py-3">Image</th>
          <th class="px-4 py-3">Key</th>
          <th class="px-4 py-3">Title</th>
          <th class="px-4 py-3">Status</th>
          <th class="px-4 py-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="contentBlockStore.listLoading">
          <td colspan="6" class="px-4 py-6 text-center text-gray-500">
            Loading content blocks...
          </td>
        </tr>

        <tr
          v-for="(block, index) in safeBlocks"
          :key="block.id"
          class="border-t border-gray-100"
        >
          <td class="px-4 py-3 text-gray-600">
            {{ rowNumber(index) }}
          </td>

          <td class="px-4 py-3">
            <img
              v-if="block.image || block.image_url"
              :src="block.image_url || buildImageUrl(block.image)"
              alt="Content block"
              class="h-16 w-20 rounded-xl object-cover border border-gray-200"
            />
            <div
              v-else
              class="h-16 w-20 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400"
            >
              No image
            </div>
          </td>

          <td class="px-4 py-3 font-medium text-gray-900">
            {{ block.key }}
          </td>

          <td class="px-4 py-3 text-gray-600">
            {{ block.title }}
          </td>

          <td class="px-4 py-3">
            <AppBadge :variant="block.is_active ? 'green' : 'gray'">
              {{ block.is_active ? 'Active' : 'Inactive' }}
            </AppBadge>
          </td>

          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <RouterLink
                :to="`/content-blocks/${block.id}/edit`"
                class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit
              </RouterLink>

              <button
                @click="handleDelete(block)"
                class="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>

        <tr
          v-if="
            !contentBlockStore.listLoading &&
            !contentBlockStore.contentBlocks.length
          "
        >
          <td colspan="6" class="px-4 py-6 text-center text-gray-500">
            No content blocks found
          </td>
        </tr>
      </tbody>
    </AppTable>

    <AppPagination :meta="contentBlockStore.meta" @change="goToPage" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useContentBlockStore } from '@/stores/contentBlock';
import { useConfirm } from '@/composables/useConfirm';
import { useNotify } from '@/composables/useNotify';
import { buildImageUrl } from '@/utils/helpers';
import AppTable from '@/components/ui/AppTable.vue';
import AppPagination from '@/components/ui/AppPagination.vue';
import AppBadge from '@/components/ui/AppBadge.vue';

const contentBlockStore = useContentBlockStore();
const { confirm } = useConfirm();
const notify = useNotify();
const page = ref(1);

const safeBlocks = computed(() =>
  Array.isArray(contentBlockStore.contentBlocks)
    ? contentBlockStore.contentBlocks.filter(
        (block) => block && typeof block === 'object',
      )
    : [],
);

onMounted(() => {
  fetchContentBlocks();
});

async function fetchContentBlocks() {
  try {
    await contentBlockStore.fetchContentBlocks({ page: page.value });
  } catch (error) {
    notify.error(
      error.response?.data?.message || 'Failed to load content blocks.',
    );
  }
}

async function goToPage(nextPage) {
  if (!nextPage) return;
  if (
    contentBlockStore.meta &&
    (nextPage < 1 || nextPage > contentBlockStore.meta.last_page)
  )
    return;

  page.value = nextPage;
  await fetchContentBlocks();
}

function rowNumber(index) {
  if (!contentBlockStore.meta) return index + 1;
  return (
    (contentBlockStore.meta.current_page - 1) *
      contentBlockStore.meta.per_page +
    index +
    1
  );
}

async function handleDelete(block) {
  const confirmed = await confirm({
    title: 'Delete Content Block',
    message: `Are you sure you want to delete "${block.title}"?`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
  });

  if (!confirmed) return;

  try {
    await contentBlockStore.removeContentBlock(block.id);
    notify.success('Content block deleted successfully.');
    await fetchContentBlocks();
  } catch (error) {
    notify.error(
      error.response?.data?.message || 'Failed to delete content block.',
    );
  }
}
</script>
