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
import { useRouter } from 'vue-router';
import { useBannerStore } from '@/stores/banner';
import { useFormErrors } from '@/composables/useFormErrors';
import { useNotify } from '@/composables/useNotify';
import { buildBannerFormData } from '@/utils/bannerFormData';
import BannerForm from '@/components/banners/BannerForm.vue';

const router = useRouter();
const bannerStore = useBannerStore();
const notify = useNotify();

const { errors, clearErrors, getErrorMessage } = useFormErrors();

async function handleCreate(payload) {
  clearErrors();

  try {
    const formData = buildBannerFormData(payload);
    await bannerStore.createBanner(formData);
    notify.success('Banner created successfully.');
    await router.push('/banners');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to create banner.');
    if (message) notify.error(message);
  }
}
</script>
