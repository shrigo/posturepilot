'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { appsecData } from '@/data/mockData';
import Topbar from '@/components/Topbar';

export default function AppsecPage() {
  return (
    <>
      <Topbar title="🔐 Application Security" subtitle="SAST/DAST findings, OWASP coverage & container security" />
      <div className="page-content animate-in">

        <div className="grid-4">
          {[
            { label: 'Total Findings',    value: appsecData.totalFindings, accent: '#7c3aed', delta: `${appsecData.openFindings} open` },
            { label: 'Critical',          value: appsecData.critical,      accent: '#dc2626', delta: 'Payment GW + API GW', up: true },
            { label: 'High',              value: appsecData.high,          accent: '#ea580c', delta: 'Customer Portal, HR Portal', up: true },
            { label: 'Patch Backlog',     value: appsecData.patchBacklogApps, accent: '#d97706', delta: `${appsecData.criticalApps} critical apps`, up: true },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className={`stat-delta ${(s as any).up ? 'delta-up' : 'delta-neutral'}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Severity donut summary */}
        <div className="grid-2">
          <div className="card">
            <div className="card-title">📱 Application Findings (SAST + DAST)</div>
            <table className="data-table">
              <thead><tr><th>Application</th><th>SAST</th><th>DAST</th><th>Severity</th><th>Remediation</th></tr></thead>
              <tbody>
                {appsecData.applications.map(a => (
                  <tr key={a.name}>
                    <td style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.8rem' }}>{a.name}</td>
                    <td style={{ fontWeight: 700, color: '#7c3aed' }}>{a.sast}</td>
                    <td style={{ fontWeight: 700, color: '#3b82f6' }}>{a.dast}</td>
                    <td><span className={`badge badge-${a.severity.toLowerCase()}`}>{a.severity}</span></td>
                    <td><span className={`badge badge-${a.remediation === 'Overdue' ? 'critical' : a.remediation === 'In Progress' ? 'medium' : 'info'}`}>{a.remediation}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-title">🔟 OWASP Top 10 Finding Distribution</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={appsecData.owaspTop10} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis type="category" dataKey="id" tick={{ fontSize: 10, fill: '#94a3b8' }} width={40} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v, _, p) => [`${v} findings`, p.payload.name]} />
                <Bar dataKey="findings" fill="#7c3aed" radius={[0,3,3,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Container security */}
        <div className="card">
          <div className="card-title">🐳 Container & DevSecOps Security</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            {[
              { label: 'Total Images',       value: appsecData.containerSecurity.totalImages,        color: '#3b82f6' },
              { label: 'Scanned',            value: appsecData.containerSecurity.scannedImages,       color: '#059669' },
              { label: 'Critical Vuln',      value: appsecData.containerSecurity.criticalVulnImages,  color: '#dc2626' },
              { label: 'IaC Misconfigs',     value: appsecData.containerSecurity.iacMisconfigs,       color: '#ea580c' },
            ].map(m => (
              <div key={m.label} style={{ padding: '0.875rem', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '1.625rem', fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.25rem' }}>{m.label}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, fontSize: '0.8rem', color: '#dc2626', fontWeight: 600 }}>
            ⚠️ {appsecData.containerSecurity.pipelineFailures} CI/CD pipeline security gate failures in the last 7 days. Review pipeline configurations.
          </div>
        </div>
      </div>
    </>
  );
}
