<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Edit Banner</h2>
      <p class="text-sm text-gray-500 mt-1">Update banner information</p>
    </div>

    <div
      v-if="bannerStore.loading"
      class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-gray-500"
    >
      Loading banner...
    </div>

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
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBannerStore } from '@/stores/banner';
import BannerForm from '@/components/banners/BannerForm.vue';
import { buildBannerFormData } from '@/utils/bannerFormData';

const route = useRoute();
const router = useRouter();
const bannerStore = useBannerStore();
const errors = ref({});

onMounted(() => {
  bannerStore.fetchBanner(route.params.id);
});

onUnmounted(() => {
  bannerStore.clearBanner();
});

async function handleUpdate(payload) {
  errors.value = {};

  try {
    const formData = buildBannerFormData(payload, true);
    await bannerStore.updateBanner(route.params.id, formData);
    router.push('/banners');
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    } else {
      alert(error.response?.data?.message || 'Failed to update banner.');
    }
  }
}
</script>
