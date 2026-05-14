'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { kpiData } from '@/data/mockData';
import Topbar from '@/components/Topbar';

export default function KpiPage() {
  return (
    <>
      <Topbar title="📊 Security KPIs" subtitle="MTTA, MTTR, Patch SLA compliance & team performance" />
      <div className="page-content animate-in">

        <div className="grid-4">
          {[
            { label: 'MTTA (minutes)',    value: kpiData.mtta,          suffix: 'm',  accent: '#3b82f6', delta: '↓10m from Dec', up: false, target: '< 30 min ✅' },
            { label: 'MTTR (hours)',      value: kpiData.mttr,          suffix: 'h',  accent: '#7c3aed', delta: '↓4.9h from Dec', up: false, target: '< 24 hrs ✅' },
            { label: 'Patch SLA %',       value: `${kpiData.patchSla}%`,suffix: '',   accent: '#059669', delta: '↑13% from Dec', up: false, target: 'Target: 95%' },
            { label: 'Closure Rate',      value: `${kpiData.closureRate}%`,suffix: '',accent: '#d97706', delta: '↑7% from Dec',  up: false, target: 'Target: 95%' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.accent }}>{s.value}{s.suffix}</div>
              <div className="stat-delta delta-down">{s.delta}</div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.25rem' }}>{s.target}</div>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">📈 KPI Trend (6 months)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>MTTA (min) — lower is better</div>
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
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Patch SLA % — higher is better</div>
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
        </div>

        {/* Team performance */}
        <div className="card">
          <div className="card-title">👥 Team Performance</div>
          <table className="data-table">
            <thead><tr><th>Team</th><th>Assigned</th><th>Resolved</th><th>SLA %</th><th>Avg MTTR</th><th>Status</th></tr></thead>
            <tbody>
              {kpiData.byTeam.map(t => (
                <tr key={t.team}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{t.team}</td>
                  <td>{t.assigned}</td>
                  <td>{t.resolved}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="progress-bar-wrap" style={{ flex: 1, height: 6 }}>
                        <div className="progress-bar-fill" style={{ width: `${t.slaCompliance}%`, background: t.slaCompliance >= 90 ? '#16a34a' : t.slaCompliance >= 80 ? '#d97706' : '#dc2626' }} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.78rem', color: t.slaCompliance >= 90 ? '#16a34a' : '#d97706' }}>{t.slaCompliance}%</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{t.avgMttr}h</td>
                  <td><span className={`badge badge-${t.slaCompliance >= 90 ? 'low' : t.slaCompliance >= 80 ? 'medium' : 'critical'}`}>{t.slaCompliance >= 90 ? 'On Track' : t.slaCompliance >= 80 ? 'Watch' : 'At Risk'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
