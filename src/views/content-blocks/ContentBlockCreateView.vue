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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useContentBlockStore } from '@/stores/contentBlock';
import ContentBlockForm from '@/components/content-blocks/ContentBlockForm.vue';
import { buildContentBlockFormData } from '@/utils/contentBlockFormData';

const router = useRouter();
const contentBlockStore = useContentBlockStore();
const errors = ref({});

async function handleCreate(payload) {
  errors.value = {};

  try {
    const formData = buildContentBlockFormData(payload);
    await contentBlockStore.createContentBlock(formData);
    router.push('/content-blocks');
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    } else {
      alert(error.response?.data?.message || 'Failed to create content block.');
    }
  }
}
</script>
