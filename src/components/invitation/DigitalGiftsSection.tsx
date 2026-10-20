import React, { useState } from 'react';
import { DIGITAL_GIFTS_DATA, BankAccount, PhysicalGiftAddress } from '../../data/invitationData';
import { Button } from '../common/Button';
import { Copy, Check, CreditCard, Home } from 'lucide-react';

interface DigitalGiftsProps {
  giftsData?: {
    description?: string;
    accounts?: BankAccount[];
    physicalGift?: PhysicalGiftAddress;
  };
  accentColor?: string;
  textColor?: string;
  borderColor?: string;
  surfaceColor?: string;
}

export const DigitalGiftsSection: React.FC<DigitalGiftsProps> = ({
  giftsData,
  accentColor = 'var(--color-burgundy)',
  textColor = 'var(--color-espresso)',
  borderColor = 'rgba(101, 31, 50, 0.15)',
  surfaceColor = 'rgba(255, 252, 247, 0.8)',
}) => {
  const activeGifts = {
    description: giftsData?.description || DIGITAL_GIFTS_DATA.description,
    accounts: giftsData?.accounts && giftsData.accounts.length > 0 ? giftsData.accounts : DIGITAL_GIFTS_DATA.accounts,
    physicalGift: giftsData?.physicalGift || DIGITAL_GIFTS_DATA.physicalGift,
  };
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const copyAddress = () => {
    const text = `${activeGifts.physicalGift.recipient}\n${activeGifts.physicalGift.address}\nPhone: ${activeGifts.physicalGift.phone}`;
    navigator.clipboard?.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <div style={{ margin: '48px 0' }}>
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
          Token of Love
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            color: textColor,
            fontWeight: 400,
          }}
        >
          Wedding Gift & Blessings
        </h3>
        <p
          style={{
            fontSize: '0.85rem',
            color: textColor,
            opacity: 0.8,
            maxWidth: '540px',
            margin: '8px auto 0',
            lineHeight: 1.6,
          }}
        >
          {activeGifts.description}
        </p>
      </div>

      {/* Bank Transfer Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {activeGifts.accounts.map((acc, index) => {
          const isCopied = copiedAccount === acc.accountNumber;
          return (
            <div
              key={index}
              style={{
                backgroundColor: surfaceColor,
                border: `1px solid ${borderColor}`,
                padding: '24px',
                borderRadius: '2px',
                position: 'relative',
                boxShadow: '0 4px 16px rgba(42, 21, 27, 0.03)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: accentColor,
                  marginBottom: '12px',
                }}
              >
                <CreditCard size={18} />
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {acc.bankName}
                </span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    display: 'block',
                    color: textColor,
                  }}
                >
                  {acc.accountNumber}
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: textColor,
                    opacity: 0.75,
                  }}
                >
                  a.n {acc.accountHolder}
                </span>
              </div>

              <Button
                variant={isCopied ? 'gold' : 'secondary'}
                size="sm"
                isFullWidth
                icon={isCopied ? <Check size={14} /> : <Copy size={14} />}
                onClick={() => copyToClipboard(acc.accountNumber, acc.accountNumber)}
              >
                {isCopied ? 'Account Copied' : 'Copy Account Number'}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Physical Gift / Parcel Destination */}
      <div
        style={{
          backgroundColor: surfaceColor,
          border: `1px solid ${borderColor}`,
          padding: '24px',
          borderRadius: '2px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: accentColor }}>
          <Home size={18} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Physical Gift Destination
          </span>
        </div>
        <div>
          <strong style={{ display: 'block', fontSize: '0.9rem', color: textColor, marginBottom: '2px' }}>
            {activeGifts.physicalGift.recipient}
          </strong>
          <p style={{ fontSize: '0.85rem', color: textColor, opacity: 0.8, lineHeight: 1.5 }}>
            {activeGifts.physicalGift.address}
          </p>
          <span style={{ fontSize: '0.8rem', color: textColor, opacity: 0.7, marginTop: '4px', display: 'block' }}>
            Phone: {activeGifts.physicalGift.phone}
          </span>
        </div>
        <div style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
          <Button
            variant="outline"
            size="sm"
            icon={copiedAddress ? <Check size={14} /> : <Copy size={14} />}
            onClick={copyAddress}
          >
            {copiedAddress ? 'Address Copied' : 'Copy Mailing Address'}
          </Button>
        </div>
      </div>
    </div>
  );
};
