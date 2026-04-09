<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Create Banner</h2>
      <p class="text-sm text-gray-500 mt-1">
        Add a new banner for the storefront
      </p>
    </div>

    <BannerForm
      :errors="errors"
      :loading="bannerStore.submitLoading"
      submit-text="Create Banner"
      @submit="handleCreate"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBannerStore } from '@/stores/banner';
import BannerForm from '@/components/banners/BannerForm.vue';
import { buildBannerFormData } from '@/utils/bannerFormData';

const router = useRouter();
const bannerStore = useBannerStore();
const errors = ref({});

async function handleCreate(payload) {
  errors.value = {};

  try {
    const formData = buildBannerFormData(payload);
    await bannerStore.createBanner(formData);
    router.push('/banners');
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
    } else {
      alert(error.response?.data?.message || 'Failed to create banner.');
    }
  }
}
</script>
