import React from 'react';
import { useDeviceWidth } from '@/hooks/useDeviceWidth';

type LoaderSize = 'sm' | 'md' | 'lg';

interface NotOutLoaderProps {
  size?: LoaderSize;
  className?: string;
}

const sizeConfig = {
  sm: { container: 110, inner: 100, logo: 50, stroke: 10 },
  md: { container: 180, inner: 165, logo: 95, stroke: 15 },
  lg: { container: 240, inner: 220, logo: 110, stroke: 16 },
};

const NotOutLoader: React.FC<NotOutLoaderProps> = ({ size = 'md', className }) => {
  const width = useDeviceWidth();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm">
      <div className="rounded-xl bg-white px-10 py-5 shadow-xl flex flex-col items-center">
        <div className="relative h-5 w-10">
          <div className="absolute left-0 h-5 w-5 rounded-full bg-slate-600 animate-swap-left" />
          <div className="absolute left-5 h-5 w-5 rounded-full bg-amber-400 animate-swap-right" />
        </div>

        <p className="mt-2 text-sm text-slate-600">Loading...</p>
      </div>
    </div>
  );
};

export default NotOutLoader;
