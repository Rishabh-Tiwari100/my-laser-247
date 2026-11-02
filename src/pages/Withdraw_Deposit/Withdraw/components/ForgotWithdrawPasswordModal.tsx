import { useEffect, useId, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import toast from 'react-hot-toast';
import type { RootState } from '@/store';
import { useResetWithdrawPasswordMutation } from '@/store/api/accountApi';
import { useSendOtpMutation } from '@/store/api/authApi';
import { sanitizeAlphaNumeric } from '@/utils';

const OTP_EXPIRY_SECONDS = 5 * 60;

const forgotWithdrawPasswordSchema = z
  .object({
    otp: z
      .string()
      .length(6, 'OTP must be exactly 6 digits')
      .regex(/^\d{6}$/, 'OTP must contain numbers only'),
    withdrawPassword: z
      .string()
      .min(8, 'Withdraw Password must be at least 8 characters long')
      .max(20, 'Withdraw Password must not exceed 20 characters')
      .regex(/^[a-zA-Z0-9]+$/, 'Withdraw Password can contain only letters and numbers'),
    confirmWithdrawPassword: z
      .string()
      .min(1, 'Confirm Withdraw Password is required')
      .regex(/^[a-zA-Z0-9]+$/, 'Withdraw Password can contain only letters and numbers'),
  })
  .refine((values) => values.withdrawPassword === values.confirmWithdrawPassword, {
    message: 'Withdraw Passwords do not match',
    path: ['confirmWithdrawPassword'],
  });

type ForgotWithdrawPasswordForm = z.infer<typeof forgotWithdrawPasswordSchema>;

interface ForgotWithdrawPasswordModalProps {
  mobile?: string | null;
  open: boolean;
  onClose: () => void;
}

const focusableSelector = [
  'button:not([disabled])',
  'input:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const formatTimer = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export default function ForgotWithdrawPasswordModal({
  mobile,
  open,
  onClose,
}: ForgotWithdrawPasswordModalProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(OTP_EXPIRY_SECONDS);
  const [showWithdrawPassword, setShowWithdrawPassword] = useState(false);
  const [showConfirmWithdrawPassword, setShowConfirmWithdrawPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const otpInputRef = useRef<HTMLInputElement | null>(null);
  const titleId = useId();
  const [resetWithdrawPassword, { isLoading: isSubmitting }] = useResetWithdrawPasswordMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const registeredCountry = useSelector((state: RootState) => state.user.profile?.country) || 'IN';

  const mobileLastFourDigits = useMemo(() => {
    const mobileDigits = mobile?.replace(/\D/g, '') ?? '';
    return mobileDigits.slice(-4) || '4437';
  }, [mobile]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotWithdrawPasswordForm>({
    resolver: zodResolver(forgotWithdrawPasswordSchema),
    defaultValues: {
      otp: '',
      withdrawPassword: '',
      confirmWithdrawPassword: '',
    },
  });

  useEffect(() => {
    if (!open) {
      setOtpSent(false);
      return undefined;
    }

    if (!mobile) {
      toast.error('No registered mobile number found.');
      onClose();
      return undefined;
    }

    let cancelled = false;
    const toastId = { id: 'withdraw-forgot-password-otp' };
    (async () => {
      try {
        await sendOtp({ mobile, country: registeredCountry, type: 'reset-password' }).unwrap();
        if (cancelled) return;
        toast.success('OTP sent successfully.', toastId);
        setOtpSent(true);
      } catch (error: any) {
        if (cancelled) return;
        toast.error(error?.data?.message || 'Failed to send OTP.', toastId);
        onClose();
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mobile]);

  useEffect(() => {
    if (!otpSent) return undefined;

    setSecondsRemaining(OTP_EXPIRY_SECONDS);
    const intervalId = window.setInterval(() => {
      setSecondsRemaining((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [otpSent]);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      );
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (!firstFocusableElement || !lastFocusableElement) return;
      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!otpSent) return undefined;
    const focusTimer = window.setTimeout(() => otpInputRef.current?.focus(), 0);
    return () => window.clearTimeout(focusTimer);
  }, [otpSent]);

  useEffect(() => {
    if (open) return;
    reset();
    setSecondsRemaining(OTP_EXPIRY_SECONDS);
    setShowWithdrawPassword(false);
    setShowConfirmWithdrawPassword(false);
  }, [open, reset]);

  if (!open) return null;

  const submitForgotWithdrawPassword = async (values: ForgotWithdrawPasswordForm) => {
    const toastId = { id: 'reset-withdraw-password' };
    try {
      const response = await resetWithdrawPassword({
        otp: values.otp,
        newPassword: values.withdrawPassword,
        confirmPassword: values.confirmWithdrawPassword,
      }).unwrap();
      toast.success(response?.message || 'Withdraw password reset successfully.', toastId);
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to reset withdraw password.', toastId);
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[5000000000000005] flex items-center justify-center bg-black/50 px-[8px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[calc(100vh-16px)] w-[498px] max-w-[calc(100vw-16px)] overflow-y-auto rounded-[7px] bg-white font-[Arial,Helvetica,sans-serif] text-black shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
      >
        <header className="flex h-[43px] items-center bg-[#243a48] px-[11px] text-white">
          <h2 id={titleId} className="text-[16px] font-normal leading-none">
            Forgot Withdraw Password
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-[2px] ml-auto flex h-[28px] w-[16px] items-center justify-center text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-white"
            aria-label="Close forgot withdraw password dialog"
          >
            <X className="h-[19px] w-[19px]" strokeWidth={1.7} />
          </button>
        </header>

        {!otpSent ? (
          <div className="flex min-h-[120px] items-center justify-center px-[8px] py-[20px] text-[14px]">
            {isSendingOtp ? 'Sending OTP...' : 'Please wait...'}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(submitForgotWithdrawPassword)}
            noValidate
            className="px-[8px] pb-[8px] pt-[10px]"
          >
            <div className="flex h-[30px] justify-center">
              <p className="inline-flex h-[30px] items-center rounded-[3px] bg-[#e9ecef] px-[10px] text-[14px]">
                OTP sent to******&nbsp;<strong>{mobileLastFourDigits}.</strong>
              </p>
            </div>

            <div className="mt-[8px] flex items-center justify-center gap-[8px] text-[12px]">
              <span className="h-px w-[42px] bg-[#ced4da]" aria-hidden="true" />
              <span className="font-bold uppercase text-[#6c757d]">OR</span>
              <span className="h-px w-[42px] bg-[#ced4da]" aria-hidden="true" />
            </div>

            <Link
              to="/my-account/update-mobile-number"
              onClick={onClose}
              className="mx-auto mt-[8px] flex h-[30px] w-fit items-center justify-center rounded-[3px] bg-[#243a48] px-[12px] text-[13px] text-white hover:bg-[#162c3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#12b6cf]"
            >
              Change Mobile Number
            </Link>

            <div className="mt-[10px] rounded-[4px] border border-[#ced4da] p-2">
              <h3 className="mb-[6px] text-[16px] font-bold leading-[19px]">
                Withdraw Instruction
              </h3>
              <div className="space-y-[5px] text-[12px] leading-[18px]">
                <p>
                  Withdraw Password Must be of minimum 8 characters and maximum 20 characters
                  required
                </p>
                <p>Withdraw Password Must have atleast 1 small and 1 capital alphabet</p>
                <p>Withdraw Password Must have atleast 1 Digit and 1 Special character</p>
                <p>Please take a note of your Withdraw Password</p>
              </div>
            </div>

            <div className="mt-[8px]">
              <label
                htmlFor="withdraw-password-otp"
                className="mb-[3px] block text-[13px] leading-[16px]"
              >
                OTP
              </label>
              <div className="flex h-[40px] overflow-hidden rounded-[5px] border border-[#aaa] focus-within:border-[#243a48]">
                <Controller
                  name="otp"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      ref={(element) => {
                        field.ref(element);
                        otpInputRef.current = element;
                      }}
                      id="withdraw-password-otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="Enter OTP*"
                      aria-invalid={Boolean(errors.otp)}
                      aria-describedby={errors.otp ? 'withdraw-password-otp-error' : undefined}
                      onChange={(event) => field.onChange(event.target.value.replace(/\D/g, ''))}
                      className="min-w-0 flex-1 px-[12px] text-[13px] outline-none placeholder:text-[#667080]"
                    />
                  )}
                />
                <span
                  className="flex w-[43px] shrink-0 items-center justify-center bg-[#87949c] text-[12px] font-bold text-white"
                  aria-label={`${formatTimer(secondsRemaining)} remaining`}
                >
                  {formatTimer(secondsRemaining)}
                </span>
              </div>
              {errors.otp && (
                <p id="withdraw-password-otp-error" className="mt-[2px] text-[11px] text-red-600">
                  {errors.otp.message}
                </p>
              )}
            </div>

            <div className="mt-[10px]">
              <label
                htmlFor="new-withdraw-password"
                className="mb-[3px] block text-[13px] leading-[16px]"
              >
                Withdraw Password
              </label>
              <div className="relative">
                <Controller
                  name="withdrawPassword"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="new-withdraw-password"
                      type={showWithdrawPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      maxLength={20}
                      onChange={(event) => field.onChange(sanitizeAlphaNumeric(event.target.value))}
                      placeholder="Enter Withdraw Password*"
                      aria-invalid={Boolean(errors.withdrawPassword)}
                      aria-describedby={
                        errors.withdrawPassword ? 'new-withdraw-password-error' : undefined
                      }
                      className="h-[40px] w-full rounded-[5px] border border-[#aaa] px-[12px] pr-[42px] text-[13px] outline-none placeholder:text-[#667080] focus:border-[#243a48]"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowWithdrawPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex w-[42px] items-center justify-center text-[#222] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#12b6cf]"
                  aria-label={
                    showWithdrawPassword ? 'Hide withdraw password' : 'Show withdraw password'
                  }
                  aria-pressed={showWithdrawPassword}
                >
                  {showWithdrawPassword ? (
                    <Eye className="h-[20px] w-[20px]" strokeWidth={2} />
                  ) : (
                    <EyeOff className="h-[20px] w-[20px]" strokeWidth={2} />
                  )}
                </button>
              </div>
              {errors.withdrawPassword && (
                <p id="new-withdraw-password-error" className="mt-[2px] text-[11px] text-red-600">
                  {errors.withdrawPassword.message}
                </p>
              )}
            </div>

            <div className="mt-[10px]">
              <label
                htmlFor="confirm-withdraw-password"
                className="mb-[3px] block text-[13px] leading-[16px]"
              >
                Confirm Withdraw Password
              </label>
              <div className="relative">
                <Controller
                  name="confirmWithdrawPassword"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="confirm-withdraw-password"
                      type={showConfirmWithdrawPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      maxLength={20}
                      onChange={(event) => field.onChange(sanitizeAlphaNumeric(event.target.value))}
                      placeholder="Enter Confirm Withdraw Password*"
                      aria-invalid={Boolean(errors.confirmWithdrawPassword)}
                      aria-describedby={
                        errors.confirmWithdrawPassword
                          ? 'confirm-withdraw-password-error'
                          : undefined
                      }
                      className="h-[40px] w-full rounded-[5px] border border-[#aaa] px-[12px] pr-[42px] text-[13px] outline-none placeholder:text-[#667080] focus:border-[#243a48]"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmWithdrawPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex w-[42px] items-center justify-center text-[#222] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#12b6cf]"
                  aria-label={
                    showConfirmWithdrawPassword
                      ? 'Hide confirm withdraw password'
                      : 'Show confirm withdraw password'
                  }
                  aria-pressed={showConfirmWithdrawPassword}
                >
                  {showConfirmWithdrawPassword ? (
                    <Eye className="h-[20px] w-[20px]" strokeWidth={2} />
                  ) : (
                    <EyeOff className="h-[20px] w-[20px]" strokeWidth={2} />
                  )}
                </button>
              </div>
              {errors.confirmWithdrawPassword && (
                <p
                  id="confirm-withdraw-password-error"
                  className="mt-[2px] text-[11px] text-red-600"
                >
                  {errors.confirmWithdrawPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-[10px] h-[33px] w-full rounded-[3px] bg-[#243a48] text-[14px] text-white hover:bg-[#162c3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#12b6cf] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </section>
    </div>,
    document.body
  );
}
