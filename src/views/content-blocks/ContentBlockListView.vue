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

    <div
      class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
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
              v-for="(block, index) in contentBlockStore.contentBlocks"
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
                <span
                  class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="
                    block.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  "
                >
                  {{ block.is_active ? 'Active' : 'Inactive' }}
                </span>
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
        </table>
      </div>
    </div>

    <div
      v-if="contentBlockStore.meta"
      class="flex items-center justify-between bg-white rounded-2xl border border-gray-200 px-4 py-3"
    >
      <p class="text-sm text-gray-500">
        Page {{ currentPage }} of {{ contentBlockStore.meta.last_page }}
      </p>

      <div class="flex items-center gap-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
        >
          Prev
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= contentBlockStore.meta.last_page"
          class="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useContentBlockStore } from '@/stores/contentBlock';
import { buildImageUrl } from '@/utils/helpers';

const contentBlockStore = useContentBlockStore();
const page = ref(1);

const currentPage = computed(
  () => contentBlockStore.meta?.current_page || page.value,
);

onMounted(() => {
  fetchContentBlocks();
});

async function fetchContentBlocks() {
  await contentBlockStore.fetchContentBlocks({ page: page.value });
}

async function goToPage(nextPage) {
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
  const confirmed = window.confirm(`Delete content block "${block.title}"?`);
  if (!confirmed) return;

  try {
    await contentBlockStore.removeContentBlock(block.id);
    await fetchContentBlocks();
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to delete content block.');
  }
}
</script>
