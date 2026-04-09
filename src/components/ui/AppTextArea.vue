<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>

    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      class="w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2"
      :class="[
        error
          ? 'border-red-300 focus:ring-red-400'
          : 'border-gray-300 focus:ring-gray-900',
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
      ]"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>

    <p v-if="error" class="text-sm text-red-500 mt-1">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  rows: {
    type: [String, Number],
    default: 4,
  },
  error: String,
  disabled: Boolean,
});

defineEmits(['update:modelValue']);
</script>
