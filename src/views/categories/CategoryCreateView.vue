<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Create Category</h2>
      <p class="text-sm text-gray-500 mt-1">Add a new category to your store</p>
    </div>

    <CategoryForm
      :errors="errors"
      :loading="categoryStore.submitLoading"
      submit-text="Create Category"
      @submit="handleCreate"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/category';
import { useFormErrors } from '@/composables/useFormErrors';
import { useNotify } from '@/composables/useNotify';
import CategoryForm from '@/components/categories/CategoryForm.vue';

const router = useRouter();
const categoryStore = useCategoryStore();
const notify = useNotify();

const { errors, clearErrors, getErrorMessage } = useFormErrors();

async function handleCreate(payload) {
  clearErrors();

  try {
    await categoryStore.createCategory(payload);
    notify.success('Category created successfully.');
    await router.push('/categories');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to create category.');
    if (message) notify.error(message);
  }
}
</script>
