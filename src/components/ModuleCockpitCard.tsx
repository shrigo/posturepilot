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
  const [animProgress, setAnimProgress] = useState(0);

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
    setAnimProgress(0);
    let start: number | null = null;
    const duration = 1800; // 1.8 seconds for smooth premium presentation
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progressVal = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutQuart
      const easeOutQuart = 1 - Math.pow(1 - progressVal, 4);
      setAnimProgress(easeOutQuart);

      if (progressVal < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
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

  const currentInnerPct = Math.round(innerPct * animProgress);
  const currentMiddlePct = Math.round(middlePct * animProgress);
  const currentOuterPct = Math.round(outerPct * animProgress);
  const displayScore = Math.round(score * animProgress);

  const currentInnerPctFloat = innerPct * animProgress;
  const currentMiddlePctFloat = middlePct * animProgress;
  const currentOuterPctFloat = outerPct * animProgress;

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

            {/* Rotating orbit dots for 3 rings */}
            <circle cx="100" cy="28" r="2.2" fill={ro.color} opacity="0.8" style={{ transformOrigin: "100px 100px", animation: "mcRotate 8s linear infinite" }} />
            <circle cx="100" cy="44" r="2.2" fill={rm.color} opacity="0.8" style={{ transformOrigin: "100px 100px", animation: "mcRotate 6s linear infinite" }} />
            <circle cx="100" cy="60" r="2.2" fill={ri.color} opacity="0.8" style={{ transformOrigin: "100px 100px", animation: "mcRotate 4s linear infinite" }} />

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
