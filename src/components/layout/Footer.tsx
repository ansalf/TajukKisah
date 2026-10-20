import React from 'react';
import { Wordmark } from '../common/Wordmark';
import { DecorativeDivider } from '../common/DecorativeDivider';
import { Heart, Sparkles, Mail, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-espresso-rich)',
        color: 'var(--color-ivory)',
        paddingTop: '80px',
        paddingBottom: '40px',
        borderTop: '1px solid rgba(199, 166, 106, 0.2)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '48px',
            marginBottom: '60px',
          }}
        >
          {/* Brand & Manifesto */}
          <div style={{ maxWidth: '340px' }}>
            <Wordmark size="md" variant="dark" onClick={() => onNavigate('/')} />
            <p
              style={{
                color: 'rgba(246, 240, 230, 0.75)',
                fontSize: '0.9rem',
                marginTop: '16px',
                lineHeight: 1.7,
              }}
            >
              Curating elevated digital wedding invitations crafted with editorial elegance, timeless typography, and bespoke romantic aesthetics.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', color: 'var(--color-gold)' }}>
              <Heart size={16} fill="var(--color-gold)" />
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Handcrafted for eternal moments
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: '20px',
              }}
            >
              Collection
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <button
                  onClick={() => onNavigate('/templates')}
                  style={{
                    color: 'rgba(246, 240, 230, 0.8)',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(246, 240, 230, 0.8)')}
                >
                  Editorial Romance
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/templates')}
                  style={{
                    color: 'rgba(246, 240, 230, 0.8)',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(246, 240, 230, 0.8)')}
                >
                  Modern Botanical
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/templates')}
                  style={{
                    color: 'rgba(246, 240, 230, 0.8)',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(246, 240, 230, 0.8)')}
                >
                  Dark Luxury
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/invitation/aditya-amara')}
                  style={{
                    color: 'var(--color-gold-light)',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    fontWeight: 500,
                  }}
                >
                  Aditya & Amara Demo →
                </button>
              </li>
            </ul>
          </div>

          {/* Design Philosophy */}
          <div>
            <h4
              style={{
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: '20px',
              }}
            >
              Art Direction
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'rgba(246, 240, 230, 0.75)' }}>
                <Sparkles size={14} color="var(--color-gold)" />
                Bespoke Typography & Whitespace
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'rgba(246, 240, 230, 0.75)' }}>
                <ShieldCheck size={14} color="var(--color-gold)" />
                Editorial Quality Standards
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'rgba(246, 240, 230, 0.75)' }}>
                <Mail size={14} color="var(--color-gold)" />
                Direct Digital Distribution
              </li>
            </ul>
          </div>

          {/* Contact / Inquiries */}
          <div>
            <h4
              style={{
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: '20px',
              }}
            >
              Concierge
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'rgba(246, 240, 230, 0.75)', marginBottom: '12px' }}>
              For bespoke atelier inquiries and collaborative commissions:
            </p>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.15rem',
                color: 'var(--color-gold-light)',
                letterSpacing: '0.04em',
              }}
            >
              concierge@tajuk-kisah.com
            </span>
          </div>
        </div>

        <DecorativeDivider variant="line" accentColor="rgba(199, 166, 106, 0.3)" />

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '0.8125rem',
            color: 'rgba(246, 240, 230, 0.75)',
            letterSpacing: '0.04em',
            paddingTop: '20px',
          }}
        >
          <span>© {new Date().getFullYear()} TajukKisah. All rights reserved. Premium Digital Wedding Editorial.</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>Phase 1 Design Foundation</span>
            <span>Made with intentional craftsmanship</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
