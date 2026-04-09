<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AppSelect
          v-model="form.category_id"
          label="Category"
          placeholder="Select category"
          :options="categoryOptions"
          :error="errors.category_id?.[0] || errors.category_id"
        />

        <AppInput
          v-model="form.name"
          label="Product Name"
          placeholder="Enter product name"
          :error="errors.name?.[0] || errors.name"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AppInput
          v-model="form.sku"
          label="SKU"
          placeholder="Enter SKU"
          :error="errors.sku?.[0] || errors.sku"
        />

        <AppInput
          v-model="form.slug"
          label="Slug"
          placeholder="Enter slug"
          :error="errors.slug?.[0] || errors.slug"
        />
      </div>

      <AppTextarea
        v-model="form.short_description"
        label="Short Description"
        placeholder="Enter short description"
        :rows="3"
        :error="errors.short_description?.[0] || errors.short_description"
      />

      <AppTextarea
        v-model="form.description"
        label="Description"
        placeholder="Enter full description"
        :rows="5"
        :error="errors.description?.[0] || errors.description"
      />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AppInput
          v-model="form.price"
          type="number"
          label="Price"
          placeholder="0.00"
          :error="errors.price?.[0] || errors.price"
        />

        <AppInput
          v-model="form.sale_price"
          type="number"
          label="Sale Price"
          placeholder="0.00"
          :error="errors.sale_price?.[0] || errors.sale_price"
        />

        <AppInput
          v-model="form.stock_quantity"
          type="number"
          label="Stock Quantity"
          placeholder="0"
          :error="errors.stock_quantity?.[0] || errors.stock_quantity"
        />
      </div>

      <div class="flex flex-wrap items-center gap-6">
        <label class="inline-flex items-center gap-2">
          <input
            v-model="form.is_active"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300"
          />
          <span class="text-sm text-gray-700">Active</span>
        </label>

        <label class="inline-flex items-center gap-2">
          <input
            v-model="form.is_featured"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300"
          />
          <span class="text-sm text-gray-700">Featured</span>
        </label>

        <label class="inline-flex items-center gap-2">
          <input
            v-model="form.replace_gallery"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300"
          />
          <span class="text-sm text-gray-700">Replace Gallery</span>
        </label>
      </div>

      <p v-if="form.replace_gallery" class="text-sm text-amber-600">
        Uploading new gallery images will replace the existing gallery on
        update.
      </p>

      <div class="border-t border-gray-200 pt-6 space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>

          <input
            type="file"
            accept="image/*"
            @change="handleFeaturedImage"
            class="block w-full text-sm text-gray-700"
          />

          <p v-if="errors.featured_image" class="text-sm text-red-500 mt-1">
            {{ errors.featured_image[0] || errors.featured_image }}
          </p>

          <div v-if="featuredImagePreview" class="mt-4">
            <img
              :src="featuredImagePreview"
              alt="Featured preview"
              class="h-28 w-28 rounded-xl object-cover border border-gray-200"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">
              Gallery Images
            </label>

            <button
              type="button"
              @click="addGalleryRow"
              class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Add Image Row
            </button>
          </div>

          <div class="space-y-3">
            <div
              v-for="(item, index) in galleryInputs"
              :key="index"
              class="grid grid-cols-1 md:grid-cols-12 gap-3 items-start rounded-xl border border-gray-200 p-4"
            >
              <div class="md:col-span-6">
                <label class="block text-xs font-medium text-gray-600 mb-1">
                  Image File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  @change="(e) => handleGalleryImage(index, e)"
                  class="block w-full text-sm text-gray-700"
                />
              </div>

              <div class="md:col-span-3">
                <AppInput
                  v-model="item.sort_order"
                  type="number"
                  label="Sort Order"
                  placeholder="1"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">
                  Preview
                </label>
                <div v-if="item.preview" class="h-20 w-20">
                  <img
                    :src="item.preview"
                    alt="Gallery preview"
                    class="h-20 w-20 rounded-xl object-cover border border-gray-200"
                  />
                </div>
                <div
                  v-else
                  class="h-20 w-20 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400"
                >
                  No image
                </div>
              </div>

              <div class="md:col-span-1 flex md:justify-end">
                <button
                  type="button"
                  @click="removeGalleryRow(index)"
                  class="rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <p v-if="errors.images" class="text-sm text-red-500 mt-2">
            {{ errors.images[0] || errors.images }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <AppButton type="submit" :loading="loading" loading-text="Saving...">
          {{ submitText }}
        </AppButton>

        <RouterLink
          to="/products"
          class="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';
import AppTextarea from '@/components/ui/AppTextarea.vue';
import AppSelect from '@/components/ui/AppSelect.vue';
import { buildImageUrl, makeSlug } from '@/utils/helpers';

const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({}),
  },
  categories: {
    type: Array,
    default: () => [],
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
  loading: Boolean,
  submitText: {
    type: String,
    default: 'Save Product',
  },
});

