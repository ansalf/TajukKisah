import React, { useState, useRef, useEffect } from 'react';
import { Music, VolumeX, AlertCircle } from 'lucide-react';
import { WEDDING_AUDIO_URL } from '../../data/invitationData';

interface AudioPlayerProps {
  accentColor?: string;
  audioUrl?: string;
  autoPlayTrigger?: boolean;
  songTitle?: string;
}

export const InvitationAudioPlayer: React.FC<AudioPlayerProps> = ({
  accentColor = 'var(--color-burgundy)',
  audioUrl = WEDDING_AUDIO_URL,
  autoPlayTrigger = false,
  songTitle = 'Wedding Melody',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [hasUserToggled, setHasUserToggled] = useState(false);
  const wasPlayingBeforeHiddenRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and update audio element
  useEffect(() => {
    const targetUrl = audioUrl && audioUrl.trim() ? audioUrl.trim() : WEDDING_AUDIO_URL;
    const audio = new Audio(targetUrl);
    audio.loop = true;
    audio.preload = 'auto';

    const handleError = () => {
      console.warn('TajukKisah: Audio source failed to load or unsupported:', targetUrl);
      setAudioError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('error', handleError);
    audioRef.current = audio;

    // Auto-pause when user switches tab or leaves the web browser (visibilitychange & pagehide)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (audioRef.current && !audioRef.current.paused) {
          wasPlayingBeforeHiddenRef.current = true;
          audioRef.current.pause();
          setIsPlaying(false);
        }
      } else {
        // When user comes back to the tab, resume if it was playing before
        if (wasPlayingBeforeHiddenRef.current && audioRef.current && !audioError) {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              wasPlayingBeforeHiddenRef.current = false;
            })
            .catch((err) => {
              console.info('Playback resume on visibility change intercepted:', err);
            });
        }
      }
    };

    const handlePageHide = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      audio.removeEventListener('error', handleError);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl, audioError]);

  // Handle triggered playback when user clicks "Open Invitation"
  useEffect(() => {
    if (!autoPlayTrigger || hasUserToggled || isPlaying || !audioRef.current || audioError) return;

    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setAudioError(false);
      })
      .catch((err) => {
        // Expected on some mobile browsers if gesture policy rejects; fail silently
        console.info('Autoplay deferred until manual tap:', err);
      });
  }, [autoPlayTrigger, hasUserToggled, isPlaying, audioError]);

  const togglePlayback = () => {
    setHasUserToggled(true);
    if (!audioRef.current || audioError) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setAudioError(false);
        })
        .catch((err) => {
          console.warn('Audio playback prevented or unsupported:', err);
          setAudioError(true);
          setIsPlaying(false);
        });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {/* Visual playing pill badge */}
      {isPlaying && (
        <div
          style={{
            backgroundColor: 'rgba(255, 252, 247, 0.95)',
            border: `1px solid ${accentColor}`,
            borderRadius: '20px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.6875rem',
            color: accentColor,
            fontWeight: 600,
            letterSpacing: '0.04em',
            boxShadow: '0 4px 14px rgba(42, 21, 27, 0.08)',
            animation: 'invitationReveal 0.4s ease forwards',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: accentColor,
              display: 'inline-block',
              animation: 'spinSlow 2s ease-in-out infinite alternate',
            }}
          />
          <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {songTitle}
          </span>
        </div>
      )}

      <button
        onClick={togglePlayback}
        title={audioError ? 'Audio soundtrack unavailable' : isPlaying ? 'Pause Music' : 'Play Wedding Soundtrack'}
        aria-label={isPlaying ? 'Pause wedding soundtrack' : 'Play wedding soundtrack'}
        className="touch-target"
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: isPlaying ? accentColor : 'rgba(255, 252, 247, 0.96)',
          color: isPlaying ? '#FFFFFF' : accentColor,
          border: `1.5px solid ${accentColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isPlaying
            ? '0 8px 24px rgba(101, 31, 50, 0.28)'
            : '0 8px 24px rgba(42, 21, 27, 0.16)',
          cursor: audioError ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
        }}
      >
        {audioError ? (
          <AlertCircle size={18} />
        ) : isPlaying ? (
          <Music size={18} className="spinning-music-icon" />
        ) : (
          <VolumeX size={18} />
        )}
      </button>

      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinning-music-icon {
          animation: spinSlow 5s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .spinning-music-icon {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

