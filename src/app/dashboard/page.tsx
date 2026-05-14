'use client';
import { useRouter } from 'next/navigation';
import { postureData, cloudData, networkData, kpiData, appsecData, serverData, aiRiskData } from '@/data/mockData';
import Topbar from '@/components/Topbar';

const modules = [
  { href: '/dashboard/posture', icon: '🛡️', label: 'Cyber Posture',     color: '#3b82f6', stat: `${postureData.score}/100`,     sub: `${postureData.openCriticals} critical open`,   bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)' },
  { href: '/dashboard/cloud',   icon: '☁️', label: 'Cloud Security',    color: '#0891b2', stat: `${cloudData.misconfiguredAssets} misconfigs`,  sub: `${cloudData.totalAssets} assets`,              bg: 'linear-gradient(135deg,#ecfeff,#cffafe)' },
  { href: '/dashboard/network', icon: '🌐', label: 'Network Security',  color: '#7c3aed', stat: `${networkData.idsAlerts.today} IDS alerts`,   sub: `${networkData.firewallEvents.blockRate}% blocked`,bg: 'linear-gradient(135deg,#faf5ff,#ede9fe)' },
  { href: '/dashboard/infosec', icon: '📋', label: 'Info Security',     color: '#059669', stat: `${73}% compliance`,              sub: '5 frameworks tracked',                         bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)' },
  { href: '/dashboard/kpi',     icon: '📊', label: 'Security KPIs',     color: '#d97706', stat: `Score ${kpiData.overallScore}`,  sub: `MTTA ${kpiData.mtta}m · MTTR ${kpiData.mttr}h`,bg: 'linear-gradient(135deg,#fffbeb,#fef3c7)' },
  { href: '/dashboard/appsec',  icon: '🔐', label: 'App Security',      color: '#dc2626', stat: `${appsecData.critical} Critical`, sub: `${appsecData.totalFindings} total findings`,  bg: 'linear-gradient(135deg,#fef2f2,#fecaca)' },
  { href: '/dashboard/traffic', icon: '📡', label: 'Traffic Monitor',   color: '#0891b2', stat: `12.4 Gbps`,                      sub: '7 anomalies detected',                         bg: 'linear-gradient(135deg,#f0f9ff,#bae6fd)' },
  { href: '/dashboard/server',  icon: '🖥️', label: 'Server Health',    color: '#7c3aed', stat: `${serverData.healthy}/${serverData.totalServers} Healthy`, sub: `${serverData.critical} critical`,   bg: 'linear-gradient(135deg,#fdf4ff,#f3e8ff)' },
  { href: '/dashboard/ai-risk', icon: '🤖', label: 'AI Risk',           color: '#ea580c', stat: `Risk: ${aiRiskData.riskLevel}`,  sub: `${aiRiskData.shadowAiToolsDetected} shadow tools`,bg: 'linear-gradient(135deg,#fff7ed,#fed7aa)' },
];

export default function OverviewPage() {
  const router = useRouter();
  return (
    <>
      <Topbar title="Command Center" subtitle="All dashboards · Acme Financial Corp" />
      <div className="page-content animate-in">
        {/* Banner */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', borderRadius: 16, padding: '1.5rem 2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #1e3a5f' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Overall Security Posture</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.04em', lineHeight: 1 }}>74 <span style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8' }}>/ 100</span></div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.375rem' }}>↓ 3 pts from last month · <span style={{ color: '#f59e0b' }}>Elevated risk</span></div>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[
              { label: 'Open Criticals', value: '14', color: '#dc2626' },
              { label: 'Active Threats', value: '3',  color: '#ea580c' },
              { label: 'Patch Backlog',  value: '234', color: '#d97706' },
              { label: 'Assets',         value: '1,247', color: '#3b82f6' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.625rem', fontWeight: 800, color: s.color, letterSpacing: '-0.03em' }}>{s.value}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Module grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {modules.map(m => (
            <div key={m.href} className="overview-module-card" onClick={() => router.push(m.href)} style={{ background: m.bg, border: `1px solid ${m.color}22` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '1.75rem' }}>{m.icon}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: m.color, background: `${m.color}18`, border: `1px solid ${m.color}33`, borderRadius: 20, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {m.label}
                </div>
              </div>
              <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '0.2rem' }}>{m.stat}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.sub}</div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: m.color, fontWeight: 600 }}>View dashboard →</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