const emit = defineEmits(['submit']);

const form = reactive({
  category_id: '',
  name: '',
  sku: '',
  slug: '',
  short_description: '',
  description: '',
  price: '',
  sale_price: '',
  stock_quantity: '',
  is_active: true,
  is_featured: false,
  replace_gallery: false,
  featured_image: null,
});

const featuredImagePreview = ref('');
const galleryInputs = ref([]);

const categoryOptions = computed(() =>
  props.categories.map((category) => ({
    label: category.name,
    value: String(category.id),
  })),
);

watch(
  () => props.initialValues,
  (values) => {
    form.category_id = values?.category_id ? String(values.category_id) : '';
    form.name = values?.name ?? '';
    form.sku = values?.sku ?? '';
    form.slug = values?.slug ?? '';
    form.short_description = values?.short_description ?? '';
    form.description = values?.description ?? '';
    form.price = values?.price ?? '';
    form.sale_price = values?.sale_price ?? '';
    form.stock_quantity = values?.stock_quantity ?? '';
    form.is_active = values?.is_active ?? true;
    form.is_featured = values?.is_featured ?? false;
    form.replace_gallery = false;
    form.featured_image = null;

    featuredImagePreview.value =
      values?.featured_image_url ||
      (values?.featured_image ? buildImageUrl(values.featured_image) : '');

    galleryInputs.value = Array.isArray(values?.images)
      ? values.images.map((image, index) => ({
          file: null,
          sort_order: image.sort_order ?? index + 1,
          preview:
            image.image_url ||
            (image.image_path ? buildImageUrl(image.image_path) : ''),
          existing_id: image.id ?? null,
        }))
      : [];
  },
  { immediate: true, deep: true },
);

watch(
  () => form.name,
  (value) => {
    if (!props.initialValues?.id && !form.slug) {
      form.slug = makeSlug(value);
    }
  },
);

watch(
  () => form.replace_gallery,
  (enabled) => {
    if (enabled && galleryInputs.value.length === 0) {
      galleryInputs.value.push(
        { file: null, sort_order: 1, preview: '', existing_id: null },
        { file: null, sort_order: 2, preview: '', existing_id: null },
      );
    }
  },
);

function handleFeaturedImage(event) {
  const file = event.target.files?.[0] || null;
  form.featured_image = file;

  if (file) {
    featuredImagePreview.value = URL.createObjectURL(file);
  }
}

function handleGalleryImage(index, event) {
  const file = event.target.files?.[0] || null;
  if (!file) return;

  galleryInputs.value[index].file = file;
  galleryInputs.value[index].preview = URL.createObjectURL(file);
}

function addGalleryRow() {
  galleryInputs.value.push({
    file: null,
    sort_order: galleryInputs.value.length + 1,
    preview: '',
    existing_id: null,
  });
}

function removeGalleryRow(index) {
  galleryInputs.value.splice(index, 1);
}

function handleSubmit() {
  emit('submit', {
    category_id: form.category_id,
    name: form.name,
    sku: form.sku,
    slug: form.slug,
    short_description: form.short_description,
    description: form.description,
    price: form.price,
    sale_price: form.sale_price,
    stock_quantity: form.stock_quantity,
    is_active: form.is_active,
    is_featured: form.is_featured,
    replace_gallery: form.replace_gallery,
    featured_image: form.featured_image,
    images: galleryInputs.value,
  });
}
</script>
