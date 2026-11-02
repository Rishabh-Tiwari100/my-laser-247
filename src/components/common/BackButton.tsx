import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '@/utils/icons';
import { cn } from '@/utils';

interface BackButtonProps {
  path?: string | number;
  date?: string;
  name?: string;
  hideBackButton?: boolean;
  className?: string;
  backButtonClassName?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  path = -1,
  date,
  name,
  className,
  backButtonClassName,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'mb-1 px-2 py-1.5 text-white bg-primary w-full flex items-center gap-x-2 md:gap-x-8 border border-b-[3px] border-r-[3px] border-black rounded-md',
        className
      )}
    >
      <button
        onClick={() => {
          typeof path === 'number' ? navigate(path) : navigate(path);
        }}
        className={cn('flex items-center gap-x-1', backButtonClassName)}
      >
        <Icons.angularLeftArrow />
        <span className="text-sm">Back</span>
      </button>

      {(date || name) && (
        <div className="flex items-center gap-x-3 text-xs md:text-sm">
          {date && <span className="font-bold whitespace-nowrap border-r-2 pr-2">{date}</span>}
          {name && (
            <span className="font-semibold md:font-medium text-left line-clamp-1">{name}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default BackButton;
