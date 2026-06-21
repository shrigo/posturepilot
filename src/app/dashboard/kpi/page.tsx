'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { kpiData } from '@/data/mockData';
import { useClient } from '@/context/ClientContext';
import Link from 'next/link';
import ModuleCockpitCard, { ModuleCockpitConfig, ModuleLiveData } from '@/components/ModuleCockpitCard';

const kpiCockpitConfig: ModuleCockpitConfig = {
  title: 'Flight Telemetry KPIs',
  badge: 'Module 12',
  apiEndpoint: '/api/findings/kpi',
  rings: [
    { label: 'SLA%', color: '#10b981', glowColor: 'rgba(16,185,129,0.35)' },
    { label: 'MTTA%', color: '#a78bfa', glowColor: 'rgba(167,139,250,0.35)' },
    { label: 'MTTR%', color: '#3b82f6', glowColor: 'rgba(59,130,246,0.35)' },
  ],
  indexLabel: 'TELEMETRY',
  funnel: [
    { label: 'SLA Targets Set', sublabel: 'Total compliance SLA targets mapped', color: '#7c3aed' },
    { label: 'MTTA Measured', sublabel: 'Mean time to acknowledge tickets', color: '#ef4444' },
    { label: 'MTTR Benchmarked', sublabel: 'Mean time to remediate tickets', color: '#ea580c' },
    { label: 'Autopilot Triggers', sublabel: 'Autopilot threat loop resolutions triggered', color: '#10b981' },
  ],
  gates: ['SLA DIAL', 'MTTA TRACK', 'MTTR LOOP'],
  syncLabel: 'Active KPI Metrics',
  checklist: [
    { name: 'MTTR Response Loop', desc: 'Optimize incident response and resolution time SLAs.' },
    { name: 'Autopilot Policies', desc: 'Configure automatic resolution logic for low-risk alerts.' },
  ],
};

interface LiveData {
  hasLiveData: boolean; total: number; critical: number; high: number;
  slaBreached: number; open: number; closed: number;
  remediationRate: number; riskScore: number; slaCompliance: number; avgCvss: string;
  bySeverity: Record<string,number>; byTool: Record<string,number>;
}

