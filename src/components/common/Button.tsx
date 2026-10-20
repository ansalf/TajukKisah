import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isFullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  isFullWidth = false,
  style,
  disabled,
  ...props
}) => {
  // Editorial sizes
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: '8px 18px',
      fontSize: '0.8125rem',
      letterSpacing: '0.08em',
    },
    md: {
      padding: '12px 28px',
      fontSize: '0.875rem',
      letterSpacing: '0.1em',
    },
    lg: {
      padding: '16px 36px',
      fontSize: '0.9375rem',
      letterSpacing: '0.12em',
    },
  };

  // Color & Aesthetic variants based on design spec
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-burgundy)',
      color: 'var(--color-warm-white)',
      border: '1px solid var(--color-burgundy)',
      boxShadow: '0 4px 16px rgba(101, 31, 50, 0.2)',
    },
    secondary: {
      backgroundColor: 'var(--color-ivory)',
      color: 'var(--color-espresso)',
      border: '1px solid var(--color-border-subtle)',
    },
    gold: {
      backgroundColor: 'var(--color-gold)',
      color: 'var(--color-espresso-rich)',
      border: '1px solid var(--color-gold-dark)',
      boxShadow: '0 4px 16px rgba(199, 166, 106, 0.25)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-espresso)',
      border: '1px solid var(--color-espresso)',
    },
    text: {
      backgroundColor: 'transparent',
      color: 'var(--color-burgundy)',
      border: '1px solid transparent',
      paddingLeft: 0,
      paddingRight: 0,
    },
  };

  return (
    <button
      disabled={disabled}
      style={{
        display: isFullWidth ? 'flex' : 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        textTransform: 'uppercase',
        fontWeight: 500,
        borderRadius: '2px', // Minimal, sharp luxury edge instead of bubbly rounded SaaS buttons
        transition: 'all 0.25s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        width: isFullWidth ? '100%' : 'auto',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--color-burgundy-dark)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        } else if (variant === 'secondary') {
          e.currentTarget.style.backgroundColor = '#EFE9DE';
          e.currentTarget.style.transform = 'translateY(-1px)';
        } else if (variant === 'gold') {
          e.currentTarget.style.backgroundColor = 'var(--color-gold-light)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        } else if (variant === 'outline') {
          e.currentTarget.style.backgroundColor = 'var(--color-espresso)';
          e.currentTarget.style.color = 'var(--color-warm-white)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = 'none';
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = 'var(--color-burgundy)';
        } else if (variant === 'secondary') {
          e.currentTarget.style.backgroundColor = 'var(--color-ivory)';
        } else if (variant === 'gold') {
          e.currentTarget.style.backgroundColor = 'var(--color-gold)';
        } else if (variant === 'outline') {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--color-espresso)';
        }
      }}
      {...props}
    >
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </button>
  );
};
