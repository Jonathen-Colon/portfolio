import { useSyncExternalStore } from 'react';

const FINE_POINTER_MQ = '(hover: hover) and (pointer: fine)';

export function useFinePointer() {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined') return () => {};
      const mq = window.matchMedia(FINE_POINTER_MQ);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => (typeof window !== 'undefined' ? window.matchMedia(FINE_POINTER_MQ).matches : false),
    () => false
  );
}

/** Narrow nav sheet or no primary hover — use click to toggle dropdowns */
const NEED_CLICK_NAV_MENU_MQ = '(max-width: 980px), (hover: none)';

export function useNeedClickNavMenu() {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined') return () => {};
      const mq = window.matchMedia(NEED_CLICK_NAV_MENU_MQ);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => (typeof window !== 'undefined' ? window.matchMedia(NEED_CLICK_NAV_MENU_MQ).matches : true),
    () => true
  );
}
