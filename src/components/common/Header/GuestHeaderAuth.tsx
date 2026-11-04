import { ArrowRight, Loader2, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLoginPage } from '@/pages/Auth/hooks/useLogin';
import OtpModal from '@/components/common/OtpModal';

export default function GuestHeaderAuth() {
  const {
    form, handleLogin, handleDemoLogin, handleVerifyMfa, handleCloseMfaModal,
    isLoading, isDemoLoading, showMfaModal, isMfaVerifying,
  } = useLoginPage();
  const { register, handleSubmit, formState: { errors } } = form;
  const busy = isLoading || isDemoLoading;

  return (
    <>
      <div className="flex items-center gap-1 pr-2 lg:hidden">
        <button type="button" onClick={handleDemoLogin} disabled={busy}
          className="flex h-[30px] min-w-[48px] items-center justify-center rounded-[3px] bg-log-button px-2 text-xs font-bold text-white disabled:opacity-60">
          {isDemoLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-label="Starting demo" /> : 'Demo'}
        </button>
        <Link to="/login" className="flex h-[30px] items-center gap-1 rounded-[3px] bg-[#243a48] px-[10px] text-xs font-bold text-white">
          <UserRound className="h-3 w-3" aria-hidden="true" /> Login
        </Link>
      </div>
      <form className="relative hidden items-center gap-[6px] lg:flex" noValidate
        onSubmit={handleSubmit((data) => handleLogin(data, 'userId', 'password'))}>
        <UserRound className="mr-1 h-4 w-4 shrink-0 text-white" aria-hidden="true" />
        <label className="sr-only" htmlFor="header-username">Username</label>
        <input id="header-username" placeholder="Username" autoComplete="username"
          aria-invalid={Boolean(errors.username)} aria-describedby={errors.username ? 'header-login-error' : undefined}
          className="h-[26px] w-[160px] rounded-[3px] border border-[#ced4da] bg-white px-[14px] text-xs text-black outline-none placeholder:text-[#98a6ad] focus:ring-2 focus:ring-cyan-300 xl:w-[185px]"
          {...register('username')} />
        <label className="sr-only" htmlFor="header-password">Password</label>
        <input id="header-password" type="password" placeholder="Password" autoComplete="current-password"
          aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'header-login-error' : undefined}
          className="h-[26px] w-[160px] rounded-[3px] border border-[#ced4da] bg-white px-[14px] text-xs text-black outline-none placeholder:text-[#98a6ad] focus:ring-2 focus:ring-cyan-300 xl:w-[185px]"
          {...register('password')} />
        <button type="submit" disabled={busy}
          className="flex h-[29px] items-center justify-center gap-1 whitespace-nowrap rounded-[4px] bg-log-button px-[10px] text-xs font-bold text-white disabled:opacity-60">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-label="Logging in" /> : <>Login <ArrowRight className="h-3 w-3" aria-hidden="true" /></>}
        </button>
        <button type="button" onClick={handleDemoLogin} disabled={busy}
          className="flex h-[29px] items-center justify-center gap-1 whitespace-nowrap rounded-[4px] bg-log-button px-[10px] text-xs font-bold text-white disabled:opacity-60">
          {isDemoLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-label="Starting demo" /> : <>Login With Demo ID <ArrowRight className="h-3 w-3" aria-hidden="true" /></>}
        </button>
        {(errors.username || errors.password) && <p id="header-login-error" role="alert"
          className="absolute right-0 top-full mt-1 rounded bg-white px-2 py-1 text-xs text-red-700 shadow">
          {errors.username?.message || errors.password?.message}
        </p>}
      </form>
      <OtpModal isOpen={showMfaModal} onClose={handleCloseMfaModal} onSubmit={handleVerifyMfa}
        isLoading={isMfaVerifying} title="Enter MFA OTP"
        description="Enter the 6-digit code from your authenticator app to complete login." submitLabel="Verify & Login" />
    </>
  );
}
