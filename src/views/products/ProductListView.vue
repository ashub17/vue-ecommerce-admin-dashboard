<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Products</h2>
        <p class="text-sm text-gray-500 mt-1">Manage your store products</p>
      </div>

      <RouterLink
        to="/products/create"
        class="inline-flex items-center justify-center rounded-lg bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-black"
      >
        Add Product
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
              <th class="px-4 py-3">Image</th>
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">SKU</th>
              <th class="px-4 py-3">Price</th>
              <th class="px-4 py-3">Stock</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="productStore.listLoading">
              <td colspan="8" class="px-4 py-6 text-center text-gray-500">
                Loading products...
              </td>
            </tr>

            <tr
              v-for="(product, index) in productStore.products"
              :key="product.id"
              class="border-t border-gray-100"
            >
              <td class="px-4 py-3 text-gray-600">
                {{ rowNumber(index) }}
              </td>
              <td class="px-4 py-3">
                <img
                  v-if="product.featured_image || product.featured_image_url"
                  :src="
                    product.featured_image_url ||
                    buildImageUrl(product.featured_image)
                  "
                  alt="Product"
                  class="h-14 w-14 rounded-xl object-cover border border-gray-200"
                />
                <div
                  v-else
                  class="h-14 w-14 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400"
                >
                  No image
                </div>
              </td>

              <td class="px-4 py-3">
                <div class="font-medium text-gray-900">
                  {{ product.name }}
                </div>
                <div
                  v-if="product.is_featured"
                  class="text-xs text-blue-600 mt-1"
                >
                  Featured
                </div>
              </td>

              <td class="px-4 py-3 text-gray-600">
                {{ product.sku }}
              </td>

              <td class="px-4 py-3 text-gray-600">
                <div>{{ formatCurrency(product.price) }}</div>
                <div v-if="product.sale_price" class="text-xs text-green-600">
                  Sale: {{ formatCurrency(product.sale_price) }}
                </div>
              </td>

              <td class="px-4 py-3 text-gray-600">
                {{ product.stock_quantity }}
              </td>

              <td class="px-4 py-3">
                <span
                  class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="
                    product.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  "
                >
                  {{ product.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>

              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <RouterLink
                    :to="`/products/${product.id}/edit`"
                    class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </RouterLink>

                  <button
                    @click="handleDelete(product)"
                    class="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>

            <tr
              v-if="!productStore.listLoading && !productStore.products.length"
            >
              <td colspan="7" class="px-4 py-6 text-center text-gray-500">
                No products found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="productStore.meta"
      class="flex items-center justify-between bg-white rounded-2xl border border-gray-200 px-4 py-3"
    >
      <p class="text-sm text-gray-500">
        Page {{ currentPage }} of {{ productStore.meta.last_page }}
      </p>

      <div class="flex items-center gap-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
        >
          Prev
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= productStore.meta.last_page"
          class="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useProductStore } from '@/stores/product';
import { buildImageUrl, formatCurrency } from '@/utils/helpers';

const productStore = useProductStore();
const page = ref(1);

const currentPage = computed(
  () => productStore.meta?.current_page || page.value,
);

onMounted(() => {
  fetchProducts();
});

async function fetchProducts() {
  await productStore.fetchProducts({ page: page.value });
}

async function goToPage(nextPage) {
  page.value = nextPage;
  await fetchProducts();
}

async function handleDelete(product) {
  const confirmed = window.confirm(`Delete product "${product.name}"?`);
  if (!confirmed) return;

  try {
    await productStore.removeProduct(product.id);
    await fetchProducts();
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to delete product.');
  }
}
function rowNumber(index) {
  if (!productStore.meta) return index + 1;
  return (
    (productStore.meta.current_page - 1) * productStore.meta.per_page +
    index +
    1
  );
}
</script>
