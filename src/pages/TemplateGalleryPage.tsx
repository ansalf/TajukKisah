import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEMPLATES_DATA } from '../data/mockData';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { SafeImage } from '../components/common/SafeImage';
import { DecorativeDivider } from '../components/common/DecorativeDivider';
import { ArrowRight, Check, Sparkles, Eye } from 'lucide-react';

interface TemplateGalleryPageProps {
  onNavigate: (path: string) => void;
  initialSelectedId?: string;
}

export const TemplateGalleryPage: React.FC<TemplateGalleryPageProps> = ({
  onNavigate,
  initialSelectedId = 'editorial-romance',
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialSelectedId);

  const selectedTemplate =
    TEMPLATES_DATA.find((t) => t.id === selectedTemplateId) || TEMPLATES_DATA[0];

  return (
    <div style={{ backgroundColor: 'var(--color-warm-white)', minHeight: '100vh', paddingBottom: '96px' }}>
      {/* Gallery Header */}
      <section
        style={{
          paddingTop: '64px',
          paddingBottom: '48px',
          borderBottom: '1px solid var(--color-border-subtle)',
          backgroundColor: 'var(--color-ivory-light)',
        }}
      >
        <div className="container">
          <SectionHeading
            eyebrow="The Atelier Archive"
            title="Design System & Template Gallery"
            subtitle="Explore our three distinct art directions. Each template is crafted with bespoke color theory, dedicated font hierarchy, and intentional whitespace."
          />

          {/* Interactive Filter / Tab Pills */}
          <div
            role="tablist"
            aria-label="Filter templates by aesthetic style"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginTop: '32px',
            }}
          >
            {TEMPLATES_DATA.map((template) => {
              const isSelected = template.id === selectedTemplateId;
              return (
                <button
                  key={template.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedTemplateId(template.id)}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    transition: 'all 0.25s ease',
                    border: isSelected
                      ? '1px solid var(--color-burgundy)'
                      : '1px solid var(--color-border-subtle)',
                    backgroundColor: isSelected
                      ? 'var(--color-burgundy)'
                      : 'var(--color-warm-white)',
                    color: isSelected
                      ? 'var(--color-warm-white)'
                      : 'var(--color-espresso)',
                    boxShadow: isSelected ? '0 4px 12px rgba(101, 31, 50, 0.15)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minHeight: '44px',
                  }}
                >
                  {isSelected && <Check size={14} aria-hidden="true" />}
                  <span>{template.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Interactive Showcase Area */}
      <section style={{ paddingTop: '64px' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: 'clamp(32px, 5vw, 56px)',
              alignItems: 'start',
            }}
          >
            {/* Left: Detailed Template Spotlight & Mock Preview */}
            <div style={{ width: '100%', minWidth: 0 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTemplate.id}
                  initial={{ opacity: 0, scale: 0.98, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    backgroundColor: selectedTemplate.paletteTheme.background,
                    color: selectedTemplate.paletteTheme.text,
                    border: `1px solid ${selectedTemplate.paletteTheme.border}`,
                    padding: 'clamp(20px, 4vw, 36px)',
                    position: 'relative',
                    boxShadow: 'var(--shadow-elevated)',
                    borderRadius: '2px',
                    boxSizing: 'border-box',
                    width: '100%',
                  }}
                >
                {/* Monogram / Header Badge inside preview */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.22em',
                      color: selectedTemplate.paletteTheme.accent,
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    {selectedTemplate.subtitle}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '2.5rem',
                      fontWeight: 400,
                      color: selectedTemplate.paletteTheme.text,
                      lineHeight: 1.1,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Aditya & Amara
                  </h3>
                  <div
                    style={{
                      width: '40px',
                      height: '1px',
                      backgroundColor: selectedTemplate.paletteTheme.accent,
                      margin: '16px auto',
                      opacity: 0.6,
                    }}
                  />
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: selectedTemplate.paletteTheme.text,
                      opacity: 0.8,
                    }}
                  >
                    Saturday, November 28, 2026 • Plataran Jakarta
                  </p>
                </div>

                {/* Framed Image */}
                <div
                  style={{
                    border: `1px solid ${selectedTemplate.paletteTheme.border}`,
                    padding: '8px',
                    backgroundColor: selectedTemplate.paletteTheme.surface,
                  }}
                >
                  <SafeImage
                    src={selectedTemplate.previewImage}
                    alt={selectedTemplate.title}
                    aspectRatio="16/10"
                  />
                </div>

                {/* Narrative excerpt preview */}
                <div
                  style={{
                    marginTop: '28px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: '1.05rem',
                    lineHeight: 1.6,
                    color: selectedTemplate.paletteTheme.text,
                    opacity: 0.9,
                  }}
                >
                  "Two souls with but a single thought, two hearts that beat as one."
                </div>

                <div
                  style={{
                    marginTop: '28px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    variant="outline"
                    size="md"
                    icon={<Eye size={15} />}
                    onClick={() =>
                      onNavigate(`/invitation/aditya-amara?template=${selectedTemplate.id}`)
                    }
                    style={
                      selectedTemplate.id === 'velvet-noir-editorial' || selectedTemplate.id === 'dark-luxury'
                        ? {
                            color: '#F5EBE1',
                            borderColor: 'rgba(212, 175, 55, 0.6)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          }
                        : undefined
                    }
                  >
                    Preview Live
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    icon={<Sparkles size={15} />}
                    onClick={() =>
                      onNavigate(`/order?template=${selectedTemplate.id}`)
                    }
                    style={
                      selectedTemplate.id === 'velvet-noir-editorial' || selectedTemplate.id === 'dark-luxury'
                        ? {
                            backgroundColor: '#D4AF37',
                            color: '#1E0E13',
                            borderColor: '#D4AF37',
                            fontWeight: 600,
                          }
                        : undefined
                    }
                  >
                    Order This Theme
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

            {/* Right: Technical & Art Direction Specs */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--color-burgundy)',
                  marginBottom: '12px',
                }}
              >
                <Sparkles size={16} />
                <span
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    fontWeight: 600,
                  }}
                >
                  Art Direction Specification
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.5rem',
                  color: 'var(--color-espresso)',
                  marginBottom: '16px',
                  fontWeight: 400,
                }}
              >
                {selectedTemplate.title}
              </h2>

              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  color: 'var(--color-charcoal-muted)',
                  marginBottom: '32px',
                }}
              >
                {selectedTemplate.description}
              </p>

              {/* Color Swatches Grid & Variants */}
              <div style={{ marginBottom: '32px' }}>
                <h4
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    fontWeight: 600,
                    color: 'var(--color-espresso)',
                    marginBottom: '14px',
                  }}
                >
                  Color Palette Harmony
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                  {[
                    { label: 'Background', val: selectedTemplate.paletteTheme.background },
                    { label: 'Surface', val: selectedTemplate.paletteTheme.surface },
                    { label: 'Accent', val: selectedTemplate.paletteTheme.accent },
                  ].map((colorItem, i) => (
                    <div
                      key={i}
                      style={{
                        border: '1px solid var(--color-border-subtle)',
                        padding: '10px 8px',
                        backgroundColor: 'var(--color-warm-white)',
                        textAlign: 'center',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div
                        style={{
                          height: '32px',
                          backgroundColor: colorItem.val,
                          border: '1px solid rgba(0,0,0,0.08)',
                          marginBottom: '6px',
                        }}
                      />
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {colorItem.label}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--color-charcoal-muted)' }}>
                        {colorItem.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Available Color Variants for this template */}
                {selectedTemplate.colorVariants && selectedTemplate.colorVariants.length > 0 && (
                  <div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--color-charcoal-muted)',
                        fontWeight: 600,
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      Included Palette Variants:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedTemplate.colorVariants.map((v) => (
                        <div
                          key={v.id}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            backgroundColor: 'var(--color-ivory)',
                            border: '1px solid var(--color-border-subtle)',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            color: 'var(--color-espresso)',
                          }}
                        >
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: v.accent,
                              display: 'inline-block',
                              border: '1px solid rgba(0,0,0,0.15)',
                            }}
                          />
                          <span>{v.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Curated Aesthetic Pillars */}
              <div style={{ marginBottom: '36px' }}>
                <h4
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    fontWeight: 600,
                    color: 'var(--color-espresso)',
                    marginBottom: '14px',
                  }}
                >
                  Key Visual Characteristics
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedTemplate.tags.map((tag, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.9rem',
                        color: 'var(--color-charcoal-muted)',
                      }}
                    >
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: 'var(--color-gold)',
                          transform: 'rotate(45deg)',
                        }}
                      />
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Link Action */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle)' }}>
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight size={16} />}
                  onClick={() =>
                    onNavigate(`/invitation/aditya-amara?template=${selectedTemplate.id}`)
                  }
                >
                  Preview Aditya & Amara in {selectedTemplate.title}
                </Button>
              </div>
            </div>
          </div>

          <DecorativeDivider variant="line" className="my-16" />

          {/* Quick Comparison Grid */}
          <div style={{ marginTop: '64px' }}>
            <SectionHeading
              eyebrow="Compare Concepts"
              title="All Atelier Templates at a Glance"
              subtitle="Distinct moods designed to reflect your exact wedding atmosphere."
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                gap: '24px',
              }}
            >
              {TEMPLATES_DATA.map((t, idx) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  onClick={() => setSelectedTemplateId(t.id)}
                  style={{
                    padding: '24px',
                    backgroundColor: t.id === selectedTemplateId ? 'var(--color-ivory)' : 'var(--color-warm-white)',
                    border: t.id === selectedTemplateId ? '1.5px solid var(--color-burgundy)' : '1px solid var(--color-border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: t.id === selectedTemplateId ? '0 8px 24px rgba(101, 31, 50, 0.12)' : 'none',
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: 'var(--color-burgundy)',
                        fontWeight: 600,
                      }}
                    >
                      Concept #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <h4
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.35rem',
                        color: 'var(--color-espresso)',
                        marginTop: '6px',
                        marginBottom: '8px',
                      }}
                    >
                      {t.title}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)', marginBottom: '16px' }}>
                      {t.subtitle}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--color-border-subtle)' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`/invitation/aditya-amara?template=${t.id}`);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        color: 'var(--color-espresso)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        fontWeight: 600,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <Eye size={13} />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`/order?template=${t.id}`);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        color: 'var(--color-burgundy)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        fontWeight: 600,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <Sparkles size={13} />
                      <span>Order</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
