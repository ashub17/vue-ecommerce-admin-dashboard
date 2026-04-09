<template>
  <RouterView />
  <AppToastContainer />
  <AppConfirmModal />
</template>

<script setup>
import AppToastContainer from '@/components/feedback/AppToastContainer.vue';
import AppConfirmModal from '@/components/feedback/AppConfirmModal.vue';
</script>
