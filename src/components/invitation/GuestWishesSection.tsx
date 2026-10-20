import React, { useState, useEffect } from 'react';
import { GuestWish, INITIAL_GUEST_WISHES } from '../../data/invitationData';
import { Button } from '../common/Button';
import { dbService } from '../../lib/dbService';
import { Send, Check } from 'lucide-react';

interface GuestWishesProps {
  weddingId?: string;
  accentColor?: string;
  textColor?: string;
  borderColor?: string;
  surfaceColor?: string;
}

export const GuestWishesSection: React.FC<GuestWishesProps> = ({
  weddingId,
  accentColor = 'var(--color-burgundy)',
  textColor = 'var(--color-espresso)',
  borderColor = 'rgba(101, 31, 50, 0.15)',
  surfaceColor = 'rgba(255, 252, 247, 0.8)',
}) => {
  const [wishes, setWishes] = useState<GuestWish[]>(INITIAL_GUEST_WISHES);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [message, setMessage] = useState('');
  const [attendance] = useState<'attending' | 'regret' | 'tentative'>('attending');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Load live wishes from Supabase if weddingId is present
  useEffect(() => {
    if (!weddingId || weddingId === '00000000-0000-0000-0000-000000000000') return;

    dbService.getPublicWishes(weddingId).then(({ data }) => {
      if (data && data.length > 0) {
        const mapped: GuestWish[] = data.map((w: any) => ({
          id: w.id,
          name: w.sender_name || 'Guest',
          relationship: w.relationship || 'Friend',
          message: w.message || '',
          attendance: 'attending',
          timestamp: new Date(w.created_at).toLocaleDateString(),
        }));
        setWishes(mapped);
      }
    });
  }, [weddingId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError('Please provide your name and warm wishes.');
      return;
    }

    const newWish: GuestWish = {
      id: `wish-${Date.now()}`,
      name: name.trim(),
      relationship,
      message: message.trim(),
      attendance,
      timestamp: 'Just now',
    };

    setWishes([newWish, ...wishes]);

    // Persist to Supabase if valid weddingId
    if (weddingId && weddingId !== '00000000-0000-0000-0000-000000000000') {
      dbService.submitWish(weddingId, {
        name: name.trim(),
        relationship,
        message: message.trim(),
        attendance,
      });
    }

    setName('');
    setMessage('');
    setError('');
    setHasSubmitted(true);
    setTimeout(() => setHasSubmitted(false), 3000);
  };

  return (
    <div style={{ margin: '48px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
          Words of Love
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            color: textColor,
            fontWeight: 400,
          }}
        >
          Prayers & Blessings
        </h3>
        <p style={{ fontSize: '0.85rem', color: textColor, opacity: 0.7, marginTop: '4px' }}>
          Leave a note for the couple as they begin their sacred journey
        </p>
      </div>

      {/* Submission Form */}
      <div
        style={{
          backgroundColor: surfaceColor,
          border: `1px solid ${borderColor}`,
          padding: 'clamp(20px, 3.5vw, 32px)',
          borderRadius: '2px',
          marginBottom: '32px',
          boxShadow: '0 4px 18px rgba(42, 21, 27, 0.03)',
        }}
      >
        <form onSubmit={handleSubmit}>
          {hasSubmitted && (
            <div
              style={{
                backgroundColor: 'rgba(101, 31, 50, 0.08)',
                color: accentColor,
                padding: '10px 14px',
                borderRadius: '2px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
              }}
            >
              <Check size={16} />
              <span>Thank you! Your wish has been added to the guestbook below.</span>
            </div>
          )}

          {error && (
            <div
              style={{
                color: '#DC2626',
                fontSize: '0.8125rem',
                marginBottom: '12px',
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            <div>
              <label
                htmlFor="wish-name"
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  marginBottom: '4px',
                  color: textColor,
                }}
              >
                Your Name *
              </label>
              <input
                id="wish-name"
                type="text"
                placeholder="e.g. Maya & Kevin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '2px',
                  fontSize: '0.875rem',
                  color: textColor,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="wish-relationship"
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  marginBottom: '4px',
                  color: textColor,
                }}
              >
                Relationship / Affiliation
              </label>
              <input
                id="wish-relationship"
                type="text"
                placeholder="e.g. High School Friend / Family"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '2px',
                  fontSize: '0.875rem',
                  color: textColor,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="wish-message"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 600,
                marginBottom: '4px',
                color: textColor,
              }}
            >
              Your Message & Warm Prayers *
            </label>
            <textarea
              id="wish-message"
              rows={3}
              placeholder="Write your wishes here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#FFFFFF',
                border: `1px solid ${borderColor}`,
                borderRadius: '2px',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                color: textColor,
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" size="sm" icon={<Send size={14} />} type="submit">
              Send Wedding Wish
            </Button>
          </div>
        </form>
      </div>

      {/* Wishes Feed */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxHeight: '440px',
          overflowY: 'auto',
          paddingRight: '6px',
        }}
      >
        {wishes.map((w) => (
          <div
            key={w.id}
            style={{
              padding: '18px 20px',
              backgroundColor: surfaceColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '2px',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '6px',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.15rem',
                    fontWeight: 500,
                    color: textColor,
                  }}
                >
                  {w.name}
                </span>
                {w.relationship && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: accentColor,
                      marginLeft: '8px',
                      opacity: 0.85,
                    }}
                  >
                    • {w.relationship}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  color: textColor,
                  opacity: 0.5,
                  letterSpacing: '0.04em',
                }}
              >
                {w.timestamp}
              </span>
            </div>

            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: textColor,
                opacity: 0.9,
                fontStyle: 'italic',
              }}
            >
              "{w.message}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
