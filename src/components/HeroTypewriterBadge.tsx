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

  // Highlight "COMMAND YOUR SECURITY" in dark navy/indigo and the rotating descriptor in vivid violet
  const renderHighlightedText = (text: string) => {
    const prefix = 'COMMAND YOUR SECURITY';
    if (text.startsWith(prefix)) {
      const rest = text.slice(prefix.length);
      return (
        <>
          <span style={{ color: '#010859', fontWeight: 900, letterSpacing: '0.04em' }}>{prefix}</span>
          <span style={{ color: '#7c3aed', fontWeight: 700, letterSpacing: '0.03em' }}>{rest}</span>
        </>
      );
    }
    return <span style={{ color: '#010859', fontWeight: 900 }}>{text}</span>;
  };

  return (
    <div
      className="hero-typewriter-caption"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        background: 'transparent',
        border: 'none',
        borderRadius: 0,
        padding: '0.25rem 0',
        fontSize: 'clamp(0.78rem, 2vw, 0.92rem)',
        fontWeight: 700,
        marginBottom: '1.25rem',
        textTransform: 'uppercase',
        minHeight: '2rem',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
      title="PosturePilot: Command Your Security"
    >
      {/* Opening Bracket '[' */}
      <span
        style={{
          color: '#4f46e5',
          fontWeight: 900,
          fontSize: '1.3em',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        [
      </span>

      {/* Live Glowing Radar Pulse Indicator */}
      <span
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 8,
          height: 8,
          flexShrink: 0,
          margin: '0 2px',
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
            width: 7,
            height: 7,
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
        {/* Blinking Terminal Cursor */}
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1.15em',
            background: '#4f46e5',
            marginLeft: '3px',
            verticalAlign: 'middle',
            animation: 'blink 0.85s step-start infinite',
          }}
        />
      </span>

      {/* Closing Bracket ']' */}
      <span
        style={{
          color: '#4f46e5',
          fontWeight: 900,
          fontSize: '1.3em',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        ]
      </span>

      {/* Keyframes */}
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
