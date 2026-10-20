import React from 'react';
import { TemplateConcept } from '../../data/mockData';
import { SafeImage } from '../common/SafeImage';
import { Button } from '../common/Button';
import { ArrowRight, Eye, Sparkles } from 'lucide-react';

interface TemplateCardProps {
  template: TemplateConcept;
  onSelect: (templateId: string) => void;
  featured?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  featured = false,
}) => {
  return (
    <div
      style={{
        backgroundColor: template.paletteTheme.surface,
        border: `1px solid ${template.paletteTheme.border}`,
        borderRadius: '2px', // Architectural fine edge, avoiding generic SaaS bubbly corners
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: featured ? '0 16px 40px rgba(42, 21, 27, 0.08)' : '0 6px 24px rgba(42, 21, 27, 0.04)',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease',
      }}
      className="template-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 20px 48px rgba(42, 21, 27, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = featured
          ? '0 16px 40px rgba(42, 21, 27, 0.08)'
          : '0 6px 24px rgba(42, 21, 27, 0.04)';
      }}
    >
      {/* Visual Header / Preview Cover */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <SafeImage
          src={template.previewImage}
          alt={template.title}
          aspectRatio="16/10"
          fallbackText={template.title}
        />
        {/* Subtle vignette gradient and dark scrim for WCAG text contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(20, 8, 12, 0.88) 0%, rgba(20, 8, 12, 0.45) 45%, rgba(0, 0, 0, 0.2) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Aesthetic Badge with high-contrast text */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: 'rgba(255, 252, 247, 0.95)',
            backdropFilter: 'blur(8px)',
            color: 'var(--color-espresso)',
            padding: '5px 12px',
            borderRadius: '1px',
            fontSize: '0.6875rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            border: '1px solid rgba(199, 166, 106, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Sparkles size={11} color="var(--color-burgundy)" aria-hidden="true" />
          <span>{template.paletteTheme.badge}</span>
        </div>

        {/* Floating Typography Preview with 7:1+ contrast on dark scrim */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '20px',
            right: '20px',
            color: '#FFFFFF',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.45rem',
              fontWeight: 500,
              display: 'block',
              letterSpacing: '0.02em',
              textShadow: '0 2px 8px rgba(0,0,0,0.7)',
            }}
          >
            {template.title}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: '#F6F0E6',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            }}
          >
            {template.subtitle}
          </span>
        </div>
      </div>

      {/* Card Content & Details */}
      {(() => {
        const isDarkSurface = template.id === 'velvet-noir-editorial' || template.id === 'dark-luxury';
        return (
          <div
            style={{
              padding: '24px 24px 28px',
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.65,
                  color: isDarkSurface ? '#F5EBE1' : 'var(--color-charcoal-muted)',
                  marginBottom: '20px',
                }}
              >
                {template.description}
              </p>

              {/* Aesthetic Notes */}
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: isDarkSurface ? 'rgba(255, 255, 255, 0.08)' : 'var(--color-ivory)',
                  borderLeft: `2px solid ${isDarkSurface ? 'var(--color-gold)' : 'var(--color-gold)'}`,
                  marginBottom: '20px',
                  fontSize: '0.8rem',
                  color: isDarkSurface ? '#FAF4EC' : 'var(--color-espresso)',
                  fontStyle: 'italic',
                }}
              >
                "{template.aestheticNotes}"
              </div>

              {/* Tags with WCAG AA compliance (4.5:1+) */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      backgroundColor: isDarkSurface ? 'rgba(212, 175, 55, 0.18)' : 'rgba(101, 31, 50, 0.08)',
                      color: isDarkSurface ? '#F0D58A' : 'var(--color-burgundy-dark)',
                      borderRadius: '2px',
                      letterSpacing: '0.04em',
                      border: isDarkSurface ? '1px solid rgba(212, 175, 55, 0.35)' : 'none',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons with 44px min touch target */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: isDarkSurface ? '1px solid rgba(212, 175, 55, 0.25)' : '1px solid rgba(101,31,50,0.1)',
              }}
            >
              <Button
                variant={isDarkSurface ? 'secondary' : 'primary'}
                size="sm"
                isFullWidth
                icon={<ArrowRight size={14} aria-hidden="true" />}
                onClick={() => onSelect(template.id)}
                aria-label={`Preview ${template.title} design style`}
                style={isDarkSurface ? { backgroundColor: '#D4AF37', color: '#1E0E13', fontWeight: 600 } : undefined}
              >
                Preview Style
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<Eye size={14} aria-hidden="true" />}
                onClick={() => onSelect(template.id)}
                aria-label={`View details for ${template.title}`}
                style={isDarkSurface ? { color: '#FAF4EC', borderColor: 'rgba(212, 175, 55, 0.5)' } : undefined}
              >
                Details
              </Button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
