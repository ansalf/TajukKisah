import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  theme?: 'light' | 'dark';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  theme = 'light',
  className = '',
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'var(--color-warm-white)' : 'var(--color-espresso)';
  const eyebrowColor = isDark ? 'var(--color-gold)' : 'var(--color-burgundy)';
  const subtitleColor = isDark ? 'rgba(255, 252, 247, 0.7)' : 'var(--color-charcoal-muted)';

  return (
    <div
      className={className}
      style={{
        textAlign: align,
        maxWidth: align === 'center' ? '760px' : '100%',
        margin: align === 'center' ? '0 auto 48px' : '0 0 32px',
      }}
    >
      {eyebrow && (
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: eyebrowColor,
            marginBottom: '12px',
          }}
        >
          {eyebrow}
        </span>
      )}
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 4vw, 3.25rem)',
          fontWeight: 400,
          lineHeight: 1.15,
          color: textColor,
          letterSpacing: '-0.02em',
          marginBottom: subtitle ? '16px' : '0',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
            color: subtitleColor,
            lineHeight: 1.65,
            maxWidth: '620px',
            margin: align === 'center' ? '0 auto' : '0',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
