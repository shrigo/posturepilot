'use client';

import React, { useState, useEffect } from 'react';

const TYPEWRITER_PHRASES = [
  'COMMAND YOUR SECURITY · NEXT-GEN AI-ASPM',
  'COMMAND YOUR SECURITY · AUTONOMOUS SOAR & MCP',
  'COMMAND YOUR SECURITY · UNIFIED 12-COCKPIT POSTURE',
];

const PREFIX = 'COMMAND YOUR SECURITY';

export default function HeroTypewriterBadge() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isEmptyPaused, setIsEmptyPaused] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];

    // Paused when fully typed so user can read
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2400);
      return () => clearTimeout(pauseTimer);
    }

    // Paused when fully deleted to [ 🟢 | ] so closed state is visible
    if (isEmptyPaused) {
      const emptyTimer = setTimeout(() => {
        setIsEmptyPaused(false);
        setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
      }, 650);
      return () => clearTimeout(emptyTimer);
    }

    if (!isDeleting) {
      if (displayedText.length < currentPhrase.length) {
        const typeTimer = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
        }, 45);
        return () => clearTimeout(typeTimer);
      } else {
        setIsPaused(true);
      }
    } else {
      if (displayedText.length > 0) {
        const deleteTimer = setTimeout(() => {
          setDisplayedText(currentPhrase.slice(0, displayedText.length - 1));
        }, 20);
        return () => clearTimeout(deleteTimer);
      } else {
        setIsDeleting(false);
        setIsEmptyPaused(true);
      }
    }
  }, [displayedText, isDeleting, isPaused, isEmptyPaused, phraseIndex]);

  // Highlights COMMAND YOUR SECURITY in deep navy/indigo and descriptor in vibrant violet
  // Uses consistent letter spacing to eliminate horizontal text snapping/jumping
  const renderHighlightedText = (text: string) => {
    if (!text) return null;
    if (text.length <= PREFIX.length) {
      return (
        <span style={{ color: '#010859', fontWeight: 900 }}>
          {text}
        </span>
      );
    }
    const prefixPart = text.slice(0, PREFIX.length);
    const suffixPart = text.slice(PREFIX.length);
    return (
      <>
        <span style={{ color: '#010859', fontWeight: 900 }}>{prefixPart}</span>
        <span style={{ color: '#7c3aed', fontWeight: 700 }}>{suffixPart}</span>
      </>
    );
  };

  return (
    <div
      className="hero-typewriter-caption"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: '32px',
        minHeight: '32px',
        maxHeight: '32px',
        lineHeight: '32px',
        background: 'transparent',
        border: 'none',
        borderRadius: 0,
        padding: 0,
        fontSize: 'clamp(0.80rem, 1.8vw, 0.92rem)',
        fontWeight: 800,
        marginBottom: '1.25rem',
        textTransform: 'uppercase',
        letterSpacing: '0.035em',
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        userSelect: 'none',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
      title="PosturePilot: Command Your Security"
    >
      {/* Opening Bracket '[' */}
      <span
        style={{
          color: '#4f46e5',
          fontWeight: 900,
          fontSize: '1.25em',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        [
      </span>

      {/* Live Glowing Green Flashing Dot */}
      <span
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 8,
          height: 8,
          flexShrink: 0,
          margin: '0 5px 0 6px',
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
          display: 'inline-flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        {renderHighlightedText(displayedText)}
        
        {/* Blinking Terminal Cursor */}
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '13px',
            background: '#4f46e5',
            marginLeft: displayedText.length > 0 ? '3px' : '1px',
            marginRight: '3px',
            alignSelf: 'center',
            animation: 'blink 0.85s step-start infinite',
          }}
        />
      </span>

      {/* Closing Bracket ']' */}
      <span
        style={{
          color: '#4f46e5',
          fontWeight: 900,
          fontSize: '1.25em',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          flexShrink: 0,
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
