import React from 'react';
import { TEMPLATES_DATA } from '../data/mockData';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { SafeImage } from '../components/common/SafeImage';
import { DecorativeDivider } from '../components/common/DecorativeDivider';
import { TemplateCard } from '../components/common/TemplateCard';
import {
  ArrowRight,
  Sparkles,
  Palette,
  Smartphone,
  Shield,
  Layers,
  Heart,
  Compass,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ backgroundColor: 'var(--color-warm-white)' }}>
      {/* 1. EDITORIAL HERO SECTION */}
      <section
        style={{
          position: 'relative',
          paddingTop: '64px',
          paddingBottom: '96px',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(101, 31, 50, 0.08)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '64px',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Editorial Headline & Copy */}
            <div style={{ maxWidth: '580px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  backgroundColor: 'var(--color-ivory)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: '2px',
                  marginBottom: '28px',
                }}
              >
                <Sparkles size={14} color="var(--color-burgundy)" />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    color: 'var(--color-burgundy)',
                  }}
                >
                  Curated Digital Wedding Atelier
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.75rem, 5.5vw, 4.5rem)',
                  fontWeight: 400,
                  lineHeight: 1.08,
                  letterSpacing: '-0.025em',
                  color: 'var(--color-espresso)',
                  marginBottom: '24px',
                }}
              >
                Your love story, <br />
                <span style={{ fontStyle: 'italic', color: 'var(--color-burgundy)' }}>
                  beautifully invited.
                </span>
              </h1>

              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
                  lineHeight: 1.7,
                  color: 'var(--color-charcoal-muted)',
                  marginBottom: '36px',
                }}
              >
                TajukKisah crafts bespoke digital wedding invitations styled like high-fashion editorials. Uncluttered whitespace, timeless typography, and unforgettable storytelling delivered effortlessly through a personalized link.
              </p>

              {/* Primary Call to Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16px',
                  alignItems: 'center',
                }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight size={16} />}
                  onClick={() => onNavigate('/invitation/aditya-amara')}
                >
                  Preview Sample Invitation
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => onNavigate('/templates')}
                >
                  Explore Collection
                </Button>
              </div>

              {/* Social Proof & Assurance */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  marginTop: '44px',
                  paddingTop: '24px',
                  borderTop: '1px solid var(--color-border-subtle)',
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.75rem',
                      color: 'var(--color-burgundy)',
                      fontWeight: 600,
                    }}
                  >
                    100%
                  </span>
                  <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
                    Editorial Layout
                  </p>
                </div>
                <div style={{ width: '1px', height: '36px', backgroundColor: 'var(--color-border-subtle)' }} />
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.75rem',
                      color: 'var(--color-gold-dark)',
                      fontWeight: 600,
                    }}
                  >
                    No SaaS Bloat
                  </span>
                  <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
                    Pure Aesthetic Focus
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--color-ivory)',
                  padding: '16px',
                  border: '1px solid var(--color-border-subtle)',
                  boxShadow: 'var(--shadow-elevated)',
                }}
              >
                {/* Thin gold inner frame */}
                <div
                  style={{
                    border: '1px solid rgba(199, 166, 106, 0.45)',
                    padding: '8px',
                    position: 'relative',
                  }}
                >
                  <SafeImage
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                    alt="Aditya and Amara Wedding Celebration"
                    aspectRatio="4/5"
                  />
                  {/* Floating Monogram Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '24px',
                      left: '24px',
                      right: '24px',
                      backgroundColor: 'rgba(255, 252, 247, 0.95)',
                      backdropFilter: 'blur(12px)',
                      padding: '20px',
                      border: '1px solid rgba(101, 31, 50, 0.1)',
                      textAlign: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.65rem',
                        fontWeight: 400,
                        color: 'var(--color-burgundy)',
                        letterSpacing: '0.05em',
                        display: 'block',
                      }}
                    >
                      Aditya & Amara
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        color: 'var(--color-gold-dark)',
                        marginTop: '4px',
                        display: 'block',
                      }}
                    >
                      Saturday, November 28, 2026 • Jakarta
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative background element */}
              <div
                style={{
                  position: 'absolute',
                  top: '-16px',
                  right: '0',
                  width: '100px',
                  height: '100px',
                  border: '1px dashed var(--color-gold)',
                  zIndex: -1,
                  opacity: 0.5,
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PHILOSOPHY & ART DIRECTION */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--color-ivory-light)' }}>
        <div className="container">
          <SectionHeading
            eyebrow="The TajukKisah Philosophy"
            title="Elegance in restraint, luxury in subtlety"
            subtitle="Most digital wedding invitations look like busy mobile apps crowded with clashing animations. We returned to the roots of high-end wedding stationery and editorial print publishing."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              marginTop: '48px',
            }}
          >
            {[
              {
                icon: <Palette size={24} color="var(--color-burgundy)" />,
                title: 'Curated Color Harmonies',
                desc: 'Intentionally restricted palettes anchored by warm ivory, rich burgundy, velvet espresso, and muted antique gold.',
              },
              {
                icon: <Compass size={24} color="var(--color-burgundy)" />,
                title: 'Editorial Typography',
                desc: 'Sophisticated serif headings paired with clean, readable sans-serif accents. Balanced hierarchy that treats every name with reverence.',
              },
              {
                icon: <Smartphone size={24} color="var(--color-burgundy)" />,
                title: 'Seamless Mobile Harmony',
                desc: 'Engineered mobile-first for friends and family browsing on smartphones, with instant loading and fluid gestures.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--color-warm-white)',
                  padding: '36px 28px',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: '2px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '2px',
                    backgroundColor: 'var(--color-ivory)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(101, 31, 50, 0.1)',
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.4rem',
                    fontWeight: 500,
                    color: 'var(--color-espresso)',
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--color-charcoal-muted)' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED TEMPLATES SHOWCASE */}
      <section style={{ padding: '96px 0' }}>
        <div className="container">
          <SectionHeading
            eyebrow="The Atelier Collection"
            title="Three distinct aesthetic directions"
            subtitle="Choose an editorial atmosphere tailored to your ceremony's character. Each design has its own unique personality, palette, and cadence."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              marginBottom: '48px',
            }}
          >
            {TEMPLATES_DATA.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={(id) => onNavigate(`/templates?selected=${id}`)}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Button
              variant="outline"
              size="md"
              icon={<ArrowRight size={16} />}
              onClick={() => onNavigate('/templates')}
            >
              Browse Full Template Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (EDITORIAL JOURNEY) */}
      <section
        style={{
          padding: '96px 0',
          backgroundColor: 'var(--color-ivory)',
          borderTop: '1px solid var(--color-border-subtle)',
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
      >
        <div className="container">
          <SectionHeading
            eyebrow="The Process"
            title="From love story to keepsake link"
            subtitle="Creating a digital invitation should feel as refined and joyful as ordering custom letterpress stationery."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '40px',
              marginTop: '56px',
              position: 'relative',
            }}
          >
            {[
              {
                step: '01',
                title: 'Select an Aesthetic',
                desc: 'Explore our curated concepts—from classic romantic ivory and burgundy to modern botanical and dark luxury.',
              },
              {
                step: '02',
                title: 'Personalize the Story',
                desc: 'Provide your event itinerary, ceremonial venues, quotes, and your curated photography vignettes.',
              },
              {
                step: '03',
                title: 'Share with Loved Ones',
                desc: 'Distribute a custom, elegant link via WhatsApp, messaging, or social invitations that opens instantly on any device.',
              },
            ].map((stepItem, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--color-warm-white)',
                  padding: '36px 30px',
                  border: '1px solid rgba(199, 166, 106, 0.3)',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2.5rem',
                    color: 'var(--color-gold-dark)',
                    lineHeight: 1,
                    display: 'block',
                    marginBottom: '16px',
                    opacity: 0.8,
                  }}
                >
                  {stepItem.step}
                </span>
                <h4
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.35rem',
                    color: 'var(--color-espresso)',
                    marginBottom: '12px',
                  }}
                >
                  {stepItem.title}
                </h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--color-charcoal-muted)' }}>
                  {stepItem.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRODUCT BENEFITS (WHY TAJUK KISAH) */}
      <section style={{ padding: '96px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '64px',
              alignItems: 'center',
            }}
          >
            <div>
              <SafeImage
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
                alt="Intimate Wedding Detail"
                aspectRatio="4/5"
                style={{
                  border: '1px solid var(--color-border-gold)',
                  padding: '10px',
                  backgroundColor: 'var(--color-warm-white)',
                  boxShadow: 'var(--shadow-card)',
                }}
              />
            </div>

            <div>
              <SectionHeading
                eyebrow="Craftsmanship"
                title="Designed for couples who care about details"
                subtitle="Your wedding invitation is the very first glimpse your guests receive of your celebration. Make it memorable."
                align="left"
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '32px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ color: 'var(--color-gold-dark)', marginTop: '4px' }}>
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '4px' }}>
                      Distraction-Free Reading
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal-muted)' }}>
                      No invasive third-party ads, gaudy popups, or jarring neon banners. Pure dignified intimacy.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ color: 'var(--color-gold-dark)', marginTop: '4px' }}>
                    <Layers size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '4px' }}>
                      Seamless Ceremony & Itinerary Access
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal-muted)' }}>
                      Clearly structured schedules for Akad Nikah, Holy Matrimony, and Evening Receptions.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ color: 'var(--color-gold-dark)', marginTop: '4px' }}>
                    <Heart size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '4px' }}>
                      Evergreen Digital Keepsake
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal-muted)' }}>
                      A timeless website artifact couples can revisit on anniversaries for years to come.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL INVITATION CALL TO ACTION */}
      <section
        style={{
          padding: '100px 0',
          backgroundColor: 'var(--color-burgundy-dark)',
          color: 'var(--color-warm-white)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: '780px' }}>
          <DecorativeDivider variant="monogram" accentColor="var(--color-gold)" symbol="❦" />

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 400,
              color: 'var(--color-warm-white)',
              lineHeight: 1.15,
              marginBottom: '20px',
            }}
          >
            Experience the Aditya & Amara Invitation
          </h2>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 252, 247, 0.85)',
              marginBottom: '40px',
              lineHeight: 1.7,
            }}
          >
            See how TajukKisah transforms real wedding dates, emotional vows, and fine photography into an unforgettable digital editorial invitation.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Button
              variant="gold"
              size="lg"
              icon={<Sparkles size={16} />}
              onClick={() => onNavigate('/order')}
            >
              Order Your Invitation
            </Button>
            <Button
              variant="outline"
              size="lg"
              style={{ color: 'var(--color-warm-white)', borderColor: 'rgba(255, 252, 247, 0.4)' }}
              onClick={() => onNavigate('/invitation/aditya-amara')}
            >
              View Live Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
