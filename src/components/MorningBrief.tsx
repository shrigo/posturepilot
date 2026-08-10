'use client';
import { useState, useEffect } from 'react';

interface BriefData {
  exposedAssets: number;
  kevCount: number;
  cloudPostureDelta: number;
  patchSlaStatus: 'EXCEEDS' | 'MEETS' | 'BREACHED';
  actions: string[];
}

interface MorningBriefProps {
  isGroupUnderAttack?: boolean;
  avgCompliance?: number;
  totalCriticals?: number;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

// 8 sun rays rendered as thin JSX divs
function SunIcon({ isAttack }: { isAttack: boolean }) {
  if (isAttack) {
    return (
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: '#fee2e2', border: '1.5px solid #fecaca',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.05rem', flexShrink: 0,
      }}>🚨</div>
    );
  }

  const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
      {/* Spinning wrapper — all rays rotate together continuously */}
      <div style={{
        position: 'absolute', inset: 0,
        animation: 'mbRaysRotate 8s linear infinite',
      }}>
        {RAY_ANGLES.map((deg, i) => (
          <div
            key={deg}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 2,
              height: 8,
              marginLeft: -1,
              marginTop: -4,
              background: 'rgba(251,191,36,0.75)',
              borderRadius: 2,
              /* transform only positions the ray — never touched by any animation */
              transform: `rotate(${deg}deg) translateY(-21px)`,
              /* Flash only changes opacity — no transform conflict */
              animation: `mbRayFlash 1.4s ease-in-out ${(i * 175)}ms infinite`,
            }}
          />
        ))}
      </div>
      {/* Sun circle — stays centered, no animation */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 28, height: 28, borderRadius: '50%',
        background: 'linear-gradient(135deg, #fef9c3, #fde68a)',
        border: '1.5px solid #fbbf24',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.88rem',
        zIndex: 2,
        boxShadow: '0 2px 8px rgba(251,191,36,0.3)',
      }}>
        ☀️
      </div>
    </div>
  );
}

