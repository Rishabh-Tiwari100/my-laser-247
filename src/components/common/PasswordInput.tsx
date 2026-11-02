import React, { useState } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/utils/icons';
import { cn, sanitizeAlphaNumeric } from '@/utils';

interface PasswordInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  placeholder: string;
  autoComplete?: string;
}

function PasswordInput<T extends FieldValues>({
  name,
  control,
  placeholder,
  autoComplete,
}: PasswordInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <div className="relative">
            <Input
              {...field}
              id={name}
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder}
              autoComplete={autoComplete}
              onChange={(event) => field.onChange(sanitizeAlphaNumeric(event.target.value))}
              className={cn(
                'h-[38px] rounded-[3px] border border-[#ced4da] px-3 pr-10 text-sm text-[#212529] shadow-[0_1px_4px_#0000001a]',
                error && 'border-red-500'
              )}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-0 top-1/2 h-full -translate-y-1/2 px-3 hover:bg-transparent"
            >
              {showPassword ? (
                <Icons.openEye className="h-5 w-5" />
              ) : (
                <Icons.closeEye className="h-5 w-5" />
              )}
            </Button>
          </div>

          {error && <p className="mt-1 text-xs text-destructive">{error.message}</p>}
        </div>
      )}
    />
  );
}
export default PasswordInput;
