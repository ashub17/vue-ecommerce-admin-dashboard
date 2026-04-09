<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Create Product</h2>
      <p class="text-sm text-gray-500 mt-1">
        Add a new product with featured and gallery images
      </p>
    </div>

    <AppLoadingState
      v-if="categoryStore.listLoading"
      message="Loading categories..."
    />

    <ProductForm
      v-else
      :categories="categoryStore.categories"
      :errors="errors"
      :loading="productStore.submitLoading"
      submit-text="Create Product"
      @submit="handleCreate"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product';
import { useCategoryStore } from '@/stores/category';
import { useFormErrors } from '@/composables/useFormErrors';
import { useNotify } from '@/composables/useNotify';
import { buildProductFormData } from '@/utils/productFormData';
import ProductForm from '@/components/products/ProductForm.vue';
import AppLoadingState from '@/components/feedback/AppLoadingState.vue';

const router = useRouter();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const notify = useNotify();

const { errors, clearErrors, getErrorMessage } = useFormErrors();

onMounted(() => {
  categoryStore.fetchCategories({ per_page: 1000 });
});

async function handleCreate(payload) {
  clearErrors();

  try {
    const formData = buildProductFormData(payload);
    await productStore.createProduct(formData);
    notify.success('Product created successfully.');
    await router.push('/products');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to create product.');
    if (message) notify.error(message);
  }
}
</script>
