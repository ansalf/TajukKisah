import React, { useState } from 'react';
import { SafeImage } from '../common/SafeImage';
import { Button } from '../common/Button';
import { MapPin, CheckCircle2, Send } from 'lucide-react';

interface VelvetNoirTemplateProps {
  couple: {
    groom: { fullName: string; shortName: string; father: string; mother: string; photoUrl: string };
    bride: { fullName: string; shortName: string; father: string; mother: string; photoUrl: string };
    monogram: string;
    quote: string;
    quoteSource: string;
    storyNarrative: string;
  };
  event: {
    dateFormatted: string;
    dayOfWeek: string;
    timeFormatted: string;
    calendarDate: string;
    holyMatrimony: { title: string; time: string; venue: string; address: string };
    reception: { title: string; time: string; venue: string; address: string };
  };
  heroPhoto: string;
  guestName: string;
  onOpenMap: () => void;
  onSubmitRsvp: (data: { name: string; attendance: string; guestsCount: number; message: string }) => void;
}

export const VelvetNoirTemplate: React.FC<VelvetNoirTemplateProps> = ({
  couple,
  event,
  heroPhoto,
  guestName,
  onOpenMap,
  onSubmitRsvp,
}) => {
  // RSVP Form state
  const [rsvpName, setRsvpName] = useState(guestName !== 'Honored Guest & Partner' ? guestName : '');
  const [attendance, setAttendance] = useState<'attending' | 'declined'>('attending');
  const [beverage, setBeverage] = useState<string[]>(['Red Wine', 'Champagne']);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleBeverage = (item: string) => {
    setBeverage((prev) =>
      prev.includes(item) ? prev.filter((b) => b !== item) : [...prev, item]
    );
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    onSubmitRsvp({
      name: rsvpName,
      attendance,
      guestsCount: attendance === 'attending' ? 2 : 0,
      message: `Beverage preference: ${beverage.join(', ') || 'None'}`,
    });
    setIsSubmitted(true);
  };

  return (
    <div
      style={{
        backgroundColor: '#23040A',
        color: '#F4ECE4',
        fontFamily: 'var(--font-sans)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient velvet texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 20%, #4D0E19 0%, #23040A 70%, #150206 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '520px',
          margin: '0 auto',
          position: 'relative',
          padding: '48px 20px 80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '64px',
        }}
      >
        {/* =========================================
            HEADER & CALLIGRAPHIC TITLE
        ========================================= */}
        <section style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.5rem',
              fontStyle: 'italic',
              color: '#F5EBE1',
              letterSpacing: '0.02em',
              lineHeight: 1.1,
              marginBottom: '6px',
            }}
          >
            Wedding Invitation
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6875rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#D4AF37',
              fontWeight: 600,
            }}
          >
            A Royal Celebration of Love
          </div>
        </section>

        {/* =========================================
            BURGUNDY ENVELOPE WITH GOLD WAX SEAL
        ========================================= */}
        <section style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              backgroundColor: '#4D0E19',
              borderRadius: '6px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              position: 'relative',
              padding: '40px 24px',
              textAlign: 'center',
            }}
          >
            {/* Triangular envelope fold illusion */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '80px',
                borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                backgroundColor: '#3E0B14',
              }}
            />

            {/* Gold Wax Seal Medallion */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #F0D58A 0%, #C7A66A 50%, #8C6A2E 100%)',
                border: '2px solid #5A4017',
                boxShadow: '0 8px 20px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4)',
                margin: '20px auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  color: '#4A1423',
                  textShadow: '0 1px 1px rgba(255,255,255,0.6)',
                }}
              >
                {couple.monogram.slice(0, 1) || 'A'}
              </span>
            </div>

            <div
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#D4AF37',
                marginBottom: '6px',
              }}
            >
              Special Invitation For
            </div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                fontStyle: 'italic',
                color: '#FAF4EC',
              }}
            >
              {guestName}
            </div>
          </div>
        </section>

        {/* =========================================
            COUPLE NAMES IN FINE SCRIPT
        ========================================= */}
        <section style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.75rem, 8vw, 3.8rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.15,
              color: '#FAF4EC',
              textShadow: '0 2px 10px rgba(0,0,0,0.4)',
            }}
          >
            {couple.groom.shortName}
            <span
              style={{
                display: 'block',
                fontSize: '1.6rem',
                color: '#D4AF37',
                margin: '4px 0',
                fontFamily: 'var(--font-serif)',
              }}
            >
              &amp;
            </span>
            {couple.bride.shortName}
          </h1>
        </section>

        {/* =========================================
            PARCHMENT CARD: INVITATION GREETING & CALENDAR
        ========================================= */}
        <section
          style={{
            backgroundColor: '#FAF5EE',
            color: '#2A151B',
            borderRadius: '16px 16px 2px 2px',
            border: '2px solid #E4D3BF',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            padding: '36px 28px',
            position: 'relative',
          }}
        >
          {/* Scalloped / Arched Top Edge Border Motif */}
          <div
            style={{
              border: '1px solid #D1BA9F',
              borderRadius: '12px',
              padding: '28px 20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.85rem',
                fontStyle: 'italic',
                color: '#651F32',
                marginBottom: '16px',
              }}
            >
              Dear Family &amp; Friends
            </div>
            <p
              style={{
                fontSize: '0.9rem',
                lineHeight: 1.7,
                color: '#554247',
                marginBottom: '28px',
              }}
            >
              {couple.storyNarrative ||
                'We joyfully invite you to celebrate our union and share the beginning of this unforgettable new chapter in our family story.'}
            </p>

            {/* Vintage Calendar Grid with Heart Badge on wedding day */}
            <div
              style={{
                borderTop: '1px solid rgba(101, 31, 50, 0.15)',
                paddingTop: '20px',
                marginTop: '12px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#8C747A',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                }}
              >
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span style={{ color: '#651F32' }}>Sat</span>
                <span style={{ color: '#651F32' }}>Sun</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '6px',
                  fontSize: '0.875rem',
                  color: '#3A1E25',
                }}
              >
                <span>24</span>
                <span>25</span>
                <span>26</span>
                <span>27</span>
                <span
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#651F32',
                  }}
                >
                  {/* Hand-drawn heart marker around the date */}
                  <span
                    style={{
                      position: 'absolute',
                      inset: '-4px',
                      border: '2px solid #651F32',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      transform: 'rotate(-5deg)',
                      pointerEvents: 'none',
                    }}
                  />
                  28
                </span>
                <span>29</span>
                <span>30</span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  fontStyle: 'italic',
                  color: '#651F32',
                  marginTop: '16px',
                }}
              >
                {event.dateFormatted}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            PARCHMENT CARD: VENUE & MAP
        ========================================= */}
        <section
          style={{
            backgroundColor: '#FAF5EE',
            color: '#2A151B',
            borderRadius: '12px',
            border: '2px solid #E4D3BF',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            padding: '32px 24px',
            textAlign: 'center',
          }}
        >
          {/* Small Gold Medallion */}
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #F0D58A 0%, #C7A66A 50%, #8C6A2E 100%)',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <MapPin size={18} color="#4A1423" />
          </div>

          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.75rem',
              fontStyle: 'italic',
              color: '#651F32',
              marginBottom: '10px',
            }}
          >
            Celebration Venue
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#7E666C', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>
            Location Details
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#2A151B', marginBottom: '4px' }}>
            {event.reception.venue}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6A565C', marginBottom: '20px' }}>
            {event.reception.address}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '0.8rem', color: '#7E666C', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Guest Arrival at
            </span>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#651F32', fontWeight: 600 }}>
              {event.reception.time || '06:00 PM'}
            </div>
          </div>

          <Button variant="primary" size="md" isFullWidth onClick={onOpenMap} icon={<MapPin size={16} />}>
            View Location on Google Maps
          </Button>
        </section>

        {/* =========================================
            DRAMATIC FLORAL STILL LIFE / HAND HOLDING BOUQUET
        ========================================= */}
        <section style={{ textAlign: 'center', position: 'relative' }}>
          <div
            style={{
              width: '100%',
              height: '320px',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
            }}
          >
            <SafeImage
              src={
                heroPhoto ||
                'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80'
              }
              alt="Rose Bouquet & Velvet"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 40%, rgba(35, 4, 10, 0.9) 100%)',
              }}
            />
          </div>
        </section>

        {/* =========================================
            PROGRAM OF THE DAY (VERTICAL BEADED TIMELINE)
        ========================================= */}
        <section style={{ textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.4rem',
              fontStyle: 'italic',
              color: '#F4ECE4',
              marginBottom: '36px',
            }}
          >
            Order of Events
          </h2>

          <div style={{ maxWidth: '360px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px', position: 'relative' }}>
            {/* Vertical timeline spine */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                bottom: '12px',
                left: '92px',
                width: '1px',
                backgroundColor: 'rgba(212, 175, 55, 0.4)',
              }}
            />

            {[
              { time: '01:00 PM', title: 'Guest Welcoming' },
              { time: '01:30 PM', title: 'Solemn Wedding Ceremony' },
              { time: '02:30 PM', title: 'Grand Banquet Dinner' },
              { time: '09:00 PM', title: 'Evening Toast & Departure' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                {/* Time (left column) */}
                <div
                  style={{
                    width: '80px',
                    textAlign: 'right',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.2rem',
                    fontStyle: 'italic',
                    color: '#FAF4EC',
                  }}
                >
                  {item.time}
                </div>

                {/* Dot */}
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#D4AF37',
                    boxShadow: '0 0 10px #D4AF37',
                    margin: '0 16px',
                    flexShrink: 0,
                  }}
                />

                {/* Event Title (right column) */}
                <div
                  style={{
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    color: '#E0D2C8',
                    letterSpacing: '0.02em',
                  }}
                >
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            DRESS CODE & PALETTE SWATCHES
        ========================================= */}
        <section
          style={{
            textAlign: 'center',
            padding: '36px 20px',
            borderTop: '1px solid rgba(212, 175, 55, 0.2)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.2rem',
              fontStyle: 'italic',
              color: '#F4ECE4',
              marginBottom: '12px',
            }}
          >
            Dress Code
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              lineHeight: 1.6,
              color: '#D4C4B8',
              maxWidth: '340px',
              margin: '0 auto 24px',
            }}
          >
            We would be honored if you join us wearing attire that harmonizes with our wedding palette:
          </p>

          {/* Color Circles */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
            {[
              { color: '#5C1425', label: 'Crimson' },
              { color: '#7E364A', label: 'Dusty Rose' },
              { color: '#C8A996', label: 'Warm Taupe' },
              { color: '#EBE2D5', label: 'Classic Ivory' },
            ].map((swatch, idx) => (
              <div
                key={idx}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: swatch.color,
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                  transition: 'transform 0.2s ease',
                }}
                title={swatch.label}
              />
            ))}
          </div>
        </section>

        {/* =========================================
            RSVP GUEST FORM
        ========================================= */}
        <section
          style={{
            backgroundColor: '#FAF5EE',
            color: '#2A151B',
            borderRadius: '14px',
            padding: '36px 24px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            border: '2px solid #E4D3BF',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.1rem',
                fontStyle: 'italic',
                color: '#651F32',
                marginBottom: '8px',
              }}
            >
              Guest Attendance &amp; RSVP
            </div>
            <p style={{ fontSize: '0.825rem', color: '#6A565C', lineHeight: 1.5 }}>
              Please kindly complete this form to help us arrange your seating and dinner preferences.
            </p>
          </div>

          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <CheckCircle2 size={40} color="#651F32" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#651F32', marginBottom: '6px' }}>
                Thank You for Your Confirmation!
              </div>
              <p style={{ fontSize: '0.85rem', color: '#6A565C' }}>
                We joyfully look forward to celebrating together on our special day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label
                  htmlFor="velvet-rsvp-name"
                  style={{ display: 'block', fontSize: '0.785rem', fontWeight: 600, color: '#3A1E25', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                >
                  Full Name *
                </label>
                <input
                  id="velvet-rsvp-name"
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="e.g. John & Sarah Doe"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '4px',
                    border: '1px solid #D1BA9F',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.9rem',
                    color: '#2A151B',
                  }}
                />
              </div>

              <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                <legend style={{ display: 'block', fontSize: '0.785rem', fontWeight: 600, color: '#3A1E25', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Will you be able to attend? *
                </legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', cursor: 'pointer', color: '#2A151B' }}>
                    <input
                      type="radio"
                      name="velvet-attendance"
                      checked={attendance === 'attending'}
                      onChange={() => setAttendance('attending')}
                      style={{ accentColor: '#651F32', width: '18px', height: '18px' }}
                    />
                    <span>Yes, I will attend with pleasure</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', cursor: 'pointer', color: '#2A151B' }}>
                    <input
                      type="radio"
                      name="velvet-attendance"
                      checked={attendance === 'declined'}
                      onChange={() => setAttendance('declined')}
                      style={{ accentColor: '#651F32', width: '18px', height: '18px' }}
                    />
                    <span>Regretfully, I will not be able to attend</span>
                  </label>
                </div>
              </fieldset>

              <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                <legend style={{ display: 'block', fontSize: '0.785rem', fontWeight: 600, color: '#3A1E25', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Beverage Preference:
                </legend>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {['Red Wine', 'White Wine', 'Champagne', 'Whisky', 'Non-Alcoholic'].map((item) => (
                    <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', cursor: 'pointer', color: '#2A151B' }}>
                      <input
                        type="checkbox"
                        checked={beverage.includes(item)}
                        onChange={() => toggleBeverage(item)}
                        style={{ accentColor: '#651F32', width: '18px', height: '18px' }}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <Button
                variant="primary"
                size="md"
                isFullWidth
                type="submit"
                icon={<Send size={15} aria-hidden="true" />}
                aria-label="Submit RSVP response"
              >
                Submit RSVP
              </Button>
            </form>
          )}
        </section>

        {/* =========================================
            CLOSING GREETING & FINAL SIGNATURE
        ========================================= */}
        <section style={{ textAlign: 'center', paddingTop: '20px' }}>
          <div
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#D4AF37',
              marginBottom: '28px',
            }}
          >
            We eagerly await celebrating together with you!
          </div>

          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.5rem',
              fontStyle: 'italic',
              color: '#F4ECE4',
              lineHeight: 1.2,
            }}
          >
            {couple.groom.shortName}
            <span style={{ display: 'block', fontSize: '1.4rem', color: '#D4AF37' }}>&amp;</span>
            {couple.bride.shortName}
          </div>
        </section>
      </div>
    </div>
  );
};
