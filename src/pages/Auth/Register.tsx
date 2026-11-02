import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Controller } from 'react-hook-form';
import AuthBrandingPanel from './components/AuthBrandingPanel';
import AuthPhoneNumberInput from './components/AuthPhoneNumberInput';
import { useRegister } from './hooks/useRegister';
import { Icons } from '@/utils/icons';
import { sanitizeAlphaNumeric } from '@/utils';

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    form,
    phoneCountry,
    setPhoneCountry,
    referralCode,
    showOtpField,
    timeLeft,
    active,
    otpLoading,
    registerLoading,
    handleSendOtp,
    handleSubmitForm,
  } = useRegister();
  const [showUsernameField, setShowUsernameField] = useState(false);
  const [showReferralField, setShowReferralField] = useState(Boolean(referralCode));

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = form;
  const mobileValue = watch('mobile');
  const otpValue = watch('otp');
  const usernameValue = watch('username');
  const isRegisterDisabled =
    !isValid ||
    (showOtpField && !/^\d{6}$/.test(otpValue ?? '')) ||
    (showUsernameField && !usernameValue?.trim());

  const formatOtpTime = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="container-fluid">
      <div className="grid w-full grid-cols-12 gap-6">
        <AuthBrandingPanel type="register" />

        <div className="col-span-12 md:col-span-7 lg:pt-5">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-6xl">
              <form
                onSubmit={handleSubmit((data) => handleSubmitForm(data, showUsernameField))}
                autoComplete="off"
                className="space-y-2"
              >
                <div>
                  <div className="flex">
                    <div className="flex-1">
                      <Controller
                        control={control}
                        name="mobile"
                        render={({ field }) => (
                          <AuthPhoneNumberInput
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            inputRef={field.ref}
                            name={field.name}
                            autoComplete="off"
                            country={phoneCountry}
                            onCountryChange={setPhoneCountry}
                            disabled={showOtpField}
                            className="rounded-r-none"
                          />
                        )}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!active) handleSendOtp();
                      }}
                      disabled={otpLoading || (!showOtpField && (!!errors.mobile || !mobileValue))}
                      className="h-10 min-w-[60px] whitespace-nowrap rounded-r-[5px] bg-[#0853c2] px-2 py-[3px] text-sm font-medium text-white hover:bg-[#5f95ff] disabled:opacity-65"
                    >
                      {otpLoading
                        ? 'Sending...'
                        : showOtpField
                          ? active
                            ? formatOtpTime(timeLeft)
                            : 'Resend OTP'
                          : 'Get OTP'}
                    </button>
                  </div>

                  {errors.mobile && (
                    <p className="block mt-1 text-[12px] font-normal leading-[1.2] text-[#ff0e25]">
                      {errors.mobile.message}
                    </p>
                  )}
                </div>

                {showOtpField && (
                  <div>
                    <div className="flex h-10 items-center rounded-[6px] bg-white">
                      <span className="flex h-10 w-7 shrink-0 items-center justify-center">
                        <img
                          src="/icons/key.svg"
                          alt=""
                          aria-hidden="true"
                          className="h-[18px] w-[18px]"
                        />
                      </span>
                      <input
                        {...register('otp')}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        onInput={(event) => {
                          event.currentTarget.value = event.currentTarget.value
                            .replace(/\D/g, '')
                            .slice(0, 6);
                        }}
                        placeholder="Enter OTP*"
                        className="block h-10 w-full bg-transparent text-sm font-medium text-[#212529] outline-none placeholder:text-[#212529]"
                      />
                    </div>
                    {errors.otp && (
                      <p className="mt-1 text-[12px] font-normal leading-[1.2] text-[#ff0e25]">
                        {errors.otp.message}
                      </p>
                    )}
                  </div>
                )}

                {!showUsernameField && (
                  <div className="text-right leading-4">
                    <button
                      type="button"
                      onClick={() => setShowUsernameField(true)}
                      className="text-sm text-white underline"
                    >
                      Want to set UserID?
                    </button>
                  </div>
                )}

                {showUsernameField && (
                  <div>
                    <div className="flex h-10 items-center rounded-[6px] bg-white">
                      <span className="flex h-10 w-7 shrink-0 items-center justify-center text-black">
                        <Icons.userFilled className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <input
                        {...register('username')}
                        type="text"
                        autoComplete="off"
                        maxLength={16}
                        placeholder="Enter User ID"
                        className="block h-10 w-full bg-transparent text-sm font-medium text-[#212529] outline-none placeholder:text-[#212529]"
                      />
                    </div>
                    {errors.username && (
                      <p className="mt-1 text-[12px] font-normal leading-[1.2] text-[#ff0e25]">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Password */}

                <div>
                  <div className="relative flex h-10 w-full items-center rounded-[6px] bg-white">
                    <div className="px-2">
                      <img
                        src="/icons/lock.svg"
                        alt="Lock"
                        className="max-h-[15px] max-w-5 w-auto"
                      />
                    </div>
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Enter Password*"
                      onInput={(event) => {
                        event.currentTarget.value = sanitizeAlphaNumeric(event.currentTarget.value);
                      }}
                      className="text-sm h-10 font-medium block w-full text-[#212529] placeholder:text-[#212529] focus:outline-none"
                    />
                    <div className="px-2" onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? (
                        <img
                          src="/icons/eye-open.webp"
                          alt="Hide password"
                          className="max-h-[15px] max-w-5 w-4"
                        />
                      ) : (
                        <img
                          src="/icons/eye-close.png"
                          alt="Show password"
                          className="max-h-[15px] max-w-5 w-4"
                        />
                      )}
                    </div>
                  </div>

                  {errors.password && (
                    <p className="block mt-1 text-[12px] font-normal leading-[1.2] text-[#ff0e25]">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}

                <div>
                  <div className="relative flex h-10 w-full items-center rounded-[6px] bg-white">
                    <div className="px-2">
                      <img
                        src="/icons/lock.svg"
                        alt="Lock"
                        className="max-h-[15px] max-w-5 w-auto"
                      />
                    </div>

                    <input
                      {...register('confirmPassword')}
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Enter Confirm Password*"
                      onInput={(event) => {
                        event.currentTarget.value = sanitizeAlphaNumeric(event.currentTarget.value);
                      }}
                      className="text-sm h-10 font-medium block w-full text-[#212529] placeholder:text-[#212529] focus:outline-none"
                    />

                    <div className="px-2" onClick={() => setShowConfirm((prev) => !prev)}>
                      {showConfirm ? (
                        <img
                          src="/icons/eye-open.webp"
                          alt="Hide password"
                          className="max-h-[15px] max-w-5 w-auto"
                        />
                      ) : (
                        <img
                          src="/icons/eye-close.png"
                          alt="Show password"
                          className="max-h-[15px] max-w-5 w-auto"
                        />
                      )}
                    </div>
                  </div>

                  {errors.confirmPassword && (
                    <p className="block mt-1 text-[12px] font-normal leading-[1.2] text-[#ff0e25]">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {!showReferralField && (
                  <div className="text-right leading-4">
                    <button
                      type="button"
                      onClick={() => setShowReferralField(true)}
                      className="text-sm text-white underline"
                    >
                      Have a referral code?
                    </button>
                  </div>
                )}

                {showReferralField && (
                  <div>
                    <div className="flex h-10 items-center rounded-[6px] bg-white">
                      <span className="flex h-10 w-7 shrink-0 items-center justify-center">
                        <img
                          src="/icons/referral-code.svg"
                          alt=""
                          aria-hidden="true"
                          className="h-[15px] w-[15px]"
                        />
                      </span>
                      <input
                        {...register('referralCode')}
                        type="text"
                        readOnly={Boolean(referralCode)}
                        placeholder="Enter Referral Code"
                        className="block h-10 w-full bg-transparent pr-3 text-sm font-medium text-[#212529] outline-none placeholder:text-[#212529] read-only:opacity-70"
                      />
                    </div>
                    {errors.referralCode && (
                      <p className="mt-1 text-[12px] font-normal leading-[1.2] text-[#ff0e25]">
                        {errors.referralCode.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-[5px]">
                  <button
                    type="submit"
                    disabled={registerLoading || isRegisterDisabled}
                    className="h-10 w-full rounded-[2px] border border-transparent bg-black p-[6px_15px] text-sm font-semibold capitalize text-[#00c6f3] disabled:cursor-not-allowed disabled:border-[#00c6f3] disabled:opacity-60"
                  >
                    {registerLoading ? 'Creating account...' : 'Register'}
                  </button>
                </div>

                <p className="text-center text-white text-sm font-normal">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold underline">
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
