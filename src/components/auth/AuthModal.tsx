import React, { useState } from 'react';
import { useAuth } from '../../lib/authContext';
import { Button } from '../common/Button';
import { Wordmark } from '../common/Wordmark';
import { Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const { signIn, signUp, isConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) {
          setErrorMsg('Please enter your full name.');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('Account created! Please check your email inbox to verify your account.');
          setTimeout(() => {
            onClose();
          }, 3000);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(30, 14, 19, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: '440px',
          width: '100%',
          backgroundColor: '#FFFCF7',
          border: '1px solid rgba(199, 166, 106, 0.4)',
          boxShadow: '0 20px 48px rgba(42, 21, 27, 0.2)',
          padding: 'clamp(28px, 5vw, 40px)',
          borderRadius: '2px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Wordmark size="sm" />
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.75rem',
              color: 'var(--color-espresso)',
              marginTop: '12px',
              marginBottom: '4px',
            }}
          >
            {mode === 'signup' ? 'Create Atelier Account' : 'Welcome to TajukKisah'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-charcoal-muted)' }}>
            {mode === 'signup'
              ? 'Join to save, customize, and publish your wedding invitation.'
              : 'Sign in to access and edit your wedding invitations.'}
          </p>
        </div>

        {!isConfigured && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--color-ivory)',
              border: '1px solid rgba(199, 166, 106, 0.4)',
              borderRadius: '2px',
              fontSize: '0.8rem',
              color: 'var(--color-charcoal-muted)',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={14} color="var(--color-burgundy)" style={{ display: 'inline', marginRight: '6px' }} />
            Supabase is operating with environment credentials. Ensure your database migration is run in Supabase SQL editor.
          </div>
        )}

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              border: '1px solid #DC2626',
              borderRadius: '2px',
              color: '#DC2626',
              fontSize: '0.8125rem',
              marginBottom: '16px',
            }}
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(74, 91, 69, 0.1)',
              border: '1px solid #4A5B45',
              borderRadius: '2px',
              color: '#4A5B45',
              fontSize: '0.8125rem',
              marginBottom: '16px',
            }}
          >
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Raden Aditya"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: '2px',
                    fontSize: '0.875rem',
                  }}
                />
                <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', opacity: 0.5 }} />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: '2px',
                  fontSize: '0.875rem',
                }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', opacity: 0.5 }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: '2px',
                  fontSize: '0.875rem',
                }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', opacity: 0.5 }} />
            </div>
          </div>

          <div style={{ marginTop: '8px' }}>
            <Button
              variant="primary"
              size="md"
              isFullWidth
              type="submit"
              disabled={loading}
              icon={<ArrowRight size={14} />}
            >
              {loading
                ? 'Processing...'
                : mode === 'signup'
                ? 'Create Account'
                : 'Sign In'}
            </Button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle)' }}>
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : 'signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-burgundy)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {mode === 'signup'
              ? 'Already have an account? Sign In'
              : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};
