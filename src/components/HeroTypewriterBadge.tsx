'use client';

import React, { useState, useEffect } from 'react';

const TYPEWRITER_PHRASES = [
  'COMMAND YOUR SECURITY · NEXT-GEN AI-ASPM',
  'COMMAND YOUR SECURITY · AUTONOMOUS SOAR & MCP',
  'COMMAND YOUR SECURITY · UNIFIED 12-COCKPIT POSTURE',
];

export default function HeroTypewriterBadge() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2200);
      return () => clearTimeout(pauseTimer);
    }

    if (!isDeleting) {
      if (displayedText.length < currentPhrase.length) {
        const typeTimer = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
        }, 55);
        return () => clearTimeout(typeTimer);
      } else {
        setIsPaused(true);
      }
    } else {
      if (displayedText.length > 0) {
        const deleteTimer = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length - 1));
        }, 28);
        return () => clearTimeout(deleteTimer);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
      }
    }
  }, [displayedText, isDeleting, isPaused, phraseIndex]);

  // Highlight "COMMAND YOUR SECURITY" in dark navy/indigo and the remainder in vivid violet
  const renderHighlightedText = (text: string) => {
    const prefix = 'COMMAND YOUR SECURITY';
    if (text.startsWith(prefix)) {
      const rest = text.slice(prefix.length);
      return (
        <>
          <span style={{ color: '#010859', fontWeight: 800 }}>{prefix}</span>
          <span style={{ color: '#6d28d9', fontWeight: 700 }}>{rest}</span>
        </>
      );
    }
    return <span style={{ color: '#010859', fontWeight: 800 }}>{text}</span>;
  };

  return (
    <div
      className="hero-badge hero-typewriter-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        background: 'linear-gradient(135deg, rgba(245, 243, 255, 0.95), rgba(238, 242, 255, 0.9))',
        border: '1px solid rgba(196, 181, 253, 0.75)',
        borderRadius: 24,
        padding: '0.42rem 1.15rem',
        fontSize: 'clamp(0.72rem, 1.8vw, 0.84rem)',
        fontWeight: 700,
        color: '#4f46e5',
        marginBottom: '1.5rem',
        marginLeft: '-10px',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        boxShadow: '0 2px 14px rgba(99, 102, 241, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        minHeight: '2.4rem',
        maxWidth: '100%',
        boxSizing: 'border-box',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      title="PosturePilot Command Your Security Engine"
    >
      {/* Live Glowing Pulse Indicator */}
      <span
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 10,
          height: 10,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: '#22c55e',
            opacity: 0.75,
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
          }}
        />
        <span
          style={{
            position: 'relative',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#16a34a',
            boxShadow: '0 0 8px #22c55e',
          }}
        />
      </span>

      {/* Typewriter Text Stream */}
      <span
        style={{
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          display: 'inline-flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {renderHighlightedText(displayedText)}
        {/* Blinking Cursor */}
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1.1em',
            background: '#4f46e5',
            marginLeft: '3px',
            verticalAlign: 'middle',
            animation: 'blink 0.85s step-start infinite',
          }}
        />
      </span>

      {/* Subtle CSS Keyframes */}
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
