import { cn } from '@/utils';
import { Icons } from '@/utils/icons';
import React from 'react';

function LoaderTwo({ text = 'Loading...', className }: { text: string; className?: string }) {
  return (
    <div className={cn('flex gap-x-3 items-center', className)}>
      <span className="inline-block h-5 w-5 animate-spin">
        <Icons.loader className="h-5 w-5" />
      </span>
      {text}
    </div>
  );
}

export default LoaderTwo;
