<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Edit Category</h2>
      <p class="text-sm text-gray-500 mt-1">Update category information</p>
    </div>

    <div
      v-if="categoryStore.loading"
      class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-gray-500"
    >
      Loading category...
    </div>

    <CategoryForm
      v-else
      :initial-values="categoryStore.category"
      :errors="errors"
      :loading="categoryStore.submitLoading"
      submit-text="Update Category"
      @submit="handleUpdate"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/category';
import CategoryForm from '@/components/categories/CategoryForm.vue';

const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();
const errors = ref({});

onMounted(() => {
  categoryStore.fetchCategory(route.params.id);
});

onUnmounted(() => {
  categoryStore.clearCategory();
});

async function handleUpdate(payload) {
  errors.value = {};

  try {
    await categoryStore.updateCategory(route.params.id, payload);
    router.push('/categories');
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    } else {
      alert(error.response?.data?.message || 'Failed to update category.');
    }
  }
}
</script>
