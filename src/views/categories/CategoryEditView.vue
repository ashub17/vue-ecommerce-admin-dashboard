<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Edit Category</h2>
      <p class="text-sm text-gray-500 mt-1">Update category information</p>
    </div>

    <AppLoadingState
      v-if="categoryStore.loading"
      message="Loading category..."
    />

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
import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/category';
import { useFormErrors } from '@/composables/useFormErrors';
import { useNotify } from '@/composables/useNotify';
import CategoryForm from '@/components/categories/CategoryForm.vue';
import AppLoadingState from '@/components/feedback/AppLoadingState.vue';

const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();
const notify = useNotify();

const { errors, clearErrors, getErrorMessage } = useFormErrors();

onMounted(() => {
  categoryStore.fetchCategory(route.params.id);
});

onUnmounted(() => {
  categoryStore.clearCategory();
});

async function handleUpdate(payload) {
  clearErrors();

  try {
    await categoryStore.updateCategory(route.params.id, payload);
    notify.success('Category updated successfully.');
    await router.push('/categories');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to update category.');
    if (message) notify.error(message);
  }
}
</script>
