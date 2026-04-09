<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Edit Product</h2>
      <p class="text-sm text-gray-500 mt-1">Update product information</p>
    </div>

    <AppLoadingState
      v-if="productStore.loading || categoryStore.listLoading"
      message="Loading product..."
    />

    <ProductForm
      v-else
      :initial-values="productStore.product"
      :categories="categoryStore.categories"
      :errors="errors"
      :loading="productStore.submitLoading"
      submit-text="Update Product"
      @submit="handleUpdate"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product';
import { useCategoryStore } from '@/stores/category';
import { useFormErrors } from '@/composables/useFormErrors';
import { useNotify } from '@/composables/useNotify';
import { buildProductFormData } from '@/utils/productFormData';
import ProductForm from '@/components/products/ProductForm.vue';
import AppLoadingState from '@/components/feedback/AppLoadingState.vue';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const notify = useNotify();

const { errors, clearErrors, getErrorMessage } = useFormErrors();

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories({ per_page: 1000 }),
    productStore.fetchProduct(route.params.id),
  ]);
});

onUnmounted(() => {
  productStore.clearProduct();
});

async function handleUpdate(payload) {
  clearErrors();

  try {
    const formData = buildProductFormData(payload, true);
    await productStore.updateProduct(route.params.id, formData);
    notify.success('Product updated successfully.');
    await router.push('/products');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to update product.');
    if (message) notify.error(message);
  }
}
</script>
