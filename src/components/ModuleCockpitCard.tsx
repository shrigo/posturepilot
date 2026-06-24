'use client';
import React, { useState, useEffect } from 'react';
import { useClient } from '@/context/ClientContext';

// ── Module Configuration Type ─────────────────────────────────────────────────
export interface ModuleCockpitConfig {
  title: string;
  badge: string;
  apiEndpoint: string;
  // Ring labels and colors
  rings: [
    { label: string; color: string; glowColor: string },   // inner
    { label: string; color: string; glowColor: string },   // middle
    { label: string; color: string; glowColor: string },   // outer
  ];
  // Center index label
  indexLabel: string;
  // 4-box funnel
  funnel: [
    { label: string; sublabel: string; color: string },
    { label: string; sublabel: string; color: string },
    { label: string; sublabel: string; color: string },
    { label: string; sublabel: string; color: string },
  ];
  // 3 clearance gates
  gates: [string, string, string];
  // Threat sync node label
  syncLabel: string;
  // 2 enterprise checklist items
  checklist: [
    { name: string; desc: string },
    { name: string; desc: string },
  ];
}

// ── Per-module data shape coming from /api/findings/* ────────────────────────
export interface ModuleLiveData {
  hasLiveData?: boolean;
  total?: number;
  critical?: number;
  high?: number;
  slaCompliance?: number;
  riskScore?: number;
  remediationRate?: number;
  slaBreached?: number;
  bySeverity?: Record<string, number>;
  byTool?: Record<string, number>;
  [key: string]: unknown;
}

// ── Per-client mock baselines (used when no scan uploaded) ───────────────────
const clientBaselines: Record<string, { score: number; f1: number; f2: number; f3: number; f4: number }> = {
  CISCO:  { score: 96, f1: 2840, f2: 312, f3: 18,  f4: 2680 },
  UR:     { score: 91, f1: 1420, f2: 184, f3: 9,   f4: 1340 },
  TOYOTA: { score: 85, f1: 3680, f2: 480, f3: 42,  f4: 3280 },
  DISNEY: { score: 81, f1: 4240, f2: 620, f3: 68,  f4: 3640 },
  WELLS:  { score: 76, f1: 5840, f2: 880, f3: 112, f4: 4820 },
};

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

interface ModuleCockpitCardProps {
  config: ModuleCockpitConfig;
  live?: ModuleLiveData | null;
  /** Override the computed ring score (0-100) */
  overrideScore?: number;
}

