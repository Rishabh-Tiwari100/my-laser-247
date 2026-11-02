import loadable from '@/utils/loadable';
import NotOutLoader from './common/NotOutLoader';

export const OtpTimer = loadable(() => import('@/components/common/OtpTimer'), {
  fallback: <NotOutLoader />,
});

export const PhoneInput = loadable(() => import('@/components/common/PhoneInput'), {
  fallback: <NotOutLoader />,
});
