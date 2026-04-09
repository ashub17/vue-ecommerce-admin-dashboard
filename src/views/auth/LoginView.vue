<template>
  <AuthLayout>
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-gray-900">Admin Login</h1>
        <p class="text-sm text-gray-500 mt-2">
          Sign in to access the admin dashboard
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            v-model="form.email"
            type="email"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="admin@example.com"
            autocomplete="email"
          />
          <p v-if="errors.email" class="text-sm text-red-500 mt-1">
            {{ errors.email[0] || errors.email }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            v-model="form.password"
            type="password"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="••••••••"
            autocomplete="current-password"
          />
          <p v-if="errors.password" class="text-sm text-red-500 mt-1">
            {{ errors.password[0] || errors.password }}
          </p>
        </div>

        <p v-if="message" class="text-sm text-red-500">
          {{ message }}
        </p>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full bg-gray-900 text-white rounded-lg px-4 py-2.5 hover:bg-black disabled:opacity-50"
        >
          {{ authStore.loading ? 'Signing in...' : 'Login' }}
        </button>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AuthLayout from '@/layouts/AuthLayout.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: '',
});

const errors = ref({});
const message = ref('');

async function handleLogin() {
  errors.value = {};
  message.value = '';

  try {
    await authStore.login({
      email: form.email,
      password: form.password,
    });

    await router.replace('/dashboard');
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
      return;
    }

    if (error.response?.status === 401) {
      message.value = error.response.data?.message || 'Invalid credentials.';
      return;
    }

    message.value =
      error.response?.data?.message || 'Login failed. Please try again.';
    console.error('Login error:', error);
  }
}
</script>
