import { ref } from 'vue';

export function useFormErrors() {
  const errors = ref({});

  function clearErrors() {
    errors.value = {};
  }

  function setErrors(newErrors = {}) {
    errors.value = newErrors;
  }

  function getErrorMessage(error, fallback = 'Something went wrong.') {
    if (error?.response?.status === 422) {
      errors.value = error.response.data.errors || {};
      return null;
    }

    return error?.response?.data?.message || fallback;
  }

  return {
    errors,
    clearErrors,
    setErrors,
    getErrorMessage,
  };
}
