import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import AuthBrandingPanel from './components/AuthBrandingPanel';
import AuthPasswordField from './components/AuthPasswordField';
import AuthPhoneNumberInput, { PhoneCountry } from './components/AuthPhoneNumberInput';
import AuthSubmitButton from './components/AuthSubmitButton';
import { useForgotPassword } from './hooks/useForgotPassword';

const formatOtpTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

function ForgotPassword() {
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>({
    code: 'IN',
    dialCode: '91',
  });

  const {
    form,
    showOtpField,
    timeLeft,
    active,
    sendingOtp,
    resetting,
    handleSendOtp,
    handleSubmitForm,
  } = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-12">
        <AuthBrandingPanel type="login" />

        <div className="col-span-12 px-3 md:col-span-7">
          <div className="flex items-center justify-center">
            <form
              onSubmit={handleSubmit(handleSubmitForm)}
              autoComplete="off"
              className="w-full max-w-6xl space-y-[9px]"
            >
              <div>
                <div className="flex">
                  <div className="min-w-0 flex-1">
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <AuthPhoneNumberInput
                          value={field.value}
                          onChange={(value) => field.onChange(value ? `+${value}` : '')}
                          onBlur={field.onBlur}
                          inputRef={field.ref}
                          name={field.name}
                          autoComplete="tel"
                          country={phoneCountry}
                          onCountryChange={setPhoneCountry}
                          disabled={active}
                          className="rounded-r-none"
                        />
                      )}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || active}
                    className="h-10 min-w-[68px] whitespace-nowrap rounded-r-[5px] bg-[#5f95ff] px-2 text-sm font-medium text-white transition hover:bg-[#0853c2] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {sendingOtp ? 'Sending...' : active ? formatOtpTime(timeLeft) : 'Get OTP'}
                  </button>
                </div>

                {errors.phone && (
                  <p className="mt-1 text-[12px] font-normal leading-[1.2] text-[#ff0e25]">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {showOtpField && (
                <div>
                  <div className="flex h-10 items-center rounded-[5px] bg-white">
                    <span className="flex h-10 w-7 shrink-0 items-center justify-center">
                      <img
                        src="/icons/key.svg"
                        alt=""
                        aria-hidden="true"
                        className="h-[18px] w-[18px]"
                      />
                    </span>
                    <Controller
                      name="otp"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          onChange={(event) =>
                            field.onChange(event.target.value.replace(/\D/g, '').slice(0, 6))
                          }
                          placeholder="Enter OTP*"
                          className="block h-10 w-full bg-transparent text-sm font-medium text-[#212529] outline-none placeholder:text-[#212529]"
                        />
                      )}
                    />
                  </div>
                  {errors.otp && (
                    <p className="mt-1 text-[12px] font-normal leading-[1.2] text-[#ff0e25]">
                      {errors.otp.message}
                    </p>
                  )}
                </div>
              )}

              <AuthPasswordField
                name="newPassword"
                control={control}
                placeholder="Enter Password*"
                inputRules={{ noSpace: true, maxLength: 20 }}
                autoComplete="new-password"
                className="[&>div:first-child]:!h-10 [&>div:first-child]:!rounded-[5px] [&_input]:placeholder:!text-[#111827] [&_input]:!text-[#111827] [&_span]:!w-7 [&_button]:!w-9"
              />

              <AuthPasswordField
                name="confirmPassword"
                control={control}
                placeholder="Enter Confirm Password*"
                inputRules={{ noSpace: true, maxLength: 20 }}
                autoComplete="new-password"
                className="[&>div:first-child]:!h-10 [&>div:first-child]:!rounded-[5px] [&_input]:placeholder:!text-[#111827] [&_input]:!text-[#111827] [&_span]:!w-7 [&_button]:!w-9"
              />

              <AuthSubmitButton
                label="Update Password"
                isLoading={resetting}
                disabled={!isValid}
                className="!mt-[18px] !h-10 !rounded-[2px] !bg-black !text-sm !font-semibold !tracking-normal !text-[#00c6f3] hover:!bg-[#070707]"
              />

              <div className="space-y-0 text-center text-sm leading-5 text-white">
                <p>
                  Remember Your Password?{' '}
                  <Link to="/login" className="font-semibold underline underline-offset-1">
                    Login
                  </Link>
                </p>
                <Link
                  to="/register"
                  className="inline-block font-semibold underline underline-offset-1"
                >
                  Create New Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
