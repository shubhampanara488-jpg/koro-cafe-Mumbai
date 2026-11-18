import { useState } from 'react';
import { Coffee } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  loading?: 'eager' | 'lazy';
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  loading = 'lazy',
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#EDE4D7] via-[#E5D7C4] to-[#D6BFA5] text-[#3B241B]/70 p-6 text-center ${className}`}
      >
        <Coffee className="w-7 h-7 mb-2 text-[#8A6B4F]" strokeWidth={1.5} />
        {fallbackTitle && (
          <span className="font-serif text-sm font-medium text-[#3B241B]/80 max-w-[18ch] leading-snug">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
