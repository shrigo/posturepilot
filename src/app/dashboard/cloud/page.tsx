'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { cloudData } from '@/data/mockData';
import Topbar from '@/components/Topbar';

const riskColor: Record<string, string> = { High: '#dc2626', Medium: '#d97706', Low: '#16a34a', Compliant: '#059669', 'At Risk': '#dc2626' };

export default function CloudPage() {
  const mfaPct = cloudData.iamMetrics.mfaCoverage;
  return (
    <>
      <Topbar title="☁️ Cloud Security" subtitle="Misconfigurations, IAM risk & storage exposure across cloud assets" />
      <div className="page-content animate-in">

        <div className="grid-4">
          {[
            { label: 'Total Cloud Assets',      value: cloudData.totalAssets,           accent: '#0891b2', delta: '↑18 this month', up: false },
            { label: 'Misconfigured Assets',    value: cloudData.misconfiguredAssets,   accent: '#dc2626', delta: '↓7 from last scan', up: false },
            { label: 'Cloud Compliance Score',  value: `${cloudData.complianceScore}%`, accent: '#7c3aed', delta: '↑3% improvement', up: false },
            { label: 'Public Buckets Exposed',  value: cloudData.storageExposure,       accent: '#ea580c', delta: 'Needs immediate fix', up: true },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ fontSize: typeof s.value === 'string' ? '1.75rem' : '2rem' }}>{s.value}</div>
              <div className={`stat-delta ${s.up ? 'delta-up' : 'delta-down'}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          {/* Misconfig by category */}
          <div className="card">
            <div className="card-title">☁️ Misconfigurations by Category</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={cloudData.misconfigByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="critical" name="Critical" fill="#dc2626" radius={[3,3,0,0]} />
                <Bar dataKey="high"     name="High"     fill="#ea580c" radius={[3,3,0,0]} />
                <Bar dataKey="medium"   name="Medium"   fill="#d97706" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* IAM Metrics */}
          <div className="card">
            <div className="card-title">🪪 IAM Risk Dashboard</div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#475569', fontWeight: 600 }}>MFA Coverage</span>
                <span style={{ fontWeight: 700, color: mfaPct >= 90 ? '#16a34a' : mfaPct >= 70 ? '#d97706' : '#dc2626' }}>{mfaPct}%</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${mfaPct}%`, background: mfaPct >= 90 ? '#16a34a' : mfaPct >= 70 ? '#d97706' : '#dc2626' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { label: 'Total Accounts',          value: cloudData.iamMetrics.totalAccounts,       color: '#3b82f6' },
                { label: 'Privileged Accounts',     value: cloudData.iamMetrics.privilegedAccounts,  color: '#7c3aed' },
                { label: 'Orphaned Accounts',       value: cloudData.iamMetrics.orphanedAccounts,    color: '#dc2626' },
                { label: 'Stale Credentials (90d)', value: cloudData.iamMetrics.staleCredentials,    color: '#ea580c' },
                { label: 'Excessive Permissions',   value: cloudData.iamMetrics.excessivePermissions,color: '#d97706' },
                { label: 'MFA Enabled',             value: cloudData.iamMetrics.mfaEnabled,          color: '#059669' },
              ].map(m => (
                <div key={m.label} style={{ padding: '0.6rem 0.875rem', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: m.color, marginTop: '0.2rem' }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Asset table */}
        <div className="card">
          <div className="card-title">📋 Cloud Asset Summary</div>
          <table className="data-table">
            <thead><tr><th>Asset Type</th><th>Count</th><th>IAM Risk</th><th>Storage Exposure</th><th>Config Status</th></tr></thead>
            <tbody>
              {cloudData.assets.map(a => (
                <tr key={a.type}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{a.type}</td>
                  <td>{a.count}</td>
                  <td><span style={{ fontWeight: 700, color: riskColor[a.iamRisk] || '#475569' }}>{a.iamRisk}</span></td>
                  <td><span style={{ fontWeight: 700, color: riskColor[a.storageExposure] || '#475569' }}>{a.storageExposure}</span></td>
                  <td><span className={`badge badge-${a.configStatus === 'Compliant' ? 'low' : 'critical'}`}>{a.configStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
