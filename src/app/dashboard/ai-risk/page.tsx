'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { aiRiskData } from '@/data/mockData';
import Topbar from '@/components/Topbar';

const llmStatusColor: Record<string, string> = { 'Implemented': '#16a34a', 'Partial': '#d97706', 'Not Implemented': '#dc2626' };
const llmStatusBg:    Record<string, string> = { 'Implemented': '#f0fdf4', 'Partial': '#fffbeb', 'Not Implemented': '#fef2f2' };

export default function AiRiskPage() {
  const implemented   = aiRiskData.owaspLlmCoverage.filter(x => x.status === 'Implemented').length;
  const partial       = aiRiskData.owaspLlmCoverage.filter(x => x.status === 'Partial').length;
  const notImpl       = aiRiskData.owaspLlmCoverage.filter(x => x.status === 'Not Implemented').length;

  return (
    <>
      <Topbar title="🤖 AI Risk & Governance" subtitle="OWASP LLM Top 10, shadow AI detection & regulatory compliance" />
      <div className="page-content animate-in">

        <div className="grid-4">
          {[
            { label: 'AI Risk Score',          value: `${aiRiskData.overallAiRiskScore}/100`, accent: '#ea580c', delta: aiRiskData.riskLevel, up: true },
            { label: 'Shadow AI Tools',        value: aiRiskData.shadowAiToolsDetected,        accent: '#dc2626', delta: `${aiRiskData.approvedAiTools} approved tools`, up: true },
            { label: 'OWASP LLM Controls',     value: `${implemented}/10`,                    accent: '#059669', delta: `${partial} partial, ${notImpl} missing` },
            { label: 'AI Incidents (May)',      value: 8,                                       accent: '#7c3aed', delta: '↑2 from April', up: true },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ fontSize: typeof s.value === 'string' ? '1.75rem' : '2rem', color: s.accent }}>{s.value}</div>
              <div className={`stat-delta ${(s as any).up ? 'delta-up' : 'delta-down'}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          {/* OWASP LLM Top 10 */}
          <div className="card">
            <div className="card-title">🔟 OWASP LLM Top 10 — Control Coverage</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {aiRiskData.owaspLlmCoverage.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.75rem', background: llmStatusBg[item.status], borderRadius: 8, border: `1px solid ${llmStatusColor[item.status]}22` }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', width: 42, flexShrink: 0 }}>{item.id}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 500, color: '#0f172a', flex: 1 }}>{item.name}</span>
                  {item.incidents > 0 && <span style={{ fontSize: '0.65rem', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 20, padding: '1px 6px', fontWeight: 700 }}>{item.incidents} incidents</span>}
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: llmStatusColor[item.status], background: `${llmStatusColor[item.status]}15`, padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap', border: `1px solid ${llmStatusColor[item.status]}33` }}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Shadow AI */}
            <div className="card" style={{ flex: 1 }}>
              <div className="card-title">👤 Shadow AI Tools Detected</div>
              <table className="data-table">
                <thead><tr><th>Tool</th><th>Users</th><th>Data Risk</th><th>Policy</th></tr></thead>
                <tbody>
                  {aiRiskData.shadowAiTools.map(t => (
                    <tr key={t.tool}>
                      <td style={{ fontWeight: 600, fontSize: '0.78rem', color: '#0f172a' }}>{t.tool}</td>
                      <td style={{ fontWeight: 700, color: '#7c3aed' }}>{t.users}</td>
                      <td><span className={`badge badge-${t.dataShared === 'High' ? 'critical' : t.dataShared === 'Medium' ? 'medium' : 'low'}`}>{t.dataShared}</span></td>
                      <td><span className={`badge badge-${t.policyStatus === 'Blocked' ? 'critical' : t.policyStatus === 'Pending' ? 'medium' : 'low'}`}>{t.policyStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Regulatory */}
            <div className="card">
              <div className="card-title">⚖️ AI Regulatory Compliance</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {aiRiskData.regulatoryCompliance.map(r => (
                  <div key={r.framework}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }}>{r.framework}</span>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span className={`badge badge-${r.status === 'At Risk' ? 'critical' : 'medium'}`}>{r.status}</span>
                        <span style={{ fontWeight: 800, fontSize: '0.82rem', color: r.coverage >= 60 ? '#d97706' : '#dc2626' }}>{r.coverage}%</span>
                      </div>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill" style={{ width: `${r.coverage}%`, background: r.coverage >= 60 ? '#d97706' : '#dc2626' }} />
                    </div>
                    <div style={{ fontSize: '0.67rem', color: '#94a3b8', marginTop: '0.2rem' }}>Deadline: {r.deadline}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Incident trend */}
        <div className="card">
          <div className="card-title">📈 AI Security Incidents — Monthly Trend</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={aiRiskData.incidentsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="incidents" name="AI Incidents" fill="#ea580c" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
