import { Navigate, Outlet } from 'react-router-dom';
import { useIsAffiliateUser, useIsDemoUser, useIsSelfRegistered } from '@/hooks/redux';
import toast from 'react-hot-toast';
import { useEffect, useRef } from 'react';

function AffiliateUserRoute() {
  const isAffiliateUser = useIsAffiliateUser();
  const isDemoUser = useIsDemoUser();
  const isSelfRegistered = useIsSelfRegistered();
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (toastShownRef.current) return;

    const toastId = { id: 'restriction' };

    if (isDemoUser) {
      toast.error('This feature is not available for demo users.', toastId);
      toastShownRef.current = true;
      return;
    }

    if (isAffiliateUser) {
      toast.error('Affiliate users are not allowed to access this feature.', toastId);
      toastShownRef.current = true;
      return;
    }

    if (isSelfRegistered === false) {
      toast.error('Only self-registered users can access this feature.', toastId);
      toastShownRef.current = true;
    }
  }, [isDemoUser, isAffiliateUser, isSelfRegistered]);

  if (isDemoUser === true || isAffiliateUser === true || isSelfRegistered === false) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AffiliateUserRoute;
