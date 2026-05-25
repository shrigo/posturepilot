'use client';
import { useRouter } from 'next/navigation';
import { useClient } from '@/context/ClientContext';
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
  const { currentClient } = useClient();

  // 1. Posture Score Half-Donut Data (Dynamically loaded based on selected client context)
  const postureScoreData = [
    { name: 'Secure Score', value: currentClient.score, fill: 'url(#postureGradient)' },
    { name: 'Risk Delta', value: 100 - currentClient.score, fill: '#e2e8f0' }
  ];

  // 2. Vulnerability Severity Donut Data (Dynamic based on selected client context)
  const severityDonutData = currentClient.key === 'UR' ? [
    { name: 'Critical', value: 4, fill: '#dc2626' },
    { name: 'High', value: 8, fill: '#ea580c' },
    { name: 'Medium', value: 26, fill: '#d97706' },
    { name: 'Low', value: 54, fill: '#16a34a' }
  ] : [
    { name: 'Critical', value: appsecData.critical, fill: '#dc2626' },
    { name: 'High', value: appsecData.high, fill: '#ea580c' },
    { name: 'Medium', value: appsecData.medium, fill: '#d97706' },
    { name: 'Low', value: appsecData.low, fill: '#16a34a' }
  ];

  const totalFindings = severityDonutData.reduce((acc, curr) => acc + curr.value, 0);

  // 3. Multi-Color Category Compliance Bar Data (Dynamically loads compliance or block rates based on selected client)
  const categoryComplianceData = [
    { name: 'Cloud Security', score: currentClient.key === 'UR' ? 92 : cloudData.complianceScore, fill: '#0891b2', label: 'CIS Benchmark' },
    { name: 'Network Firewall', score: currentClient.key === 'UR' ? 96 : Math.round(networkData.firewallEvents.blockRate), fill: '#7c3aed', label: 'Packet Blocks' },
    { name: 'Compliance Audits', score: currentClient.key === 'UR' ? 89 : 71, fill: '#059669', label: 'Framework Controls' },
    { name: 'Identity & Access', score: currentClient.key === 'UR' ? 87 : 64, fill: '#a855f7', label: 'Zero Trust (IAM)' },
    { name: 'KPI SLA SLA', score: currentClient.key === 'UR' ? 94 : kpiData.patchSla, fill: '#d97706', label: 'Ticket Remediation' },
    { name: 'Server Health', score: currentClient.key === 'UR' ? 99 : Math.round((serverData.healthy / serverData.totalServers) * 100), fill: '#16a34a', label: 'Host Availability' }
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
      label: 'Governance & Compliance', 
      color: '#059669', 
      stat: `${currentClient.key === 'UR' ? 89 : 71}% compliance`, 
      sub: '5 frameworks tracked', 
      bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
      progress: currentClient.key === 'UR' ? 89 : 71
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
    { 
      href: '/dashboard/identity', 
      icon: '🔑', 
      label: 'Identity & Access', 
      color: '#a855f7', 
      stat: `${currentClient.key === 'UR' ? 87 : 64}% ZT Score`, 
      sub: `${currentClient.key === 'UR' ? 'Microsoft Entra ID' : 'Okta SSO Directory'}`, 
      bg: 'linear-gradient(135deg,#fcf8ff,#f3e8ff)',
      progress: currentClient.key === 'UR' ? 87 : 64
    }
  ];

  return (
    <>
      <div className="page-content animate-in">

        {/* Sleek, Space-Saving Overall Posture KPI & Client Command HUD (Reduced height, matching Topbar, no standalone alert space killer needed!) */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: 14, 
          padding: '0.625rem 1.5rem', 
          marginBottom: '1.25rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '1rem',
          border: '1px solid #e2e8f0', 
          boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
          minHeight: '74px'
        }}>
          {/* Left: Client & Overall Posture Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Pulsing Command Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <span 
                className="hud-pulse" 
                style={{ 
                  background: currentClient.key === 'UR' ? '#10b981' : '#3b82f6', 
                  width: 8, 
                  height: 8, 
                  flexShrink: 0 
                }} 
              />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                  {currentClient.name}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 600 }}>
                  Telemetry Sync Active ●
                </div>
              </div>
            </div>
            
            {/* Sleek vertical divider */}
            <div style={{ width: 1, height: 26, background: '#e2e8f0' }} />

            {/* Score HUD Display */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginRight: 4 }}>Posture Level:</span>
                <span style={{ fontSize: '1.375rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{currentClient.score}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>/100</span>
                <span style={{ 
                  fontSize: '0.65rem', 
                  color: currentClient.key === 'UR' ? '#16a34a' : '#ea580c', 
                  background: currentClient.key === 'UR' ? 'rgba(22,163,74,0.15)' : 'rgba(234,88,12,0.15)', 
                  border: currentClient.key === 'UR' ? '1px solid rgba(22,163,74,0.3)' : '1px solid rgba(234,88,12,0.3)', 
                  borderRadius: 4, 
                  padding: '1px 6px', 
                  marginLeft: 8, 
                  fontWeight: 800 
                }}>
                  {currentClient.key === 'UR' ? 'Secure Posture' : 'Elevated Risk'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Sleek Interactive HUD Cards (Taller, highly prominent board-level CISO KPIs!) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
            {[
              { 
                label: 'MTTR Speed', 
                value: currentClient.key === 'UR' ? '3.0 hrs' : '6.5 hrs', 
                color: '#7c3aed', 
                bg: 'rgba(124,58,237,0.12)', 
                border: 'rgba(124,58,237,0.25)',
                svg: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 4px rgba(124,58,237,0.4))' }}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                )
              },
              { 
                label: 'Exposure Index', 
                value: currentClient.key === 'UR' ? '4 CVEs' : '14 CVEs', 
                color: '#dc2626', 
                bg: 'rgba(220,38,38,0.12)', 
                border: 'rgba(220,38,38,0.25)',
                svg: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 4px rgba(220,38,38,0.4))' }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                )
              },
              { 
                label: 'GRC Conformance',  
                value: currentClient.key === 'UR' ? '89%' : '71%', 
                color: '#10b981', 
                bg: 'rgba(16,185,129,0.12)', 
                border: 'rgba(16,185,129,0.25)',
                svg: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.4))' }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <polyline points="9 15 11 17 15 13" />
                  </svg>
                )
              },
              { 
                label: 'Human Risk', 
                value: currentClient.key === 'UR' ? 'Low' : 'Med-High', 
                color: '#ea580c', 
                bg: 'rgba(234,88,12,0.12)', 
                border: 'rgba(234,88,12,0.25)',
                svg: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 4px rgba(234,88,12,0.4))' }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
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
                  <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{s.value}</span>
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
                <PieChart key={currentClient.key}>
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
                    innerRadius={56}
                    outerRadius={76}
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
              <div style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.375rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
                  {currentClient.score}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: 3 }}>
                  Overall Posture
                </div>
                <div style={{ fontSize: '0.62rem', color: '#ea580c', fontWeight: 800, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 4, padding: '1px 6px', display: 'inline-block', marginTop: 3 }}>
                  GRADE: {currentClient.grade}
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
                <PieChart key={currentClient.key}>
                  <Pie
                    data={severityDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={76}
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
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{totalFindings}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: 2 }}>Open Findings</div>
              </div>
            </div>

            {/* Custom Interactive Color Legend Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.65rem', fontWeight: 700, borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
              <div style={{ color: '#dc2626' }}>🔴 Critical ({severityDonutData[0].value})</div>
              <div style={{ color: '#ea580c' }}>🟠 High ({severityDonutData[1].value})</div>
              <div style={{ color: '#d97706' }}>🟡 Med ({severityDonutData[2].value})</div>
              <div style={{ color: '#16a34a' }}>🟢 Low ({severityDonutData[3].value})</div>
            </div>
          </div>

          {/* 3. MULTI-COLOR CATEGORY COMPLIANCE BAR CHART */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '280px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.25rem' }}>
            <div className="card-title" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
              📊 Category Compliance Scores
            </div>
            <div style={{ flex: 1, paddingTop: '0.5rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart key={currentClient.key} data={categoryComplianceData} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
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
        {/* ZERO TRUST IAM & GRC COMPLIANCE DEEP-DIVE TELEMETRY */}
        {/* ========================================================================= */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#475569', marginBottom: '0.75rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          📊 Executive Zero Trust & GRC Framework Analytics <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#f5f3ff', color: '#7c3aed' }}>Live Aggregates</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          
          {/* LEFT COLUMN: GRC COMPLIANCE FRAMEWORK COVERAGE */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>📋 GRC Framework Audit Progress</span>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, background: '#ecfdf5', color: '#10b981', padding: '2px 6px', borderRadius: 10 }}>Framework Checklists</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'center' }}>
              {[
                { name: 'SOC 2 Type II Compliance', pct: currentClient.key === 'UR' ? 89 : 71, color: '#10b981' },
                { name: 'ISO 27001:2022 Security Rule', pct: currentClient.key === 'UR' ? 85 : 64, color: '#3b82f6' },
                { name: 'PCI-DSS v4.0 Credit Standards', pct: currentClient.key === 'UR' ? 95 : 78, color: '#7c3aed' },
                { name: 'HIPAA Privacy Safeguards', pct: currentClient.key === 'UR' ? 88 : 68, color: '#06b6d4' },
                { name: 'NIST Cyber Security Framework', pct: currentClient.key === 'UR' ? 90 : 70, color: '#ea580c' },
                { name: 'GDPR Data Privacy Directive', pct: currentClient.key === 'UR' ? 92 : 75, color: '#ec4899' }
              ].map(f => (
                <div key={f.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: 3 }}>
                    <span>{f.name}</span>
                    <span style={{ color: f.color }}>{f.pct}%</span>
                  </div>
                  <div className="progress-bar-wrap" style={{ height: 6, background: '#f1f5f9' }}>
                    <div className="progress-bar-fill" style={{ width: `${f.pct}%`, background: f.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: ZERO TRUST (IAM) DIRECTORY ANALYTICS */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>🔑 Identity & Access (Zero Trust) Posture</span>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, background: '#f5f3ff', color: '#7c3aed', padding: '2px 6px', borderRadius: 10 }}>
                {currentClient.key === 'UR' ? 'Microsoft Entra ID' : 'Okta SSO Directory'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1rem', flex: 1, alignItems: 'center' }}>
              {/* Circular MFA Progress Dial */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #f1f5f9', paddingRight: '1rem' }}>
                <div style={{ position: 'relative', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="45" cy="45" r="36" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                    <circle 
                      cx="45" cy="45" r="36" 
                      stroke="#7c3aed" 
                      strokeWidth="6" 
                      fill="transparent" 
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - (currentClient.key === 'UR' ? 98.2 : 85.6) / 100)}`}
                      style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#7c3aed', letterSpacing: '-0.04em' }}>
                      {currentClient.key === 'UR' ? '98.2%' : '85.6%'}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748b', marginTop: 6, textTransform: 'uppercase', textAlign: 'center' }}>MFA Coverage</div>
              </div>

              {/* Identity Telemetry Indicators */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {[
                  { label: 'Active SSO Users', value: currentClient.key === 'UR' ? 478 : 312, icon: '👥', color: '#38bdf8' },
                  { label: 'Privileged Admins', value: currentClient.key === 'UR' ? 12 : 28, icon: '👑', color: '#fca5a5' },
                  { label: 'API Keys Stale (>90d)', value: currentClient.key === 'UR' ? 2 : 17, icon: '🔑', color: '#fbbf24' },
                  { label: 'SSO Travel Spikes', value: currentClient.key === 'UR' ? 2 : 3, icon: '🚨', color: '#f87171' }
                ].map(item => (
                  <div key={item.label} style={{ padding: '0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.58rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      <span>{item.icon}</span>
                      <span>{item.label.split(' ')[0]}</span>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginTop: 2 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RESPONSIVE MODULE GRID */}
        {/* ========================================================================= */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#475569', marginBottom: '0.75rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          ⚡ Security Control Modules <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#eef2ff', color: '#4f46e5' }}>10 active layers</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
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
