'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { kpiData } from '@/data/mockData';
import Topbar from '@/components/Topbar';
import Link from 'next/link';

interface LiveData {
  hasLiveData: boolean; total: number; critical: number; high: number;
  slaBreached: number; open: number; closed: number;
  remediationRate: number; riskScore: number; slaCompliance: number; avgCvss: string;
  bySeverity: Record<string,number>; byTool: Record<string,number>;
}

export default function KpiPage() {
  const [live, setLive] = useState<LiveData | null>(null);

  useEffect(() => {
    fetch('/api/findings/kpi').then(r => r.json())
      .then(d => { if (d.hasLiveData) setLive(d); }).catch(() => {});
  }, []);

  const sevChart = live
    ? Object.entries(live.bySeverity).map(([name, value]) => ({ name, value }))
    : kpiData.monthlyKpis;

  return (
    <>
      <Topbar title="📊 Security KPIs" subtitle="MTTA, MTTR, Patch SLA compliance & team performance" />
      <div className="page-content animate-in">

        {live && (
          <div style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #86efac', borderRadius:12, padding:'0.875rem 1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.75rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:'#22c55e', display:'inline-block', boxShadow:'0 0 8px #22c55e' }} />
              <div>
                <div style={{ fontWeight:800, color:'#15803d', fontSize:'0.9rem' }}>Live KPIs — {live.total.toLocaleString()} total findings · Risk Score: {live.riskScore}</div>
                <div style={{ fontSize:'0.75rem', color:'#16a34a' }}>Remediation Rate: {live.remediationRate}% · SLA Compliance: {live.slaCompliance}% · Avg CVSS: {live.avgCvss}</div>
              </div>
            </div>
            <Link href="/dashboard/findings" style={{ fontSize:'0.78rem', fontWeight:700, color:'#16a34a', textDecoration:'none', border:'1px solid #86efac', padding:'0.375rem 0.875rem', borderRadius:8 }}>View All Findings →</Link>
          </div>
        )}

        <div className="grid-4">
          {[
            { label:'Risk Score',       value: live ? `${live.riskScore}`            : kpiData.mtta,              suffix: live ? '/100' : 'm',  accent:'#3b82f6', delta: live ? 'Live computed'        : '↓10m from Dec', target: live ? `${live.critical} critical` : '< 30 min ✅' },
            { label:'SLA Compliance',   value: live ? `${live.slaCompliance}%`       : `${kpiData.patchSla}%`,    suffix:'', accent:'#059669', delta: live ? `${live.slaBreached} breached`  : '↑13% from Dec', target: live ? 'Target: 95%'        : 'Target: 95%' },
            { label:'Remediation Rate', value: live ? `${live.remediationRate}%`     : `${kpiData.closureRate}%`, suffix:'', accent:'#7c3aed', delta: live ? `${live.closed} closed`        : '↑7% from Dec',  target: live ? `${live.open} still open`    : 'Target: 95%' },
            { label:'Avg CVSS',         value: live ? live.avgCvss                  : `${kpiData.mttr}`,         suffix: live ? '' : 'h',       accent:'#d97706', delta: live ? 'Weighted average'     : '↓4.9h from Dec', target: live ? `${live.total} findings` : '< 24 hrs ✅' },
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
