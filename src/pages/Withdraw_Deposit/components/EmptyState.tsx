import React from 'react';
import clsx from 'clsx';

interface EmptyStateProps {
  message?: string;
  className?: string;
  boxClassName?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No account has been added yet.',
  className = '',
  boxClassName = '',
}) => {
  return (
    <div className={clsx('shadow-xl rounded-lg p-2.5 xs:p-4 bg-white', className)}>
      <div
        className={clsx(
          'text-center p-2 xs:p-4 border border-dashed bg-primary/5 border-primary rounded-xl h-[60px] xs:h-[80px] text-15 xs:text-lg md:text-xl xl:text-2xl font-semibold flex items-center justify-center',
          boxClassName
        )}
      >
        {message}
      </div>
    </div>
  );
};

export default EmptyState;
