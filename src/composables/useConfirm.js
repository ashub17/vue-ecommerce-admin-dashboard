import { useConfirmStore } from '@/stores/confirm';

export function useConfirm() {
  const confirmStore = useConfirmStore();

  function confirm(options) {
    return confirmStore.open(options);
  }

  return { confirm };
}
