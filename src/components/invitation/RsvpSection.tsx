import React, { useState } from 'react';
import { Button } from '../common/Button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface RsvpFormProps {
  accentColor?: string;
  textColor?: string;
  borderColor?: string;
  surfaceColor?: string;
  onRsvpSuccess?: (guestName: string, attendance: 'attending' | 'regret') => void;
}

export const RsvpSection: React.FC<RsvpFormProps> = ({
  accentColor = 'var(--color-burgundy)',
  textColor = 'var(--color-espresso)',
  borderColor = 'rgba(101, 31, 50, 0.15)',
  surfaceColor = 'rgba(255, 252, 247, 0.8)',
  onRsvpSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [attendance, setAttendance] = useState<'attending' | 'regret'>('attending');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    }
    if (!emailOrPhone.trim()) {
      errs.emailOrPhone = 'Please provide an email or phone number for confirmation.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitted(true);
    if (onRsvpSuccess) {
      onRsvpSuccess(fullName, attendance);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFullName('');
    setEmailOrPhone('');
    setGuestCount(1);
    setDietaryRequirements('');
    setErrors({});
  };

  return (
    <div
      style={{
        backgroundColor: surfaceColor,
        border: `1px solid ${borderColor}`,
        padding: 'clamp(24px, 4vw, 40px)',
        margin: '40px 0',
        borderRadius: '2px',
        boxShadow: '0 8px 30px rgba(42, 21, 27, 0.04)',
      }}
    >
      {isSubmitted ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(101, 31, 50, 0.08)',
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <CheckCircle2 size={32} />
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.75rem',
              color: textColor,
              marginBottom: '8px',
            }}
          >
            {attendance === 'attending' ? 'Warmly Received' : 'Thank You for Letting Us Know'}
          </h3>
          <p
            style={{
              fontSize: '0.92rem',
              color: textColor,
              opacity: 0.85,
              maxWidth: '460px',
              margin: '0 auto 20px',
              lineHeight: 1.6,
            }}
          >
            {attendance === 'attending'
              ? `Thank you, ${fullName}! Your RSVP for ${guestCount} guest(s) has been recorded in this local preview session.`
              : `We will miss you, ${fullName}. Thank you for sending your blessings and letting us know.`}
          </p>

          <span
            style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              padding: '4px 10px',
              backgroundColor: 'rgba(199, 166, 106, 0.2)',
              color: 'var(--color-gold-dark)',
              borderRadius: '2px',
              marginBottom: '24px',
            }}
          >
            Local Demo State (No external database connection)
          </span>

          <div>
            <Button variant="outline" size="sm" onClick={resetForm}>
              Edit / Submit Another Response
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
              Response Requested
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2rem',
                color: textColor,
                fontWeight: 400,
              }}
            >
              Will You Honor Us with Your Presence?
            </h3>
            <p style={{ fontSize: '0.85rem', color: textColor, opacity: 0.7, marginTop: '4px' }}>
              Kindly reply by November 10, 2026
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Attendance Choice */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  marginBottom: '8px',
                  color: textColor,
                }}
              >
                Attendance Confirmation *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setAttendance('attending')}
                  style={{
                    padding: '12px',
                    border:
                      attendance === 'attending'
                        ? `1.5px solid ${accentColor}`
                        : `1px solid ${borderColor}`,
                    backgroundColor:
                      attendance === 'attending' ? 'rgba(101, 31, 50, 0.08)' : 'transparent',
                    color: textColor,
                    fontWeight: attendance === 'attending' ? 600 : 400,
                    fontSize: '0.875rem',
                    borderRadius: '2px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Joyfully Attend
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance('regret')}
                  style={{
                    padding: '12px',
                    border:
                      attendance === 'regret'
                        ? `1.5px solid ${accentColor}`
                        : `1px solid ${borderColor}`,
                    backgroundColor:
                      attendance === 'regret' ? 'rgba(101, 31, 50, 0.08)' : 'transparent',
                    color: textColor,
                    fontWeight: attendance === 'regret' ? 600 : 400,
                    fontSize: '0.875rem',
                    borderRadius: '2px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Regretfully Decline
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="rsvp-name"
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  marginBottom: '6px',
                  color: textColor,
                }}
              >
                Full Name *
              </label>
              <input
                id="rsvp-name"
                type="text"
                placeholder="e.g. Raden Dananjaya"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: '#FFFFFF',
                  border: errors.fullName ? '1px solid #DC2626' : `1px solid ${borderColor}`,
                  borderRadius: '2px',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  color: textColor,
                  outline: 'none',
                }}
              />
              {errors.fullName && (
                <span
                  style={{
                    color: '#DC2626',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '4px',
                  }}
                >
                  <AlertCircle size={12} /> {errors.fullName}
                </span>
              )}
            </div>

            {/* Email or Phone */}
            <div>
              <label
                htmlFor="rsvp-contact"
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  marginBottom: '6px',
                  color: textColor,
                }}
              >
                Email or WhatsApp Number *
              </label>
              <input
                id="rsvp-contact"
                type="text"
                placeholder="Email or WhatsApp number"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: '#FFFFFF',
                  border: errors.emailOrPhone ? '1px solid #DC2626' : `1px solid ${borderColor}`,
                  borderRadius: '2px',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  color: textColor,
                  outline: 'none',
                }}
              />
              {errors.emailOrPhone && (
                <span
                  style={{
                    color: '#DC2626',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '4px',
                  }}
                >
                  <AlertCircle size={12} /> {errors.emailOrPhone}
                </span>
              )}
            </div>

            {/* Number of Guests (Only if attending) */}
            {attendance === 'attending' && (
              <div>
                <label
                  htmlFor="rsvp-guests"
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    marginBottom: '6px',
                    color: textColor,
                  }}
                >
                  Number of Reserved Guests
                </label>
                <select
                  id="rsvp-guests"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px 36px 12px 14px',
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '2px',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    color: textColor,
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                  }}
                >
                  <option value={1}>1 Guest (Just me)</option>
                  <option value={2}>2 Guests (+ Partner)</option>
                </select>
              </div>
            )}

            {/* Dietary or Special Notes */}
            <div>
              <label
                htmlFor="rsvp-notes"
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  marginBottom: '6px',
                  color: textColor,
                }}
              >
                Dietary Preferences or Notes (Optional)
              </label>
              <input
                id="rsvp-notes"
                type="text"
                placeholder="e.g. Vegetarian, Nut Allergy, or wheelchair accessibility"
                value={dietaryRequirements}
                onChange={(e) => setDietaryRequirements(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '2px',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  color: textColor,
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginTop: '12px' }}>
              <Button variant="primary" size="lg" isFullWidth type="submit">
                Confirm RSVP
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
