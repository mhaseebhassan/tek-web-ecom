'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FALLBACK_IMAGE, resolveImageSrc } from '@/lib/images';

export default function SafeImage({ src, alt = '', onError, ...props }) {
  const [currentSrc, setCurrentSrc] = useState(() => resolveImageSrc(src));

  useEffect(() => {
    setCurrentSrc(resolveImageSrc(src));
  }, [src]);

  const handleError = (event) => {
    if (currentSrc !== FALLBACK_IMAGE) {
      setCurrentSrc(FALLBACK_IMAGE);
    }
    onError?.(event);
  };

  return <Image {...props} src={currentSrc} alt={alt} onError={handleError} />;
}
