import { Icons } from '@/utils/icons';
import React, { useState } from 'react';

interface ImageLoaderProps {
  src: string;
  alt?: string;
  onClick?: () => void;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({ src, alt = '', onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full cursor-pointer group" onClick={onClick}>
      {/* Show skeleton while loading */}
      {!loaded && !error && <GameSkeleton />}

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
          <span className="text-gray-400 text-sm">No Image</span>
        </div>
      ) : (
        <>
          <img
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className={`aspect-[4/5] rounded-lg shadow-md object-cover transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Hover Play Button Overlay */}
          {loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
              <Icons.playButton className="h-9 w-9 text-white" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageLoader;

const GameSkeletonComponent = () => (
  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-gray-800">
    <div className="absolute inset-0 bg-gray-700" />
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-500/20 to-transparent" />
  </div>
);

const GameSkeleton = React.memo(GameSkeletonComponent);
