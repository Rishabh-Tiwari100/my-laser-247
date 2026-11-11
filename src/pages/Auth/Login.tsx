import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useLoginPage } from './hooks/useLogin';
import OtpModal from '@/components/common/OtpModal';
import AppInstallButtons from './components/AppInstallButtons';

const REMEMBERED_USERNAME_KEY = 'laser247.rememberedUsername';

function readRememberedUsername() {
  try {
    return localStorage.getItem(REMEMBERED_USERNAME_KEY) ?? '';
  } catch {
    return '';
  }
}

function Login() {
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
  const [rememberMe, setRememberMe] = useState(() => Boolean(readRememberedUsername()));
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    const username = readRememberedUsername();
    if (username) setValue('username', username);
  }, [setValue]);

  return (
    <section
      aria-labelledby="login-title"
      className="mx-auto min-h-dvh w-full bg-[linear-gradient(180deg,#00000005_27%,#1c282de0_83%)] px-[22px] py-[30px] font-helvetica text-[14px] leading-[21px] text-white [&_a]:focus-visible:outline [&_a]:focus-visible:outline-cyan-300 [&_button]:focus-visible:outline [&_button]:focus-visible:outline-cyan-300 md:mt-[10vw] md:grid md:min-h-0 md:max-w-[700px] md:grid-cols-12 md:items-center md:p-[40px]"
    >
      <div className="mt-[10px] flex flex-col items-center py-[6px] md:col-span-5 md:mt-[12px] md:px-[12px]">
        <Link to="/" aria-label="My Laser247 home">
          <img
            src="/images/logo.png"
            alt="My Laser247"
            className="h-[40px] w-auto max-w-full md:h-auto md:w-[150px]"
          />
        </Link>
        <img src="/images/betfair.png" alt="Betfair" className="mt-[6px] h-auto w-[150px]" />
        <img
          src="/images/login-sports.png"
          alt=""
          className="mt-[20px] hidden h-auto w-[150px] md:block"
        />
      </div>

      <div className="mt-[20px] min-w-0 md:col-span-7 md:px-[12px]">
        <h1
          id="login-title"
          className="sr-only md:not-sr-only md:mb-[16px] md:text-center md:text-[22px] md:font-bold md:leading-[33px]"
        >
          Welcome Please Login To Your Account
        </h1>

        <form
          onSubmit={handleSubmit((data) => {
            try {
              if (rememberMe) localStorage.setItem(REMEMBERED_USERNAME_KEY, data.username.trim());
              else localStorage.removeItem(REMEMBERED_USERNAME_KEY);
            } catch {
              /* Sign-in remains available when browser storage is disabled. */
            }
            return handleLogin(data, 'userId', 'password');
          })}
          className="flex flex-col gap-[5px] md:gap-[15px]"
          noValidate
        >
          <div>
            <label className="sr-only" htmlFor="login-username">
              Username
            </label>
            <input
              id="login-username"
              autoComplete="username"
              placeholder="Enter Username"
              required
              aria-invalid={Boolean(errors.username)}
              className="h-[40px] w-full rounded-[4px] border border-[#ced4da] bg-white px-[14.4px] text-[14px] leading-[21px] text-black outline-none placeholder:italic placeholder:text-black focus:ring-2 focus:ring-cyan-300 md:h-[36.375px]"
              {...register('username')}
            />
          </div>
          <div className="relative">
            <label className="sr-only" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter Password"
              required
              aria-invalid={Boolean(errors.password)}
              className="h-[40px] w-full rounded-[4px] border border-[#ced4da] bg-white px-[14.4px] text-[14px] leading-[21px] text-black outline-none placeholder:italic placeholder:text-black focus:ring-2 focus:ring-cyan-300 md:h-[36.375px]"
              {...register('password')}
            />
          </div>
          <div>
            <div className="flex items-center justify-between gap-3">
              <label className="flex h-[21px] w-fit cursor-pointer items-start gap-[5px] text-[12px] font-bold leading-[18px]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => {
                    setRememberMe(event.target.checked);
                    if (!event.target.checked) {
                      try {
                        localStorage.removeItem(REMEMBERED_USERNAME_KEY);
                      } catch {
                        /* Storage is optional. */
                      }
                    }
                  }}
                  className="mt-[2px] h-[13px] w-[13px] accent-[#00bfe5]"
                />
                Remember me
              </label>
            </div>
            <p className="min-h-[42px] text-[12px] leading-[21px]">
              This site is protected by reCAPTCHA and the Google{' '}
              <span className="underline">Privacy Policy</span> and{' '}
              <span className="underline">Terms of Service apply</span>.
            </p>
          </div>
          <div className="flex flex-col gap-[5px] md:items-end md:gap-[15px]">
            <button
              type="submit"
              disabled={isLoading || isDemoLoading}
              className="flex h-[40px] w-full items-center justify-center rounded-[2px] border border-transparent bg-black px-[7px] text-[16px] font-semibold leading-[24px] text-[#00c6f3] hover:brightness-110 disabled:opacity-60 md:h-[36px] md:w-auto md:bg-[#e83523] md:px-[30px] md:uppercase md:text-white"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-label="Logging in" />
              ) : (
                'Log In'
              )}
            </button>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading || isDemoLoading}
              className="flex h-[40px] w-full items-center justify-center rounded-[2px] border border-transparent bg-black px-[7px] text-[16px] font-semibold leading-[24px] text-[#00c6f3] hover:brightness-110 disabled:opacity-60 md:h-[36px] md:w-auto md:bg-[#e83523] md:px-[30px] md:uppercase md:text-white"
            >
              {isDemoLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-label="Starting demo" />
              ) : (
                'Log In With Demo ID'
              )}
            </button>
          </div>
        </form>
        <AppInstallButtons />
      </div>

      <OtpModal
        isOpen={showMfaModal}
        onClose={handleCloseMfaModal}
        onSubmit={handleVerifyMfa}
        isLoading={isMfaVerifying}
        title="Enter MFA OTP"
        description="Enter the 6-digit code from your authenticator app to complete login."
        submitLabel="Verify & Login"
      />
    </section>
  );
}

export default Login;
