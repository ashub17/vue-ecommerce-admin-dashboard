import { defineStore } from 'pinia';

let toastId = 1;

export const useUiStore = defineStore('ui', {
  state: () => ({
    toasts: [],
  }),

  actions: {
    addToast(payload) {
      const id = toastId++;

      const toast = {
        id,
        type: payload.type || 'success',
        title: payload.title || '',
        message: payload.message || '',
        duration: payload.duration ?? 3000,
      };

      this.toasts.push(toast);

      if (toast.duration > 0) {
        setTimeout(() => {
          this.removeToast(id);
        }, toast.duration);
      }

      return id;
    },

    removeToast(id) {
      this.toasts = this.toasts.filter((toast) => toast.id !== id);
    },

    success(message, title = 'Success') {
      this.addToast({ type: 'success', title, message });
    },

    error(message, title = 'Error') {
      this.addToast({ type: 'error', title, message, duration: 4000 });
    },

    info(message, title = 'Info') {
      this.addToast({ type: 'info', title, message });
    },

    warning(message, title = 'Warning') {
      this.addToast({ type: 'warning', title, message, duration: 4000 });
    },
  },
});
