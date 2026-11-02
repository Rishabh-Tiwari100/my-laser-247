import React from 'react';

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`relative w-full aspect-[4/3] overflow-hidden rounded-md bg-gray-800 ${className}`}
  >
    <div className="absolute inset-0 bg-gray-700" />
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-500/20 to-transparent" />
  </div>
);

export default Skeleton;
