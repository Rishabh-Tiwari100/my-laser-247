import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils';
import { Icons } from '@/utils/icons';

interface BackButtonSmallProps {
  path?: string | number;
  className?: string;
  label?: string;
}

const BackButtonSmall: React.FC<BackButtonSmallProps> = ({ path = -1, className, label = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof path === 'number') navigate(path);
    else navigate(path);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex sm:hidden items-center gap-x-1 rounded bg-black p-1 text-white mb-1.5',
        className
      )}
    >
      <Icons.angularLeftArrow className="h-3 w-3" />
      {label && <span className="text-sm">{label}</span>}
    </button>
  );
};

export default BackButtonSmall;
