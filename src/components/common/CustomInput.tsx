import React, { useState } from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/utils/icons';
import { applyInputRules, cn, sanitizeAlphaNumeric } from '@/utils';

interface CustomInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  error?: FieldError;
  inputRules?: {
    onlyNumber?: boolean;
    onlyAlphaNumeric?: boolean;
    onlyAlphabet?: boolean;
    noSpace?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: RegExp;
  };
  [key: string]: any;
}

const CustomInput: React.FC<CustomInputProps> = ({
  name,
  control,
  label,
  type = 'text',
  placeholder,
  className = '',
  labelClassName = 'text-white',
  inputClassName = '',
  inputRules,
  //   error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={name} className={cn('text-sm', labelClassName)}>
          {label}
        </label>
      )}

      <div>
        <Controller
          name={name}
          control={control}
          defaultValue={''}
          render={({ field, fieldState: { error } }) => (
            <>
              <div className="relative">
                <Input
                  id={name}
                  type={inputType}
                  placeholder={placeholder}
                  {...field}
                  {...props}
                  onChange={(e) => {
                    const baseValue = isPassword ? sanitizeAlphaNumeric(e.target.value) : e.target.value;
                    const sanitizedValue = applyInputRules(baseValue, inputRules);
                    field.onChange(sanitizedValue);
                  }}
                  className={`!h-[38px] ${error ? 'border-red-[500]' : ''} ${
                    isPassword ? 'pr-10' : ''
                  } ${inputClassName}`}
                />
                {/* Password eye toggle */}
                {isPassword && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Icons.openEye className="!h-5 !w-5" />
                    ) : (
                      <Icons.closeEye className="!h-5 !w-5" />
                    )}
                  </Button>
                )}
              </div>
              {error && <p className="text-xs text-destructive mt-1">{error.message}</p>}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default CustomInput;
