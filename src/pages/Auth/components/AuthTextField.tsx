import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { applyInputRules, cn } from '@/utils';

interface AuthTextFieldProps {
  name: string;
  control: Control<any>;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
  inputRules?: {
    onlyNumber?: boolean;
    onlyAlphabet?: boolean;
    noSpace?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: RegExp;
  };
  className?: string;
}

function AuthTextField({
  name,
  control,
  placeholder,
  type = 'text',
  autoComplete,
  disabled,
  inputRules,
  className,
}: AuthTextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <div className={className}>
          <div
            className={cn(
              'flex h-[46px] w-full items-center overflow-hidden rounded-[4px] bg-white px-4',
              error && 'ring-1 ring-red-500'
            )}
          >
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
              onChange={(e) => {
                const sanitizedValue = applyInputRules(e.target.value, inputRules);
                field.onChange(sanitizedValue);
              }}
              className="h-full w-full border-0 bg-transparent text-[14px] text-[#333] outline-none placeholder:text-[#9ca3af] disabled:opacity-60"
            />
          </div>
          {error && <p className="mt-1 text-xs text-red-300">{error.message}</p>}
        </div>
      )}
    />
  );
}

export default AuthTextField;
