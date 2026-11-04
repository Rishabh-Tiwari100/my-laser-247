import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import toast from 'react-hot-toast';
import AuthBrandingPanel from './components/AuthBrandingPanel';
import AuthPhoneNumberInput, { PhoneCountry } from './components/AuthPhoneNumberInput';
import AuthPasswordField from './components/AuthPasswordField';
import AuthSubmitButton from './components/AuthSubmitButton';
import { LoginCredentialType, LoginMethod, useLoginPage } from './hooks/useLogin';
import { useOtpTimer } from '@/hooks';
import { useSendOtpMutation } from '@/store/api/authApi';
import { useGetCmsContentQuery } from '@/store/api/cmsApi';
import { Icons } from '@/utils/icons';
import { sanitizeCmsContent } from '@/utils/sanitizeCmsContent';
import { hasMinimumNationalPhoneLength } from '@/utils/validations';
import OtpModal from '@/components/common/OtpModal';

function Login() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');
  const {
    form,
    handleLogin,
    handleDemoLogin,
    handleVerifyMfa,
    handleCloseMfaModal,
    isLoading,
    showMfaModal,
    isMfaVerifying,
  } = useLoginPage(undefined, loginMethod);
  const {
    clearErrors,
    control,
    handleSubmit,
    resetField,
    watch,
    formState: { isValid },
  } = form;
  const usernameValue = watch('username');
  const passwordValue = watch('password');

  const [credentialType, setCredentialType] = useState<LoginCredentialType>('password');
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>({
    code: 'IN',
    dialCode: '91',
  });
  const [otpSent, setOtpSent] = useState(false);
  const {
    timeLeft,
    active: otpTimerActive,
    start: startOtpTimer,
    reset: resetOtpTimer,
  } = useOtpTimer(300);
  const [sendOtp, { isLoading: otpLoading }] = useSendOtpMutation();
  const { data: cmsContentResponse } = useGetCmsContentQuery({
    page: '/login',
    type: 'footer',
  });
  const cmsFooterContent = cmsContentResponse?.data?.find(
    ({ isActive, type }) => isActive && type === 'footer'
  )?.content;
  const sanitizedCmsFooterContent = useMemo(
    () => sanitizeCmsContent(cmsFooterContent),
    [cmsFooterContent]
  );

  const mobileDigits = usernameValue?.replace(/\D/g, '') ?? '';
  const mobile = mobileDigits ? `+${mobileDigits}` : '';
  const isValidMobile =
    mobile.length > 1 && hasMinimumNationalPhoneLength(mobile) && isValidPhoneNumber(mobile);
  const isValidLoginOtp =
    loginMethod !== 'phone' ||
    credentialType !== 'otp' ||
    (otpSent && /^\d{6}$/.test(passwordValue));
  const isLoginDisabled = !isValid || !isValidLoginOtp;

  const resetOtpFlow = () => {
    setOtpSent(false);
    resetOtpTimer();
  };

  const selectLoginMethod = (method: LoginMethod) => {
    setLoginMethod(method);
    setCredentialType('password');
    resetOtpFlow();
    resetField('username');
    resetField('password');
    clearErrors();
  };

  const selectCredentialType = (type: LoginCredentialType) => {
    if (type === credentialType) return;

    setCredentialType(type);
    resetOtpFlow();
    resetField('password');
    clearErrors('password');
  };

  const handleSendLoginOtp = async () => {
    if (!isValidMobile) {
      toast.error('Please enter a valid mobile number.', { id: 'login-otp' });
      return;
    }

    try {
      await sendOtp({ mobile, country: phoneCountry.code, type: 'login' }).unwrap();
      toast.success(`OTP sent to ${mobile}`, { id: 'login-otp' });
      setCredentialType('otp');
      setOtpSent(true);
      resetField('password');
      clearErrors('password');
      startOtpTimer();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to send OTP', { id: 'login-otp' });
    }
  };

  const formatOtpTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-12">
        <AuthBrandingPanel type="login" />

        <div className="col-span-12 md:col-span-7 px-3">
          <div className="mt-5 flex items-center justify-center">
            <div className="w-full max-w-6xl">
              <form
                onSubmit={handleSubmit((data) => handleLogin(data, loginMethod, credentialType))}
                autoComplete="off"
                className="space-y-[9px]"
              >
                <div className="grid grid-cols-2 overflow-hidden rounded-[7px] border border-white text-sm font-semibold shadow-sm">
                  <button
                    type="button"
                    className={`p-[7px] transition ${
                      loginMethod === 'phone' ? 'bg-white text-black' : 'bg-transparent text-white'
                    }`}
                    onClick={() => selectLoginMethod('phone')}
                  >
                    Phone Number
                  </button>
                  <button
                    type="button"
                    className={`p-[7px] transition ${
                      loginMethod === 'userId' ? 'bg-white text-black' : 'bg-transparent text-white'
                    }`}
                    onClick={() => selectLoginMethod('userId')}
                  >
                    User ID
                  </button>
                </div>

                {loginMethod === 'phone' ? (
                  <div>
                    <Controller
                      name="username"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <div>
                          <AuthPhoneNumberInput
                            value={field.value}
                            country={phoneCountry}
                            onCountryChange={setPhoneCountry}
                            onChange={(value) => {
                              field.onChange(value);
                              if (otpSent) {
                                resetOtpFlow();
                                resetField('password');
                              }
                            }}
                            onBlur={field.onBlur}
                            inputRef={field.ref}
                            name={field.name}
                            autoComplete="off"
                          />
                          {error && (
                            <p className="block mt-1 text-[12px] font-normal leading-[1.2] text-[#ff0e25]">
                              {error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                ) : (
                  <Controller
                    name="username"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <div className="relative flex h-10 items-center rounded-[5px] bg-white shadow-sm">
                          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-black">
                            <Icons.userFilled className="h-4 w-4" />
                          </span>
                          <input
                            {...field}
                            type="text"
                            placeholder="Enter User ID*"
                            autoComplete="off"
                            className="h-full w-full border-0 bg-transparent pl-7 pr-3 text-sm text-[#111827] outline-none placeholder:text-[#111827]"
                          />
                        </div>
                        {error && (
                          <p className="block mt-1 text-[12px] font-normal leading-[1.2] text-[#ff0e25]">
                            {error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                )}

                {loginMethod === 'phone' && (
                  <div className="flex h-6 items-center gap-3 text-sm font-normal text-white">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="credentialType"
                        checked={credentialType === 'password'}
                        onChange={() => selectCredentialType('password')}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-[15px] w-[15px] items-center justify-center rounded-full border ${
                          credentialType === 'password'
                            ? 'border-white bg-white'
                            : 'border-white bg-transparent'
                        }`}
                      >
                        {credentialType === 'password' && (
                          <span className="h-[7px] w-[7px] rounded-full bg-[#5e6f79]" />
                        )}
                      </span>
                      Password
                    </label>

                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="credentialType"
                        checked={credentialType === 'otp'}
                        onChange={() => selectCredentialType('otp')}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-[15px] w-[15px] items-center justify-center rounded-full border ${
                          credentialType === 'otp'
                            ? 'border-white bg-white'
                            : 'border-white bg-transparent'
                        }`}
                      >
                        {credentialType === 'otp' && (
                          <span className="h-[7px] w-[7px] rounded-full bg-[#5e6f79]" />
                        )}
                      </span>
                      OTP
                    </label>
                  </div>
                )}

                <div className="space-y-[3px]">
                  {loginMethod === 'userId' || credentialType === 'password' ? (
                    <AuthPasswordField
                      name="password"
                      control={control}
                      placeholder="Enter Password*"
                      inputRules={{
                        noSpace: true,
                        maxLength: 20,
                      }}
                      autoComplete="new-password"
                      className="[&>div:first-child]:!h-10 [&>div:first-child]:!rounded-[5px] [&_input]:placeholder:!text-[#111827] [&_input]:!text-[#111827] [&_span]:!w-7 [&_button]:!w-9 [&_svg]:!text-black"
                    />
                  ) : (
                    <Controller
                      name="password"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <div>
                          <div
                            className={`flex h-10 items-center overflow-hidden rounded-[5px] ${
                              otpSent ? 'bg-white' : 'bg-[#bdbdbd]'
                            } ${error ? 'ring-1 ring-red-500' : ''}`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex h-10 items-center">
                                <span className="flex h-full w-7 shrink-0 items-center justify-center text-black">
                                  <Icons.lock className="h-[16px] w-[16px]" />
                                </span>
                                <input
                                  {...field}
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={6}
                                  onChange={(event) =>
                                    field.onChange(
                                      event.target.value.replace(/\D/g, '').slice(0, 6)
                                    )
                                  }
                                  placeholder="Enter OTP*"
                                  disabled={!otpSent}
                                  className="h-full w-full min-w-0 border-0 bg-transparent pr-2 text-sm text-[#111827] outline-none placeholder:text-[#111827] disabled:cursor-not-allowed"
                                  autoComplete="one-time-code"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleSendLoginOtp}
                              disabled={otpLoading || otpTimerActive || !isValidMobile}
                              className="h-10 min-w-[82px] bg-[#0853c2] px-3 text-sm font-medium uppercase text-white transition disabled:opacity-30"
                            >
                              {otpLoading
                                ? 'Sending...'
                                : otpTimerActive
                                  ? formatOtpTime(timeLeft)
                                  : otpSent
                                    ? 'RESEND OTP'
                                    : 'GET OTP'}
                            </button>
                          </div>
                          {error && (
                            <p className="block mt-1 text-[12px] font-normal leading-[1.2] text-[#ff0e25]">
                              {error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  )}

                  <div className="text-right leading-4">
                    <Link
                      to="/forgot-password"
                      className="text-sm font-bold text-white underline underline-offset-1 hover:text-[#0cddff]"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-[5px]">
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="flex h-10 items-center justify-center rounded-[2px] border border-black bg-black text-sm font-semibold text-[#00c6f3] transition hover:bg-[#070707]"
                  >
                    Log In With Demo ID
                  </button>
                  <AuthSubmitButton
                    label="Login"
                    isLoading={isLoading}
                    // disabled={isLoginDisabled}
                    className="!mt-0 !h-10 !rounded-[2px] !bg-black !text-sm !font-semibold !text-[#00c6f3] hover:!bg-[#070707]"
                  />
                </div>

                <div className="text-center text-sm text-white">Or Login With</div>
                <div className="flex items-center justify-center gap-2 text-white">
                  <button type="button" className="h-5 w-5 overflow-hidden rounded-[4px]">
                    <img
                      src="/images/footer/telegram.png"
                      alt="Telegram"
                      className="h-full w-full"
                    />
                  </button>
                  <button type="button" className="h-5 w-5 overflow-hidden rounded-[4px]">
                    <img
                      src="/images/socialMedia/instagram.svg"
                      alt="Instagram"
                      className="h-full w-full"
                    />
                  </button>
                  <button type="button" className="h-5 w-5 overflow-hidden rounded-[4px]">
                    <img
                      src="/images/footer/facebook.svg"
                      alt="Facebook"
                      className="h-full w-full"
                    />
                  </button>
                </div>

                <p className="text-center text-sm text-white">
                  Don&apos;t have an account ?{' '}
                  <Link
                    to="/register"
                    className="font-bold text-white underline underline-offset-1"
                  >
                    Register
                  </Link>
                </p>

                {sanitizedCmsFooterContent && (
                  <div
                    className="cms-api-content login-cms-content mx-auto max-h-[130px] overflow-y-auto rounded-[5px] border border-white/70 bg-[#243a48] px-3 py-2 text-white shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
                    dangerouslySetInnerHTML={{ __html: sanitizedCmsFooterContent }}
                  />
                )}
              </form>
            </div>
          </div>
        </div>
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
    </div>
  );
}

export default Login;
