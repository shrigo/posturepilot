'use client';
import { useRouter } from 'next/navigation';
import { 
  postureData, 
  cloudData, 
  networkData, 
  infosecData, 
  kpiData, 
  appsecData, 
  serverData, 
  aiRiskData 
} from '@/data/mockData';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

export default function OverviewPage() {
  const router = useRouter();

  // 1. Posture Score Half-Donut Data
  const postureScoreData = [
    { name: 'Secure Score', value: postureData.score, fill: 'url(#postureGradient)' },
    { name: 'Risk Delta', value: 100 - postureData.score, fill: '#e2e8f0' }
  ];

  // 2. Vulnerability Severity Donut Data
  const totalFindings = appsecData.critical + appsecData.high + appsecData.medium + appsecData.low;
  const severityDonutData = [
    { name: 'Critical', value: appsecData.critical, fill: '#dc2626' },
    { name: 'High', value: appsecData.high, fill: '#ea580c' },
    { name: 'Medium', value: appsecData.medium, fill: '#d97706' },
    { name: 'Low', value: appsecData.low, fill: '#16a34a' }
  ];

  // 3. Multi-Color Category Compliance Bar Data
  const categoryComplianceData = [
    { name: 'Cloud Security', score: cloudData.complianceScore, fill: '#0891b2', label: 'CIS Benchmark' },
    { name: 'Network Firewall', score: Math.round(networkData.firewallEvents.blockRate), fill: '#7c3aed', label: 'Packet Blocks' },
    { name: 'Compliance Audits', score: infosecData.overallCompliance, fill: '#059669', label: 'Framework Controls' },
    { name: 'KPI SLA SLA', score: kpiData.patchSla, fill: '#d97706', label: 'Ticket Remediation' },
    { name: 'Server Health', score: Math.round((serverData.healthy / serverData.totalServers) * 100), fill: '#16a34a', label: 'Host Availability' }
  ];

  const modules = [
    { 
      href: '/dashboard/posture', 
      icon: '🛡️', 
      label: 'Cyber Posture', 
      color: '#3b82f6', 
      stat: `${postureData.score}/100`, 
      sub: `${postureData.openCriticals} critical open`, 
      bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)',
      progress: postureData.score
    },
    { 
      href: '/dashboard/cloud', 
      icon: '☁️', 
      label: 'Cloud Security', 
      color: '#0891b2', 
 stat: `${cloudData.misconfiguredAssets} misconfigs`, 
      sub: `${cloudData.totalAssets} assets`, 
      bg: 'linear-gradient(135deg,#ecfeff,#cffafe)',
      progress: cloudData.complianceScore
    },
    { 
      href: '/dashboard/network', 
      icon: '🌐', 
      label: 'Network Security', 
      color: '#7c3aed', 
      stat: `${networkData.idsAlerts.today} IDS alerts`, 
      sub: `${networkData.firewallEvents.blockRate}% blocked`, 
      bg: 'linear-gradient(135deg,#faf5ff,#ede9fe)',
      progress: Math.round(networkData.firewallEvents.blockRate)
    },
    { 
      href: '/dashboard/infosec', 
      icon: '📋', 
      label: 'Info Security', 
      color: '#059669', 
      stat: `${infosecData.overallCompliance}% compliance`, 
      sub: '5 frameworks tracked', 
      bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
      progress: infosecData.overallCompliance
    },
    { 
      href: '/dashboard/kpi', 
      icon: '📊', 
      label: 'Security KPIs', 
      color: '#d97706', 
      stat: `Score ${kpiData.overallScore}`, 
      sub: `MTTA ${kpiData.mtta}m · MTTR ${kpiData.mttr}h`, 
      bg: 'linear-gradient(135deg,#fffbeb,#fef3c7)',
      progress: kpiData.patchSla
    },
    { 
      href: '/dashboard/appsec', 
      icon: '🔐', 
      label: 'App Security', 
      color: '#dc2626', 
      stat: `${appsecData.critical} Critical`, 
      sub: `${appsecData.totalFindings} total findings`, 
      bg: 'linear-gradient(135deg,#fef2f2,#fecaca)',
      progress: Math.max(10, 100 - Math.round((appsecData.critical / appsecData.totalFindings) * 1000))
    },
    { 
      href: '/dashboard/traffic', 
      icon: '📡', 
      label: 'Traffic Monitor', 
      color: '#0891b2', 
      stat: `12.4 Gbps`, 
      sub: '7 anomalies detected', 
      bg: 'linear-gradient(135deg,#f0f9ff,#bae6fd)',
      progress: 88
    },
    { 
      href: '/dashboard/server', 
      icon: '🖥️', 
      label: 'Server Health', 
      color: '#7c3aed', 
      stat: `${serverData.healthy}/${serverData.totalServers} Healthy`, 
      sub: `${serverData.critical} critical`, 
      bg: 'linear-gradient(135deg,#fdf4ff,#f3e8ff)',
      progress: Math.round((serverData.healthy / serverData.totalServers) * 100)
    },
    { 
      href: '/dashboard/ai-risk', 
      icon: '🤖', 
      label: 'AI Risk', 
      color: '#ea580c', 
      stat: `Risk: ${aiRiskData.riskLevel}`, 
      sub: `${aiRiskData.shadowAiToolsDetected} shadow tools`, 
      bg: 'linear-gradient(135deg,#fff7ed,#fed7aa)',
      progress: 68
    },
  ];

  return (
    <>
      <div className="page-content animate-in">

        {/* Sleek, Space-Saving Overall Posture KPI & Client Command HUD (Reduced height, matching Topbar, no standalone alert space killer needed!) */}
        <div style={{ 
          background: 'linear-gradient(135deg, #0f172a, #1e293b)', 
          borderRadius: 14, 
          padding: '0.625rem 1.5rem', 
          marginBottom: '1.25rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '1rem',
          border: '1px solid rgba(255,255,255,0.08)', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          minHeight: '74px'
        }}>
          {/* Left: Acme Client & Overall Posture Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Pulsing Command Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <span className="hud-pulse" style={{ background: '#3b82f6', width: 8, height: 8, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                  Acme Financial Corp
                </div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>
                  Telemetry Sync Active ●
                </div>
              </div>
            </div>
            
            {/* Sleek vertical divider */}
            <div style={{ width: 1, height: 26, background: 'rgba(255,255,255,0.12)' }} />

            {/* Score HUD Display */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginRight: 4 }}>Posture Level:</span>
                <span style={{ fontSize: '1.375rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>74</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>/100</span>
                <span style={{ fontSize: '0.65rem', color: '#ea580c', background: 'rgba(234,88,12,0.15)', border: '1px solid rgba(234,88,12,0.3)', borderRadius: 4, padding: '1px 6px', marginLeft: 8, fontWeight: 800 }}>
                  Elevated Risk
                </span>
              </div>
            </div>
          </div>

          {/* Right: Sleek Interactive HUD Cards (Taller, highly prominent metric boxes!) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
            {[
              { 
                label: 'Criticals', 
                value: '14', 
                color: '#dc2626', 
                bg: 'rgba(220,38,38,0.12)', 
                border: 'rgba(220,38,38,0.25)',
                svg: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 4px rgba(220,38,38,0.4))' }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <circle cx="12" cy="11" r="2.5" fill="#dc2626">
                      <animate attributeName="r" values="1.5;3;1.5" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                )
              },
              { 
                label: 'Threats', 
                value: '3',  
                color: '#ea580c', 
                bg: 'rgba(234,88,12,0.12)', 
                border: 'rgba(234,88,12,0.25)',
                svg: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 4px rgba(234,88,12,0.4))' }}>
                    <circle cx="12" cy="12" r="9" strokeDasharray="2 2" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                )
              },
              { 
                label: 'Backlog',  
                value: '234', 
                color: '#d97706', 
                bg: 'rgba(217,119,6,0.12)', 
                border: 'rgba(217,119,6,0.25)',
                svg: (
                  <svg width="22" height="22" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#334155" strokeWidth="4.5" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#d97706" strokeWidth="4.5" strokeDasharray="100" strokeDashoffset="16" transform="rotate(-90 18 18)" style={{ filter: 'drop-shadow(0 0 3px rgba(217,119,6,0.5))' }} />
                  </svg>
                )
              },
              { 
                label: 'Assets', 
                value: '1,247', 
                color: '#3b82f6', 
                bg: 'rgba(59,130,246,0.12)', 
                border: 'rgba(59,130,246,0.25)',
                svg: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.4))' }}>
                    <rect x="3" y="3" width="6" height="6" rx="1" />
                    <rect x="15" y="3" width="6" height="6" rx="1" />
                    <rect x="3" y="15" width="6" height="6" rx="1" />
                    <rect x="15" y="15" width="6" height="6" rx="1" />
                  </svg>
                )
              },
            ].map(s => (
              <div 
                key={s.label} 
                style={{ 
                  background: s.bg, 
                  border: `1px solid ${s.border}`, 
                  borderRadius: 10, 
                  padding: '0.5rem 0.85rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  minHeight: '44px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{s.svg}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>{s.value}</span>
                  <span style={{ fontSize: '0.6rem', color: s.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VISUAL COCKPIT ROW: DONUTS, HALF DONUTS & MULTI COLOR BAR CHARTS */}
        {/* ========================================================================= */}
        <div className="grid-3">

          {/* 1. HALF-DONUT POSTURE SCORE GAUGE */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '280px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.25rem' }}>
            <div className="card-title" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
              🛡️ Posture Score Gauge
            </div>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="postureGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="50%" stopColor="#eab308" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={postureScoreData}
                    cx="50%"
                    cy="80%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={72}
                    outerRadius={96}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {postureScoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Stat Overlay */}
              <div style={{ position: 'absolute', bottom: '18%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
                  {postureData.score}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>
                  Overall Posture
                </div>
                <div style={{ fontSize: '0.65rem', color: '#ea580c', fontWeight: 800, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 4, padding: '1px 6px', display: 'inline-block', marginTop: 4 }}>
                  GRADE: {postureData.grade}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
              <span>🚨 Critical: 0</span>
              <span>⚠️ Warning: 50</span>
              <span>🟢 Secure: 100</span>
            </div>
          </div>

          {/* 2. FULL DONUT VULNERABILITY SEVERITY CHART */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '280px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.25rem' }}>
            <div className="card-title" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
              🍩 Severity Findings Breakdown
            </div>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={92}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {severityDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0', padding: '6px 10px' }}
                    formatter={(value: any, name: any) => [`${value} open findings`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Central Count Overlay */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{totalFindings}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: 2 }}>Open Findings</div>
              </div>
            </div>

            {/* Custom Interactive Color Legend Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.65rem', fontWeight: 700, borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
              <div style={{ color: '#dc2626' }}>🔴 Critical ({appsecData.critical})</div>
              <div style={{ color: '#ea580c' }}>🟠 High ({appsecData.high})</div>
              <div style={{ color: '#d97706' }}>🟡 Med ({appsecData.medium})</div>
              <div style={{ color: '#16a34a' }}>🟢 Low ({appsecData.low})</div>
            </div>
          </div>

          {/* 3. MULTI-COLOR CATEGORY COMPLIANCE BAR CHART */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '280px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.25rem' }}>
            <div className="card-title" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
              📊 Category Compliance Scores
            </div>
            <div style={{ flex: 1, paddingTop: '0.5rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryComplianceData} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#475569', fontWeight: 700 }} width={90} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
                    formatter={(value: any, name: any, props: any) => [`${value}% Compliance`, props.payload.label]}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={12}>
                    {categoryComplianceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem', marginTop: 4 }}>
              Comparing controls coverage across different functional layers.
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RESPONSIVE MODULE GRID */}
        {/* ========================================================================= */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          ⚡ Security Control Modules <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#eef2ff', color: '#4f46e5' }}>9 active layers</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {modules.map(m => (
            <div 
              key={m.href} 
              className="overview-module-card animate-in" 
              onClick={() => router.push(m.href)} 
              style={{ 
                background: m.bg, 
                border: `1px solid ${m.color}22`,
                position: 'relative',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '160px'
              }}
            >
              {/* Card Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '1.625rem' }}>{m.icon}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: m.color, background: `${m.color}15`, border: `1px solid ${m.color}30`, borderRadius: 20, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {m.label}
                  </div>
                </div>

                {/* Stat Display */}
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  {m.stat}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '1px' }}>
                  {m.sub}
                </div>
              </div>

              {/* Miniature Interactive Vector Progress Ring / Bar */}
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', fontWeight: 700, color: m.color, marginBottom: 2 }}>
                  <span>Security Health</span>
                  <span>{m.progress}%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.6)', borderRadius: 99, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <div style={{ height: '100%', width: `${m.progress}%`, background: m.color, borderRadius: 99, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
