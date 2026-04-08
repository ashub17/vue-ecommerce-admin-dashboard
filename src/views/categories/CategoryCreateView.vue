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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/category';
import CategoryForm from '@/components/categories/CategoryForm.vue';

const router = useRouter();
const categoryStore = useCategoryStore();
const errors = ref({});

async function handleCreate(payload) {
  errors.value = {};

  try {
    await categoryStore.createCategory(payload);
    router.push('/categories');
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    } else {
      alert(error.response?.data?.message || 'Failed to create category.');
    }
  }
}
</script>
