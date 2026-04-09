import { useUiStore } from '@/stores/ui';

export function useNotify() {
  const uiStore = useUiStore();

  return {
    success: (message, title) => uiStore.success(message, title),
    error: (message, title) => uiStore.error(message, title),
    info: (message, title) => uiStore.info(message, title),
    warning: (message, title) => uiStore.warning(message, title),
  };
}
