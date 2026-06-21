'use client';
import React, { useState, useEffect } from 'react';
import { useClient } from '@/context/ClientContext';

// Live feed data shape from /api/findings/summary
export interface LiveFeedData {
  total: number;
  critical: number;
  high: number;
  riskScore: number;
  slaCompliance: number;
  avgCvss?: string;
  bySeverity: Record<string, number>;
  byTool: Record<string, number>;
  recentScans?: { id: string; sourceTool: string; findingCount: number; createdAt: string }[];
  topCVEs?: { cveId: string | null; count: number }[];
}

interface CockpitPipelineCardProps {
  moduleId: 'posture' | 'cloud' | 'network' | 'appsec' | 'ai-risk' | 'secure' | 'identity' | 'infosec' | 'dispatch' | 'server' | 'traffic' | 'kpi';
  // Live API data — when provided, graphics reflect real scan data; otherwise falls back to client context
  live?: LiveFeedData | null;
  // Posture score computed on the parent page (already blends mitigations + SLA penalty + attack state)
  postureScore?: number;
  // Count of mitigated CVEs to drive cleared gates
  mitigatedCount?: number;
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

export default function CockpitPipelineCard({
  moduleId,
  live,
  postureScore: externalScore,
  mitigatedCount = 0,
}: CockpitPipelineCardProps) {
  const { currentClient, isEnterpriseMode, isUnderAttack, slaThresholds } = useClient();

  // ── Mount animation: rings draw from 0 → target on load & data change ──
  const [animated, setAnimated] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  const hasLive = !!live && live.total > 0;

  // ── JPI Score ──────────────────────────────────────────────────────────────
  // Priority: 1. parent-computed score (blends SLA+mitigations+attack)
  //            2. live API slaCompliance mapped to 0-100
  //            3. client context score (static mock)
  const slaBreachPenalty = Math.max(0, (7 - slaThresholds.critical) * 2) + Math.max(0, (30 - slaThresholds.high) * 0.5);

  let postureScore: number;
  if (isUnderAttack) {
    postureScore = 42;
  } else if (externalScore !== undefined) {
    postureScore = externalScore;
  } else if (hasLive) {
    // Derive from real SLA compliance and risk score
    const slaWeight = live!.slaCompliance * 0.6;
    const riskWeight = Math.max(0, 100 - live!.riskScore) * 0.4;
    postureScore = Math.max(30, Math.min(100, Math.round(slaWeight + riskWeight - slaBreachPenalty)));
  } else {
    const baseByClient: Record<string, number> = {
      WELLS: 76, TOYOTA: 85, UR: 91, CISCO: 96, DISNEY: 81,
    };
    postureScore = Math.max(30, Math.min(100,
      (baseByClient[currentClient.key] ?? 76) - Math.round(slaBreachPenalty) + mitigatedCount * 3
    ));
  }

  // Three rings: Code (innermost) = overall JPI, Cloud (middle) = cloud-adjusted, Hosts (outer) = host-adjusted
  const codePct  = Math.min(100, postureScore);
  const cloudPct = Math.min(100, Math.round(postureScore * 0.95));
  const hostsPct = Math.min(100, Math.round(postureScore * 0.87));

  // ── Funnel Metrics ─────────────────────────────────────────────────────────
  // When live feed is present: use real counts from DB
  // When no live feed: use client-context values as meaningful mock data
  let rawVal: string, groupedVal: string, exposedVal: string, clearedVal: string;
  let liveSource = false;

  if (hasLive && moduleId === 'posture') {
    liveSource = true;
    // Raw = total open findings from DB
    const raw  = isUnderAttack ? live!.total * 3 : live!.total;
    // Grouped = critical + high (the highest-priority cluster)
    const grouped = isUnderAttack
      ? (live!.critical + live!.high) * 4
      : live!.critical + live!.high;
    // Exposed = critical findings only (correlated with active exploits)
    const exposed = isUnderAttack ? live!.critical * 5 : live!.critical;
    // Cleared = findings mitigated this session + SLA-compliant findings
    const baseCleared = Math.round(live!.total * (live!.slaCompliance / 100));
    const cleared = isUnderAttack
      ? Math.max(0, Math.round(baseCleared * 0.25))
      : baseCleared + mitigatedCount;

    rawVal     = formatNum(raw);
    groupedVal = formatNum(grouped);
    exposedVal = formatNum(exposed);
    clearedVal = formatNum(cleared);
  } else {
    // No live scan — use client context as mock baseline
    const assetCount  = parseInt(currentClient.assets.replace(/,/g, ''), 10) || 10000;
    const critCount   = parseInt(currentClient.criticals, 10) || 5;
    const backlogCount = parseInt(currentClient.backlog.replace(/,/g, ''), 10) || 100;

    const raw     = isUnderAttack ? backlogCount * 40 : backlogCount * 12;
    const grouped = isUnderAttack ? critCount * 80 : critCount * 20;
    const exposed = isUnderAttack ? critCount * 5  : critCount;
    const cleared = isUnderAttack
      ? Math.max(0, Math.round(mitigatedCount * 0.25))
      : mitigatedCount + Math.round(assetCount * 0.01);

    rawVal     = formatNum(raw);
    groupedVal = formatNum(grouped);
    exposedVal = formatNum(exposed);
    clearedVal = formatNum(cleared);
  }

  // ── Gate States ────────────────────────────────────────────────────────────
  // BUILD gate: fails if open criticals in live > threshold; else PASS
  const liveCriticals = hasLive ? live!.critical : parseInt(currentClient.criticals, 10);
  const buildFail  = isUnderAttack || liveCriticals > 20;
  // DEPLOY gate: fails if SLA compliance < 80% in live; else PASS
  const liveSla    = hasLive ? live!.slaCompliance : 95;
  const deployFail = isUnderAttack || liveSla < 80;
  // CONFIG gate: fails under attack OR if riskScore > 75
  const liveRisk   = hasLive ? live!.riskScore : 0;
  const configFail = isUnderAttack || liveRisk > 75;

  // Tool count for Threat Sync
  const toolCount = hasLive ? Object.keys(live!.byTool).length : 5;

  // ── SVG Ring Geometry ──────────────────────────────────────────────────────
  const rOuter = 72, rMiddle = 56, rInner = 40;
  const circOuter  = 2 * Math.PI * rOuter;
  const circMiddle = 2 * Math.PI * rMiddle;
  const circInner  = 2 * Math.PI * rInner;

  // Target dash values (full arc at target %)
  const targetOuter  = (hostsPct / 100) * circOuter;
  const targetMiddle = (cloudPct / 100) * circMiddle;
  const targetInner  = (codePct  / 100) * circInner;

  // ── Animation: draw from zero ONLY when client changes ──────────────────
  useEffect(() => {
    setAnimated(false);
    setDisplayScore(0);
    const t = setTimeout(() => setAnimated(true), 60);
    return () => clearTimeout(t);
  }, [currentClient.key]); // ← ONLY client switch triggers redraw from zero

  // Counter animation: 0 → postureScore over ~900ms
  useEffect(() => {
    if (!animated) return;
    const duration = 2000;
    const start = performance.now();
    let raf: number;
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * postureScore));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [animated, postureScore]);

