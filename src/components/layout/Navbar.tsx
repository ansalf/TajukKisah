import React, { useState, useEffect } from 'react';
import { Wordmark } from '../common/Wordmark';
import { Button } from '../common/Button';
import { Sparkles, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Collection', path: '/templates' },
    { label: 'Demo Preview', path: '/invitation/aditya-amara' },
    { label: 'Order Invitation', path: '/order' },
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: isScrolled ? 'rgba(255, 252, 247, 0.95)' : 'rgba(255, 252, 247, 0.85)',
          backdropFilter: 'blur(10px)',
          borderBottom: isScrolled ? '1px solid rgba(101, 31, 50, 0.08)' : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
          {/* Left: Brand */}
          <Wordmark size="md" onClick={() => onNavigate('/')} />

          {/* Center: Desktop Nav */}
          <nav style={{ display: 'none', gap: '32px', alignItems: 'center' }} className="desktop-nav">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--color-burgundy)' : 'var(--color-espresso)',
                    position: 'relative',
                    padding: '6px 0',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '1.5px',
                        backgroundColor: 'var(--color-gold)',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="desktop-cta" style={{ display: 'none' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('/templates')}
              >
                Browse Themes
              </Button>
            </div>

            <div className="desktop-cta" style={{ display: 'none' }}>
              <Button
                variant="primary"
                size="sm"
                icon={<Sparkles size={14} />}
                onClick={() => onNavigate('/order')}
              >
                Order Invitation
              </Button>
            </div>

            {/* Mobile hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                color: 'var(--color-espresso)',
                borderRadius: '2px',
              }}
              className="mobile-toggle touch-target"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav-menu"
            aria-label="Mobile Navigation"
            style={{
              backgroundColor: 'var(--color-warm-white)',
              borderBottom: '1px solid var(--color-border-subtle)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                style={{
                  textAlign: 'left',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: currentPath === link.path ? 600 : 400,
                  color: currentPath === link.path ? 'var(--color-burgundy)' : 'var(--color-espresso)',
                  padding: '8px 0',
                }}
              >
                {link.label}
              </button>
            ))}
            <Button
              variant="primary"
              size="md"
              isFullWidth
              icon={<Sparkles size={16} />}
              onClick={() => {
                onNavigate('/order');
                setMobileMenuOpen(false);
              }}
            >
              Order Invitation
            </Button>
          </nav>
        )}

        <style>{`
          @media (min-width: 768px) {
            .desktop-nav {
              display: flex !important;
            }
            .desktop-cta {
              display: block !important;
            }
            .mobile-toggle {
              display: none !important;
            }
          }
        `}</style>
      </header>
    </>
  );
};
