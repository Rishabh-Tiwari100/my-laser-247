import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';

interface AuthSubmitButtonProps {
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

function AuthSubmitButton({ label, isLoading, disabled, className }: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className={cn(
        'mt-2 flex h-[46px] w-full items-center justify-center rounded-[4px] border border-transparent bg-[#060d18] text-[15px] font-medium tracking-wide text-[#0cddff] transition-colors hover:bg-[#0a1525] disabled:cursor-not-allowed disabled:border-[#00c6f3] disabled:opacity-60',
        className
      )}
    >
      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : label}
    </button>
  );
}

export default AuthSubmitButton;
