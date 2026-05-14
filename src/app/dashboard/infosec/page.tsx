'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { infosecData } from '@/data/mockData';
import Topbar from '@/components/Topbar';

export default function InfosecPage() {
  return (
    <>
      <Topbar title="📋 Information Security" subtitle="Policy compliance, audit findings & framework coverage" />
      <div className="page-content animate-in">

        <div className="grid-4">
          {[
            { label: 'Overall Compliance',  value: `${infosecData.overallCompliance}%`, accent: '#7c3aed', delta: '↑5% this quarter' },
            { label: 'Open Audit Findings', value: infosecData.auditFindings.open,       accent: '#dc2626', delta: `${infosecData.auditFindings.overdue} overdue`, up: true },
            { label: 'Frameworks Tracked',  value: infosecData.frameworks.length,        accent: '#3b82f6', delta: 'SOC2, ISO, NIST, PCI, HIPAA' },
            { label: 'Policies Overdue',    value: 1,                                     accent: '#ea580c', delta: 'Business Continuity', up: true },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ fontSize: typeof s.value === 'string' ? '1.75rem' : '2rem' }}>{s.value}</div>
              <div className={`stat-delta ${(s as any).up ? 'delta-up' : 'delta-down'}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Framework progress */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">⚖️ Compliance Framework Progress</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {infosecData.frameworks.map(f => (
              <div key={f.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{f.name}</span>
                    <span style={{ marginLeft: '0.75rem', fontSize: '0.72rem', color: '#94a3b8' }}>Owner: {f.owner} · Due: {f.dueDate}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge badge-${f.status === 'On Track' ? 'low' : f.status === 'In Progress' ? 'info' : 'critical'}`}>{f.status}</span>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: f.progress >= 80 ? '#16a34a' : f.progress >= 60 ? '#d97706' : '#dc2626' }}>{f.progress}%</span>
                  </div>
                </div>
                <div className="progress-bar-wrap" style={{ height: 10 }}>
                  <div className="progress-bar-fill" style={{ width: `${f.progress}%`, background: f.progress >= 80 ? '#16a34a' : f.progress >= 60 ? '#d97706' : '#dc2626' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid-2">
          {/* Policy review */}
          <div className="card">
            <div className="card-title">📄 Policy Review Status</div>
            <table className="data-table">
              <thead><tr><th>Policy</th><th>Owner</th><th>Progress</th><th>Status</th></tr></thead>
              <tbody>
                {infosecData.policyReview.map(p => (
                  <tr key={p.policy}>
                    <td style={{ fontWeight: 600, fontSize: '0.78rem', color: '#0f172a' }}>{p.policy}</td>
                    <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.owner}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div className="progress-bar-wrap" style={{ flex: 1, height: 5 }}>
                          <div className="progress-bar-fill" style={{ width: `${p.progress}%`, background: p.progress >= 80 ? '#16a34a' : p.progress >= 60 ? '#d97706' : '#dc2626' }} />
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td><span className={`badge badge-${p.status === 'On Track' ? 'low' : p.status === 'At Risk' ? 'high' : 'critical'}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Training completion */}
          <div className="card">
            <div className="card-title">🎓 Security Training Completion</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(infosecData.trainingCompletion).map(([key, pct]) => (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: pct >= 90 ? '#16a34a' : pct >= 75 ? '#d97706' : '#dc2626' }}>{pct}%</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct >= 90 ? '#16a34a' : pct >= 75 ? '#d97706' : '#dc2626' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
