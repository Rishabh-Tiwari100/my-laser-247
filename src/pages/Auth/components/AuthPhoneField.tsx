import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Value } from 'react-phone-number-input';
import { PhoneInput } from '@/components';
import type { PhoneData } from '@/components/common/PhoneInput';
import { cn } from '@/utils';

interface AuthPhoneFieldProps {
  name: string;
  control: Control<any>;
  setPhone: (data: PhoneData) => void;
  disabled?: boolean;
  onGetOtp?: () => void;
  otpLoading?: boolean;
  active?: boolean;
  className?: string;
}

function AuthPhoneField({
  name,
  control,
  setPhone,
  disabled,
  onGetOtp,
  otpLoading,
  active,
  className,
}: AuthPhoneFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <div className={className}>
          <div
            className={cn(
              'flex h-[46px] w-full items-stretch overflow-hidden rounded-[4px] bg-white',
              error && 'ring-1 ring-red-500'
            )}
          >
            <div className="auth-phone-field min-w-0 flex-1">
              <PhoneInput
                value={field.value as Value}
                defaultCountry="IN"
                disabled={disabled || active}
                placeholder="Enter Mobile Number*"
                onChange={(phoneData) => {
                  setPhone(phoneData);
                  field.onChange(phoneData.fullNumber);
                }}
              />
            </div>
            {onGetOtp && (
              <button
                type="button"
                onClick={onGetOtp}
                disabled={otpLoading || active}
                className="shrink-0 bg-[#2563eb] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {active ? 'Sent' : 'Get OTP'}
              </button>
            )}
          </div>
          {error && <p className="mt-1 text-xs text-red-300">{error.message}</p>}
        </div>
      )}
    />
  );
}

export default AuthPhoneField;
