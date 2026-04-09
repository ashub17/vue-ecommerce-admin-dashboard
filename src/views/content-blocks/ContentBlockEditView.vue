<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Edit Content Block</h2>
      <p class="text-sm text-gray-500 mt-1">Update content block information</p>
    </div>

    <div
      v-if="contentBlockStore.loading"
      class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-gray-500"
    >
      Loading content block...
    </div>

    <ContentBlockForm
      v-else
      :initial-values="contentBlockStore.contentBlock"
      :errors="errors"
      :loading="contentBlockStore.submitLoading"
      submit-text="Update Content Block"
      @submit="handleUpdate"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContentBlockStore } from '@/stores/contentBlock';
import ContentBlockForm from '@/components/content-blocks/ContentBlockForm.vue';
import { buildContentBlockFormData } from '@/utils/contentBlockFormData';

const route = useRoute();
const router = useRouter();
const contentBlockStore = useContentBlockStore();
const errors = ref({});

onMounted(() => {
  contentBlockStore.fetchContentBlock(route.params.id);
});

onUnmounted(() => {
  contentBlockStore.clearContentBlock();
});

async function handleUpdate(payload) {
  errors.value = {};

  try {
    const formData = buildContentBlockFormData(payload, true);
    await contentBlockStore.updateContentBlock(route.params.id, formData);
    router.push('/content-blocks');
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    } else {
      alert(error.response?.data?.message || 'Failed to update content block.');
    }
  }
}
</script>
