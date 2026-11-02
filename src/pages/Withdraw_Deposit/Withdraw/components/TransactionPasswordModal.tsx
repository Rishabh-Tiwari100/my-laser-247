import { useEffect, useId, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useSetWithdrawPasswordMutation } from '@/store/api/accountApi';
import { sanitizeAlphaNumeric } from '@/utils';

const transactionPasswordSchema = z
  .object({
    transactionPassword: z
      .string()
      .min(8, 'Transaction Password must be at least 8 characters long')
      .max(20, 'Transaction Password must not exceed 20 characters')
      .regex(/^[a-zA-Z0-9]+$/, 'Transaction Password can contain only letters and numbers'),
    confirmTransactionPassword: z
      .string()
      .min(1, 'Confirm Transaction Password is required')
      .regex(/^[a-zA-Z0-9]+$/, 'Transaction Password can contain only letters and numbers'),
  })
  .refine((values) => values.transactionPassword === values.confirmTransactionPassword, {
    message: 'Transaction Passwords do not match',
    path: ['confirmTransactionPassword'],
  });

type TransactionPasswordForm = z.infer<typeof transactionPasswordSchema>;

interface TransactionPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const focusableSelector = [
  'button:not([disabled])',
  'input:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function TransactionPasswordModal({ open, onClose }: TransactionPasswordModalProps) {
  const [showTransactionPassword, setShowTransactionPassword] = useState(false);
  const [showConfirmTransactionPassword, setShowConfirmTransactionPassword] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const titleId = useId();
  const [setWithdrawPassword, { isLoading: isSubmitting }] = useSetWithdrawPasswordMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionPasswordForm>({
    resolver: zodResolver(transactionPasswordSchema),
    defaultValues: {
      transactionPassword: '',
      confirmTransactionPassword: '',
    },
  });

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => passwordInputRef.current?.focus(), 0);

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
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose, open]);

  useEffect(() => {
    if (open) return;
    reset();
    setShowTransactionPassword(false);
    setShowConfirmTransactionPassword(false);
  }, [open, reset]);

  if (!open) return null;

  const submitTransactionPassword = async (values: TransactionPasswordForm) => {
    const toastId = { id: 'set-withdraw-password' };
    try {
      const response = await setWithdrawPassword({
        newPassword: values.transactionPassword,
        confirmPassword: values.confirmTransactionPassword,
      }).unwrap();
      toast.success(response?.message || 'Withdraw password set successfully.', toastId);
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to set withdraw password.', toastId);
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[5000000000000004] flex items-center justify-center bg-black/50 px-[8px]"
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
        <header className="flex h-[42px] items-center bg-[#243a48] px-[11px] text-white">
          <h2 id={titleId} className="text-[16px] font-bold leading-none">
            Update Transaction Password
          </h2>
        </header>

        <form
          onSubmit={handleSubmit(submitTransactionPassword)}
          noValidate
          className="px-[8px] pb-[8px] pt-[9px]"
        >
          <div className="rounded-[4px] border border-[#ced4da] p-2">
            <h3 className="mb-[6px] text-[16px] font-bold leading-[19px]">
              Transaction Instruction
            </h3>
            <div className="space-y-[5px] text-[12px] leading-[18px]">
              <p>
                Transaction Password Must be of minimum 8 characters and maximum 20 characters
                required
              </p>
              <p>Transaction Password Must have atleast 1 small and 1 capital alphabet</p>
              <p>Transaction Password Must have atleast 1 Digit and 1 Special character</p>
              <p>Please take a note of your Transaction Password</p>
            </div>
          </div>

          <div className="mt-[8px]">
            <label
              htmlFor="transaction-password"
              className="mb-[3px] block text-[13px] leading-[16px]"
            >
              Transaction Password
            </label>
            <div className="relative">
              <Controller
                name="transactionPassword"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    ref={(element) => {
                      field.ref(element);
                      passwordInputRef.current = element;
                    }}
                    id="transaction-password"
                    type={showTransactionPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    maxLength={20}
                    onChange={(event) => field.onChange(sanitizeAlphaNumeric(event.target.value))}
                    placeholder="Enter Transaction Password*"
                    aria-invalid={Boolean(errors.transactionPassword)}
                    aria-describedby={
                      errors.transactionPassword ? 'transaction-password-error' : undefined
                    }
                    className="h-[40px] w-full rounded-[5px] border border-[#aaa] px-[12px] pr-[42px] text-[13px] outline-none placeholder:text-[#667080] focus:border-[#243a48]"
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowTransactionPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 flex w-[42px] items-center justify-center text-[#222] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#12b6cf]"
                aria-label={
                  showTransactionPassword
                    ? 'Hide transaction password'
                    : 'Show transaction password'
                }
                aria-pressed={showTransactionPassword}
              >
                {showTransactionPassword ? (
                  <Eye className="h-[20px] w-[20px]" strokeWidth={2} />
                ) : (
                  <EyeOff className="h-[20px] w-[20px]" strokeWidth={2} />
                )}
              </button>
            </div>
            {errors.transactionPassword && (
              <p id="transaction-password-error" className="mt-[2px] text-[11px] text-red-600">
                {errors.transactionPassword.message}
              </p>
            )}
          </div>

          <div className="mt-[10px]">
            <label
              htmlFor="confirm-transaction-password"
              className="mb-[3px] block text-[13px] leading-[16px]"
            >
              Confirm Transaction Password
            </label>
            <div className="relative">
              <Controller
                name="confirmTransactionPassword"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="confirm-transaction-password"
                    type={showConfirmTransactionPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    maxLength={20}
                    onChange={(event) => field.onChange(sanitizeAlphaNumeric(event.target.value))}
                    placeholder="Enter Confirm Transaction Password*"
                    aria-invalid={Boolean(errors.confirmTransactionPassword)}
                    aria-describedby={
                      errors.confirmTransactionPassword
                        ? 'confirm-transaction-password-error'
                        : undefined
                    }
                    className="h-[40px] w-full rounded-[5px] border border-[#aaa] px-[12px] pr-[42px] text-[13px] outline-none placeholder:text-[#667080] focus:border-[#243a48]"
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmTransactionPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 flex w-[42px] items-center justify-center text-[#222] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#12b6cf]"
                aria-label={
                  showConfirmTransactionPassword
                    ? 'Hide confirm transaction password'
                    : 'Show confirm transaction password'
                }
                aria-pressed={showConfirmTransactionPassword}
              >
                {showConfirmTransactionPassword ? (
                  <Eye className="h-[20px] w-[20px]" strokeWidth={2} />
                ) : (
                  <EyeOff className="h-[20px] w-[20px]" strokeWidth={2} />
                )}
              </button>
            </div>
            {errors.confirmTransactionPassword && (
              <p
                id="confirm-transaction-password-error"
                className="mt-[2px] text-[11px] text-red-600"
              >
                {errors.confirmTransactionPassword.message}
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
      </section>
    </div>,
    document.body
  );
}