  // drawn arc length: 0 when rings are empty, target when fully filled
  const dashOuter  = animated ? targetOuter  : 0;
  const dashMiddle = animated ? targetMiddle : 0;
  const dashInner  = animated ? targetInner  : 0;

  const gateColor  = (fail: boolean) => fail ? '#ef4444' : '#10b981';
  const gateFill   = (fail: boolean) => fail ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)';
  const gateStroke = (fail: boolean) => fail ? 'rgba(239,68,68,0.45)' : 'rgba(16,185,129,0.35)';

  return (
    <div
      className="cockpit-pipeline-card card animate-in"
      style={{
        padding: '1.5rem',
        marginBottom: '1.25rem',
        border: '1.5px solid #7c3aed',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.08)',
      }}
    >
      <style>{`
        .cockpit-pipeline-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          align-items: stretch;
        }
        .cockpit-funnel-metric {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
          overflow: hidden;
          transition: all 0.2s ease;
        }
        .cockpit-funnel-metric:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .cockpit-gate-label {
          font-family: monospace;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #64748b;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }
        .cockpit-feature-item-box {
          background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%);
          border: 1px solid #a7f3d0;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          box-shadow: 0 4px 10px -2px rgba(16,185,129,0.06);
          margin-bottom: 0.65rem;
          transition: all 0.2s ease;
        }
        .cockpit-feature-item-box:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 12px -2px rgba(16,185,129,0.1);
        }
        .cockpit-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.58rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 10px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        @media(max-width: 980px) {
          .cockpit-pipeline-grid { grid-template-columns: 1fr; }
        }
        @keyframes scanline-overlay {
          0%   { transform: translateY(0px);   opacity: 0.6; }
          50%  { transform: translateY(213px); opacity: 0.3; }
          100% { transform: translateY(0px);   opacity: 0.6; }
        }
        @keyframes pulseRed {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1;   }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1);   }
          50%       { opacity: 0.9; transform: scale(1.6); }
        }
        @keyframes rotateClockwise {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#7c3aed', background: 'rgba(124, 58, 237, 0.08)', padding: '2px 8px', borderRadius: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Cockpit Telemetry Pipeline &amp; GRC Controls
          </span>
          <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
            Real-Time Posture Clearance Telemetry
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Live feed badge */}
          {hasLive ? (
            <span className="cockpit-live-badge" style={{ background: '#dcfce7', color: '#15803d' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              LIVE · {live!.total.toLocaleString()} findings
            </span>
          ) : (
            <span className="cockpit-live-badge" style={{ background: '#f1f5f9', color: '#64748b' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#94a3b8', display: 'inline-block' }} />
              DEMO DATA
            </span>
          )}
          <span className="hud-pulse" style={{ background: isUnderAttack ? '#ef4444' : '#10b981', width: 8, height: 8 }} />
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: isUnderAttack ? '#ef4444' : '#10b981' }}>
            {isUnderAttack ? '🔴 EXPLOIT WAVE ACTIVE' : 'POSTURE OK'}
          </span>
        </div>
      </div>

      <div className="cockpit-pipeline-grid">
        {/* ── Left: JPI Ring SVG + Clearance Gates ── */}
        <div style={{ background: '#090d16', borderRadius: '14px', border: '1px solid #1e293b', position: 'relative', overflow: 'hidden', minHeight: '275px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.85)' }}>

          <svg viewBox="0 0 280 215" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'visible', zIndex: 1 }}>
            <defs>
              <radialGradient id="jpiCoreDynamic" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor={isUnderAttack ? '#ef4444' : '#10b981'} stopOpacity="0.22" />
                <stop offset="100%" stopColor={isUnderAttack ? '#ef4444' : '#10b981'} stopOpacity="0" />
              </radialGradient>
              <filter id="glow-badge">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Ghost orbit tracks */}
            {[rOuter, rMiddle, rInner].map((r, i) => (
              <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            ))}

            {/* Orbiting dot */}
            <circle cx="100" cy="28" r="2.2" fill="#7c3aed" opacity="0.8"
              style={{ transformOrigin: '100px 100px', animation: 'rotateClockwise 8s linear infinite' }} />

            {/* ── Hosts ring (outer / blue) ── */}
            <circle cx="100" cy="100" r={rOuter} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5.5" />
            <circle cx="100" cy="100" r={rOuter} fill="none" stroke="#3b82f6" strokeWidth="5.5"
              strokeDasharray={circOuter} strokeDashoffset={circOuter - dashOuter} strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px',
                filter: 'drop-shadow(0 0 3px rgba(59,130,246,0.5))',
                transition: 'stroke-dashoffset 2.2s cubic-bezier(0.4,0,0.2,1) 0.5s' }} />

            {/* ── Cloud ring (middle / purple) ── */}
            <circle cx="100" cy="100" r={rMiddle} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5.5" />
            <circle cx="100" cy="100" r={rMiddle} fill="none" stroke="#a78bfa" strokeWidth="5.5"
              strokeDasharray={circMiddle} strokeDashoffset={circMiddle - dashMiddle} strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px',
                filter: 'drop-shadow(0 0 3px rgba(167,139,250,0.5))',
                transition: 'stroke-dashoffset 2.2s cubic-bezier(0.4,0,0.2,1) 0.3s' }} />

            {/* ── Code ring (inner / green) ── */}
            <circle cx="100" cy="100" r={rInner} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5.5" />
            <circle cx="100" cy="100" r={rInner} fill="none" stroke="#10b981" strokeWidth="5.5"
              strokeDasharray={circInner} strokeDashoffset={circInner - dashInner} strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px',
                filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.6))',
                transition: 'stroke-dashoffset 2.2s cubic-bezier(0.4,0,0.2,1) 0.1s' }} />

            {/* Core glow */}
            <circle cx="100" cy="100" r="30" fill="url(#jpiCoreDynamic)" />

            <text x="100" y="96" textAnchor="middle" fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="900">
              {displayScore}%
            </text>
            <text x="100" y="108" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="monospace">JPI INDEX</text>

            {/* Legend strip */}
            <line x1="10" y1="178" x2="250" y2="178" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            <circle cx="30"  cy="188" r="4.5" fill="#10b981" />
            <text x="39"  y="191" fill="#cbd5e1" fontSize="6.5" fontFamily="monospace">Code {codePct}%</text>
            <circle cx="105" cy="188" r="4.5" fill="#a78bfa" />
            <text x="114" y="191" fill="#cbd5e1" fontSize="6.5" fontFamily="monospace">Cloud {cloudPct}%</text>
            <circle cx="180" cy="188" r="4.5" fill="#3b82f6" />
            <text x="189" y="191" fill="#cbd5e1" fontSize="6.5" fontFamily="monospace">Hosts {hostsPct}%</text>

            {/* ── Clearance Gates panel (right side) ── */}
            <text x="198" y="36" textAnchor="start" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="900" letterSpacing="0.08em">CLEAR GATES</text>

            {/* Gate 1: BUILD */}
            <rect x="198" y="44" width="72" height="18" rx="4" fill={gateFill(buildFail)} stroke={gateStroke(buildFail)} strokeWidth="0.8" />
            <circle cx="208" cy="53" r="3.5" fill={gateColor(buildFail)} filter="url(#glow-badge)"
              style={buildFail ? { animation: 'pulseRed 1.2s infinite' } : {}} />
            <text x="216" y="56" fill={gateColor(buildFail)} fontSize="6.5" fontFamily="monospace" fontWeight="700">BUILD</text>
            <text x="264" y="56" textAnchor="end" fill={gateColor(buildFail)} fontSize="6" fontFamily="monospace" fontWeight="900">
              {buildFail ? 'FAIL' : 'PASS'}
            </text>

            {/* Gate 2: DEPLOY */}
            <rect x="198" y="68" width="72" height="18" rx="4" fill={gateFill(deployFail)} stroke={gateStroke(deployFail)} strokeWidth="0.8" />
            <circle cx="208" cy="77" r="3.5" fill={gateColor(deployFail)} filter="url(#glow-badge)"
              style={deployFail ? { animation: 'pulseRed 1.2s infinite' } : {}} />
            <text x="216" y="80" fill={gateColor(deployFail)} fontSize="6.5" fontFamily="monospace" fontWeight="700">DEPLOY</text>
            <text x="264" y="80" textAnchor="end" fill={gateColor(deployFail)} fontSize="6" fontFamily="monospace" fontWeight="900">
              {deployFail ? 'FAIL' : 'PASS'}
            </text>

            {/* Gate 3: CONFIG */}
            <rect x="198" y="92" width="72" height="18" rx="4" fill={gateFill(configFail)} stroke={gateStroke(configFail)} strokeWidth="0.8" />
            <circle cx="208" cy="101" r="3.5" fill={gateColor(configFail)}
              style={configFail ? { animation: 'pulseRed 1.2s infinite' } : {}} />
            <text x="216" y="104" fill={gateColor(configFail)} fontSize="6.5" fontFamily="monospace" fontWeight="700">CONFIG</text>
            <text x="264" y="104" textAnchor="end" fill={gateColor(configFail)} fontSize="6" fontFamily="monospace" fontWeight="900">
              {configFail ? 'FAIL' : 'PASS'}
            </text>

            {/* Threat Sync */}
            <text x="198" y="128" textAnchor="start" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="900" letterSpacing="0.08em">THREAT SYNC</text>
            <circle cx="208" cy="144" r="5.5" fill="none" stroke="rgba(245,158,11,0.2)" strokeWidth="1" style={{ animation: 'pulseGlow 2s infinite' }} />
            <circle cx="208" cy="144" r="3.5" fill="#f59e0b" />
            <text x="216" y="148" fill="#fbbf24" fontSize="6.5" fontFamily="monospace" fontWeight="700">
              {isUnderAttack ? 'ATTACK WAVE' : `${toolCount} FEEDS LIVE`}
            </text>
          </svg>

          {/* Scanline sweep overlay */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '2px',
            background: isUnderAttack ? 'rgba(239,68,68,0.18)' : 'rgba(16,185,129,0.15)',
            animation: 'scanline-overlay 3.5s linear infinite',
          }} />
        </div>

        {/* ── Right: Funnel Metrics + Enterprise GRC ── */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

          {/* Funnel heading with data-source indicator */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div className="cockpit-gate-label" style={{ marginBottom: 0 }}>Vulnerability Exposure Funnel</div>
              <span style={{
                fontSize: '0.58rem', fontWeight: 800, padding: '1px 7px', borderRadius: '10px',
                background: liveSource ? '#dcfce7' : '#f1f5f9',
                color: liveSource ? '#15803d' : '#64748b',
                letterSpacing: '0.04em',
              }}>
                {liveSource ? '● LIVE DB COUNTS' : '○ CLIENT BASELINE'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>

              {/* Box 1: Raw total */}
              <div className="cockpit-funnel-metric">
                <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ef4444', fontFamily: 'monospace', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {rawVal}
                </span>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>
                  {hasLive ? 'Open Findings' : 'Raw Detections'}
                </span>
                <span style={{ fontSize: '0.62rem', color: '#64748b', lineHeight: 1.2 }}>
                  {hasLive ? 'From uploaded scans · DB' : 'Ingested scanning blips'}
                </span>
              </div>

              {/* Box 2: Critical+High cluster */}
              <div className="cockpit-funnel-metric">
                <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#f97316', fontFamily: 'monospace', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {groupedVal}
                </span>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>
                  {hasLive ? 'Critical + High' : 'Grouped Flags'}
                </span>
                <span style={{ fontSize: '0.62rem', color: '#64748b', lineHeight: 1.2 }}>
                  {hasLive ? 'Priority findings in feed' : 'Duplicate alert suppression'}
                </span>
              </div>

              {/* Box 3: Criticals / exposed */}
              <div className="cockpit-funnel-metric">
                <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {exposedVal}
                </span>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>
                  {hasLive ? 'Critical CVEs' : 'Exposed Assets'}
                </span>
                <span style={{ fontSize: '0.62rem', color: '#64748b', lineHeight: 1.2 }}>
                  {hasLive ? 'Active KEV-listed findings' : 'Threat intel correlated'}
                </span>
              </div>

              {/* Box 4: Cleared / SLA-compliant */}
              <div className="cockpit-funnel-metric">
                <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#10b981', fontFamily: 'monospace', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {clearedVal}
                </span>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>
                  {hasLive ? 'SLA Compliant' : 'Cleared Gates'}
                </span>
                <span style={{ fontSize: '0.62rem', color: '#64748b', lineHeight: 1.2 }}>
                  {hasLive ? `${live!.slaCompliance}% within deadline` : 'Auto-cleared deployments'}
                </span>
              </div>

            </div>
          </div>

          {/* Enterprise GRC Checklist */}
          <div style={{ marginTop: '0.75rem' }}>
            <div className="cockpit-gate-label">Enterprise GRC Checkpoint Features</div>

            {[
              { name: 'Executive Flight Deck', desc: 'Real-time posture gauges configured for immediate CISO board reporting metrics.' },
              { name: 'Clearance Audit Trails', desc: 'Automated gate proof-logs proving security compliance posture to external regulatory auditors.' },
            ].map((item, idx) => (
              <div key={idx} className="cockpit-feature-item-box"
                style={{
                  background: isEnterpriseMode ? undefined : '#f8fafc',
                  border: isEnterpriseMode ? undefined : '1px solid #cbd5e1',
                  marginBottom: idx === 1 ? 0 : undefined,
                }}>
                <div style={{
                  background: isEnterpriseMode ? '#10b981' : '#64748b',
                  borderRadius: '50%', padding: '3px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '2px',
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.name}
                    <span style={{
                      fontSize: '0.58rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px',
                      background: isEnterpriseMode ? '#dcfce7' : '#e2e8f0',
                      color: isEnterpriseMode ? '#15803d' : '#64748b',
                    }}>
                      {isEnterpriseMode ? 'ACTIVE' : 'ENTERPRISE PLAN ONLY'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.08rem', lineHeight: 1.2 }}>
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
