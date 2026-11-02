import { Icons } from '@/utils/icons';
import React from 'react';

function NoBetsPlaceHolder({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-primary/20 text-gray-800 font-medium text-sm px-1.5 w-full lg:min-w-[300px] min-h-[250px] flex flex-col gap-y-2 items-center justify-center ${className}`}
    >
      <div className="bg-primary/35 rounded-full p-3">
        <Icons.ban className="h-7 w-7" />
      </div>
      <p className="text-gray-800 text-xs">Your bet slip is empty.</p>
    </div>
  );
}

export default NoBetsPlaceHolder;
