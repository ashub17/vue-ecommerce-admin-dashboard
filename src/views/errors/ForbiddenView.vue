<template>
  <AuthLayout>
    <div
      class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center"
    >
      <p class="text-5xl font-bold text-gray-900">403</p>

      <h1 class="text-xl font-semibold text-gray-900 mt-4">Access denied</h1>

      <p class="text-sm text-gray-500 mt-2">
        Your account does not have permission to use the admin dashboard. Sign
        in with an administrator account to continue.
      </p>

      <div class="mt-6 flex items-center justify-center gap-3">
        <AppButton variant="secondary" @click="goBack">Go back</AppButton>
        <AppButton @click="signOut">Sign in as admin</AppButton>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AuthLayout from '@/layouts/AuthLayout.vue';
import AppButton from '@/components/ui/AppButton.vue';

const router = useRouter();
const authStore = useAuthStore();

function goBack() {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  router.replace('/login');
}

async function signOut() {
  await authStore.logout();
  await router.replace('/login');
}
</script>
