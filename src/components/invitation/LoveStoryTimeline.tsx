import React from 'react';
import { WEDDING_STORY_TIMELINE, StoryMilestone } from '../../data/invitationData';

interface LoveStoryTimelineProps {
  items?: StoryMilestone[];
  accentColor?: string;
  textColor?: string;
  borderColor?: string;
}

export const LoveStoryTimeline: React.FC<LoveStoryTimelineProps> = ({
  items,
  accentColor = 'var(--color-burgundy)',
  textColor = 'var(--color-espresso)',
  borderColor = 'rgba(101, 31, 50, 0.15)',
}) => {
  const storyItems = items && items.length > 0 ? items : WEDDING_STORY_TIMELINE;
  return (
    <div style={{ margin: '48px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: accentColor,
            fontWeight: 600,
            display: 'block',
            marginBottom: '4px',
          }}
        >
          Our Journey
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            color: textColor,
            fontWeight: 400,
          }}
        >
          The Story of Us
        </h3>
      </div>

      <div
        style={{
          position: 'relative',
          paddingLeft: '24px',
          borderLeft: `1.5px solid ${borderColor}`,
          marginLeft: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}
      >
        {storyItems.map((item, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            {/* Timeline node marker */}
            <div
              style={{
                position: 'absolute',
                left: '-31px',
                top: '4px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: `2px solid ${accentColor}`,
              }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.35rem',
                    fontWeight: 600,
                    color: accentColor,
                  }}
                >
                  {item.year}
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: textColor,
                    opacity: 0.6,
                  }}
                >
                  • {item.location}
                </span>
              </div>

              <h4
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.2rem',
                  color: textColor,
                  marginBottom: '6px',
                  fontWeight: 500,
                }}
              >
                {item.title}
              </h4>

              <p
                style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  color: textColor,
                  opacity: 0.85,
                }}
              >
                {item.narrative}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
