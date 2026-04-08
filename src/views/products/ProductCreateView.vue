<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Create Product</h2>
      <p class="text-sm text-gray-500 mt-1">
        Add a new product with featured and gallery images
      </p>
    </div>

    <div
      v-if="categoryStore.listLoading"
      class="bg-white rounded-2xl border border-gray-200 p-6"
    >
      Loading categories...
    </div>

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
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product';
import { useCategoryStore } from '@/stores/category';
import ProductForm from '@/components/products/ProductForm.vue';
import { buildProductFormData } from '@/utils/productFormData';

const router = useRouter();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const errors = ref({});

onMounted(() => {
  categoryStore.fetchCategories();
});

async function handleCreate(payload) {
  errors.value = {};

  try {
    const formData = buildProductFormData(payload);
    await productStore.createProduct(formData);
    router.push('/products');
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    } else {
      alert(error.response?.data?.message || 'Failed to create product.');
    }
  }
}
</script>
