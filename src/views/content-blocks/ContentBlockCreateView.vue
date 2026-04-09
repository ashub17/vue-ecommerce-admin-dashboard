<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Create Content Block</h2>
      <p class="text-sm text-gray-500 mt-1">
        Add a new dynamic content section
      </p>
    </div>

    <ContentBlockForm
      :errors="errors"
      :loading="contentBlockStore.submitLoading"
      submit-text="Create Content Block"
      @submit="handleCreate"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useContentBlockStore } from '@/stores/contentBlock';
import { useFormErrors } from '@/composables/useFormErrors';
import { useNotify } from '@/composables/useNotify';
import { buildContentBlockFormData } from '@/utils/contentBlockFormData';
import ContentBlockForm from '@/components/content-blocks/ContentBlockForm.vue';

const router = useRouter();
const contentBlockStore = useContentBlockStore();
const notify = useNotify();

const { errors, clearErrors, getErrorMessage } = useFormErrors();

async function handleCreate(payload) {
  clearErrors();

  try {
    const formData = buildContentBlockFormData(payload);
    await contentBlockStore.createContentBlock(formData);
    notify.success('Content block created successfully.');
    await router.push('/content-blocks');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to create content block.');
    if (message) notify.error(message);
  }
}
</script>
