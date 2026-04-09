<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AppInput
          v-model="form.title"
          label="Title"
          placeholder="Enter banner title"
          :error="errors.title?.[0] || errors.title"
        />

        <AppInput
          v-model="form.sort_order"
          type="number"
          label="Sort Order"
          placeholder="1"
          :error="errors.sort_order?.[0] || errors.sort_order"
        />
      </div>

      <AppTextarea
        v-model="form.subtitle"
        label="Subtitle"
        placeholder="Enter banner subtitle"
        :rows="4"
        :error="errors.subtitle?.[0] || errors.subtitle"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AppInput
          v-model="form.button_text"
          label="Button Text"
          placeholder="Shop Now"
          :error="errors.button_text?.[0] || errors.button_text"
        />

        <AppInput
          v-model="form.button_link"
          label="Button Link"
          placeholder="/shop"
          :error="errors.button_link?.[0] || errors.button_link"
        />
      </div>

      <div class="flex items-end">
        <label class="inline-flex items-center gap-2">
          <input
            v-model="form.is_active"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300"
          />
          <span class="text-sm text-gray-700">Active</span>
        </label>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Banner Image
        </label>

        <input
          type="file"
          accept="image/*"
          @change="handleImageChange"
          class="block w-full text-sm text-gray-700"
        />

        <p v-if="errors.image" class="text-sm text-red-500 mt-1">
          {{ errors.image[0] || errors.image }}
        </p>

        <div v-if="imagePreview" class="mt-4">
          <img
            :src="imagePreview"
            alt="Banner preview"
            class="h-32 w-full max-w-md rounded-xl object-cover border border-gray-200"
          />
        </div>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <AppButton type="submit" :loading="loading" loading-text="Saving...">
          {{ submitText }}
        </AppButton>

        <RouterLink
          to="/banners"
          class="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';
import AppTextarea from '@/components/ui/AppTextarea.vue';
import { buildImageUrl } from '@/utils/helpers';

const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({}),
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
  loading: Boolean,
  submitText: {
    type: String,
    default: 'Save Banner',
  },
});

const emit = defineEmits(['submit']);

const form = reactive({
  title: '',
  subtitle: '',
  button_text: '',
  button_link: '',
  sort_order: '',
  is_active: true,
  image: null,
});

const imagePreview = ref('');

watch(
  () => props.initialValues,
  (values) => {
    form.title = values?.title ?? '';
    form.subtitle = values?.subtitle ?? '';
    form.button_text = values?.button_text ?? '';
    form.button_link = values?.button_link ?? '';
    form.sort_order = values?.sort_order ?? '';
    form.is_active = values?.is_active ?? true;
    form.image = null;

    imagePreview.value =
      values?.image_url || (values?.image ? buildImageUrl(values.image) : '');
  },
  { immediate: true, deep: true },
);

function handleImageChange(event) {
  const file = event.target.files?.[0] || null;
  form.image = file;

  if (file) {
    imagePreview.value = URL.createObjectURL(file);
  }
}

function handleSubmit() {
  emit('submit', {
    title: form.title,
    subtitle: form.subtitle,
    button_text: form.button_text,
    button_link: form.button_link,
    sort_order: form.sort_order,
    is_active: form.is_active,
    image: form.image,
  });
}
</script>