export default function ModuleCockpitCard({ config, live, overrideScore }: ModuleCockpitCardProps) {
  const { currentClient, isEnterpriseMode, isUnderAttack } = useClient();

  // ── Animation state ────────────────────────────────────────────────────────
  const [animTime, setAnimTime] = useState(0);

  const hasLive = !!live && (live.hasLiveData === true || (live.total ?? 0) > 0);

  // ── Score computation ──────────────────────────────────────────────────────
  const base = clientBaselines[currentClient.key] ?? clientBaselines.WELLS;
  let score: number;
  if (isUnderAttack)             score = 38;
  else if (overrideScore != null) score = overrideScore;
  else if (hasLive) {
    const apiRiskScore = live!.riskScore != null
      ? (live!.riskScore as number)
      : (live!.complianceScore != null
          ? (100 - (live!.complianceScore as number))
          : Math.min(70, Math.round((((live!.critical ?? 0) * 4 + (live!.high ?? 0) * 2) / Math.max(1, live!.total ?? 1)) * 25)));
    score = Math.max(30, Math.min(100, 100 - apiRiskScore));
  }
  else                           score = base.score;

  const innerPct  = Math.min(100, score);
  const middlePct = Math.min(100, Math.round(score * 0.95));
  const outerPct  = Math.min(100, Math.round(score * 0.88));

  // ── Ring geometry ──────────────────────────────────────────────────────────
  const rOuter = 72, rMiddle = 56, rInner = 40;
  const circOuter  = 2 * Math.PI * rOuter;
  const circMiddle = 2 * Math.PI * rMiddle;
  const circInner  = 2 * Math.PI * rInner;

  // ── Animation: requestAnimationFrame counting up smoothly over 1.8 seconds ──
  useEffect(() => {
    setAnimTime(0);
    let start: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      setAnimTime(elapsed);
      animationFrameId = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentClient.key, score]);

  const progressVal = Math.min(animTime / 1800, 1);
  const easedProgress = 1 - Math.pow(1 - progressVal, 4); // easeOutQuart

  const currentInnerPct = Math.round(innerPct * easedProgress);
  const currentMiddlePct = Math.round(middlePct * easedProgress);
  const currentOuterPct = Math.round(outerPct * easedProgress);
  const displayScore = Math.round(score * easedProgress);

  const currentInnerPctFloat = innerPct * easedProgress;
  const currentMiddlePctFloat = middlePct * easedProgress;
  const currentOuterPctFloat = outerPct * easedProgress;

  // Sync orbiting dots to follow the ring tips perfectly during creation
  // and continue orbiting infinitely afterwards.
  const getDotCoords = (center: number, radius: number, targetPct: number, time: number, orbitDuration: number) => {
    const duration = 1800;
    let angle = -90;
    if (time < duration) {
      const progress = Math.min(time / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      angle = -90 + (targetPct * eased * 3.6);
    } else {
      const extraTime = time - duration;
      angle = -90 + (targetPct * 3.6) + (extraTime / orbitDuration) * 360;
    }
    const rad = (angle * Math.PI) / 180;
    return {
      cx: center + radius * Math.cos(rad),
      cy: center + radius * Math.sin(rad)
    };
  };

  const outerDot = getDotCoords(100, 72, outerPct, animTime, 8000);
  const middleDot = getDotCoords(100, 56, middlePct, animTime, 6000);
  const innerDot = getDotCoords(100, 40, innerPct, animTime, 4000);

  const dashOuter  = (currentOuterPctFloat / 100) * circOuter;
  const dashMiddle = (currentMiddlePctFloat / 100) * circMiddle;
  const dashInner  = (currentInnerPctFloat / 100) * circInner;

  // ── Funnel values ──────────────────────────────────────────────────────────
  const attackMult = isUnderAttack ? 3.2 : 1.0;
  let f1: string, f2: string, f3: string, f4: string;

  if (hasLive) {
    const total    = (live!.total ?? 0) * attackMult;
    const critical = (live!.critical ?? 0) * attackMult;
    const high     = (live!.high ?? 0) * attackMult;
    const cleared  = isUnderAttack
      ? Math.round(total * 0.1)
      : Math.round(total * ((live!.slaCompliance ?? 80) / 100));

    f1 = fmtNum(Math.round(total));
    f2 = fmtNum(Math.round(critical + high));
    f3 = fmtNum(Math.round(critical));
    f4 = fmtNum(cleared);
  } else {
    f1 = fmtNum(Math.round(base.f1 * attackMult));
    f2 = fmtNum(Math.round(base.f2 * attackMult));
    f3 = fmtNum(Math.round(base.f3 * attackMult));
    f4 = isUnderAttack ? fmtNum(Math.round(base.f4 * 0.2)) : fmtNum(base.f4);
  }

  // ── Gate states ────────────────────────────────────────────────────────────
  // Gate 1: fails when under attack OR critical > 15
  const g1Fail = isUnderAttack || (hasLive && (live!.critical ?? 0) > 15);
  // Gate 2: fails when SLA compliance < 80%
  const g2Fail = isUnderAttack || (hasLive && (live!.slaCompliance ?? 100) < 80);
  // Gate 3: fails when risk score > 70
  const g3Fail = isUnderAttack || (hasLive && (live!.riskScore ?? 0) > 70);

  const gateColor  = (f: boolean) => f ? '#ef4444' : '#10b981';
  const gateFill   = (f: boolean) => f ? 'rgba(239,68,68,0.08)'  : 'rgba(16,185,129,0.08)';
  const gateStroke = (f: boolean) => f ? 'rgba(239,68,68,0.45)'  : 'rgba(16,185,129,0.35)';

  const toolCount = hasLive ? Object.keys(live!.byTool ?? {}).length : 5;

  const [ri, rm, ro] = config.rings;

  return (
    <div
      className="cockpit-pipeline-card card animate-in"
      style={{
        padding: '1.5rem',
        marginBottom: '1.25rem',
        border: '1.5px solid #7c3aed',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(124,58,237,0.08)',
      }}
    >
      <style>{`
        .mcockpit-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          align-items: stretch;
        }
        .mcockpit-funnel-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          display: flex; flex-direction: column; gap: 0.15rem;
          transition: all 0.2s ease;
        }
        .mcockpit-funnel-box:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .mcockpit-gate-lbl {
          font-family: monospace; font-size: 0.7rem; font-weight: 800;
          letter-spacing: 0.06em; color: #64748b; margin-bottom: 0.5rem;
          text-transform: uppercase;
        }
        .mcockpit-checklist-box {
          background: linear-gradient(135deg,#ecfdf5 0%,#ffffff 100%);
          border: 1px solid #a7f3d0; border-radius: 10px;
          padding: 0.75rem 1rem; display: flex; align-items: flex-start; gap: 0.75rem;
          box-shadow: 0 4px 10px -2px rgba(16,185,129,0.06);
          margin-bottom: 0.65rem; transition: all 0.2s ease;
        }
        .mcockpit-checklist-box:hover { transform: translateY(-1px); box-shadow: 0 6px 12px -2px rgba(16,185,129,0.1); }
        .mcockpit-live-badge {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.58rem; font-weight: 800; padding: 2px 7px;
          border-radius: 10px; letter-spacing: 0.04em; text-transform: uppercase;
        }
        @media(max-width:980px) { .mcockpit-grid { grid-template-columns: 1fr; } }
        @keyframes mcScanline {
          0%  { transform: translateY(0px);   opacity: 0.6; }
          50% { transform: translateY(213px); opacity: 0.3; }
          100%{ transform: translateY(0px);   opacity: 0.6; }
        }
        @keyframes mcPulseRed  { 0%,100%{ opacity:0.4; } 50%{ opacity:1; } }
        @keyframes mcPulseGlow { 0%,100%{ opacity:0.3; transform:scale(1);   } 50%{ opacity:0.9; transform:scale(1.6); } }
        @keyframes mcRotate    { from{ transform:rotate(0deg); } to{ transform:rotate(360deg); } }
        @keyframes mcDash {
          to {
            stroke-dashoffset: -40;
          }
        }
        @keyframes mcGrowBar {
          from { width: 0; }
        }
        @keyframes mcRadarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes mcRotateClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes mcRotateCounterClockwise {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #f1f5f9', paddingBottom:'0.75rem', marginBottom:'1rem' }}>
        <div>
          <span style={{ fontSize:'0.62rem', fontWeight:800, color:'#7c3aed', background:'rgba(124,58,237,0.08)', padding:'2px 8px', borderRadius:'12px', letterSpacing:'0.05em', textTransform:'uppercase' }}>
            {config.badge}
          </span>
          <h3 style={{ margin:'0.25rem 0 0 0', fontSize:'1.15rem', fontWeight:900, color:'#0f172a' }}>
            {config.title}
          </h3>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          {hasLive ? (
            <span className="mcockpit-live-badge" style={{ background:'#dcfce7', color:'#15803d' }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'#10b981', display:'inline-block' }} />
              LIVE · {(live!.total ?? 0).toLocaleString()} findings
            </span>
          ) : (
            <span className="mcockpit-live-badge" style={{ background:'#f1f5f9', color:'#64748b' }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'#94a3b8', display:'inline-block' }} />
              DEMO DATA
            </span>
          )}
          <span className="hud-pulse" style={{ background: isUnderAttack ? '#ef4444' : '#10b981', width:8, height:8 }} />
          <span style={{ fontSize:'0.74rem', fontWeight:800, color: isUnderAttack ? '#ef4444' : '#10b981' }}>
            {isUnderAttack ? '🔴 BREACH ACTIVE' : 'NOMINAL'}
          </span>
        </div>
      </div>

      <div className="mcockpit-grid">

        {/* ── Left: SVG Rings + Gates ── */}
        <div style={{ background:'#090d16', borderRadius:'14px', border:'1px solid #1e293b', position:'relative', overflow:'hidden', minHeight:'275px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'inset 0 0 30px rgba(0,0,0,0.85)' }}>

          {config.indexLabel === 'ALTITUDE' && (
            <svg viewBox="0 -2 260 215" preserveAspectRatio="xMidYMid meet"
              style={{ width:'100%', height:'100%', position:'absolute', top:0, left:0, overflow:'visible', zIndex:1 }}>
              <defs>
                <radialGradient id="cloudHub" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* AWS → Hub */}
              <line x1="46" y1="59" x2="114" y2="108" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="4 3"
                style={{ animation: "mcDash 3s linear infinite" }} />
              {/* Azure → Hub */}
              <line x1="130" y1="80" x2="130" y2="108" stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="4 3"
                style={{ animation: "mcDash 4s linear infinite" }} />
              {/* GCP → Hub */}
              <line x1="214" y1="59" x2="146" y2="108" stroke="#10b981" strokeWidth="1.2" strokeDasharray="4 3"
                style={{ animation: "mcDash 3.5s linear infinite" }} />
              {/* Hub → Exposed bucket */}
              <line x1="110" y1="122" x2="68" y2="150" stroke="#ef4444" strokeWidth="1.4" strokeDasharray="3 3"
                style={{ animation: "mcDash 2s linear infinite" }} />

              <rect x="6" y="15" width="80" height="44" rx="6" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
              <text x="46" y="35" textAnchor="middle" dominantBaseline="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="900">AWS</text>
              <text x="46" y="49" textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">850K resources</text>

              <rect x="8" y="64" width="38" height="14" rx="3" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.35)" strokeWidth="0.7" />
              <circle cx="15" cy="71" r="2.5" fill="#ef4444" style={{ animation: "mcPulseRed 1.5s infinite" }} />
              <text x="20" y="74" fill="#ef4444" fontSize="5" fontFamily="monospace" fontWeight="700">3 DRIFT</text>

              <rect x="90" y="15" width="80" height="44" rx="6" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.4)" strokeWidth="1" />
              <text x="130" y="35" textAnchor="middle" dominantBaseline="middle" fill="#60a5fa" fontSize="9" fontFamily="monospace" fontWeight="900">AZURE</text>
              <text x="130" y="49" textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">142K resources</text>

              <rect x="118" y="64" width="24" height="14" rx="3" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.35)" strokeWidth="0.7" />
              <text x="130" y="74" textAnchor="middle" fill="#10b981" fontSize="5" fontFamily="monospace" fontWeight="700">OK</text>

              <rect x="174" y="15" width="80" height="44" rx="6" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
              <text x="214" y="35" textAnchor="middle" dominantBaseline="middle" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="900">GCP</text>
              <text x="214" y="49" textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">204K resources</text>

              <rect x="220" y="64" width="32" height="14" rx="3" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.35)" strokeWidth="0.7" />
              <circle cx="226" cy="71" r="2.5" fill="#10b981" />
              <text x="232" y="74" fill="#10b981" fontSize="5" fontFamily="monospace" fontWeight="700">IAM OK</text>

              <circle cx="130" cy="115" r="26" fill="url(#cloudHub)" />
              <circle cx="130" cy="115" r="18" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.8"
                style={{ filter: "drop-shadow(0 0 6px rgba(59,130,246,0.5))" }} />
              <text x="130" y="112" textAnchor="middle" dominantBaseline="middle" fill="#3b82f6" fontSize="7" fontFamily="monospace" fontWeight="900">PP</text>
              <text x="130" y="123" textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize="5" fontFamily="monospace">HUB</text>

              <rect x="10" y="150" width="114" height="28" rx="5" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.5)" strokeWidth="1" />
              <circle cx="24" cy="164" r="4" fill="#ef4444" style={{ animation: "mcPulseRed 1s infinite" }} />
              <text x="32" y="160" fill="#ef4444" fontSize="6.5" fontFamily="monospace" fontWeight="700">S3_LOGS</text>
              <text x="32" y="170" fill="#f87171" fontSize="5.5" fontFamily="monospace">PUBLIC EXPOSED</text>

              <rect x="136" y="150" width="114" height="28" rx="5" fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
              <circle cx="150" cy="164" r="4" fill="#10b981" />
              <text x="158" y="160" fill="#10b981" fontSize="6.5" fontFamily="monospace" fontWeight="700">IAM KEY</text>
              <text x="158" y="170" fill="#6ee7b7" fontSize="5.5" fontFamily="monospace">AUTO-QUARANTINED</text>

              <line x1="10" y1="186" x2="250" y2="186" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
              <circle cx="22" cy="193" r="3" fill="#3b82f6" />
              <text x="29" y="196" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">1.19M total assets</text>
              <circle cx="140" cy="193" r="3" fill="#ef4444" />
              <text x="147" y="196" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">810 keys revoked</text>
            </svg>
          )}

          {config.indexLabel === 'RUNWAY' && (
            <svg viewBox="0 -12 260 200" preserveAspectRatio="xMidYMid meet"
              style={{ width:'100%', height:'100%', position:'absolute', top:0, left:0, overflow:'visible', zIndex:1 }}>
              <defs>
                <linearGradient id="netFlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.6"/>
                </linearGradient>
              </defs>
              <text x="130" y="14" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">EDGE FIREWALL GATEWAY</text>
              <rect x="10" y="28" width="50" height="22" rx="4" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.4)" strokeWidth="1"/>
              <text x="35" y="39" textAnchor="middle" fill="#60a5fa" fontSize="6" fontFamily="monospace" fontWeight="900">INTERNET</text>
              <text x="35" y="46" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">142.6M pkts</text>
              <line x1="60" y1="39" x2="88" y2="39" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 3" style={{ animation: "mcDash 2s linear infinite" }}/>
              <polygon points="88,36 94,39 88,42" fill="#3b82f6"/>
              <rect x="94" y="22" width="72" height="34" rx="6" fill="rgba(30,41,59,0.9)" stroke="#3b82f6" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 5px rgba(59,130,246,0.3))" }}/>
              <text x="130" y="36" textAnchor="middle" fill="#3b82f6" fontSize="7" fontFamily="monospace" fontWeight="900">FIREWALL</text>
              <text x="130" y="46" textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="monospace">IDS/IPS Active</text>
              <line x1="166" y1="39" x2="194" y2="39" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" style={{ animation: "mcDash 3s linear infinite" }}/>
              <polygon points="194,36 200,39 194,42" fill="#10b981"/>
              <rect x="200" y="28" width="52" height="22" rx="4" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.4)" strokeWidth="1"/>
              <text x="226" y="39" textAnchor="middle" fill="#10b981" fontSize="6" fontFamily="monospace" fontWeight="900">INTERNAL</text>
              <text x="226" y="46" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">Clean traffic</text>
              <line x1="130" y1="56" x2="130" y2="76" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" style={{ animation: "mcDash 1.5s linear infinite" }}/>
              <rect x="80" y="76" width="100" height="22" rx="5" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.5)" strokeWidth="1"/>
              <circle cx="94" cy="87" r="4" fill="#ef4444" style={{ animation: "mcPulseRed 1s infinite" }}/>
              <text x="102" y="91" fill="#ef4444" fontSize="6.5" fontFamily="monospace" fontWeight="700">IDS TRIGGERED</text>
              <text x="130" y="116" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace" fontWeight="800">BLOCKED SOURCE IPs</text>
              {["103.21.4.x", "45.155.x.x", "91.234.x.x", "185.x.x.x"].map((ip, i) => (
                <g key={i} transform={`translate(${18 + i * 60}, 122)`}>
                  <rect x="0" y="0" width="52" height="16" rx="3" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.25)" strokeWidth="0.8"/>
                  <text x="26" y="11" textAnchor="middle" fill="#f87171" fontSize="5" fontFamily="monospace">{ip}</text>
                </g>
              ))}
              <line x1="18" y1="152" x2="242" y2="152" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
              <circle cx="30" cy="162" r="3.5" fill="#10b981"/>
              <text x="38" y="166" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">VPN: 48 tunnels active</text>
              <circle cx="148" cy="162" r="3.5" fill="#f59e0b"/>
              <text x="156" y="166" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">4,210 IPs geo-blocked</text>
            </svg>
          )}

          {config.indexLabel === 'APPSEC' && (
            <svg viewBox="0 -3 260 200" preserveAspectRatio="xMidYMid meet"
              style={{ width:'100%', height:'100%', position:'absolute', top:0, left:0, overflow:'visible', zIndex:1 }}>
              <text x="130" y="14" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">CI/CD SECURITY PIPELINE</text>
              {[
                { x: 40, label: "GIT", sub: "Commit", color: "#ffffff" },
                { x: 100, label: "SAST", sub: "Static", color: "#a78bfa" },
                { x: 160, label: "SCA", sub: "Deps", color: "#f59e0b" },
                { x: 220, label: "DAST", sub: "Dynamic", color: "#3b82f6" },
              ].map((s, i) => (
                <g key={i}>
                  <circle cx={s.x} cy="50" r="16" fill="#0f172a" stroke={s.color} strokeWidth="1.8" style={{ filter: `drop-shadow(0 0 4px ${s.color}66)` }}/>
                  <text x={s.x} y="48" textAnchor="middle" fill={s.color} fontSize="6" fontFamily="monospace" fontWeight="900">{s.label}</text>
                  <text x={s.x} y="57" textAnchor="middle" fill="#64748b" fontSize="5" fontFamily="monospace">{s.sub}</text>
                </g>
              ))}
              {[
                { x: 56, color: "#a78bfa" },
                { x: 116, color: "#f59e0b" },
                { x: 176, color: "#3b82f6" }
              ].map((arrow, i) => (
                <line key={i} x1={arrow.x} y1="50" x2={arrow.x + 28} y2="50" stroke={arrow.color} strokeWidth="1.5" strokeDasharray="4 3" style={{ animation: "mcDash 3s linear infinite" }}/>
              ))}
              <text x="130" y="90" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace" fontWeight="800">FINDINGS BY STAGE</text>
              {[
                { label: "120.4K imports", pct: 100, color: "#ffffff", y: 98 },
                { label: "18.2K SAST alerts", pct: 72, color: "#a78bfa", y: 114 },
                { label: "4.22K OWASP flaws", pct: 34, color: "#f59e0b", y: 130 },
                { label: "128 builds BLOCKED", pct: 8, color: "#ef4444", y: 146 },
              ].map((b, i) => (
                <g key={i}>
                  <text x="18" y={b.y + 9} fill="#94a3b8" fontSize="5.5" fontFamily="monospace">{b.label}</text>
                  <rect x="80" y={b.y} width="140" height="10" rx="2" fill="rgba(255,255,255,0.04)"/>
                  <rect x="80" y={b.y} width={b.pct * 1.4} height="10" rx="2" fill={b.color} style={{ width: b.pct * 1.4, animation: "mcGrowBar 1.5s ease-out forwards" }}/>
                  <text x={80 + b.pct * 1.4 + 3} y={b.y + 8} fill={b.color} fontSize="5" fontFamily="monospace">{b.pct}%</text>
                </g>
              ))}
              <rect x="18" y="162" width="224" height="24" rx="5" fill="rgba(239,68,68,0.07)" stroke="rgba(239,68,68,0.4)" strokeWidth="1"/>
              <circle cx="32" cy="174" r="4" fill="#ef4444" style={{ animation: "mcPulseRed 1.2s infinite" }}/>
              <text x="41" y="172" fill="#ef4444" fontSize="6.5" fontFamily="monospace" fontWeight="700">PIPELINE BLOCKED</text>
              <text x="41" y="180" fill="#f87171" fontSize="5.5" fontFamily="monospace">CVE-2024-3094 — weaponised XZ lib detected in build #4821</text>
            </svg>
          )}

          {config.indexLabel === 'AI RISK' && (
            <svg viewBox="0 -3 260 205" preserveAspectRatio="xMidYMid meet"
              style={{ width:'100%', height:'100%', position:'absolute', top:0, left:0, overflow:'visible', zIndex:1 }}>
              <defs>
                <radialGradient id="aiHub" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="firewallGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
              <text x="130" y="12" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">AI GOVERNANCE & PROMPT FIREWALL</text>
              {[
                { label: "GPT-4o", org: "OpenAI", color: "#10b981", y: 28 },
                { label: "Claude 3", org: "Anthropic", color: "#a78bfa", y: 66 },
                { label: "Gemini", org: "Google", color: "#3b82f6", y: 104 },
              ].map((m, i) => (
                <g key={i}>
                  <rect x="8" y={m.y} width="80" height="30" rx="5"
                    fill={`rgba(${m.color === "#10b981" ? "16,185,129" : m.color === "#a78bfa" ? "167,139,250" : "59,130,246"},0.07)`}
                    stroke={m.color} strokeWidth="0.8" strokeOpacity="0.5" />
                  <text x="48" y={m.y + 13} textAnchor="middle" dominantBaseline="middle" fill={m.color} fontSize="7" fontFamily="monospace" fontWeight="900">{m.label}</text>
                  <text x="48" y={m.y + 24} textAnchor="middle" fill="#64748b" fontSize="5" fontFamily="monospace">{m.org}</text>
                  <line x1="88" y1={m.y + 15} x2="110" y2="81" stroke={m.color} strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.6" style={{ animation: "mcDash 3s linear infinite" }} />
                </g>
              ))}
              <circle cx="130" cy="81" r="28" fill="url(#aiHub)" />
              <circle cx="130" cy="81" r="20" fill="#0f172a" stroke="url(#firewallGrad)" strokeWidth="2" style={{ filter: "drop-shadow(0 0 8px rgba(124,58,237,0.6))" }} />
              <text x="130" y="76" textAnchor="middle" dominantBaseline="middle" fill="#a78bfa" fontSize="6" fontFamily="monospace" fontWeight="900">AI</text>
              <text x="130" y="86" textAnchor="middle" dominantBaseline="middle" fill="#7c3aed" fontSize="5" fontFamily="monospace" fontWeight="800">FIREWALL</text>
              <text x="212" y="22" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace" fontWeight="800">INTERCEPT LOG</text>
              {[
                { threat: "PII LEAK", prompt: "\"Send SSN to...\"", color: "#ef4444", y: 28, blocked: true },
                { threat: "JAILBREAK", prompt: "\"Ignore prev...\"", color: "#f59e0b", y: 57, blocked: true },
                { threat: "SHADOW IT", prompt: "\"Upload to...\"", color: "#f59e0b", y: 87, blocked: true },
                { threat: "CLEAN", prompt: "\"Summarise Q3...\"", color: "#10b981", y: 116, blocked: false },
              ].map((r, i) => (
                <g key={i}>
                  <rect x="172" y={r.y} width="80" height="18" rx="3" fill={r.blocked ? `rgba(${r.color === "#ef4444" ? "239,68,68" : "245,158,11"},0.07)` : "rgba(16,185,129,0.07)"} stroke={r.color} strokeWidth="0.7" strokeOpacity="0.4" />
                  <circle cx="180" cy={r.y + 9} r="3" fill={r.color} style={r.blocked && r.color === "#ef4444" ? { animation: "mcPulseRed 1.2s infinite" } : {}} />
                  <text x="186" y={r.y + 7} fill={r.color} fontSize="5" fontFamily="monospace" fontWeight="800">{r.threat}</text>
                  <text x="186" y={r.y + 14} fill="#64748b" fontSize="4.5" fontFamily="monospace">{r.prompt}</text>
                  {r.blocked && (
                    <text x="248" y={r.y + 11} textAnchor="end" fill={r.color} fontSize="5" fontFamily="monospace" fontWeight="900">⛔</text>
                  )}
                </g>
              ))}
              {[28, 57, 87, 116].map((y, i) => (
                <line key={`hub-line-${i}`} x1="150" y1="81" x2="172" y2={y + 9} stroke="rgba(124,58,237,0.3)" strokeWidth="0.8" strokeDasharray="3 2" style={{ animation: "mcDash 2s linear infinite" }} />
              ))}
              <text x="130" y="146" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace" fontWeight="800">AI RISK SCORE</text>
              <rect x="18" y="152" width="224" height="10" rx="3" fill="rgba(255,255,255,0.04)" />
              <rect x="18" y="152" width="80" height="10" rx="3" fill="#10b981" style={{ width: 80, animation: "mcGrowBar 2s ease-out forwards" }} />
              <rect x="98" y="152" width="70" height="10" fill="#f59e0b" style={{ width: 70, animation: "mcGrowBar 2.2s ease-out forwards" }} />
              <rect x="168" y="152" width="74" height="10" rx="3" fill="#ef4444" style={{ width: 74, animation: "mcGrowBar 2.4s ease-out forwards" }} />
              <line x1="157" y1="150" x2="157" y2="164" stroke="#ffffff" strokeWidth="1.2" />
              <text x="157" y="170" textAnchor="middle" fill="#ffffff" fontSize="6" fontFamily="monospace" fontWeight="900">62</text>
              <text x="157" y="177" textAnchor="middle" fill="#f59e0b" fontSize="5" fontFamily="monospace">ELEVATED</text>
              <line x1="18" y1="174" x2="242" y2="174" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
              {[
                { color: "#ef4444", label: "12.4K prompts blocked", x: 18 },
                { color: "#a78bfa", label: "6 shadow AI tools", x: 140 },
              ].map((s, i) => (
                <g key={i}>
                  <circle cx={s.x + 4} cy="184" r="3" fill={s.color} />
                  <text x={s.x + 11} y="187" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">{s.label}</text>
                </g>
              ))}
            </svg>
          )}

          {config.indexLabel === 'RADAR' && (
            <svg viewBox="0 9 260 195" preserveAspectRatio="xMidYMid meet"
              style={{ width:'100%', height:'100%', position:'absolute', top:0, left:0, overflow:'visible', zIndex:1 }}>
              <circle cx="90" cy="100" r="72" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="1"/>
              <circle cx="90" cy="100" r="52" fill="none" stroke="rgba(139,92,246,0.08)" strokeWidth="1"/>
              <circle cx="90" cy="100" r="32" fill="none" stroke="rgba(139,92,246,0.06)" strokeWidth="1"/>
              <circle cx="90" cy="100" r="14" fill="none" stroke="rgba(139,92,246,0.12)" strokeWidth="1"/>
              <line x1="18" y1="100" x2="162" y2="100" stroke="rgba(139,92,246,0.08)" strokeWidth="0.5"/>
              <line x1="90" y1="28" x2="90" y2="172" stroke="rgba(139,92,246,0.08)" strokeWidth="0.5"/>
              <g style={{ transformOrigin: "90px 100px", animation: "mcRadarSweep 4s linear infinite" }}>
                <path d="M90 100 L90 28 A72 72 0 0 1 162 100 Z" fill="rgba(139,92,246,0.22)" />
                <line x1="90" y1="100" x2="90" y2="28" stroke="#a78bfa" strokeWidth="0.75" style={{ filter: "drop-shadow(0 0 3px #a78bfa)" }} />
              </g>
              <circle cx="128" cy="62" r="9.5" fill="#ef4444" style={{ animation: "mcPulseRed 1.2s infinite" }}/>
              <text x="128" y="64.5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="monospace" fontWeight="800">.94</text>
              <circle cx="54" cy="72" r="8.5" fill="#f59e0b" style={{ animation: "mcPulseRed 1.8s infinite" }}/>
              <text x="54" y="74.5" textAnchor="middle" fill="#0f172a" fontSize="5.8" fontFamily="monospace" fontWeight="800">.61</text>
              <circle cx="140" cy="120" r="3" fill="#f59e0b"/>
              <circle cx="68" cy="135" r="2.5" fill="#10b981"/>
              <circle cx="110" cy="148" r="2.5" fill="#10b981"/>
              <circle cx="90" cy="100" r="5" fill="#8b5cf6" style={{ filter: "drop-shadow(0 0 4px rgba(139,92,246,0.8))" }}/>
              <text x="212" y="32" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace" fontWeight="800">CVE TRIAGE</text>
              {[
                { label: "3.84M total CVEs", dot: "#475569", y: 46 },
                { label: "180K asset hits", dot: "#3b82f6", y: 62 },
                { label: "8,510 exploitable", dot: "#f59e0b", y: 78 },
                { label: "420 actionable", dot: "#ef4444", y: 94 },
              ].map((r, i) => (
                <g key={i}>
                  <circle cx="178" cy={r.y - 2} r="3.5" fill={r.dot}/>
                  <text x="186" y={r.y + 1} fill="#cbd5e1" fontSize="6" fontFamily="monospace">{r.label}</text>
                </g>
              ))}
              <rect x="174" y="108" width="76" height="18" rx="4" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.4)" strokeWidth="0.8"/>
              <text x="212" y="120" textAnchor="middle" fill="#ef4444" fontSize="5.5" fontFamily="monospace" fontWeight="800">CISA KEV MATCH</text>
              <rect x="174" y="132" width="76" height="18" rx="4" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.35)" strokeWidth="0.8"/>
              <text x="212" y="144" textAnchor="middle" fill="#f59e0b" fontSize="5.5" fontFamily="monospace" fontWeight="800">EPSS &gt; 0.60</text>
              <line x1="18" y1="180" x2="242" y2="180" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
              <circle cx="28" cy="190" r="3" fill="#ef4444"/>
              <text x="35" y="193" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">Noise suppressed: 95%</text>
              <circle cx="148" cy="190" r="3" fill="#10b981"/>
              <text x="155" y="193" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">420 targets queued</text>
            </svg>
          )}

          {config.indexLabel === 'IDENTITY' && (
            <svg viewBox="0 0 260 200" preserveAspectRatio="xMidYMid meet"
              style={{ width:'100%', height:'100%', position:'absolute', top:0, left:0, overflow:'visible', zIndex:1 }}>
              <text x="130" y="14" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">SSO IDENTITY DIRECTORY</text>
              <circle cx="130" cy="85" r="20" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(59,130,246,0.4))" }}/>
              <text x="130" y="82" textAnchor="middle" fill="#60a5fa" fontSize="6.5" fontFamily="monospace" fontWeight="900">OKTA</text>
              <text x="130" y="92" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">15.4K IDs</text>
              {[
                { x: 20, y: 30, label: "admin@corp", mfa: true, role: "SUPER ADMIN", drift: false },
                { x: 20, y: 95, label: "svc-deploy", mfa: false, role: "ORPHAN ACCT", drift: true },
                { x: 174, y: 30, label: "john@corp", mfa: true, role: "ENGINEER", drift: false },
                { x: 174, y: 95, label: "old-api-key", mfa: false, role: "PRIV DRIFT", drift: true },
              ].map((u, i) => {
                const color = u.drift ? "#ef4444" : "#10b981";
                const borderColor = u.drift ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.3)";
                return (
                  <g key={i}>
                    <rect x={u.x} y={u.y} width="66" height="38" rx="5" fill={u.drift ? "rgba(239,68,68,0.06)" : "rgba(16,185,129,0.05)"} stroke={borderColor} strokeWidth="0.8"/>
                    <circle cx={u.x + 10} cy={u.y + 12} r="4" fill={color} style={u.drift ? { animation: "mcPulseRed 1.4s infinite" } : {}}/>
                    <text x={u.x + 18} y={u.y + 15} fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">{u.label}</text>
                    <text x={u.x + 6} y={u.y + 28} fill={color} fontSize="5" fontFamily="monospace" fontWeight="700">{u.role}</text>
                    <text x={u.x + 6} y={u.y + 35} fill={u.mfa ? "#10b981" : "#ef4444"} fontSize="4.5" fontFamily="monospace">{u.mfa ? "MFA ✓" : "MFA MISSING"}</text>
                  </g>
                );
              })}
              <line x1="86" y1="49" x2="114" y2="72" stroke="#64748b" strokeWidth="1.2" strokeDasharray="2 2" style={{ animation: "mcDash 4s linear infinite reverse" }}/>
              <line x1="86" y1="114" x2="112" y2="92" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 2" style={{ animation: "mcDash 3s linear infinite" }}/>
              <line x1="174" y1="49" x2="146" y2="72" stroke="#64748b" strokeWidth="1.2" strokeDasharray="2 2" style={{ animation: "mcDash 4s linear infinite reverse" }}/>
              <line x1="174" y1="114" x2="148" y2="92" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 2" style={{ animation: "mcDash 3s linear infinite" }}/>
              <rect x="60" y="146" width="140" height="20" rx="5" fill="rgba(239,68,68,0.07)" stroke="rgba(239,68,68,0.4)" strokeWidth="1"/>
              <circle cx="74" cy="156" r="3.5" fill="#ef4444" style={{ animation: "mcPulseRed 1s infinite" }}/>
              <text x="82" y="159" fill="#ef4444" fontSize="6.5" fontFamily="monospace" fontWeight="700">640 MFA POLICY GAPS</text>
              <line x1="18" y1="172" x2="242" y2="172" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
              <circle cx="28" cy="183" r="3" fill="#3b82f6"/>
              <text x="35" y="186" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">1.82K privilege drifts</text>
              <circle cx="148" cy="183" r="3" fill="#10b981"/>
              <text x="155" y="186" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">48 orphans disabled</text>
            </svg>
          )}

          {config.indexLabel === 'COMPLY' && (
            <svg viewBox="0 0 260 200" preserveAspectRatio="xMidYMid meet"
              style={{ width:'100%', height:'100%', position:'absolute', top:0, left:0, overflow:'visible', zIndex:1 }}>
              <text x="130" y="14" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">CONTINUOUS AUDIT READINESS</text>
              {[
                { cx: 38, label: "SOC2", val: 99, color: "#10b981", r: 24 },
                { cx: 100, label: "ISO27K", val: 100, color: "#10b981", r: 24 },
                { cx: 162, label: "PCI-DSS", val: 92, color: "#3b82f6", r: 24 },
                { cx: 224, label: "HIPAA", val: 88, color: "#a78bfa", r: 24 },
              ].map((g, i) => {
                const circ = 2 * Math.PI * g.r;
                return (
                  <g key={i}>
                    <circle cx={g.cx} cy="62" r={g.r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4.5"/>
                    <circle cx={g.cx} cy="62" r={g.r} fill="none" stroke={g.color} strokeWidth="4.5"
                      strokeDasharray={circ} strokeDashoffset={circ - (circ * g.val / 100)} strokeLinecap="round"
                      style={{ transform: "rotate(-90deg)", transformOrigin: `${g.cx}px 62px`, filter: `drop-shadow(0 0 3px ${g.color}88)` }} />
                    <text x={g.cx} y="59" textAnchor="middle" fill="#fff" fontSize="7.5" fontFamily="monospace" fontWeight="900">{g.val}%</text>
                    <text x={g.cx} y="68" textAnchor="middle" fill="#64748b" fontSize="5" fontFamily="monospace">{g.label}</text>
                  </g>
                );
              })}
              <text x="130" y="106" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace" fontWeight="800">EVIDENCE COLLECTED TODAY</text>
              <rect x="18" y="112" width="224" height="10" rx="3" fill="rgba(255,255,255,0.04)"/>
              <rect x="18" y="112" width="210" height="10" rx="3" fill="#10b981" style={{ width: 210, animation: "mcGrowBar 2s ease-out forwards", filter: "drop-shadow(0 0 3px rgba(16,185,129,0.4))" }}/>
              <text x="232" y="120" fill="#10b981" fontSize="5" fontFamily="monospace">320</text>
              {[
                { label: "Config Deviations", val: "42", color: "#f59e0b", x: 18 },
                { label: "Controls Gaps", val: "0 critical", color: "#10b981", x: 140 },
              ].map((item, i) => (
                <g key={i}>
                  <rect x={item.x} y="132" width="108" height="22" rx="4" fill={item.color === "#10b981" ? "rgba(16,185,129,0.06)" : "rgba(245,158,11,0.06)"} stroke={item.color === "#10b981" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"} strokeWidth="0.8"/>
                  <text x={item.x + 8} y="143" fill={item.color} fontSize="6" fontFamily="monospace" fontWeight="700">{item.val}</text>
                  <text x={item.x + 8} y="150" fill="#64748b" fontSize="5" fontFamily="monospace">{item.label}</text>
                </g>
              ))}
              <line x1="18" y1="168" x2="242" y2="168" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
              <circle cx="28" cy="179" r="3" fill="#10b981"/>
              <text x="35" y="182" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">1,200 controls mapped</text>
              <circle cx="148" cy="179" r="3" fill="#3b82f6"/>
              <text x="155" y="182" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">Audit readiness 99%+</text>
            </svg>
          )}

          {config.indexLabel === 'DISPATCH' && (
            <svg viewBox="0 0 260 200" preserveAspectRatio="xMidYMid meet"
              style={{ width:'100%', height:'100%', position:'absolute', top:0, left:0, overflow:'visible', zIndex:1 }}>
              <text x="130" y="14" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">SOAR INCIDENT ROUTING</text>
              <rect x="88" y="22" width="84" height="28" rx="6" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.5)" strokeWidth="1.2"/>
              <circle cx="102" cy="36" r="5" fill="#ef4444" style={{ animation: "mcPulseRed 1s infinite" }}/>
              <text x="112" y="34" fill="#ef4444" fontSize="6.5" fontFamily="monospace" fontWeight="900">ALERT CORE</text>
              <text x="112" y="43" fill="#94a3b8" fontSize="5" fontFamily="monospace">18.4K signals/day</text>
              <line x1="130" y1="50" x2="130" y2="68" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 2" style={{ animation: "mcDash 1.5s linear infinite" }}/>
              <rect x="84" y="68" width="92" height="28" rx="6" fill="rgba(124,58,237,0.08)" stroke="rgba(124,58,237,0.5)" strokeWidth="1.2"/>
              <text x="130" y="80" textAnchor="middle" fill="#a78bfa" fontSize="6.5" fontFamily="monospace" fontWeight="900">SOAR RUNBOOK</text>
              <text x="130" y="89" textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="monospace">Classify → Assign → Escalate</text>
              <line x1="100" y1="96" x2="50" y2="118" stroke="#a78bfa" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="3 2" style={{ animation: "mcDash 3s linear infinite" }}/>
              <line x1="130" y1="96" x2="130" y2="118" stroke="#a78bfa" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="3 2" style={{ animation: "mcDash 2.5s linear infinite" }}/>
              <line x1="160" y1="96" x2="210" y2="118" stroke="#a78bfa" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="3 2" style={{ animation: "mcDash 2s linear infinite" }}/>
              {[
                { x: 18, label: "JIRA", sub: "4.2K tickets", color: "#3b82f6" },
                { x: 98, label: "SLACK", sub: "War rooms", color: "#a78bfa" },
                { x: 178, label: "PagerDuty", sub: "On-call", color: "#f59e0b" },
              ].map((b, i) => (
                <g key={i}>
                  <rect x={b.x} y="118" width="62" height="28" rx="5" fill={`rgba(${b.color === "#3b82f6" ? "59,130,246" : b.color === "#a78bfa" ? "167,139,250" : "245,158,11"},0.08)`} stroke={b.color} strokeWidth="0.8" strokeOpacity="0.4"/>
                  <text x={b.x + 31} y="130" textAnchor="middle" fill={b.color} fontSize="6.5" fontFamily="monospace" fontWeight="900">{b.label}</text>
                  <text x={b.x + 31} y="139" textAnchor="middle" fill="#64748b" fontSize="5" fontFamily="monospace">{b.sub}</text>
                </g>
              ))}
              <circle cx="28" cy="172" r="3" fill="#10b981"/>
              <text x="35" y="175" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">1,120 auto-resolved</text>
              <circle cx="148" cy="172" r="3" fill="#a78bfa"/>
              <text x="155" y="175" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">AI post-mortems generated</text>
            </svg>
          )}

          {config.indexLabel === 'FLEET' && (
            <svg viewBox="0 0 260 200" preserveAspectRatio="xMidYMid meet"
              style={{ width:'100%', height:'100%', position:'absolute', top:0, left:0, overflow:'visible', zIndex:1 }}>
              <text x="130" y="14" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">ENDPOINT FLEET HEALTH</text>
              {[
                { id: "SRV-01", edr: true, patch: true, cve: false },
                { id: "SRV-02", edr: true, patch: true, cve: false },
                { id: "SRV-03", edr: true, patch: false, cve: true },
                { id: "SRV-04", edr: true, patch: true, cve: false },
                { id: "SRV-05", edr: false, patch: false, cve: true },
                { id: "SRV-06", edr: true, patch: true, cve: false },
                { id: "SRV-07", edr: true, patch: true, cve: false },
                { id: "SRV-08", edr: true, patch: true, cve: false },
                { id: "SRV-09", edr: true, patch: true, cve: false },
                { id: "WKS-01", edr: false, patch: false, cve: true },
              ].map((s, i) => {
                const col = i % 5;
                const row = Math.floor(i / 5);
                const x = 18 + col * 48;
                const y = 24 + row * 52;
                const bad = s.cve || !s.edr;
                const borderColor = bad ? "#ef4444" : "#10b981";
                return (
                  <g key={i}>
                    <rect x={x} y={y} width="40" height="40" rx="4" fill={bad ? "rgba(239,68,68,0.07)" : "rgba(16,185,129,0.05)"} stroke={borderColor} strokeWidth={bad ? "1.2" : "0.8"} style={bad ? { animation: "mcPulseRed 2s infinite" } : {}}/>
                    <rect x={x + 4} y={y + 4} width="32" height="4" rx="2" fill={bad ? "#ef4444" : "#10b981"} opacity="0.7"/>
                    <text x={x + 20} y={y + 22} textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="monospace">{s.id}</text>
                    <text x={x + 20} y={y + 30} textAnchor="middle" fill={bad ? "#ef4444" : "#10b981"} fontSize="5" fontFamily="monospace" fontWeight="700">{bad ? (s.cve ? "CVE" : "NO EDR") : "OK"}</text>
                    <text x={x + 20} y={y + 37} textAnchor="middle" fill={s.patch ? "#10b981" : "#f59e0b"} fontSize="4.5" fontFamily="monospace">{s.patch ? "PATCHED" : "OUTDATED"}</text>
                  </g>
                );
              })}
              {[
                { color: "#10b981", label: "EDR: 45.1K covered", x: 18 },
                { color: "#f59e0b", label: "1.24K CVE hosts", x: 105 },
                { color: "#3b82f6", label: "128 patches pushed", x: 178 },
              ].map((s, i) => (
                <g key={i}>
                  <circle cx={s.x + 4} cy="148" r="3" fill={s.color}/>
                  <text x={s.x + 11} y="151" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">{s.label}</text>
                </g>
              ))}
              <text x="18" y="166" fill="#64748b" fontSize="6" fontFamily="monospace" fontWeight="800">PATCH COMPLIANCE</text>
              <rect x="18" y="170" width="224" height="10" rx="3" fill="rgba(255,255,255,0.04)"/>
              <rect x="18" y="170" width="190" height="10" rx="3" fill="#3b82f6" style={{ width: 190, animation: "mcGrowBar 2s ease-out forwards", filter: "drop-shadow(0 0 3px rgba(59,130,246,0.4))" }}/>
              <text x="215" y="178" fill="#3b82f6" fontSize="5.5" fontFamily="monospace">85%</text>
            </svg>
          )}

          {config.indexLabel === 'TRAFFIC' && (
            <svg viewBox="0 0 260 200" preserveAspectRatio="xMidYMid meet"
              style={{ width:'100%', height:'100%', position:'absolute', top:0, left:0, overflow:'visible', zIndex:1 }}>
              <defs>
                <radialGradient id="gwGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </radialGradient>
              </defs>
              <text x="130" y="14" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">GLOBAL TRAFFIC NEXUS</text>
              <line x1="20" y1="100" x2="240" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="130" y1="20" x2="130" y2="180" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="3 3" />
              <circle cx="130" cy="100" r="32" fill="url(#gwGlow)" />
              <circle cx="130" cy="100" r="22" fill="#0f172a" stroke="#7c3aed" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(124,58,237,0.5))" }} />
              <text x="130" y="96" textAnchor="middle" dominantBaseline="middle" fill="#a78bfa" fontSize="7" fontFamily="monospace" fontWeight="900">GW-01</text>
              <text x="130" y="106" textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize="5.2" fontFamily="monospace">PROXY</text>
              {[
                { cx: 50, cy: 50, label: "US-EAST", rxtx: "1.4 GB/s", color: "#3b82f6" },
                { cx: 50, cy: 150, label: "US-WEST", rxtx: "820 MB/s", color: "#3b82f6" },
                { cx: 210, cy: 50, label: "EU-CENT", rxtx: "2.1 GB/s", color: "#10b981" },
                { cx: 210, cy: 150, label: "AP-SOUTH", rxtx: "410 MB/s", color: "#f59e0b" },
              ].map((node, i) => (
                <g key={i}>
                  <circle cx={node.cx} cy={node.cy} r="16" fill="#0f172a" stroke={node.color} strokeWidth="1.5" />
                  <text x={node.cx} y={node.cy - 2} textAnchor="middle" fill={node.color} fontSize="5.5" fontFamily="monospace" fontWeight="900">{node.label}</text>
                  <text x={node.cx} y={node.cy + 6} textAnchor="middle" fill="#cbd5e1" fontSize="4.8" fontFamily="monospace">{node.rxtx}</text>
                  <line x1={node.cx < 130 ? node.cx + 16 : node.cx - 16} y1={node.cy} x2={node.cx < 130 ? 108 : 152} y2="100" stroke={node.color} strokeWidth="1" strokeDasharray="3 3" style={{ animation: "mcDash 3s linear infinite" }} />
                </g>
              ))}
              <circle cx="28" cy="184" r="3.5" fill="#10b981"/>
              <text x="36" y="187.5" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">Active streams: 4,821</text>
            </svg>
          )}

          {config.indexLabel === 'TELEMETRY' && (
            <svg viewBox="0 0 280 200" preserveAspectRatio="xMidYMid meet"
              style={{ width:'100%', height:'100%', position:'absolute', top:0, left:0, overflow:'visible', zIndex:1 }}>
              <defs>
                <radialGradient id="hudGlowCyan" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                  <stop offset="70%" stopColor="#10b981" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
                <filter id="neonGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <text x="130" y="14" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">FLIGHT TELEMETRY HUD</text>

              <g opacity="0.08">
                <circle cx="130" cy="105" r="85" fill="none" stroke="#fff" strokeWidth="0.5" />
                <circle cx="130" cy="105" r="65" fill="none" stroke="#fff" strokeWidth="0.5" />
                <line x1="45" y1="105" x2="215" y2="105" stroke="#fff" strokeWidth="0.5" />
                <line x1="130" y1="20" x2="130" y2="190" stroke="#fff" strokeWidth="0.5" />
              </g>

              <g transform="translate(130, 105)">
                <circle cx="0" cy="0" r="65" fill="url(#hudGlowCyan)" />
                <circle cx="0" cy="0" r="58" fill="none" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="3" strokeDasharray="1 5" style={{ transformOrigin: "0 0", animation: "mcRotateClockwise 40s linear infinite" }} />
                <circle cx="0" cy="0" r="50" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" strokeDasharray="8 4" style={{ transformOrigin: "0 0", animation: "mcRotateCounterClockwise 25s linear infinite" }} />
                <circle cx="0" cy="0" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <path d="M 0 -44 A 44 44 0 1 1 -41.8 13.6" fill="none" stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" filter="url(#neonGlowCyan)" />
                <line x1="0" y1="0" x2="0" y2="-56" stroke="#06b6d4" strokeWidth="1.2" opacity="0.8" style={{ transformOrigin: "0 0", animation: "mcRadarSweep 5s linear infinite" }} />
                <text x="0" y="-8" textAnchor="middle" fill="#10b981" fontSize="19" fontWeight="950" fontFamily="monospace" filter="url(#neonGlowCyan)">1.8h</text>
                <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="5.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.12em">MTTR COCKPIT</text>
                <text x="0" y="16" textAnchor="middle" fill="#06b6d4" fontSize="4.5" fontFamily="monospace" fontWeight="bold">▲ 98% AUTOPILOT</text>
                <text x="0" y="24" textAnchor="middle" fill="#10b981" fontSize="4" fontFamily="monospace" fontWeight="800">STATUS: OPTIMAL</text>
              </g>

              <g transform="translate(20, 50)">
                <rect x="0" y="0" width="60" height="25" rx="3" fill="rgba(15,23,42,0.6)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                <text x="6" y="8" fill="#64748b" fontSize="4.5" fontFamily="monospace">SLA TARGET</text>
                <text x="6" y="19" fill="#3b82f6" fontSize="9" fontWeight="900" fontFamily="monospace">4.0h</text>
                
                <rect x="0" y="32" width="60" height="25" rx="3" fill="rgba(15,23,42,0.6)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                <text x="6" y="40" fill="#64748b" fontSize="4.5" fontFamily="monospace">LEGACY AVG</text>
                <text x="6" y="51" fill="#ef4444" fontSize="9" fontWeight="900" fontFamily="monospace">48.2h</text>
              </g>

              <g transform="translate(200, 50)">
                <rect x="0" y="0" width="60" height="25" rx="3" fill="rgba(15,23,42,0.6)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                <text x="6" y="8" fill="#64748b" fontSize="4.5" fontFamily="monospace">MEAN MTTA</text>
                <text x="6" y="19" fill="#10b981" fontSize="9" fontWeight="900" fontFamily="monospace">12.4m</text>
                
                <rect x="0" y="32" width="60" height="25" rx="3" fill="rgba(15,23,42,0.6)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                <text x="6" y="40" fill="#64748b" fontSize="4.5" fontFamily="monospace">SLA FAILURES</text>
                <text x="6" y="51" fill="#10b981" fontSize="9" fontWeight="900" fontFamily="monospace">0.00%</text>
              </g>

              <path d="M 25 175 L 50 170 L 75 178 L 100 165 L 125 172 L 150 155 L 175 168 L 200 160 L 225 174 L 255 170" fill="none" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="1.2" strokeDasharray="3 1" />
              <circle cx="255" cy="170" r="2.5" fill="#10b981" style={{ filter: "drop-shadow(0 0 3px #10b981)" }} />
              
              <line x1="18" y1="182" x2="242" y2="182" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
              <circle cx="28" cy="191" r="2.5" fill="#10b981" />
              <text x="35" y="194" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">SLA Compliant state</text>
              <circle cx="140" cy="191" r="2.5" fill="#06b6d4" />
              <text x="147" y="194" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">Autopilot remediation loops active</text>
            </svg>
          )}

          {/* Fallback to concentric rings for default behavior */}
          {!['ALTITUDE', 'RUNWAY', 'APPSEC', 'AI RISK', 'RADAR', 'IDENTITY', 'COMPLY', 'DISPATCH', 'FLEET', 'TRAFFIC', 'TELEMETRY'].includes(config.indexLabel) && (
            <svg viewBox="0 0 280 215" preserveAspectRatio="xMidYMid meet"
              style={{ width:'100%', height:'100%', position:'absolute', top:0, left:0, overflow:'visible', zIndex:1 }}>
              <defs>
                <radialGradient id={`mcCore-${config.indexLabel}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor={isUnderAttack ? '#ef4444' : ri.color} stopOpacity="0.22" />
                  <stop offset="100%" stopColor={isUnderAttack ? '#ef4444' : ri.color} stopOpacity="0" />
                </radialGradient>
                <filter id="mc-glow">
                  <feGaussianBlur stdDeviation="2.2" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Ghost tracks */}
              {[rOuter, rMiddle, rInner].map((r,i) => (
                <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              ))}

              {/* Sync-moving orbit dots for 3 rings */}
              <circle cx={outerDot.cx} cy={outerDot.cy} r="2.2" fill={ro.color} opacity="0.9" style={{ filter: `drop-shadow(0 0 2px ${ro.glowColor})` }} />
              <circle cx={middleDot.cx} cy={middleDot.cy} r="2.2" fill={rm.color} opacity="0.9" style={{ filter: `drop-shadow(0 0 2px ${rm.glowColor})` }} />
              <circle cx={innerDot.cx} cy={innerDot.cy} r="2.2" fill={ri.color} opacity="0.9" style={{ filter: `drop-shadow(0 0 2px ${ri.glowColor})` }} />

              {/* Outer ring */}
              <circle cx="100" cy="100" r={rOuter} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5.5" />
              <circle cx="100" cy="100" r={rOuter} fill="none" stroke={ro.color} strokeWidth="5.5"
                strokeDasharray={circOuter} strokeDashoffset={circOuter - dashOuter} strokeLinecap="round"
                style={{ transform:'rotate(-90deg)', transformOrigin:'100px 100px', filter:`drop-shadow(0 0 3px ${ro.glowColor})` }} />

              {/* Middle ring */}
              <circle cx="100" cy="100" r={rMiddle} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5.5" />
              <circle cx="100" cy="100" r={rMiddle} fill="none" stroke={rm.color} strokeWidth="5.5"
                strokeDasharray={circMiddle} strokeDashoffset={circMiddle - dashMiddle} strokeLinecap="round"
                style={{ transform:'rotate(-90deg)', transformOrigin:'100px 100px', filter:`drop-shadow(0 0 3px ${rm.glowColor})` }} />

              {/* Inner ring */}
              <circle cx="100" cy="100" r={rInner} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5.5" />
              <circle cx="100" cy="100" r={rInner} fill="none" stroke={ri.color} strokeWidth="5.5"
                strokeDasharray={circInner} strokeDashoffset={circInner - dashInner} strokeLinecap="round"
                style={{ transform:'rotate(-90deg)', transformOrigin:'100px 100px', filter:`drop-shadow(0 0 4px ${ri.glowColor})` }} />

              {/* Core glow */}
              <circle cx="100" cy="100" r="30" fill={`url(#mcCore-${config.indexLabel})`} />

              {/* Score */}
              <text x="100" y="96" textAnchor="middle" fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="900">
                {displayScore}%
              </text>
              <text x="100" y="108" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="monospace">
                {config.indexLabel}
              </text>

              {/* Legend */}
              <line x1="10" y1="178" x2="250" y2="178" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              <circle cx="30"  cy="188" r="4.5" fill={ri.color} />
              <text x="39"  y="191" fill="#cbd5e1" fontSize="6.5" fontFamily="monospace">{ri.label} {innerPct}%</text>
              <circle cx="105" cy="188" r="4.5" fill={rm.color} />
              <text x="114" y="191" fill="#cbd5e1" fontSize="6.5" fontFamily="monospace">{rm.label} {middlePct}%</text>
              <circle cx="180" cy="188" r="4.5" fill={ro.color} />
              <text x="189" y="191" fill="#cbd5e1" fontSize="6.5" fontFamily="monospace">{ro.label} {outerPct}%</text>

              {/* Gates panel */}
              <text x="198" y="36" textAnchor="start" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="900" letterSpacing="0.08em">CLEAR GATES</text>

              {[
                { g: g1Fail, name: config.gates[0], y: 44, cy: 53 },
                { g: g2Fail, name: config.gates[1], y: 68, cy: 77 },
                { g: g3Fail, name: config.gates[2], y: 92, cy: 101 },
              ].map(({ g, name, y, cy }) => (
                <g key={name}>
                  <rect x="198" y={y} width="72" height="18" rx="4" fill={gateFill(g)} stroke={gateStroke(g)} strokeWidth="0.8" />
                  <circle cx="208" cy={cy} r="3.5" fill={gateColor(g)} filter="url(#mc-glow)"
                    style={g ? { animation:'mcPulseRed 1.2s infinite' } : {}} />
                  <text x="216" y={cy + 3} fill={gateColor(g)} fontSize="6.5" fontFamily="monospace" fontWeight="700">{name}</text>
                  <text x="264" y={cy + 3} textAnchor="end" fill={gateColor(g)} fontSize="6" fontFamily="monospace" fontWeight="900">
                    {g ? 'FAIL' : 'PASS'}
                  </text>
                </g>
              ))}

              {/* Sync node */}
              <text x="198" y="128" textAnchor="start" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="900" letterSpacing="0.08em">SYNC NODE</text>
              <circle cx="208" cy="144" r="5.5" fill="none" stroke="rgba(245,158,11,0.2)" strokeWidth="1"
                style={{ animation:'mcPulseGlow 2s infinite' }} />
              <circle cx="208" cy="144" r="3.5" fill="#f59e0b" />
              <text x="216" y="148" fill="#fbbf24" fontSize="6.5" fontFamily="monospace" fontWeight="700">
                {isUnderAttack ? 'BREACH WAVE' : `${toolCount} ${config.syncLabel}`}
              </text>
            </svg>
          )}

          {/* Scanline */}
          <div style={{
            position:'absolute', top:0, left:0, width:'100%', height:'2px',
            background: isUnderAttack ? 'rgba(239,68,68,0.18)' : 'rgba(16,185,129,0.15)',
            animation:'mcScanline 3.5s linear infinite',
          }} />
        </div>

        {/* ── Right: Funnel + Checklist ── */}
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between' }}>

          {/* Funnel */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.5rem' }}>
              <div className="mcockpit-gate-lbl" style={{ marginBottom:0 }}>{config.funnel[0].label.split(' ').slice(-2).join(' ')} Funnel</div>
              <span style={{
                fontSize:'0.58rem', fontWeight:800, padding:'1px 7px', borderRadius:'10px',
                background: hasLive ? '#dcfce7' : '#f1f5f9',
                color: hasLive ? '#15803d' : '#64748b',
                letterSpacing:'0.04em',
              }}>
                {hasLive ? '● LIVE DB' : '○ BASELINE'}
              </span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'0.65rem' }}>
              {([
                { val: f1, ...config.funnel[0] },
                { val: f2, ...config.funnel[1] },
                { val: f3, ...config.funnel[2] },
                { val: f4, ...config.funnel[3] },
              ] as { val: string; label: string; sublabel: string; color: string }[]).map((box, i) => (
                <div key={i} className="mcockpit-funnel-box">
                  <span style={{ fontSize:'1.45rem', fontWeight:900, color: box.color, fontFamily:'monospace', letterSpacing:'-0.02em', lineHeight:1 }}>
                    {box.val}
                  </span>
                  <span style={{ fontSize:'0.74rem', fontWeight:800, color:'#0f172a', margin:'2px 0' }}>{box.label}</span>
                  <span style={{ fontSize:'0.62rem', color:'#64748b', lineHeight:1.2 }}>{box.sublabel}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div style={{ marginTop:'0.75rem' }}>
            <div className="mcockpit-gate-lbl">Enterprise GRC Checkpoint</div>
            {config.checklist.map((item, idx) => (
              <div key={idx} className="mcockpit-checklist-box"
                style={{
                  background: isEnterpriseMode ? undefined : '#f8fafc',
                  border: isEnterpriseMode ? undefined : '1px solid #cbd5e1',
                  marginBottom: idx === config.checklist.length - 1 ? 0 : undefined,
                }}>
                <div style={{
                  background: isEnterpriseMode ? '#10b981' : '#64748b',
                  borderRadius:'50%', padding:'3px',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink:0, marginTop:'2px',
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize:'0.8rem', fontWeight:800, color:'#0f172a', display:'flex', alignItems:'center', gap:'6px' }}>
                    {item.name}
                    <span style={{
                      fontSize:'0.58rem', fontWeight:800, padding:'1px 5px', borderRadius:'4px',
                      background: isEnterpriseMode ? '#dcfce7' : '#e2e8f0',
                      color: isEnterpriseMode ? '#15803d' : '#64748b',
                    }}>
                      {isEnterpriseMode ? 'ACTIVE' : 'ENTERPRISE'}
                    </span>
                  </div>
                  <div style={{ fontSize:'0.68rem', color:'#64748b', marginTop:'0.08rem', lineHeight:1.2 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
