<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Edit Banner</h2>
      <p class="text-sm text-gray-500 mt-1">Update banner information</p>
    </div>

    <AppLoadingState v-if="bannerStore.loading" message="Loading banner..." />

    <BannerForm
      v-else
      :initial-values="bannerStore.banner"
      :errors="errors"
      :loading="bannerStore.submitLoading"
      submit-text="Update Banner"
      @submit="handleUpdate"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBannerStore } from '@/stores/banner';
import { useFormErrors } from '@/composables/useFormErrors';
import { useNotify } from '@/composables/useNotify';
import { buildBannerFormData } from '@/utils/bannerFormData';
import BannerForm from '@/components/banners/BannerForm.vue';
import AppLoadingState from '@/components/feedback/AppLoadingState.vue';

const route = useRoute();
const router = useRouter();
const bannerStore = useBannerStore();
const notify = useNotify();

const { errors, clearErrors, getErrorMessage } = useFormErrors();

onMounted(() => {
  bannerStore.fetchBanner(route.params.id);
});

onUnmounted(() => {
  bannerStore.clearBanner();
});

async function handleUpdate(payload) {
  clearErrors();

  try {
    const formData = buildBannerFormData(payload, true);
    await bannerStore.updateBanner(route.params.id, formData);
    notify.success('Banner updated successfully.');
    await router.push('/banners');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to update banner.');
    if (message) notify.error(message);
  }
}
</script>
