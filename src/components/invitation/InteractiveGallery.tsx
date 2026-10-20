import React, { useState } from 'react';
import { GalleryItem } from '../../data/invitationData';
import { SafeImage } from '../common/SafeImage';
import { X, ChevronLeft, ChevronRight, Maximize2, MapPin } from 'lucide-react';

interface InteractiveGalleryProps {
  items: GalleryItem[];
  accentColor?: string;
  borderColor?: string;
}

export const InteractiveGallery: React.FC<InteractiveGalleryProps> = ({
  items,
  accentColor = 'var(--color-burgundy)',
  borderColor = 'rgba(101, 31, 50, 0.15)',
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % items.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + items.length) % items.length);
    }
  };

  React.useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % items.length : null));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, items.length]);

  return (
    <div style={{ margin: '40px 0' }}>
      {/* Grid of photos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {items.map((item, idx) => (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => openLightbox(idx)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(idx);
              }
            }}
            aria-label={`View full photo: ${item.caption || item.alt}`}
            style={{
              cursor: 'pointer',
              border: `1px solid ${borderColor}`,
              padding: '6px',
              backgroundColor: '#FFFFFF',
              position: 'relative',
              boxShadow: '0 4px 16px rgba(42, 21, 27, 0.04)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            className="gallery-thumb"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(42, 21, 27, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(42, 21, 27, 0.04)';
            }}
          >
            <SafeImage src={item.src} alt={item.alt} aspectRatio="4/5" />
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(255, 252, 247, 0.9)',
                padding: '4px',
                borderRadius: '1px',
                color: accentColor,
                opacity: 0.85,
              }}
            >
              <Maximize2 size={12} />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo Gallery Lightbox"
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(30, 14, 19, 0.95)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          {/* Top Bar with counter & close */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '24px',
              right: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#FFFCF7',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8125rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                opacity: 0.9,
              }}
            >
              {lightboxIndex + 1} of {items.length}
            </span>
            <button
              onClick={closeLightbox}
              className="touch-target"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
              aria-label="Close photo preview"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {/* Centered Image Showcase */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '850px',
              maxHeight: '75vh',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            <img
              src={items[lightboxIndex].src}
              alt={items[lightboxIndex].alt}
              style={{
                maxHeight: '65vh',
                maxWidth: '100%',
                objectFit: 'contain',
                margin: '0 auto',
                border: '1px solid rgba(199, 166, 106, 0.4)',
                boxShadow: '0 20px 48px rgba(0,0,0,0.5)',
              }}
            />
            {/* Caption & Location */}
            <div style={{ marginTop: '16px', color: '#FFFCF7' }}>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  fontStyle: 'italic',
                  color: '#FFFCF7',
                }}
              >
                {items[lightboxIndex].caption}
              </p>
              {items[lightboxIndex].location && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-gold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '4px',
                  }}
                >
                  <MapPin size={12} />
                  {items[lightboxIndex].location}
                </span>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <button
            onClick={prevImage}
            style={{
              position: 'absolute',
              left: '24px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="Previous photograph"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextImage}
            style={{
              position: 'absolute',
              right: '24px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="Next photograph"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};
