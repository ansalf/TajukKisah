import React from 'react';

interface WordmarkProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  onClick?: () => void;
}

export const Wordmark: React.FC<WordmarkProps> = ({
  size = 'md',
  variant = 'light',
  onClick,
}) => {
  const isDark = variant === 'dark';
  const textColor = isDark ? '#FFFCF7' : '#2A151B';
  const accentColor = isDark ? '#C7A66A' : '#651F32';

  const fontSizes = {
    sm: '1.25rem',
    md: '1.65rem',
    lg: '2.25rem',
  };

  const tagSizes = {
    sm: '0.55rem',
    md: '0.625rem',
    lg: '0.75rem',
  };

  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: fontSizes[size],
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: textColor,
            lineHeight: 1,
          }}
        >
          Tajuk
        </span>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: fontSizes[size],
            fontStyle: 'italic',
            fontWeight: 400,
            letterSpacing: '0.04em',
            color: accentColor,
            lineHeight: 1,
          }}
        >
          Kisah
        </span>
      </div>
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: tagSizes[size],
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          color: isDark ? 'rgba(255,252,247,0.5)' : '#A9874D',
          marginTop: '3px',
          paddingLeft: '3px',
        }}
      >
        Digital Invitation
      </span>
    </div>
  );
};
