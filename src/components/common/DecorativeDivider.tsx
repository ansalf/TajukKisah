import React from 'react';

interface DividerProps {
  variant?: 'line' | 'monogram' | 'floral' | 'subtle';
  accentColor?: string;
  className?: string;
  symbol?: string;
}

export const DecorativeDivider: React.FC<DividerProps> = ({
  variant = 'monogram',
  accentColor,
  className = '',
  symbol = '❦',
}) => {
  const color = accentColor || 'var(--color-gold)';

  if (variant === 'subtle') {
    return (
      <div
        className={className}
        style={{
          width: '60px',
          height: '1px',
          background: color,
          opacity: 0.6,
          margin: '24px auto',
        }}
      />
    );
  }

  if (variant === 'line') {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '320px',
          margin: '32px auto',
        }}
      >
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${color})` }} />
        <div
          style={{
            width: '6px',
            height: '6px',
            transform: 'rotate(45deg)',
            background: color,
            margin: '0 12px',
          }}
        />
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(to left, transparent, ${color})` }} />
      </div>
    );
  }

  if (variant === 'floral') {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          margin: '36px auto',
          color: color,
        }}
      >
        <div style={{ width: '48px', height: '1px', background: color, opacity: 0.4 }} />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 2C12 7 7 12 2 12C7 12 12 17 12 22C12 17 17 12 22 12C17 12 12 7 12 2Z" />
        </svg>
        <div style={{ width: '48px', height: '1px', background: color, opacity: 0.4 }} />
      </div>
    );
  }

  // Monogram / Ornamental Default
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        margin: '32px auto',
        color: color,
        opacity: 0.9,
      }}
    >
      <div
        style={{
          width: '80px',
          height: '1px',
          background: `linear-gradient(to right, transparent, ${color})`,
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '18px',
          lineHeight: 1,
          letterSpacing: '0.1em',
        }}
      >
        {symbol}
      </span>
      <div
        style={{
          width: '80px',
          height: '1px',
          background: `linear-gradient(to left, transparent, ${color})`,
        }}
      />
    </div>
  );
};
