import { Navigate, Outlet } from 'react-router-dom';
import { useIsDemoUser } from '@/hooks/redux';
import toast from 'react-hot-toast';
import { useEffect, useRef } from 'react';

function DemoProtectedRoute() {
  const isDemoUser = useIsDemoUser();
  const toastShownRef = useRef(false);

  useEffect(() => {
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

export default DemoProtectedRoute;
