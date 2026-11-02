import React, { useState } from 'react';

interface ImageKitImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  useImageKit?: boolean;
  transformations?: string;
  fallbackSrc?: string;
  className?: string;
}

const ImageKitImage: React.FC<ImageKitImageProps> = ({
  src,
  alt = '',
  useImageKit = false,
  transformations = '',
  className = '',
  fallbackSrc,
  ...rest
}) => {
  const baseURL = import.meta.env.VITE_IMAGEKIT_BASE_URL || '';
  const [imgSrc, setImgSrc] = useState<string>(getImageUrl(src));

  function getImageUrl(path: string): string {
    if (useImageKit) {
      return `${baseURL}${path}${transformations}`;
    }
    return path;
  }

  const handleError = () => {
    if (fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
      {...rest}
    />
  );
};

export default ImageKitImage;
