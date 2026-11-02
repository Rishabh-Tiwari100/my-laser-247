import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
}

const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  title = 'Enter MFA OTP',
  description = 'Enter the 6-digit verification code to continue.',
  submitLabel = 'Verify OTP',
}) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!isOpen) return;

    setOtp(Array(6).fill(''));
    window.setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 0);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);

    if (!pastedValue) return;

    const updatedOtp = Array(6).fill('');

    pastedValue.split('').forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);

    const focusIndex = Math.min(pastedValue.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join('');

    if (otpValue.length !== 6) return;

    onSubmit(otpValue);
  };

  const otpValue = otp.join('');
  const isOtpComplete = otpValue.length === 6;

  return createPortal(
    <div className="fixed inset-0 z-[5000000000000006] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 transition hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                autoFocus={index === 0}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="h-12 w-12 rounded-lg border border-gray-300 text-center text-xl font-semibold text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!isOtpComplete || isLoading}
            className="mt-6 flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isLoading ? 'Verifying...' : submitLabel}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default OtpModal;
