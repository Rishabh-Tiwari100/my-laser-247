import React from 'react';
import { cn } from '@/utils';

interface LiveIconProps {
  label?: number | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LiveIcon: React.FC<LiveIconProps> = ({ label, className, size = 'sm' }) => {
  const sizes = {
    sm: {
      container: 'text-[10px]',
      outer: 'text-[8px]',
      inner: 'text-[6px]',
      dot: 'w-1 h-1',
      signal: 'px-[2px]',
      label: 'px-1',
    },
    md: {
      container: 'text-[12px]',
      outer: 'text-[10px]',
      inner: 'text-[8px]',
      dot: 'w-1.5 h-1.5',
      signal: 'px-[4px]',
      label: 'px-1.5',
    },
    lg: {
      container: 'text-[14px]',
      outer: 'text-[12px]',
      inner: 'text-[10px]',
      dot: 'w-2 h-2',
      signal: 'px-[6px]',
      label: 'px-2',
    },
  };

  const s = sizes[size];

  return (
    <span
      className={cn(
        'absolute bg-red-600 z-50 text-white rounded-sm flex items-stretch overflow-hidden',
        s.container,
        className
      )}
    >
      <span
        className={cn(
          'bg-white flex items-center justify-center text-red-600 leading-none',
          s.signal
        )}
      >
        <span className={cn(s.outer, 'animate-[pulse_2s_ease-in-out_infinite]')}>(</span>
        <span className={cn(s.inner, 'animate-[pulse_2s_ease-in-out_infinite]')}>(</span>

        <span
          className={cn(
            s.dot,
            'bg-red-600 rounded-full animate-[pulse_2s_ease-in-out_infinite] mx-[1px]'
          )}
        />

        <span className={cn(s.inner, 'animate-[pulse_2s_ease-in-out_infinite]')}>)</span>
        <span className={cn(s.outer, 'animate-[pulse_2s_ease-in-out_infinite]')}>)</span>
      </span>

      {label && <span className={cn(s.label, 'flex items-center whitespace-nowrap')}>{label}</span>}
    </span>
  );
};

export default LiveIcon;
