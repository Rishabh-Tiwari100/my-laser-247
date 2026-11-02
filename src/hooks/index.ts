// Export all custom hooks for easy importing
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { useThrottle, useThrottledValue } from './useThrottle';
export { useClipboard, useAutoCopy } from './useClipboard';
export {
  useOutsideClick,
  useOutsideClickMultiple,
  useToggleWithOutsideClick,
} from './useOutsideClick';
export { useLocalStorage } from './useLocalStorage';
export { useOtpTimer } from './useOtpTimer';

// Redux hooks
export {
  useAppDispatch,
  useAppSelector,
  useAuth,
  useIsAuthenticated,
  useCurrentUser,
  useIsDemoUser,
} from './redux';
