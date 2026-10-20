import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEMO_COUPLE, TEMPLATES_DATA, TemplateConcept } from '../data/mockData';
import {
  GALLERY_ITEMS,
  GOOGLE_MAPS_DIRECTION_URL,
  GOOGLE_MAPS_EMBED_URL,
} from '../data/invitationData';
import { SafeImage } from '../components/common/SafeImage';
import { DecorativeDivider } from '../components/common/DecorativeDivider';
import { Button } from '../components/common/Button';
import { WeddingCountdown } from '../components/invitation/WeddingCountdown';
import { InvitationAudioPlayer } from '../components/invitation/InvitationAudioPlayer';
import { InteractiveGallery } from '../components/invitation/InteractiveGallery';
import { LoveStoryTimeline } from '../components/invitation/LoveStoryTimeline';
import { RsvpSection } from '../components/invitation/RsvpSection';
import { GuestWishesSection } from '../components/invitation/GuestWishesSection';
import { DigitalGiftsSection } from '../components/invitation/DigitalGiftsSection';
import { InvitationCover } from '../components/invitation/InvitationCover';
import { VelvetNoirTemplate } from '../components/invitation/VelvetNoirTemplate';
import { dbService } from '../lib/dbService';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Share2,
  Check,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

import { loadProjectsFromStorage, ProjectInvitation } from '../data/projectData';

interface InvitationPreviewPageProps {
  onNavigate: (path: string) => void;
  selectedTemplateId?: string;
  guestNameParam?: string;
  slug?: string;
}

