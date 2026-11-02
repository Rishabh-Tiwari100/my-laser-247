import { Navigate, useNavigate } from 'react-router-dom';
import { TwoFaShell, SecurityBadge, IconCard } from './components';
import { useCurrentUser, useIsAuthenticated, useIsDemoUser } from '@/hooks';
import { useGetUserProfileQuery } from '@/store/api/userApi';
import NotOutLoader from '@/components/common/NotOutLoader';

export default function Edit2FA() {
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

  if (!user.isMfaEnabled) {
    return <Navigate to="/2fa/setup-auth" replace />;
  }

  const enabled = user.isMfaEnabled;

  return (
    <TwoFaShell
      title="2-Factor Authentication"
      icon={<SecurityBadge />}
      panelClassName="lg:min-h-[760px]"
      footer={null}
    >
      <div className="min-h-[520px]">
        <div className="mx-auto max-w-[720px] rounded-[10px] border border-[#78b8e6] bg-[#deeffa] px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/icons/lock.svg" alt="" className="h-6 w-6" />
              <span className="text-[14px] font-semibold text-[#1d2740]">2FA Method</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={() => navigate('/2fa/edit/verify/otp')}
              className={`relative h-[20px] w-[36px] rounded-full transition ${enabled ? 'bg-[#5fb4e6]' : 'bg-[#6e7d8f]'}`}
            >
              <span
                className={`absolute top-[2px] h-[16px] w-[16px] rounded-full bg-white shadow transition-all ${enabled ? 'left-[18px]' : 'left-[2px]'}`}
              />
            </button>
          </div>
        </div>

        <div className="px-2 pb-2 pt-6 text-center sm:px-4">
          <h2 className="text-[21px] font-semibold text-[#2e87d5]">2-Step Verification</h2>
          <p className="mt-1 text-[13px] text-[#384757]">
            Secure your account with two-factor authentication (2fa)
          </p>
        </div>

        <div className="mt-6">
          <IconCard
            title="Google Authenticator"
            description="Connect with google authenticator."
            actionLabel="Edit Google Authenticator"
            onAction={() => navigate('/2fa/edit/verify/otp')}
          />
        </div>
      </div>
    </TwoFaShell>
  );
}
