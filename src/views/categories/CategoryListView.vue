<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Categories</h2>
        <p class="text-sm text-gray-500 mt-1">Manage your product categories</p>
      </div>

      <RouterLink
        to="/categories/create"
        class="inline-flex items-center justify-center rounded-lg bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-black"
      >
        Add Category
      </RouterLink>
    </div>

    <AppTable>
      <thead class="bg-gray-50 text-left text-gray-600">
        <tr>
          <th class="px-4 py-3">#</th>
          <th class="px-4 py-3">Name</th>
          <th class="px-4 py-3">Slug</th>
          <th class="px-4 py-3">Status</th>
          <th class="px-4 py-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="categoryStore.listLoading">
          <td colspan="5" class="px-4 py-6 text-center text-gray-500">
            Loading categories...
          </td>
        </tr>

        <tr
          v-for="(category, index) in categoryStore.categories"
          :key="category.id"
          class="border-t border-gray-100"
        >
          <td class="px-4 py-3 text-gray-600">
            {{ rowNumber(index) }}
          </td>

          <td class="px-4 py-3 font-medium text-gray-900">
            {{ category.name }}
          </td>

          <td class="px-4 py-3 text-gray-600">
            {{ category.slug }}
          </td>

          <td class="px-4 py-3">
            <AppBadge :variant="category.is_active ? 'green' : 'gray'">
              {{ category.is_active ? 'Active' : 'Inactive' }}
            </AppBadge>
          </td>

          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <RouterLink
                :to="`/categories/${category.id}/edit`"
                class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit
              </RouterLink>

              <button
                @click="handleDelete(category)"
                class="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>

        <tr
          v-if="!categoryStore.listLoading && !categoryStore.categories.length"
        >
          <td colspan="5" class="px-4 py-6 text-center text-gray-500">
            No categories found
          </td>
        </tr>
      </tbody>
    </AppTable>

    <AppPagination :meta="categoryStore.meta" @change="goToPage" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { useConfirm } from '@/composables/useConfirm';
import { useNotify } from '@/composables/useNotify';
import AppTable from '@/components/ui/AppTable.vue';
import AppPagination from '@/components/ui/AppPagination.vue';
import AppBadge from '@/components/ui/AppBadge.vue';

const categoryStore = useCategoryStore();
const { confirm } = useConfirm();
const notify = useNotify();
const page = ref(1);

const currentPage = computed(
  () => categoryStore.meta?.current_page || page.value,
);

onMounted(() => {
  fetchCategories();
});

async function fetchCategories() {
  await categoryStore.fetchCategories({ page: page.value });
}

async function goToPage(nextPage) {
  if (!nextPage) return;
  if (
    categoryStore.meta &&
    (nextPage < 1 || nextPage > categoryStore.meta.last_page)
  )
    return;

  page.value = nextPage;
  await fetchCategories();
}

function rowNumber(index) {
  if (!categoryStore.meta) return index + 1;
  return (
    (categoryStore.meta.current_page - 1) * categoryStore.meta.per_page +
    index +
    1
  );
}

async function handleDelete(category) {
  const confirmed = await confirm({
    title: 'Delete Category',
    message: `Are you sure you want to delete "${category.name}"?`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
  });

  if (!confirmed) return;

  try {
    await categoryStore.removeCategory(category.id);
    notify.success('Category deleted successfully.');
    await fetchCategories();
  } catch (error) {
    notify.error(error.response?.data?.message || 'Failed to delete category.');
  }
}
</script>
