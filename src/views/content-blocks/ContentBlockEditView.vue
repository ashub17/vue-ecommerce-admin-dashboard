<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Edit Content Block</h2>
      <p class="text-sm text-gray-500 mt-1">Update content block information</p>
    </div>

    <AppLoadingState
      v-if="contentBlockStore.loading"
      message="Loading content block..."
    />

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
import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContentBlockStore } from '@/stores/contentBlock';
import { useFormErrors } from '@/composables/useFormErrors';
import { useNotify } from '@/composables/useNotify';
import { buildContentBlockFormData } from '@/utils/contentBlockFormData';
import ContentBlockForm from '@/components/content-blocks/ContentBlockForm.vue';
import AppLoadingState from '@/components/feedback/AppLoadingState.vue';

const route = useRoute();
const router = useRouter();
const contentBlockStore = useContentBlockStore();
const notify = useNotify();

const { errors, clearErrors, getErrorMessage } = useFormErrors();

onMounted(async () => {
  try {
    await contentBlockStore.fetchContentBlock(route.params.id);
  } catch (error) {
    notify.error(
      error.response?.data?.message || 'Failed to load content block.',
    );
  }
});

onUnmounted(() => {
  contentBlockStore.clearContentBlock();
});

async function handleUpdate(payload) {
  clearErrors();

  try {
    const formData = buildContentBlockFormData(payload, true);
    await contentBlockStore.updateContentBlock(route.params.id, formData);
    notify.success('Content block updated successfully.');
    await router.push('/content-blocks');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to update content block.');
    if (message) notify.error(message);
  }
}
</script>
