<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <AppInput
        v-model="form.name"
        label="Category Name"
        placeholder="Enter category name"
        :error="errors.name?.[0] || errors.name"
      />

      <AppInput
        v-model="form.slug"
        label="Slug"
        placeholder="Enter category slug"
        :error="errors.slug?.[0] || errors.slug"
      />

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>

        <textarea
          v-model="form.description"
          rows="4"
          placeholder="Enter category description"
          class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
        ></textarea>

        <p v-if="errors.description" class="text-sm text-red-500 mt-1">
          {{ errors.description[0] || errors.description }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <input
          id="is_active"
          v-model="form.is_active"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300"
        />
        <label for="is_active" class="text-sm text-gray-700"> Active </label>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <AppButton type="submit" :loading="loading" loading-text="Saving...">
          {{ submitText }}
        </AppButton>

        <RouterLink
          to="/categories"
          class="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';
import { makeSlug } from '@/utils/helpers';

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
    default: 'Save Category',
  },
});

const emit = defineEmits(['submit']);

const form = reactive({
  name: '',
  slug: '',
  description: '',
  is_active: true,
});

watch(
  () => props.initialValues,
  (values) => {
    form.name = values?.name ?? '';
    form.slug = values?.slug ?? '';
    form.description = values?.description ?? '';
    form.is_active = values?.is_active ?? true;
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

function handleSubmit() {
  emit('submit', {
    name: form.name,
    slug: form.slug,
    description: form.description,
    is_active: form.is_active,
  });
}
</script>
