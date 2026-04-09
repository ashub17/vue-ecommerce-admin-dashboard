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

    <div
      class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
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
              <td class="px-4 py-3">
                {{ index + 1 }}
              </td>
              <td class="px-4 py-3 font-medium text-gray-900">
                {{ category.name }}
              </td>
              <td class="px-4 py-3 text-gray-600">
                {{ category.slug }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="
                    category.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  "
                >
                  {{ category.is_active ? 'Active' : 'Inactive' }}
                </span>
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
              v-if="
                !categoryStore.listLoading && !categoryStore.categories.length
              "
            >
              <td colspan="5" class="px-4 py-6 text-center text-gray-500">
                No categories found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="message"
      class="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
    >
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { useConfirm } from '@/composables/useConfirm';
import { useNotify } from '@/composables/useNotify';

const categoryStore = useCategoryStore();
const { confirm } = useConfirm();
const notify = useNotify();

onMounted(() => {
  categoryStore.fetchCategories();
});

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
    await categoryStore.fetchCategories();
  } catch (error) {
    notify.error(error.response?.data?.message || 'Failed to delete category.');
  }
}
</script>
