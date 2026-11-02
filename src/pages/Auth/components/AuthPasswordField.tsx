import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Icons } from '@/utils/icons';
import { applyInputRules, cn, sanitizeAlphaNumeric } from '@/utils';

interface AuthPasswordFieldProps {
  name: string;
  control: Control<any>;
  placeholder: string;
  inputRules?: {
    noSpace?: boolean;
    maxLength?: number;
  };
  autoComplete?: string;
  className?: string;
}

function AuthPasswordField({
  name,
  control,
  placeholder,
  inputRules,
  autoComplete,
  className,
}: AuthPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <div className={className}>
          <div
            className={cn(
              'flex h-[46px] w-full items-center overflow-hidden rounded-[4px] bg-white',
              error && 'ring-1 ring-red-500'
            )}
          >
            <span className="flex h-full w-11 shrink-0 items-center justify-center text-[#8a8a8a]">
              <Icons.lock className="h-[18px] w-[18px]" />
            </span>
            <input
              {...field}
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder}
              autoComplete={
                autoComplete ?? (name === 'password' ? 'current-password' : 'new-password')
              }
              onChange={(e) => {
                const sanitizedValue = applyInputRules(
                  sanitizeAlphaNumeric(e.target.value),
                  inputRules
                );
                field.onChange(sanitizedValue);
              }}
              className="h-full min-w-0 flex-1 border-0 bg-transparent pr-2 text-[14px] text-[#333] outline-none placeholder:text-[#9ca3af]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="flex h-full w-11 shrink-0 items-center justify-center text-[#8a8a8a] hover:text-[#555]"
            >
              {showPassword ? (
                <img src="/icons/eye-open.webp" className="w-4" />
              ) : (
                <img src="/icons/eye-close.png" className="w-4" />
              )}
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
  );
}

export default AuthPasswordField;