export const InvitationPreviewPage: React.FC<InvitationPreviewPageProps> = ({
  onNavigate,
  selectedTemplateId,
  guestNameParam,
  slug,
}) => {
  const [activeTemplateId, setActiveTemplateId] = useState<string>(selectedTemplateId || 'editorial-romance');
  const [activeColorVariantId, setActiveColorVariantId] = useState<string>('');
  const [isOpened, setIsOpened] = useState(false);
  const [triggerAudio, setTriggerAudio] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const [loadedProject, setLoadedProject] = useState<ProjectInvitation | null>(null);
  const [isLoadingSlug, setIsLoadingSlug] = useState<boolean>(Boolean(slug));
  const [isNotFoundOrDraft, setIsNotFoundOrDraft] = useState<boolean>(false);

  // Sync template from props/url parameter
  React.useEffect(() => {
    if (selectedTemplateId) {
      setActiveTemplateId(selectedTemplateId);
      setActiveColorVariantId('');
    }
  }, [selectedTemplateId]);

  // Load wedding from database or local storage by slug
  React.useEffect(() => {
    if (!slug) return;

    setIsLoadingSlug(true);
    dbService.getWeddingBySlug(slug).then(({ data }) => {
      setIsLoadingSlug(false);
      if (data) {
        if (data.status !== 'published') {
          setIsNotFoundOrDraft(true);
        } else {
          setLoadedProject(data);
          // If no specific template was forced in the URL/props, use the project's saved template
          if (!selectedTemplateId) {
            setActiveTemplateId(data.templateId);
          }
        }
      } else {
        // Fallback: check local storage projects
        const localProjects = loadProjectsFromStorage();
        const found = localProjects.find((p) => p.slug === slug);
        if (found) {
          if (found.status !== 'published') {
            setIsNotFoundOrDraft(true);
          } else {
            setLoadedProject(found);
            // If no specific template was forced in the URL/props, use the project's saved template
            if (!selectedTemplateId) {
              setActiveTemplateId(found.templateId);
            }
          }
        } else if (slug !== 'aditya-amara') {
          setIsNotFoundOrDraft(true);
        }
      }
    });
  }, [slug, selectedTemplateId]);

  // Safe fallback for guest name
  const guestName = guestNameParam && guestNameParam.trim() ? guestNameParam.trim() : 'Honored Guest & Partner';

  const activeTemplate: TemplateConcept =
    TEMPLATES_DATA.find((t) => t.id === activeTemplateId) || TEMPLATES_DATA[0];

  const couple = loadedProject ? loadedProject.weddingData.couple : DEMO_COUPLE.couple;
  const event = loadedProject ? loadedProject.weddingData.event : DEMO_COUPLE.event;
  const heroPhoto = loadedProject ? loadedProject.weddingData.heroPhoto : DEMO_COUPLE.heroPhoto;
  const storyTimeline = loadedProject?.storyTimeline;
  const galleryPhotos = loadedProject?.gallery;
  const digitalGifts = loadedProject?.digitalGifts;
  const features = loadedProject?.features || {
    showRsvp: true,
    showGuestWishes: true,
    showAudio: true,
    audioUrl: '',
    showStory: true,
    showGallery: true,
    showGift: true,
    showCountdown: true,
    googleMapsEmbedUrl: GOOGLE_MAPS_EMBED_URL,
    googleMapsDirectionUrl: GOOGLE_MAPS_DIRECTION_URL,
  };

  const isDark = activeTemplate.id === 'dark-luxury' || activeTemplate.id === 'velvet-noir-editorial';
  const isBotanical = activeTemplate.id === 'modern-botanical';

  // Dynamic Theme Palette bindings with active color variant support
  const activeVariant = activeTemplate.colorVariants?.find((v) => v.id === activeColorVariantId);

  const themeBg = activeVariant?.background || activeTemplate.paletteTheme.background;
  const themeSurface = activeVariant?.surface || activeTemplate.paletteTheme.surface;
  const themeText = activeVariant?.text || activeTemplate.paletteTheme.text;
  const themeAccent = activeVariant?.accent || activeTemplate.paletteTheme.accent;
  const themeBorder = activeVariant?.border || activeTemplate.paletteTheme.border;

  // Web Share API with copy-link fallback
  const handleShare = async () => {
    const shareData = {
      title: `${couple.groom.shortName} & ${couple.bride.shortName} Wedding Invitation`,
      text: `You are cordially invited to celebrate the wedding of ${couple.groom.fullName} and ${couple.bride.fullName}.`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard if user cancels or error
        console.info('Share dismissed or failed, falling back to copy:', err);
      }
    }

    // Clipboard fallback
    navigator.clipboard?.writeText(window.location.href);
    setHasShared(true);
    setTimeout(() => setHasShared(false), 2500);
  };

  // 0. LOADING & DRAFT GUARD
  if (isLoadingSlug) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-warm-white)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--color-burgundy)', marginBottom: '8px' }}>
            ❦ TajukKisah
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>Retrieving invitation details...</p>
        </div>
      </div>
    );
  }

  if (isNotFoundOrDraft) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'var(--color-warm-white)' }}>
        <div style={{ maxWidth: '520px', textAlign: 'center', padding: '40px 32px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: '28px', color: 'var(--color-gold-dark)', marginBottom: '12px' }}>❦</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-espresso)', marginBottom: '12px' }}>
            Invitation Unavailable
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
            This wedding invitation is either currently in private draft mode or the requested link does not exist.
          </p>
          <Button variant="outline" size="sm" onClick={() => onNavigate('/')}>
            Return to TajukKisah Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: themeBg, minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="invitation-cover"
            initial={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              y: -50,
              scale: 0.98,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            }}
            style={{ width: '100%', minHeight: '100vh', position: 'relative', zIndex: 50 }}
          >
            <InvitationCover
              groomName={couple.groom.shortName}
              brideName={couple.bride.shortName}
              dateFormatted={event.dateFormatted}
              guestName={guestName}
              heroPhoto={heroPhoto}
              accentColor={themeAccent}
              textColor={themeText}
              backgroundColor={themeBg}
              onOpenInvitation={() => {
                setIsOpened(true);
                setTriggerAudio(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="invitation-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%' }}
          >
            {/* Floating Audio Soundtrack Player */}
            {features.showAudio && (
              <InvitationAudioPlayer
                accentColor={themeAccent}
                audioUrl={features.audioUrl}
                autoPlayTrigger={triggerAudio}
                songTitle={`${couple.groom.shortName} & ${couple.bride.shortName} Melody`}
              />
            )}

      {/* Top Floating Editorial Toolbar (Docked cleanly at top) */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: isDark ? '#1E0E13' : 'rgba(255, 252, 247, 0.98)',
          backdropFilter: 'blur(16px)',
          borderBottom: isDark ? '1px solid rgba(212, 175, 55, 0.35)' : `1px solid ${themeBorder}`,
          padding: '12px 16px',
          boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 2px 10px rgba(0,0,0,0.04)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px 14px',
            paddingLeft: 'clamp(10px, 3vw, 24px)',
            paddingRight: 'clamp(10px, 3vw, 24px)',
          }}
        >
          {/* Back to Gallery */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => onNavigate('/templates')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.8rem',
                color: isDark ? '#F5EBE1' : 'var(--color-espresso)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: '4px 0',
              }}
            >
              <ArrowLeft size={14} />
              <span>Templates</span>
            </button>
            <span style={{ color: isDark ? 'rgba(212, 175, 55, 0.4)' : themeBorder }}>•</span>
            <span
              style={{
                fontSize: '0.85rem',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 600,
                color: isDark ? '#D4AF37' : themeAccent,
              }}
            >
              {activeTemplate.title}
            </span>
          </div>

          {/* Color Palette Switcher for the active template */}
          {activeTemplate.colorVariants && activeTemplate.colorVariants.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  color: isDark ? '#E5D6C5' : 'var(--color-charcoal-muted)',
                  marginRight: '2px',
                }}
              >
                Palette:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
                {activeTemplate.colorVariants.map((v) => {
                  const isSelected = (activeColorVariantId || activeTemplate.colorVariants![0].id) === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setActiveColorVariantId(v.id)}
                      aria-pressed={isSelected}
                      aria-label={`Switch palette to ${v.name}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        borderRadius: '3px',
                        border: isSelected
                          ? (isDark ? '1px solid #D4AF37' : `1px solid ${themeAccent}`)
                          : (isDark ? '1px solid rgba(212, 175, 55, 0.3)' : `1px solid ${themeBorder}`),
                        backgroundColor: isSelected
                          ? (isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 0, 0, 0.05)')
                          : (isDark ? 'rgba(255, 255, 255, 0.04)' : 'transparent'),
                        color: isDark ? '#F5EBE1' : 'var(--color-espresso)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span
                        style={{
                          width: '9px',
                          height: '9px',
                          borderRadius: '50%',
                          backgroundColor: v.accent,
                          border: '1px solid rgba(255, 255, 255, 0.6)',
                          display: 'inline-block',
                          flexShrink: 0,
                        }}
                      />
                      <span>{v.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions: Order & Share */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              size="sm"
              icon={hasShared ? <Check size={14} color={isDark ? '#F5EBE1' : undefined} /> : <Share2 size={14} color={isDark ? '#F5EBE1' : undefined} />}
              onClick={handleShare}
              style={
                isDark
                  ? {
                      color: '#F5EBE1',
                      borderColor: '#D4AF37',
                      backgroundColor: 'rgba(212, 175, 55, 0.12)',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                    }
                  : undefined
              }
            >
              {hasShared ? 'Link Copied' : 'Share'}
            </Button>
            <Button
              variant={isDark ? 'gold' : 'primary'}
              size="sm"
              icon={<Sparkles size={14} />}
              onClick={() => onNavigate(`/order?template=${activeTemplate.id}`)}
            >
              Order This Design
            </Button>
          </div>
        </div>
      </div>

      {/* INVITATION CONTAINER (Centered Editorial Frame) */}
      {activeTemplate.id === 'velvet-noir-editorial' ? (
        <VelvetNoirTemplate
          couple={couple}
          event={event}
          heroPhoto={heroPhoto}
          guestName={guestName}
          onOpenMap={() => window.open(GOOGLE_MAPS_DIRECTION_URL, '_blank')}
          onSubmitRsvp={(data) => {
            console.log('RSVP Submitted:', data);
          }}
          themeBg={themeBg}
          themeSurface={themeSurface}
          themeAccent={themeAccent}
          themeText={themeText}
          themeBorder={themeBorder}
        />
      ) : (
      <main
        style={{
          maxWidth: '740px',
          width: 'min(calc(100% - 24px), 740px)',
          margin: '24px auto 80px',
          backgroundColor: themeSurface,
          border: `1px solid ${themeBorder}`,
          boxShadow: isDark
            ? '0 24px 64px rgba(0, 0, 0, 0.45)'
            : '0 24px 64px rgba(42, 21, 27, 0.08)',
          color: themeText,
          position: 'relative',
          padding: 'clamp(16px, 5vw, 64px)',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            border: isBotanical
              ? `1px double ${themeAccent}`
              : `1px solid ${themeBorder}`,
            padding: 'clamp(16px, 4vw, 40px)',
            position: 'relative',
          }}
        >
          {/* Section 1: Monogram & Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', marginBottom: '32px' }}
          >
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                fontStyle: 'italic',
                color: themeAccent,
                letterSpacing: '0.15em',
                marginBottom: '8px',
              }}
            >
              {couple.monogram}
            </div>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: themeText,
                opacity: 0.85,
                display: 'block',
              }}
            >
              The Wedding Celebration of
            </span>
          </motion.div>

          {/* Section 2: Couple Names Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', marginBottom: '36px' }}
          >
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.75rem, 6vw, 4.25rem)',
                fontWeight: 400,
                color: themeText,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              {couple.groom.shortName}
              <span
                style={{
                  display: 'block',
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  color: themeAccent,
                  margin: '8px 0',
                }}
              >
                &
              </span>
              {couple.bride.shortName}
            </h1>
          </motion.div>

          {/* Section 3: Main Editorial Photography */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginBottom: '40px',
              border: `1px solid ${themeBorder}`,
              padding: '6px',
              backgroundColor: themeBg,
            }}
          >
            <SafeImage
              src={heroPhoto}
              alt={`${couple.groom.shortName} and ${couple.bride.shortName} Wedding Celebration`}
              aspectRatio="4/5"
            />
          </motion.div>

          {/* Section 4: Sacred Vow / Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', maxWidth: '480px', margin: '0 auto 40px' }}
          >
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1.25rem',
                lineHeight: 1.6,
                color: themeText,
                opacity: 0.9,
                marginBottom: '8px',
              }}
            >
              "{couple.quote}"
            </p>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: themeAccent,
              }}
            >
              — {couple.quoteSource}
            </span>
          </motion.div>

          <DecorativeDivider
            variant="monogram"
            accentColor={themeAccent}
            symbol={isBotanical ? '𓇚' : '❦'}
          />

          {/* Section 5: Couple Profiles and Family Info */}
          <section style={{ margin: '48px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color: themeAccent,
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                The Beloved Couple
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  color: themeText,
                  fontWeight: 400,
                }}
              >
                Groom & Bride
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '32px',
                textAlign: 'center',
              }}
            >
              {/* Groom Profile */}
              <div
                style={{
                  padding: '24px 16px',
                  border: `1px solid ${themeBorder}`,
                  backgroundColor: themeBg,
                }}
              >
                <div
                  style={{
                    width: '120px',
                    height: '140px',
                    margin: '0 auto 16px',
                    overflow: 'hidden',
                    border: `1px solid ${themeAccent}`,
                    padding: '4px',
                  }}
                >
                  <SafeImage
                    src={couple.groom.photoUrl}
                    alt={couple.groom.fullName}
                    aspectRatio="1/1"
                  />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.35rem',
                    color: themeText,
                    marginBottom: '4px',
                  }}
                >
                  {couple.groom.fullName}
                </h3>
                <p style={{ fontSize: '0.8rem', color: themeText, opacity: 0.75 }}>
                  First son of {couple.groom.father} <br />
                  & {couple.groom.mother}
                </p>
              </div>

              {/* Bride Profile */}
              <div
                style={{
                  padding: '24px 16px',
                  border: `1px solid ${themeBorder}`,
                  backgroundColor: themeBg,
                }}
              >
                <div
                  style={{
                    width: '120px',
                    height: '140px',
                    margin: '0 auto 16px',
                    overflow: 'hidden',
                    border: `1px solid ${themeAccent}`,
                    padding: '4px',
                  }}
                >
                  <SafeImage
                    src={couple.bride.photoUrl}
                    alt={couple.bride.fullName}
                    aspectRatio="1/1"
                  />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.35rem',
                    color: themeText,
                    marginBottom: '4px',
                  }}
                >
                  {couple.bride.fullName}
                </h3>
                <p style={{ fontSize: '0.8rem', color: themeText, opacity: 0.75 }}>
                  Daughter of {couple.bride.father} <br />
                  & {couple.bride.mother}
                </p>
              </div>
            </div>
          </section>

          <DecorativeDivider variant="subtle" accentColor={themeAccent} />

          {/* Section 6: Wedding Countdown */}
          <section style={{ margin: '48px 0', textAlign: 'center' }}>
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: themeAccent,
                fontWeight: 600,
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Counting Down to Forever
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2rem',
                color: themeText,
                fontWeight: 400,
              }}
            >
              Save the Sacred Date
            </h2>

            <WeddingCountdown
              targetDate={event.calendarDate ? `${event.calendarDate}T09:00:00` : '2026-11-28T09:00:00'}
              accentColor={themeAccent}
              textColor={themeText}
              borderColor={themeBorder}
            />
          </section>

          <DecorativeDivider variant="line" accentColor={themeAccent} />

          {/* Section 7: Love Story Timeline */}
          {features.showStory !== false && (
            <>
              <LoveStoryTimeline
                items={storyTimeline}
                accentColor={themeAccent}
                textColor={themeText}
                borderColor={themeBorder}
              />
              <DecorativeDivider variant="subtle" accentColor={themeAccent} />
            </>
          )}

          {/* Section 8: Ceremony & Reception Details */}
          <section style={{ margin: '48px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color: themeAccent,
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Wedding Schedule
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  color: themeText,
                  fontWeight: 400,
                }}
              >
                Ceremony & Reception
              </h2>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  color: themeAccent,
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                <Calendar size={16} />
                <span>{event.dateFormatted}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Akad */}
              <div
                style={{
                  padding: '24px',
                  border: `1px solid ${themeBorder}`,
                  backgroundColor: themeBg,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: themeAccent, marginBottom: '8px' }}>
                  <Clock size={16} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{event.holyMatrimony.time}</span>
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.45rem',
                    color: themeText,
                    marginBottom: '6px',
                  }}
                >
                  {event.holyMatrimony.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: themeText, opacity: 0.85, fontWeight: 500, marginBottom: '4px' }}>
                  {event.holyMatrimony.venue}
                </p>
                <p style={{ fontSize: '0.8rem', color: themeText, opacity: 0.7, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <MapPin size={14} style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>{event.holyMatrimony.address}</span>
                </p>
              </div>

              {/* Reception */}
              <div
                style={{
                  padding: '24px',
                  border: `1px solid ${themeBorder}`,
                  backgroundColor: themeBg,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: themeAccent, marginBottom: '8px' }}>
                  <Clock size={16} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{event.reception.time}</span>
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.45rem',
                    color: themeText,
                    marginBottom: '6px',
                  }}
                >
                  {event.reception.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: themeText, opacity: 0.85, fontWeight: 500, marginBottom: '4px' }}>
                  {event.reception.venue}
                </p>
                <p style={{ fontSize: '0.8rem', color: themeText, opacity: 0.7, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <MapPin size={14} style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>{event.reception.address}</span>
                </p>
              </div>
            </div>

            {/* Google Maps Embed & External Link */}
            <div style={{ marginTop: '32px' }}>
              <div
                style={{
                  width: '100%',
                  height: '280px',
                  border: `1px solid ${themeBorder}`,
                  overflow: 'hidden',
                  backgroundColor: '#ECE7DE',
                }}
              >
                <iframe
                  title="Wedding Location Map"
                  src={GOOGLE_MAPS_EMBED_URL}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <a
                  href={GOOGLE_MAPS_DIRECTION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<ExternalLink size={14} />}
                  >
                    Open in Google Maps
                  </Button>
                </a>
              </div>
            </div>
          </section>

          <DecorativeDivider variant="line" accentColor={themeAccent} />

          {/* Section 9: Responsive Photo Gallery with Lightbox */}
          {features.showGallery !== false && (
            <>
              <section style={{ margin: '48px 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.22em',
                      color: themeAccent,
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    Treasured Moments
                  </span>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '2rem',
                      color: themeText,
                      fontWeight: 400,
                    }}
                  >
                    Our Gallery
                  </h2>
                </div>

                <InteractiveGallery
                  items={galleryPhotos && galleryPhotos.length > 0 ? galleryPhotos : GALLERY_ITEMS}
                  accentColor={themeAccent}
                  borderColor={themeBorder}
                />
              </section>
              <DecorativeDivider variant="subtle" accentColor={themeAccent} />
            </>
          )}

          {/* Section 10: RSVP Form */}
          {features.showRsvp !== false && (
            <>
              <RsvpSection
                accentColor={themeAccent}
                textColor={themeText}
                borderColor={themeBorder}
                surfaceColor={themeBg}
                onRsvpSuccess={(name, attendance) => {
                  dbService.submitRsvp(loadedProject?.id || '00000000-0000-0000-0000-000000000000', {
                    fullName: name,
                    contact: 'RSVP Form Submission',
                    attendance,
                    paxConfirmed: 1,
                  });
                }}
              />
              <DecorativeDivider variant="monogram" accentColor={themeAccent} symbol="❦" />
            </>
          )}

          {/* Section 11: Guest Wishes and Messages */}
          {features.showGuestWishes !== false && (
            <>
              <GuestWishesSection
                weddingId={loadedProject?.id}
                accentColor={themeAccent}
                textColor={themeText}
                borderColor={themeBorder}
                surfaceColor={themeBg}
              />
              <DecorativeDivider variant="subtle" accentColor={themeAccent} />
            </>
          )}

          {/* Section 12: Digital Gift Section */}
          {features.showGift !== false && digitalGifts?.enabled !== false && (
            <>
              <DigitalGiftsSection
                giftsData={digitalGifts}
                accentColor={themeAccent}
                textColor={themeText}
                borderColor={themeBorder}
                surfaceColor={themeBg}
              />
              <DecorativeDivider variant="monogram" accentColor={themeAccent} symbol="❦" />
            </>
          )}

          {/* Section 13: Closing Message and Wedding Footer */}
          <section style={{ textAlign: 'center', margin: '48px 0 24px' }}>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                color: themeText,
                marginBottom: '12px',
              }}
            >
              Thank You for Your Blessings
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                lineHeight: 1.7,
                color: themeText,
                opacity: 0.85,
                maxWidth: '480px',
                margin: '0 auto 28px',
              }}
            >
              It is an immense privilege to share this precious chapter with the people who have shaped our lives. We eagerly await celebrating together.
            </p>

            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                fontStyle: 'italic',
                color: themeAccent,
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Aditya & Amara
            </span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: themeText,
                opacity: 0.82,
              }}
            >
              #AdityaAmaraForever
            </span>
          </section>
        </div>
      </main>
      )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
