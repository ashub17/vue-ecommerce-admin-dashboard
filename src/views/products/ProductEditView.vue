<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Edit Product</h2>
      <p class="text-sm text-gray-500 mt-1">Update product information</p>
    </div>

    <div
      v-if="productStore.loading || categoryStore.listLoading"
      class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-gray-500"
    >
      Loading product...
    </div>

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
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product';
import { useCategoryStore } from '@/stores/category';
import ProductForm from '@/components/products/ProductForm.vue';
import { buildProductFormData } from '@/utils/productFormData';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const errors = ref({});

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    productStore.fetchProduct(route.params.id),
  ]);
});

onUnmounted(() => {
  productStore.clearProduct();
});

async function handleUpdate(payload) {
  errors.value = {};

  try {
    const formData = buildProductFormData(payload, true);
    await productStore.updateProduct(route.params.id, formData);
    router.push('/products');
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    } else {
      alert(error.response?.data?.message || 'Failed to update product.');
    }
  }
}
</script>
