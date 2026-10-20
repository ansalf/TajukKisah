import React from 'react';
import { Button } from '../common/Button';
import { SafeImage } from '../common/SafeImage';
import { MailOpen, Sparkles } from 'lucide-react';

interface InvitationCoverProps {
  groomName: string;
  brideName: string;
  dateFormatted: string;
  guestName: string;
  heroPhoto: string;
  accentColor?: string;
  textColor?: string;
  backgroundColor?: string;
  isExiting?: boolean;
  onOpenInvitation: () => void;
}

export const InvitationCover: React.FC<InvitationCoverProps> = ({
  groomName,
  brideName,
  dateFormatted,
  guestName,
  heroPhoto,
  accentColor = '#651F32',
  textColor = '#2A151B',
  backgroundColor = '#FAF6EE',
  isExiting = false,
  onOpenInvitation,
}) => {
  return (
    <div
      className={isExiting ? 'invitation-cover-exit' : ''}
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(16px, 4vw, 24px)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.6s ease, opacity 0.6s ease',
      }}
    >
      {/* Background Arch Overlay & Ambient Imagery */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          backgroundImage: `url(${heroPhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
        }}
      />

      {/* Main Luxury Envelope / Card Surface */}
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          backgroundColor: '#FFFCF7',
          border: '1px solid rgba(199, 166, 106, 0.4)',
          boxShadow: '0 24px 64px rgba(42, 21, 27, 0.12)',
          padding: 'clamp(32px, 6vw, 56px) clamp(24px, 5vw, 44px)',
          position: 'relative',
          textAlign: 'center',
          borderRadius: '2px',
        }}
      >
        {/* Subtle Decorative Arch Border */}
        <div
          style={{
            border: '1px solid rgba(101, 31, 50, 0.12)',
            padding: 'clamp(20px, 4vw, 36px) clamp(16px, 3vw, 28px)',
            position: 'relative',
          }}
        >
          {/* Atelier Brand Tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-gold-text)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              marginBottom: '20px',
            }}
          >
            <Sparkles size={13} aria-hidden="true" />
            <span>TajukKisah Wedding Invitation</span>
          </div>

          {/* Couple Names */}
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 6vw, 3.75rem)',
              fontWeight: 400,
              color: textColor,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: '8px',
            }}
          >
            {groomName}
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                color: accentColor,
                margin: '4px 0',
              }}
            >
              &amp;
            </span>
            {brideName}
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: textColor,
              opacity: 0.9,
              marginBottom: '32px',
            }}
          >
            {dateFormatted}
          </p>

          {/* Vignette Preview Photo */}
          <div
            style={{
              width: '160px',
              height: '200px',
              margin: '0 auto 32px',
              border: '1px solid rgba(199, 166, 106, 0.4)',
              padding: '6px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(42, 21, 27, 0.06)',
            }}
          >
            <SafeImage src={heroPhoto} alt={`Portrait of the couple: ${groomName} & ${brideName}`} aspectRatio="4/5" />
          </div>

          {/* Personalized Guest Card */}
          <div
            style={{
              backgroundColor: 'var(--color-ivory)',
              border: '1px solid rgba(101, 31, 50, 0.16)',
              padding: '18px 20px',
              borderRadius: '2px',
              marginBottom: '32px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'var(--color-charcoal-muted)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Dear Respected Guest
            </span>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                color: accentColor,
                fontWeight: 600,
                letterSpacing: '0.02em',
                display: 'block',
              }}
            >
              {guestName}
            </span>
            <span
              style={{
                fontSize: '0.8125rem',
                color: textColor,
                opacity: 0.9,
                marginTop: '6px',
                display: 'block',
                lineHeight: 1.5,
              }}
            >
              We cordially request the honour of your presence at our wedding
            </span>
          </div>

          {/* Open Invitation CTA */}
          <div>
            <Button
              variant="primary"
              size="lg"
              icon={<MailOpen size={16} aria-hidden="true" />}
              onClick={onOpenInvitation}
              aria-label={`Open Wedding Invitation for ${guestName}`}
            >
              Open Invitation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
