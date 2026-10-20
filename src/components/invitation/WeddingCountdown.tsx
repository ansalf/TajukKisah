import React, { useState, useEffect } from 'react';

interface WeddingCountdownProps {
  targetDate: string; // ISO date string e.g. '2026-11-28T09:00:00'
  accentColor?: string;
  textColor?: string;
  borderColor?: string;
  surfaceColor?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const WeddingCountdown: React.FC<WeddingCountdownProps> = ({
  targetDate,
  accentColor = 'var(--color-burgundy)',
  textColor = 'var(--color-espresso)',
  borderColor = 'rgba(101, 31, 50, 0.15)',
  surfaceColor = 'rgba(255, 252, 247, 0.65)',
}) => {
  const calculateTimeLeft = (): TimeLeft => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isPast: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div style={{ margin: '40px 0' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          maxWidth: '520px',
          margin: '0 auto',
        }}
      >
        {units.map((unit, i) => (
          <div
            key={i}
            style={{
              padding: '16px 8px',
              backgroundColor: surfaceColor,
              border: `1px solid ${borderColor}`,
              textAlign: 'center',
              borderRadius: '2px',
              boxShadow: '0 4px 14px rgba(42, 21, 27, 0.03)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 500,
                color: accentColor,
                lineHeight: 1,
                display: 'block',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {String(unit.value).padStart(2, '0')}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: textColor,
                opacity: 0.7,
                marginTop: '6px',
                display: 'block',
              }}
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>
      {timeLeft.isPast && (
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            marginTop: '16px',
            color: accentColor,
          }}
        >
          The celebratory union has begun.
        </p>
      )}
    </div>
  );
};
