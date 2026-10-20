import React, { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  aspectRatio?: string;
  overlayClass?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackText,
  aspectRatio = '4/5',
  style,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div
        style={{
          aspectRatio,
          backgroundColor: '#F6F0E6',
          border: '1px solid rgba(101, 31, 50, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          color: '#651F32',
          ...style,
        }}
        className={className}
      >
        <span style={{ fontSize: '28px', marginBottom: '8px', opacity: 0.8 }}>❦</span>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', letterSpacing: '0.04em' }}>
          {fallbackText || alt || 'Editorial Photography'}
        </span>
        <span style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          TajukKisah Fine Imagery
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#F6F0E6',
        aspectRatio,
        ...style,
      }}
      className={className}
    >
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s ease',
        }}
        {...props}
      />
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #F6F0E6 0%, #FAF6EE 50%, #F6F0E6 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.8s infinite',
          }}
        />
      )}
    </div>
  );
};
