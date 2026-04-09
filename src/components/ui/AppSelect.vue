<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>

    <select
      :value="modelValue"
      :disabled="disabled"
      class="w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2"
      :class="[
        error
          ? 'border-red-300 focus:ring-red-400'
          : 'border-gray-300 focus:ring-gray-900',
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
      ]"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="placeholder" value="">
        {{ placeholder }}
      </option>

      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <p v-if="error" class="text-sm text-red-500 mt-1">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number, Boolean],
  label: String,
  placeholder: String,
  options: {
    type: Array,
    default: () => [],
  },
  error: String,
  disabled: Boolean,
});

defineEmits(['update:modelValue']);
</script>
