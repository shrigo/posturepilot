'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { postureData } from '@/data/mockData';
import Topbar from '@/components/Topbar';

const severityColor: Record<string, string> = { critical: '#dc2626', high: '#ea580c', medium: '#d97706', low: '#16a34a' };
const statusColor: Record<string, string> = { 'KEV Listed': '#dc2626', 'Active Exploit': '#ea580c', 'PoC Available': '#d97706', 'Patch Available': '#16a34a' };

export default function PosturePage() {
  return (
    <>
      <Topbar title="🛡️ Cyber Posture" subtitle="Overall risk score, threat level & threat intelligence feed" />
      <div className="page-content animate-in">

        {/* Top stat row */}
        <div className="grid-4">
          {[
            { label: 'Posture Score',      value: postureData.score,              suffix: '/100', accent: '#3b82f6', delta: '↓3 vs last month', up: true },
            { label: 'Threat Level',       value: postureData.threatLevel,        suffix: '',     accent: '#ea580c', delta: 'Elevated since May 9' },
            { label: 'Control Coverage',   value: `${postureData.controlCoverage}%`, suffix: '', accent: '#059669', delta: '↑2% this month', up: false },
            { label: 'Open Criticals',     value: postureData.openCriticals,      suffix: '',     accent: '#dc2626', delta: '↑4 since last scan',up: true },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ fontSize: typeof s.value === 'string' ? '1.375rem' : '2rem' }}>{s.value}{s.suffix}</div>
              <div className={`stat-delta ${s.up ? 'delta-up' : 'delta-down'}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Score trend + threat campaigns */}
        <div className="grid-2-1">
          <div className="card">
            <div className="card-title">📈 Posture Score Trend (6 months)</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={postureData.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="card-title">🔥 Active Threat Campaigns</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { name: 'FIN7 (Ransomware)', target: 'Finance sector', severity: 'critical', ttps: 'T1059, T1486' },
                { name: 'Lazarus APT',       target: 'Banking apps',   severity: 'high',     ttps: 'T1190, T1566' },
                { name: 'DarkGate Loader',   target: 'Email phishing', severity: 'high',     ttps: 'T1566.001' },
              ].map(c => (
                <div key={c.name} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                    <span className={`badge badge-${c.severity}`}>{c.severity}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Target: {c.target}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.2rem' }}>TTPs: {c.ttps}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Threat Intel Feed */}
        <div className="card">
          <div className="card-title">🚨 Threat Intelligence Feed — Relevant CVEs</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>CVE ID</th><th>Title</th><th>CVSS</th><th>EPSS</th><th>Status</th><th>Severity</th><th>Published</th>
              </tr>
            </thead>
            <tbody>
              {postureData.threatIntelFeed.map(t => (
                <tr key={t.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#3b82f6', fontWeight: 600 }}>{t.cve}</span></td>
                  <td style={{ fontWeight: 500, color: '#0f172a', fontSize: '0.8rem' }}>{t.title}</td>
                  <td><span style={{ fontWeight: 700, color: t.cvss >= 9 ? '#dc2626' : t.cvss >= 7 ? '#ea580c' : '#d97706' }}>{t.cvss}</span></td>
                  <td><span style={{ fontWeight: 700, color: t.epss >= 0.7 ? '#dc2626' : '#d97706' }}>{(t.epss * 100).toFixed(0)}%</span></td>
                  <td><span style={{ fontSize: '0.7rem', fontWeight: 700, color: statusColor[t.status] || '#64748b', background: `${statusColor[t.status] || '#64748b'}15`, padding: '2px 8px', borderRadius: 20, border: `1px solid ${statusColor[t.status] || '#64748b'}33` }}>{t.status}</span></td>
                  <td><span className={`badge badge-${t.severity}`}>{t.severity}</span></td>
                  <td style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
