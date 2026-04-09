import { defineStore } from 'pinia';

export const useConfirmStore = defineStore('confirm', {
  state: () => ({
    isOpen: false,
    title: 'Are you sure?',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'danger',
    resolver: null,
  }),

  actions: {
    open(options = {}) {
      this.isOpen = true;
      this.title = options.title || 'Are you sure?';
      this.message = options.message || '';
      this.confirmText = options.confirmText || 'Confirm';
      this.cancelText = options.cancelText || 'Cancel';
      this.variant = options.variant || 'danger';

      return new Promise((resolve) => {
        this.resolver = resolve;
      });
    },

    confirm() {
      if (this.resolver) this.resolver(true);
      this.reset();
    },

    cancel() {
      if (this.resolver) this.resolver(false);
      this.reset();
    },

    reset() {
      this.isOpen = false;
      this.message = '';
      this.resolver = null;
    },
  },
});
