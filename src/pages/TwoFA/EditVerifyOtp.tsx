import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { TwoFaShell, GoogleBadge, CodeInputs } from './components';
import { useCurrentUser, useIsDemoUser } from '@/hooks';
import { useToggleMfaMutation } from '@/store/api/mfaApi';
import toast from 'react-hot-toast';
import { useIsAuthenticated } from '@/hooks';
import { useGetUserProfileQuery } from '@/store/api/userApi';
import NotOutLoader from '@/components/common/NotOutLoader';

type ApiError = {
  data?: {
    message?: string;
  };
};

export default function EditVerifyOtp() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const isDemoUser = useIsDemoUser();
  const user = useCurrentUser();
  const [code, setCode] = useState('');
  const [toggleMfa, { isLoading }] = useToggleMfaMutation();
  const mobileOrEmail = useMemo(
    () => user?.email || user?.mobile || '',
    [user?.email, user?.mobile]
  );
  const { isLoading: isProfileLoading, isFetching } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isProfileLoading || isFetching || !user) {
    return <NotOutLoader />;
  }

  if (isDemoUser) {
    return <Navigate to="/" replace />;
  }

  if (!user.isMfaEnabled) {
    return <Navigate to="/2fa/setup-auth" replace />;
  }

  const handleVerify = async () => {
    if (code.length !== 6) return;

    if (!mobileOrEmail) {
      toast.error('No registered mobile or email found.', { id: 'mfa-disable' });
      return;
    }

    const toastId = toast.loading('Verifying code...', { id: 'mfa-disable' });

    try {
      const response = await toggleMfa({
        mobileOrEmail,
        otp: code,
        status: 'INACTIVE',
      }).unwrap();

      toast.success(response.message || 'Two-factor authentication disabled.', { id: toastId });
      navigate('/2fa/setup-auth');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.data?.message || 'Failed to verify code.', { id: toastId });
    }
  };

  return (
    <TwoFaShell
      title="Verify Your Code"
      icon={<GoogleBadge />}
      footer={
        <button
          type="button"
          disabled={code.length !== 6 || isLoading}
          onClick={handleVerify}
          className="flex min-h-[44px] w-full items-center justify-center rounded-[8px] bg-theme-navbar text-[14px] font-medium text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-[#dfdfdf] disabled:bg-none disabled:text-[#737373] disabled:opacity-100"
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
      }
    >
      <div className="min-h-[300px] pt-2">
        <h2 className="border-b border-[#e3e8ec] pb-2 text-[19px] font-semibold text-[#2e87d5]">
          Verify Code
        </h2>
        <p className="mt-4 max-w-[560px] text-[14px] leading-6 text-[#1f2b39]">
          <span className="font-semibold">
            Please enter the 6-Digit code which appears on the authenticator app.
          </span>
          <br />
          <span className="text-[#6b7583]">Tap to copy the code in authenticator.</span>
        </p>

        <div className="mt-5">
          <div className="mb-3 text-[15px] font-medium text-[#1f2b39]">Enter Code</div>
          <CodeInputs value={code} onChange={setCode} />
        </div>
      </div>
    </TwoFaShell>
  );
}
