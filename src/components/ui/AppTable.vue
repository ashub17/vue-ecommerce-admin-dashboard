<template>
  <div
    class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
  >
    <div v-if="$slots.header" class="p-4 border-b border-gray-200">
      <slot name="header" />
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <slot />
      </table>
    </div>
  </div>
</template>

<script setup></script>