export default function MorningBrief({
  isGroupUnderAttack = false,
  avgCompliance = 84,
}: MorningBriefProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [ready, setReady] = useState(false);

  const brief: BriefData = isGroupUnderAttack
    ? {
        exposedAssets: 148,
        kevCount: 7,
        cloudPostureDelta: -12,
        patchSlaStatus: 'BREACHED',
        actions: [
          'Activate SOAR playbook — isolate Wells Fargo & CISCO tenant segments immediately.',
          'Escalate all 7 KEV exploits to Tier-1 IR team for emergency patch deployment.',
          'Engage cloud security team to remediate 148 exposed assets before market open.',
        ],
      }
    : {
        exposedAssets: 3,
        kevCount: 1,
        cloudPostureDelta: 4,
        patchSlaStatus:
          avgCompliance >= 85 ? 'EXCEEDS' : avgCompliance >= 75 ? 'MEETS' : 'BREACHED',
        actions: [
          'Review and prioritize the 1 KEV entry — assign to patch lead before EOD.',
          'Investigate 3 newly exposed assets flagged overnight; verify classification & ownership.',
          'Brief VP of Engineering on cloud posture +4% gain; update board slide deck.',
        ],
      };

  useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, [isGroupUnderAttack]);

  const isAttack = isGroupUnderAttack;

  const slaColor =
    brief.patchSlaStatus === 'EXCEEDS'
      ? { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', dot: '#22c55e' }
      : brief.patchSlaStatus === 'MEETS'
      ? { bg: '#fffbeb', border: '#fde68a', text: '#b45309', dot: '#f59e0b' }
      : { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', dot: '#ef4444' };
  const slaLabel =
    brief.patchSlaStatus === 'EXCEEDS' ? 'Exceeds Target'
    : brief.patchSlaStatus === 'MEETS' ? 'Meets Target'
    : 'Breached Target';

  const accentBorder = isAttack ? '#fecaca' : '#ddd6fe';
  const accentText   = isAttack ? '#be123c' : '#7c3aed';

  // 4 distinct mild tile backgrounds
  const tileColors = isAttack
    ? [
        { bg: '#fff1f2', border: '#fecdd3', label: '#9f1239' }, // rose
        { bg: '#fff7ed', border: '#fed7aa', label: '#9a3412' }, // orange
        { bg: '#fff1f2', border: '#fecdd3', label: '#9f1239' }, // rose again (attack)
        { bg: '#fef2f2', border: '#fecaca', label: '#b91c1c' }, // red
      ]
    : [
        { bg: '#fef2f2', border: '#fecdd3', label: '#be123c' }, // soft rose — Exposed Assets
        { bg: '#fffbeb', border: '#fde68a', label: '#92400e' }, // soft amber  — KEV
        { bg: '#f0fdf4', border: '#bbf7d0', label: '#166534' }, // soft green  — Cloud Posture
        { bg: '#eff6ff', border: '#bfdbfe', label: '#1e40af' }, // soft blue   — Patch SLA
      ];

  return (
    <>
      <style>{`
        @keyframes mbFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mbRaysRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes mbRayFlash {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 1; }
        }
        .mb-wrap { margin-bottom: 1rem; animation: mbFadeUp 0.35s ease both; }
        .mb-card {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid;
          box-shadow: 0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
        }
        .mb-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.4rem;
        }
        .mb-metric-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border-top: 1px solid rgba(0,0,0,0.06);
        }
        @media (max-width: 900px) {
          .mb-metric-grid { grid-template-columns: repeat(2, 1fr); }
          .mb-metric-tile:nth-child(2) { border-right: none; }
        }
        @media (max-width: 480px) {
          .mb-metric-grid { grid-template-columns: 1fr; }
          .mb-metric-tile { border-right: none !important; }
        }
        .mb-metric-tile {
          padding: 1.1rem 1.25rem;
          border-right: 1px solid rgba(0,0,0,0.06);
          animation: mbFadeUp 0.3s ease both;
          transition: filter 0.15s;
        }
        .mb-metric-tile:last-child { border-right: none; }
        .mb-metric-tile:hover { filter: brightness(0.97); }
        .mb-actions-section {
          padding: 0.9rem 1.4rem 1.25rem;
          border-top: 1px solid rgba(0,0,0,0.06);
          animation: mbFadeUp 0.35s ease both;
        }
        .mb-action-row {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          padding: 0.6rem 0.75rem;
          border-radius: 10px;
          transition: background 0.15s;
          animation: mbFadeUp 0.3s ease both;
          margin-bottom: 0.4rem;
          cursor: default;
        }
        .mb-action-row:last-child { margin-bottom: 0; }
        .mb-action-row:hover { background: rgba(0,0,0,0.025); }
        .mb-collapse-btn {
          background: none;
          border: 1px solid rgba(0,0,0,0.1);
          cursor: pointer;
          font-size: 0.7rem;
          font-weight: 700;
          color: #94a3b8;
          padding: 0.3rem 0.75rem;
          border-radius: 20px;
          transition: all 0.15s;
          font-family: inherit;
          white-space: nowrap;
        }
        .mb-collapse-btn:hover {
          background: rgba(0,0,0,0.04);
          color: #64748b;
          border-color: rgba(0,0,0,0.18);
        }
      `}</style>

      <div className="mb-wrap">
        <div className="mb-card" style={{ borderColor: accentBorder }}>

          {/* ── Header ── */}
          <div
            className="mb-header"
            style={{
              background: isAttack
                ? 'linear-gradient(135deg, #fff1f2 0%, #fff 70%)'
                : 'linear-gradient(135deg, #f5f3ff 0%, #fff 70%)',
              borderBottom: isExpanded ? '1px solid rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
              <SunIcon isAttack={isAttack} />
              <div>
                <div style={{
                  fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: accentText, marginBottom: 2,
                }}>
                  {isAttack ? '⚠ Incident Brief — Live Crisis Mode' : 'CISO Morning Brief'}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                  {getGreeting()}{' '}
                  <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.82rem' }}>
                    · {getDate()}
                  </span>
                </div>
              </div>
            </div>
            <button className="mb-collapse-btn" onClick={() => setIsExpanded(p => !p)}>
              {isExpanded ? '▲ Collapse' : '▼ Expand Brief'}
            </button>
          </div>

          {/* ── 4-Tile Metric Grid ── */}
          {isExpanded && ready && (
            <>
              <div className="mb-metric-grid">

                {/* Tile 1 — Exposed Assets (soft rose) */}
                <div
                  className="mb-metric-tile"
                  style={{ background: tileColors[0].bg, animationDelay: '0ms' }}
                >
                  <div style={{
                    fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.07em', color: tileColors[0].label,
                    opacity: 0.7, marginBottom: '0.5rem',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block', flexShrink: 0 }} />
                    Exposed Assets
                  </div>
                  <div style={{
                    fontSize: '2.1rem', fontWeight: 900,
                    color: isAttack ? '#dc2626' : '#be123c',
                    lineHeight: 1, marginBottom: '0.3rem',
                  }}>
                    {brief.exposedAssets}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                    {isAttack ? 'Compromised across tenants' : 'Became exposed overnight'}
                  </div>
                </div>

                {/* Tile 2 — KEV (soft amber) */}
                <div
                  className="mb-metric-tile"
                  style={{ background: tileColors[1].bg, animationDelay: '60ms' }}
                >
                  <div style={{
                    fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.07em', color: tileColors[1].label,
                    opacity: 0.7, marginBottom: '0.5rem',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', flexShrink: 0 }} />
                    KEV Detected
                  </div>
                  <div style={{
                    fontSize: '2.1rem', fontWeight: 900,
                    color: brief.kevCount > 3 ? '#b45309' : '#92400e',
                    lineHeight: 1, marginBottom: '0.3rem',
                  }}>
                    {brief.kevCount}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                    {brief.kevCount === 1 ? 'CISA-flagged — patch required' : 'CISA-flagged — escalate now'}
                  </div>
                </div>

                {/* Tile 3 — Cloud Posture (soft green) */}
                <div
                  className="mb-metric-tile"
                  style={{ background: tileColors[2].bg, animationDelay: '120ms' }}
                >
                  <div style={{
                    fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.07em', color: tileColors[2].label,
                    opacity: 0.7, marginBottom: '0.5rem',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }} />
                    Cloud Posture
                  </div>
                  <div style={{
                    fontSize: '2.1rem', fontWeight: 900,
                    color: brief.cloudPostureDelta >= 0 ? '#166534' : '#dc2626',
                    lineHeight: 1, marginBottom: '0.3rem',
                  }}>
                    {brief.cloudPostureDelta >= 0 ? `+${brief.cloudPostureDelta}%` : `${brief.cloudPostureDelta}%`}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                    {brief.cloudPostureDelta >= 0 ? 'Improved — CSPM signal strong' : 'Degraded — check misconfigs'}
                  </div>
                </div>

                {/* Tile 4 — Patch SLA (soft blue) */}
                <div
                  className="mb-metric-tile"
                  style={{ background: tileColors[3].bg, animationDelay: '180ms' }}
                >
                  <div style={{
                    fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.07em', color: tileColors[3].label,
                    opacity: 0.7, marginBottom: '0.5rem',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: slaColor.dot, display: 'inline-block', flexShrink: 0 }} />
                    Patch SLA
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: slaColor.bg,
                    border: `1px solid ${slaColor.border}`,
                    borderRadius: 8, padding: '0.3rem 0.65rem',
                    marginBottom: '0.3rem',
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: slaColor.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: slaColor.text }}>
                      {slaLabel}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                    Based on current compliance
                  </div>
                </div>
              </div>

              {/* ── Recommended Actions ── */}
              <div className="mb-actions-section">
                <div style={{
                  fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '0.09em', color: '#94a3b8', marginBottom: '0.7rem',
                }}>
                  Recommended Actions
                </div>
                {brief.actions.map((action, idx) => (
                  <div
                    key={idx}
                    className="mb-action-row"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <span style={{
                      flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                      background: isAttack ? '#fee2e2' : '#ede9fe',
                      border: `1.5px solid ${isAttack ? '#fecaca' : '#ddd6fe'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', fontWeight: 900, color: accentText,
                      marginTop: 1,
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{
                      fontSize: '0.82rem', color: '#334155',
                      fontWeight: 500, lineHeight: 1.5,
                    }}>
                      {action}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
