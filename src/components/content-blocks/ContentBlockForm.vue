<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AppInput
          v-model="form.key"
          label="Key"
          placeholder="home_about"
          :error="errors.key?.[0] || errors.key"
        />

        <AppInput
          v-model="form.title"
          label="Title"
          placeholder="About Our Store"
          :error="errors.title?.[0] || errors.title"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          v-model="form.content"
          rows="6"
          placeholder="Enter content block text"
          class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
        ></textarea>

        <p v-if="errors.content" class="text-sm text-red-500 mt-1">
          {{ errors.content[0] || errors.content }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Meta (JSON)
        </label>
        <textarea
          v-model="form.metaText"
          rows="6"
          placeholder='{"section":"homepage","style":"light"}'
          class="w-full rounded-lg border border-gray-300 px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        ></textarea>

        <p v-if="metaError" class="text-sm text-red-500 mt-1">
          {{ metaError }}
        </p>

        <p v-else-if="errors.meta" class="text-sm text-red-500 mt-1">
          {{ errors.meta[0] || errors.meta }}
        </p>
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
          Image
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
            alt="Content block preview"
            class="h-32 w-full max-w-md rounded-xl object-cover border border-gray-200"
          />
        </div>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <AppButton type="submit" :loading="loading" loading-text="Saving...">
          {{ submitText }}
        </AppButton>

        <RouterLink
          to="/content-blocks"
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
    default: 'Save Content Block',
  },
});

const emit = defineEmits(['submit']);

const form = reactive({
  key: '',
  title: '',
  content: '',
  metaText: '',
  is_active: true,
  image: null,
});

const imagePreview = ref('');
const metaError = ref('');

watch(
  () => props.initialValues,
  (values) => {
    form.key = values?.key ?? '';
    form.title = values?.title ?? '';
    form.content = values?.content ?? '';
    form.is_active = values?.is_active ?? true;
    form.image = null;

    if (typeof values?.meta === 'string') {
      form.metaText = values.meta;
    } else if (values?.meta && typeof values.meta === 'object') {
      form.metaText = JSON.stringify(values.meta, null, 2);
    } else {
      form.metaText = '';
    }

    imagePreview.value =
      values?.image_url || (values?.image ? buildImageUrl(values.image) : '');

    metaError.value = '';
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
  metaError.value = '';

  let parsedMeta = null;

  if (form.metaText?.trim()) {
    try {
      parsedMeta = JSON.parse(form.metaText);
    } catch {
      metaError.value = 'Meta must be valid JSON.';
      return;
    }
  }

  emit('submit', {
    key: form.key,
    title: form.title,
    content: form.content,
    is_active: form.is_active,
    meta: parsedMeta,
    image: form.image,
  });
}
</script>
