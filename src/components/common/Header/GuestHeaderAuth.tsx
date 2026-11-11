import { Loader2 } from 'lucide-react';
import { mdiAccount, mdiArrowRight } from '@mdi/js';
import { Link } from 'react-router-dom';
import { useLoginPage } from '@/pages/Auth/hooks/useLogin';
import OtpModal from '@/components/common/OtpModal';

export default function GuestHeaderAuth() {
  const {
    form,
    handleLogin,
    handleDemoLogin,
    handleVerifyMfa,
    handleCloseMfaModal,
    isLoading,
    isDemoLoading,
    showMfaModal,
    isMfaVerifying,
  } = useLoginPage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const busy = isLoading || isDemoLoading;

  return (
    <>
      <div className="flex translate-y-px items-center gap-[5px] lg:hidden">
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={busy}
          className="flex h-[32px] w-[60.34375px] items-center justify-center rounded-[3px] border border-transparent bg-log-button px-[10px] text-xs font-semibold text-white disabled:opacity-60"
        >
          {isDemoLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-label="Starting demo" />
          ) : (
            'Demo'
          )}
        </button>
        <Link
          to="/login"
          className="flex h-[32px] w-[70px] items-center justify-center gap-1 rounded-[3px] border border-transparent bg-[#243a48] px-[10px] text-xs font-semibold text-white"
        >
          <svg viewBox="0 0 24 24" className="size-3 fill-current" aria-hidden="true">
            <path d={mdiAccount} />
          </svg>{' '}
          Login
        </Link>
      </div>
      <form
        className="relative hidden items-center gap-[6px] lg:flex"
        noValidate
        onSubmit={handleSubmit((data) => handleLogin(data, 'userId', 'password'))}
      >
        <svg
          viewBox="0 0 24 24"
          className="-mr-[2px] size-[17px] shrink-0 fill-current text-white"
          aria-hidden="true"
        >
          <path d={mdiAccount} />
        </svg>
        <label className="sr-only" htmlFor="header-username">
          Username
        </label>
        <input
          id="header-username"
          placeholder="Username"
          autoComplete="username"
          aria-invalid={Boolean(errors.username)}
          className="relative -top-[0.75px] h-[25px] w-[186.78125px] rounded-[3px] border border-[#ced4da] bg-white px-[14.4px] text-[14px] leading-[21px] text-black outline-none placeholder:text-[#98a6ad] shadow-[0_1px_4px_#0000001a] focus:ring-2 focus:ring-cyan-300"
          {...register('username')}
        />
        <label className="sr-only" htmlFor="header-password">
          Password
        </label>
        <input
          id="header-password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          className="h-[25px] w-[186.78125px] rounded-[3px] border border-[#ced4da] bg-white px-[14.4px] text-[14px] leading-[21px] text-black outline-none placeholder:text-[#98a6ad] shadow-[0_1px_4px_#0000001a] focus:ring-2 focus:ring-cyan-300"
          {...register('password')}
        />
        <button
          type="submit"
          disabled={busy}
          className="-mr-[3px] flex h-[29.5px] w-[74px] items-center justify-center gap-1 whitespace-nowrap rounded-[4px] bg-log-button px-[10px] text-[13px] font-bold leading-[19.5px] text-white disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-label="Logging in" />
          ) : (
            <>
              Login{' '}
              <svg viewBox="0 0 24 24" className="size-[13px] fill-current" aria-hidden="true">
                <path d={mdiArrowRight} />
              </svg>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={busy}
          className="flex h-[29.5px] w-[161.984375px] shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-[4px] bg-log-button px-[10px] text-[13px] font-bold leading-[19.5px] text-white disabled:opacity-60"
        >
          {isDemoLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-label="Starting demo" />
          ) : (
            <>
              Login With Demo ID{' '}
              <svg viewBox="0 0 24 24" className="size-[13px] fill-current" aria-hidden="true">
                <path d={mdiArrowRight} />
              </svg>
            </>
          )}
        </button>
      </form>
      <OtpModal
        isOpen={showMfaModal}
        onClose={handleCloseMfaModal}
        onSubmit={handleVerifyMfa}
        isLoading={isMfaVerifying}
        title="Enter MFA OTP"
        description="Enter the 6-digit code from your authenticator app to complete login."
        submitLabel="Verify & Login"
      />
    </>
  );
}
