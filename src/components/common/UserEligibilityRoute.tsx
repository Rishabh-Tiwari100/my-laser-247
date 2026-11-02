import { Navigate, Outlet } from 'react-router-dom';
import { useIsDemoUser } from '@/hooks/redux';
import { useLayoutEffect, useRef } from 'react';
import toast from 'react-hot-toast';

function UserEligibilityRoute() {
  const isDemoUser = useIsDemoUser();

  const toastShownRef = useRef(false);

  useLayoutEffect(() => {
    if (toastShownRef.current) return;
    const id = { id: 'restriction' };
    if (isDemoUser === true) {
      toast.error('This feature is not available for demo users.', id);
      toastShownRef.current = true;
    }
  }, [isDemoUser]);

  if (isDemoUser === true) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default UserEligibilityRoute;
