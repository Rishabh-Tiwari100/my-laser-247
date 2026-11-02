import { Navigate } from 'react-router-dom';
import NotOutLoader from '@/components/common/NotOutLoader';
import { useCurrentUser, useIsAuthenticated, useIsDemoUser } from '@/hooks';
import { useGetUserProfileQuery } from '@/store/api/userApi';

export default function TwoFARedirect() {
  const isAuthenticated = useIsAuthenticated();
  const { isLoading, isFetching } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const user = useCurrentUser();
  const isDemoUser = useIsDemoUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading || isFetching || !user) {
    return <NotOutLoader />;
  }

  if (isDemoUser) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to={user.isMfaEnabled ? '/2fa/edit-2fa' : '/2fa/setup-auth'} replace />;
}
