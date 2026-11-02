import { Navigate, useNavigate } from 'react-router-dom';
import { TwoFaShell, SecurityBadge } from './components';
import { Icons } from '@/utils/icons';
import { useCurrentUser, useIsAuthenticated, useIsDemoUser } from '@/hooks';
import { useGetUserProfileQuery } from '@/store/api/userApi';
import NotOutLoader from '@/components/common/NotOutLoader';

export default function SetupAuth() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const isDemoUser = useIsDemoUser();
  const { isLoading, isFetching } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const user = useCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading || isFetching || !user) {
    return <NotOutLoader />;
  }

  if (isDemoUser) {
    return <Navigate to="/" replace />;
  }

  if (user.isMfaEnabled) {
    return <Navigate to="/2fa/edit-2fa" replace />;
  }

  return (
    <TwoFaShell
      title="Security"
      icon={<SecurityBadge />}
      footer={
        <button
          type="button"
          onClick={() => navigate('/2fa/google/setup')}
          className="flex min-h-[44px] w-full items-center justify-center gap-[10px] rounded-[8px] bg-theme-navbar text-[14px] font-medium text-white transition hover:brightness-105"
        >
          Get Started
          <span aria-hidden="true"><Icons.arrowRight /></span>
        </button>
      }
    >
      <div className="min-h-[260px] text-center sm:min-h-[320px]">
        <div className="mx-auto max-w-[430px]">
          <h1 className="mb-[10px] text-[20px] font-bold capitalize leading-[1.5] text-[#2789ce]">
            Protect Your Account With
            <br />
            <span className="text-[#f35757]">2-Step Verification</span>
          </h1>
          <p className="text-[14px] text-[#33444b]">
            Each time you withdraw or Add Account, a <span className="text-[#0094de]">verification code</span> will be
            required
          </p>
        </div>
      </div>
    </TwoFaShell>
  );
}
