import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useLoginPage } from './hooks/useLogin';
import OtpModal from '@/components/common/OtpModal';
import AppInstallButtons from './components/AppInstallButtons';

const REMEMBERED_USERNAME_KEY = 'laser247.rememberedUsername';

function readRememberedUsername() {
  try { return localStorage.getItem(REMEMBERED_USERNAME_KEY) ?? ''; }
  catch { return ''; }
}

function Login() {
  const {
    form, handleLogin, handleDemoLogin, handleVerifyMfa, handleCloseMfaModal,
    isLoading, isDemoLoading, showMfaModal, isMfaVerifying,
  } = useLoginPage();
  const [rememberMe, setRememberMe] = useState(() => Boolean(readRememberedUsername()));
  const { register, handleSubmit, setValue, formState: { errors } } = form;

  useEffect(() => {
    const username = readRememberedUsername();
    if (username) setValue('username', username);
  }, [setValue]);

  return (
    <section className="mx-auto w-full max-w-[700px] font-helvetica text-white md:grid md:grid-cols-12 md:bg-[linear-gradient(0deg,#1c282d,transparent)] md:px-[30px] md:py-[55px]">
      <div className="flex flex-col items-center justify-center pb-6 pt-2 md:col-span-5 md:pb-0 md:pt-[45px]">
        <Link to="/" aria-label="My Laser247 home">
          <img src="/images/logo.png" alt="My Laser247" className="h-auto w-[170px] max-w-full md:w-[146px]" />
        </Link>
        <span className="text-[13px] leading-[18px]">Powered by</span>
        <img src="/images/skyexchHome/betfair.png" alt="Betfair" className="h-auto w-[146px] brightness-0 invert" />
        <img src="/images/auth-image.webp" alt="" className="mt-6 hidden h-auto w-[146px] md:block" />
      </div>

      <div className="min-w-0 md:col-span-7 md:px-[22px]">
        <h1 className="mb-5 hidden text-center text-[22px] font-bold leading-[1.5] md:block">
          Welcome Please Login To Your Account
        </h1>
        <form onSubmit={handleSubmit((data) => {
          try {
            if (rememberMe) localStorage.setItem(REMEMBERED_USERNAME_KEY, data.username.trim());
            else localStorage.removeItem(REMEMBERED_USERNAME_KEY);
          } catch { /* Sign-in remains available when browser storage is disabled. */ }
          return handleLogin(data, 'userId', 'password');
        })} className="space-y-1 md:space-y-[15px]" noValidate>
          <div>
            <label className="sr-only" htmlFor="login-username">Username</label>
            <input id="login-username" autoComplete="username" placeholder="Enter Username"
              aria-invalid={Boolean(errors.username)} aria-describedby={errors.username ? 'login-username-error' : undefined}
              className="h-10 w-full rounded-[3px] border border-[#ced4da] bg-white px-[14px] text-sm text-black outline-none placeholder:italic placeholder:text-black focus:ring-2 focus:ring-cyan-300 md:h-9"
              {...register('username')} />
            {errors.username && <p id="login-username-error" role="alert" className="mt-1 text-xs text-[#ffb7b7]">{errors.username.message}</p>}
          </div>
          <div>
            <label className="sr-only" htmlFor="login-password">Password</label>
            <input id="login-password" type="password" autoComplete="current-password" placeholder="Enter Password"
              aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'login-password-error' : undefined}
              className="h-10 w-full rounded-[3px] border border-[#ced4da] bg-white px-[14px] text-sm text-black outline-none placeholder:italic placeholder:text-black focus:ring-2 focus:ring-cyan-300 md:h-9"
              {...register('password')} />
            {errors.password && <p id="login-password-error" role="alert" className="mt-1 text-xs text-[#ffb7b7]">{errors.password.message}</p>}
          </div>
          <div>
            <label className="flex w-fit cursor-pointer items-center gap-[5px] py-1 text-xs font-bold">
              <input type="checkbox" checked={rememberMe} onChange={(event) => {
                setRememberMe(event.target.checked);
                if (!event.target.checked) {
                  try { localStorage.removeItem(REMEMBERED_USERNAME_KEY); } catch { /* Storage is optional. */ }
                }
              }} className="h-3 w-3 accent-[#00bfe5]" />
              Remember me
            </label>
            <p className="text-xs leading-[1.8]">
              Please review our <Link to="/terms-policy" className="underline">Privacy Policy</Link> and{' '}
              <Link to="/terms-policy" className="underline">Terms of Service</Link>.
            </p>
          </div>
          <div className="flex flex-col gap-1 md:items-end md:gap-[14px]">
            <button type="submit" disabled={isLoading || isDemoLoading}
              className="flex h-10 w-full items-center justify-center rounded-[2px] bg-black px-[30px] text-sm font-semibold text-[#00c6f3] disabled:opacity-60 md:h-9 md:w-auto md:bg-[#ed321c] md:text-base md:uppercase md:text-white">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" aria-label="Logging in" /> : 'Log In'}
            </button>
            <button type="button" onClick={handleDemoLogin} disabled={isLoading || isDemoLoading}
              className="flex h-10 w-full items-center justify-center rounded-[2px] bg-black px-[30px] text-sm font-semibold text-[#00c6f3] disabled:opacity-60 md:h-9 md:w-auto md:bg-[#ed321c] md:text-base md:uppercase md:text-white">
              {isDemoLoading ? <Loader2 className="h-5 w-5 animate-spin" aria-label="Starting demo" /> : 'Log In With Demo ID'}
            </button>
          </div>
        </form>
        <AppInstallButtons />
      </div>
      <OtpModal isOpen={showMfaModal} onClose={handleCloseMfaModal} onSubmit={handleVerifyMfa}
        isLoading={isMfaVerifying} title="Enter MFA OTP"
        description="Enter the 6-digit code from your authenticator app to complete login." submitLabel="Verify & Login" />
    </section>
  );
}

export default Login;
