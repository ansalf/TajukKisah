import React from 'react';
import { SafeImage } from './SafeImage';

interface PhotoLayoutProps {
  photos: string[];
  variant?: 'editorial-asymmetric' | 'triptych' | 'featured-portrait';
  caption?: string;
}

export const WeddingPhotoLayout: React.FC<PhotoLayoutProps> = ({
  photos,
  variant = 'editorial-asymmetric',
  caption,
}) => {
  if (variant === 'triptych') {
    return (
      <div style={{ margin: '40px 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
          }}
        >
          {photos.slice(0, 3).map((photo, i) => (
            <div
              key={i}
              style={{
                border: '1px solid var(--color-border-subtle)',
                padding: '8px',
                backgroundColor: 'var(--color-warm-white)',
                boxShadow: 'var(--shadow-subtle)',
              }}
            >
              <SafeImage src={photo} alt={`Editorial couple vignette ${i + 1}`} aspectRatio="3/4" />
            </div>
          ))}
        </div>
        {caption && (
          <p
            style={{
              textAlign: 'center',
              fontStyle: 'italic',
              fontFamily: 'var(--font-serif)',
              fontSize: '1rem',
              color: 'var(--color-charcoal-muted)',
              marginTop: '16px',
            }}
          >
            — {caption}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'featured-portrait') {
    return (
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '16px',
          backgroundColor: 'var(--color-warm-white)',
          border: '1px solid var(--color-border-gold)',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
        }}
      >
        <div style={{ border: '1px solid rgba(199, 166, 106, 0.4)', padding: '6px' }}>
          <SafeImage src={photos[0]} alt="Featured couple portrait" aspectRatio="4/5" />
        </div>
        {caption && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                color: 'var(--color-espresso)',
                letterSpacing: '0.04em',
              }}
            >
              {caption}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Editorial Asymmetric default with mobile responsive stacking
  return (
    <div style={{ margin: '48px 0' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'center',
        }}
      >
        {/* Main Large Hero vignette */}
        <div
          style={{
            border: '1px solid var(--color-border-subtle)',
            padding: '12px',
            backgroundColor: 'var(--color-warm-white)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <SafeImage src={photos[0]} alt="Primary portrait" aspectRatio="3/4" />
        </div>

        {/* Secondary Stacked vignettes */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {photos[1] && (
            <div
              style={{
                border: '1px solid var(--color-border-subtle)',
                padding: '10px',
                backgroundColor: 'var(--color-warm-white)',
                boxShadow: 'var(--shadow-subtle)',
              }}
            >
              <SafeImage src={photos[1]} alt="Secondary candid moment" aspectRatio="4/3" />
            </div>
          )}
          {photos[2] && (
            <div
              style={{
                border: '1px solid var(--color-border-subtle)',
                padding: '10px',
                backgroundColor: 'var(--color-warm-white)',
                boxShadow: 'var(--shadow-subtle)',
              }}
            >
              <SafeImage src={photos[2]} alt="Botanical details" aspectRatio="4/3" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
