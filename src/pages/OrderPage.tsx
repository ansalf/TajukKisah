import React, { useState } from 'react';
import { TEMPLATES_DATA, TemplateConcept } from '../data/mockData';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { DecorativeDivider } from '../components/common/DecorativeDivider';
import { dbService } from '../lib/dbService';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';

interface OrderPageProps {
  initialTemplateId?: string;
  onNavigate: (path: string) => void;
}

export const OrderPage: React.FC<OrderPageProps> = ({
  initialTemplateId = 'editorial-romance',
  onNavigate,
}) => {
  // Find or fallback template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialTemplateId);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [ceremonyVenue, setCeremonyVenue] = useState('');
  const [receptionVenue, setReceptionVenue] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songReferenceUrl, setSongReferenceUrl] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Form UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeTemplate: TemplateConcept =
    TEMPLATES_DATA.find((t) => t.id === selectedTemplateId) || TEMPLATES_DATA[0];

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!validateEmail(customerEmail.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!customerWhatsapp.trim() || customerWhatsapp.trim().length < 8) {
      setErrorMessage('Please enter a valid WhatsApp phone number.');
      return;
    }
    if (!groomName.trim() || !brideName.trim()) {
      setErrorMessage('Please provide both the Groom and Bride names.');
      return;
    }
    if (!weddingDate.trim()) {
      setErrorMessage('Please provide the estimated or confirmed wedding date.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerWhatsapp: customerWhatsapp.trim(),
      templateId: activeTemplate.id,
      templateTitle: activeTemplate.title,
      groomName: groomName.trim(),
      brideName: brideName.trim(),
      weddingDate: weddingDate.trim(),
      ceremonyVenue: ceremonyVenue.trim(),
      receptionVenue: receptionVenue.trim(),
      songTitle: songTitle.trim(),
      songArtist: songArtist.trim(),
      songReferenceUrl: songReferenceUrl.trim(),
      specialRequests: specialRequests.trim(),
    };

    const { error } = await dbService.submitOrder(payload);

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(
        'We encountered an issue submitting your request. Please try again or reach out directly via WhatsApp.'
      );
      return;
    }

    setSubmitSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // WhatsApp follow-up link
  const waMessage = encodeURIComponent(
    `Hello TajukKisah Atelier, I have just submitted an invitation order request for ${groomName || 'our wedding'} & ${brideName || ''} using the "${activeTemplate.title}" design.`
  );
  const waUrl = `https://wa.me/6281234567890?text=${waMessage}`;

  return (
    <div style={{ backgroundColor: 'var(--color-warm-white)', minHeight: '100vh', paddingBottom: '96px' }}>
      {/* Header */}
      <section
        style={{
          paddingTop: '64px',
          paddingBottom: '40px',
          borderBottom: '1px solid var(--color-border-subtle)',
          backgroundColor: 'var(--color-ivory-light)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '780px' }}>
          <SectionHeading
            eyebrow="TajukKisah Bespoke Service"
            title="Commission Your Digital Invitation"
            subtitle="Share your wedding vision with us. Our atelier design team personalizes every detail—from romantic storytelling and custom photo curation to guest list links—delivering a finished luxury invitation."
          />
        </div>
      </section>

      {/* Main Order Content */}
      <div className="container" style={{ maxWidth: '840px', marginTop: '48px' }}>
        {submitSuccess ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(199, 166, 106, 0.4)',
              boxShadow: '0 20px 48px rgba(42, 21, 27, 0.08)',
              padding: 'clamp(32px, 6vw, 56px)',
              textAlign: 'center',
              borderRadius: '2px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(74, 91, 69, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle2 size={36} color="#4A5B45" />
            </div>

            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--color-gold-dark)',
                fontWeight: 600,
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Commission Request Received
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                color: 'var(--color-espresso)',
                fontWeight: 400,
                marginBottom: '16px',
              }}
            >
              Thank You, {customerName}
            </h2>

            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'var(--color-charcoal-muted)',
                maxWidth: '560px',
                margin: '0 auto 28px',
              }}
            >
              Your wedding invitation order request for{' '}
              <strong style={{ color: 'var(--color-espresso)' }}>
                {groomName} &amp; {brideName}
              </strong>{' '}
              in the{' '}
              <strong style={{ color: 'var(--color-burgundy)' }}>
                {activeTemplate.title}
              </strong>{' '}
              theme has been logged. Our design team has received your submission and will review your event details to begin crafting your personalized invitation link.
            </p>

            <div
              style={{
                backgroundColor: 'var(--color-ivory)',
                border: '1px solid var(--color-border-subtle)',
                padding: '20px',
                borderRadius: '2px',
                maxWidth: '480px',
                margin: '0 auto 36px',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-burgundy)', fontWeight: 600, fontSize: '0.85rem' }}>
                <ShieldCheck size={16} />
                <span>Next Steps:</span>
              </div>
              <ul style={{ fontSize: '0.875rem', color: 'var(--color-charcoal-muted)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Our team will contact you via WhatsApp (<strong>{customerWhatsapp}</strong>) or Email (<strong>{customerEmail}</strong>).</li>
                <li>You can send high-resolution wedding portraits and family information directly via chat.</li>
                <li>We deliver your live test link for review and approval prior to guest distribution.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="md" icon={<MessageCircle size={16} />}>
                  Chat with Atelier via WhatsApp
                </Button>
              </a>
              <Button variant="outline" size="md" onClick={() => onNavigate('/templates')}>
                Browse More Themes
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border-subtle)',
              boxShadow: 'var(--shadow-card)',
              padding: 'clamp(28px, 5vw, 48px)',
              borderRadius: '2px',
            }}
          >
            {/* Error Message */}
            {errorMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(220, 38, 38, 0.08)',
                  border: '1px solid rgba(220, 38, 38, 0.25)',
                  color: '#DC2626',
                  fontSize: '0.875rem',
                  marginBottom: '28px',
                  borderRadius: '2px',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: Selected Theme Overview */}
            <div style={{ marginBottom: '36px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: 'var(--color-gold-dark)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Step 01 • Chosen Aesthetic
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.6rem',
                  color: 'var(--color-espresso)',
                  fontWeight: 400,
                  marginBottom: '16px',
                }}
              >
                Selected Invitation Theme
              </h3>

              {/* Theme Selector Pills */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                {TEMPLATES_DATA.map((t) => {
                  const isSelected = t.id === selectedTemplateId;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTemplateId(t.id)}
                      style={{
                        padding: '14px',
                        border: isSelected
                          ? '1.5px solid var(--color-burgundy)'
                          : '1px solid var(--color-border-subtle)',
                        backgroundColor: isSelected ? 'var(--color-ivory)' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        borderRadius: '2px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gold-dark)', fontWeight: 600 }}>
                          {t.paletteTheme.badge}
                        </span>
                        {isSelected && <CheckCircle2 size={15} color="var(--color-burgundy)" />}
                      </div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-espresso)', marginTop: '4px' }}>
                        {t.title}
                      </h4>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => onNavigate(`/invitation/aditya-amara?template=${activeTemplate.id}`)}
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-burgundy)',
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Preview "{activeTemplate.title}" live in full screen →
                </button>
              </div>
            </div>

            <DecorativeDivider variant="subtle" accentColor="var(--color-gold)" />

            {/* Step 2: Contact Information */}
            <div style={{ margin: '36px 0' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: 'var(--color-gold-dark)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Step 02 • Client Details
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.6rem',
                  color: 'var(--color-espresso)',
                  fontWeight: 400,
                  marginBottom: '16px',
                }}
              >
                Your Contact Information
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div>
                  <label htmlFor="order-customer-name" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    id="order-customer-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Raden Aditya"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: '2px',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="order-customer-email" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    id="order-customer-email"
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="aditya@example.com"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: '2px',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="order-customer-whatsapp" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    WhatsApp Number *
                  </label>
                  <input
                    id="order-customer-whatsapp"
                    type="tel"
                    required
                    value={customerWhatsapp}
                    onChange={(e) => setCustomerWhatsapp(e.target.value)}
                    placeholder="e.g. 081234567890"
                    aria-describedby="order-whatsapp-desc"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: '2px',
                      fontSize: '0.9rem',
                    }}
                  />
                  <span id="order-whatsapp-desc" style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)', marginTop: '4px', display: 'block' }}>
                    For order confirmation and proof link delivery.
                  </span>
                </div>
              </div>
            </div>

            <DecorativeDivider variant="subtle" accentColor="var(--color-gold)" />

            {/* Step 3: Wedding Details */}
            <div style={{ margin: '36px 0' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: 'var(--color-gold-dark)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Step 03 • The Sacred Occasion
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.6rem',
                  color: 'var(--color-espresso)',
                  fontWeight: 400,
                  marginBottom: '16px',
                }}
              >
                Couple &amp; Wedding Information
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label htmlFor="order-groom-name" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Groom's Name *
                  </label>
                  <input
                    id="order-groom-name"
                    type="text"
                    required
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    placeholder="e.g. Aditya Wicaksono"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: '2px',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="order-bride-name" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Bride's Name *
                  </label>
                  <input
                    id="order-bride-name"
                    type="text"
                    required
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    placeholder="e.g. Amara Danasasmita"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: '2px',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="order-wedding-date" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Estimated / Target Wedding Date *
                  </label>
                  <input
                    id="order-wedding-date"
                    type="date"
                    required
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: '2px',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label htmlFor="order-ceremony-venue" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Akad / Ceremony Venue (Optional)
                  </label>
                  <input
                    id="order-ceremony-venue"
                    type="text"
                    value={ceremonyVenue}
                    onChange={(e) => setCeremonyVenue(e.target.value)}
                    placeholder="e.g. The Glasshouse at Plataran Dharmawangsa"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: '2px',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="order-reception-venue" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Reception Venue (Optional)
                  </label>
                  <input
                    id="order-reception-venue"
                    type="text"
                    value={receptionVenue}
                    onChange={(e) => setReceptionVenue(e.target.value)}
                    placeholder="e.g. The Grand Ballroom, Jakarta"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: '2px',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              {/* Custom Music Preference */}
              <div
                style={{
                  backgroundColor: 'var(--color-ivory-light)',
                  border: '1px solid var(--color-border-subtle)',
                  padding: '20px',
                  marginBottom: '20px',
                  borderRadius: '2px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-burgundy)' }}>
                    Custom Background Music Soundtrack (Optional)
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)', marginBottom: '16px', lineHeight: 1.6 }}>
                  Every invitation features an ambient musical accompaniment. You can request your favorite song, suggest an acoustic instrumental version, or choose from our licensed wedding library.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '12px' }}>
                  <div>
                    <label htmlFor="order-song-title" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      Song Title
                    </label>
                    <input
                      id="order-song-title"
                      type="text"
                      value={songTitle}
                      onChange={(e) => setSongTitle(e.target.value)}
                      placeholder="e.g. Can't Help Falling in Love / Canon in D"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: '2px',
                        fontSize: '0.9rem',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="order-song-artist" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      Artist / Composer
                    </label>
                    <input
                      id="order-song-artist"
                      type="text"
                      value={songArtist}
                      onChange={(e) => setSongArtist(e.target.value)}
                      placeholder="e.g. Kina Grannis / Acoustic Piano"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: '2px',
                        fontSize: '0.9rem',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="order-song-url" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Reference URL or Audio Link (Spotify, YouTube, MP3 or Cloud Drive)
                  </label>
                  <input
                    id="order-song-url"
                    type="url"
                    value={songReferenceUrl}
                    onChange={(e) => setSongReferenceUrl(e.target.value)}
                    placeholder="https://open.spotify.com/... or https://youtube.com/..."
                    aria-describedby="order-song-desc"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--color-border-subtle)',
                      borderRadius: '2px',
                      fontSize: '0.9rem',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                  <span id="order-song-desc" style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)', marginTop: '4px', display: 'block' }}>
                    Note: Our team ensures audio files are properly licensed, royalty-free, or authorized for private non-commercial celebration use.
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="order-special-requests" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Special Requests, Notes, or Story Highlights (Optional)
                </label>
                <textarea
                  id="order-special-requests"
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Share details such as dress code colors, romantic quotes, number of guest categories, or questions..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: '2px',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            <div style={{ paddingTop: '20px', borderTop: '1px solid var(--color-border-subtle)' }}>
              <Button
                variant="primary"
                size="lg"
                type="submit"
                isFullWidth
                disabled={isSubmitting}
                icon={isSubmitting ? undefined : <Send size={16} />}
              >
                {isSubmitting ? 'Submitting Order Request...' : 'Submit Invitation Commission Request'}
              </Button>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-charcoal-muted)', marginTop: '12px' }}>
                By submitting this form, our team will review your order details and follow up with a live preview proposal. No payment is required right now.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