export default function KpiPage() {
  const { currentClient } = useClient();
  const [live, setLive] = useState<LiveData | null>(null);

  useEffect(() => {
    fetch('/api/findings/kpi').then(r => r.json())
      .then(d => { if (d.hasLiveData) setLive(d); else setLive(null); }).catch(() => {});
  }, [currentClient.key]);

  const sevChart: any[] = live
    ? Object.entries(live.bySeverity).map(([name, value]) => ({ name, value }))
    : kpiData.monthlyKpis;

  // Resolve dynamic CISO metrics based on active client key
  const totalFindings = live ? live.total : (currentClient.key === 'UR' ? 3842 : 1247);
  const activeRiskScore = live ? live.riskScore : currentClient.score;
  const activeSlaCompliance = live ? live.slaCompliance : (currentClient.key === 'UR' ? 89 : 71);
  const activeRemediationRate = live ? live.remediationRate : (currentClient.key === 'UR' ? 82 : 68);
  const activeAvgCvss = live ? live.avgCvss : (currentClient.key === 'UR' ? '4.5' : '8.2');

  const criticalCount = live ? live.critical : (currentClient.key === 'UR' ? 4 : 14);
  const highCount = live ? live.high : (currentClient.key === 'UR' ? 18 : 64);
  const closedCount = live ? live.closed : (currentClient.key === 'UR' ? 212 : 92);
  const openCount = live ? live.open : (currentClient.key === 'UR' ? 48 : 142);
  const breachedCount = live ? live.slaBreached : (currentClient.key === 'UR' ? 1 : 17);

  return (
    <>
      <div className="page-content animate-in">

        {/* Dynamic CISO Executive KPI Sticky Banner */}
        <div className="sticky-alert-banner">
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', boxShadow: '0 0 8px #7c3aed' }} />
            <div>
              <div style={{ fontWeight:800, color:'#6d28d9', fontSize:'0.9rem' }}>
                Executive Security KPIs & SLA Dashboard — {currentClient.name}
              </div>
              <div style={{ fontSize:'0.75rem', color:'#7c3aed', fontWeight: 600 }}>
                Risk Level: <span style={{ fontWeight: 800 }}>{activeRiskScore}/100</span> · Framework SLA Compliance: <span style={{ fontWeight: 800 }}>{activeSlaCompliance}%</span> · Ticket Remediation: <span style={{ fontWeight: 800 }}>{activeRemediationRate}%</span> · Total Active Findings: {totalFindings.toLocaleString()}
              </div>
            </div>
          </div>
          <Link href="/dashboard/findings?tool=kpi" style={{ fontSize:'0.78rem', fontWeight:700, color:'#7c3aed', textDecoration:'none', border:'1px solid #c084fc', padding:'0.375rem 0.875rem', borderRadius:8, background: 'rgba(255, 255, 255, 0.4)' }}>
            View All GRC Findings →
          </Link>
        </div>

        <div className="grid-4">
          {[
            { label:'Risk Score',       value: `${activeRiskScore}`,            suffix: '/100',  accent:'#3b82f6', delta: 'Unified Tenant Score', target: `${criticalCount} critical · ${highCount} high` },
            { label:'SLA Compliance',   value: `${activeSlaCompliance}%`,       suffix:'', accent:'#059669', delta: `${breachedCount} breached tickets`, target: 'Target: 95% threshold' },
            { label:'Remediation Rate', value: `${activeRemediationRate}%`,     suffix:'', accent:'#7c3aed', delta: `${closedCount} tickets closed`,  target: `${openCount} still open` },
            { label:'Avg CVSS',         value: activeAvgCvss,                   suffix: '',       accent:'#d97706', delta: 'Weighted critical severity', target: `${totalFindings} total findings` },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.accent }}>{s.value}{s.suffix}</div>
              <div className="stat-delta delta-down">{s.delta}</div>
              <div style={{ fontSize:'0.68rem', color:'#94a3b8', marginTop:'0.25rem' }}>{s.target}</div>
            </div>
          ))}
        </div>

        {/* Cockpit telemetry card */}
        <ModuleCockpitCard config={kpiCockpitConfig} live={live as any} />

        <div className="card" style={{ marginBottom:'1.25rem' }}>
          <div className="card-title">{live ? '📊 Findings by Severity (Live)' : '📈 KPI Trend (6 months)'}</div>
          {live ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sevChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="value" name="Count" fill="#4f46e5" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div>
                <div style={{ fontSize:'0.72rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase', marginBottom:'0.5rem' }}>MTTA (min)</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={kpiData.monthlyKpis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Bar dataKey="mtta" name="MTTA" fill="#3b82f6" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div style={{ fontSize:'0.72rem', fontWeight:700, color:'#94a3b8', textTransform:'uppercase', marginBottom:'0.5rem' }}>Patch SLA %</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={kpiData.monthlyKpis}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Bar dataKey="patchSla" name="Patch SLA" fill="#059669" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {!live && (
          <div className="card">
            <div className="card-title">👥 Team Performance</div>
            <table className="data-table">
              <thead><tr><th>Team</th><th>Assigned</th><th>Resolved</th><th>SLA %</th><th>Avg MTTR</th><th>Status</th></tr></thead>
              <tbody>
                {kpiData.byTeam.map(t => (
                  <tr key={t.team}>
                    <td style={{ fontWeight:600, color:'#0f172a' }}>{t.team}</td>
                    <td>{t.assigned}</td>
                    <td>{t.resolved}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                        <div className="progress-bar-wrap" style={{ flex:1, height:6 }}>
                          <div className="progress-bar-fill" style={{ width:`${t.slaCompliance}%`, background: t.slaCompliance >= 90 ? '#16a34a' : t.slaCompliance >= 80 ? '#d97706' : '#dc2626' }} />
                        </div>
                        <span style={{ fontWeight:700, fontSize:'0.78rem', color: t.slaCompliance >= 90 ? '#16a34a' : '#d97706' }}>{t.slaCompliance}%</span>
                      </div>
                    </td>
                    <td style={{ fontWeight:600 }}>{t.avgMttr}h</td>
                    <td><span className={`badge badge-${t.slaCompliance >= 90 ? 'low' : t.slaCompliance >= 80 ? 'medium' : 'critical'}`}>{t.slaCompliance >= 90 ? 'On Track' : t.slaCompliance >= 80 ? 'Watch' : 'At Risk'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {live && (
          <div className="card">
            <div className="card-title">🔢 Severity Breakdown (Live)</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {Object.entries(live.bySeverity).map(([sev, count]) => {
                const colors: Record<string,string> = { Critical:'#dc2626', High:'#ea580c', Medium:'#d97706', Low:'#16a34a', Info:'#3b82f6' };
                const pct = Math.round((count / live.total) * 100);
                return (
                  <div key={sev} style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                    <span className={`badge badge-${sev.toLowerCase()}`}>{sev}</span>
                    <div style={{ flex:1 }}>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar-fill" style={{ width:`${pct}%`, background: colors[sev] || '#64748b' }} />
                      </div>
                    </div>
                    <span style={{ fontWeight:700, fontSize:'0.85rem', color: colors[sev], width:40, textAlign:'right' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
