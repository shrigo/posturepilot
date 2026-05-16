'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { aiRiskData } from '@/data/mockData';
import Topbar from '@/components/Topbar';
import Link from 'next/link';

interface LiveData {
  hasLiveData: boolean; total: number; critical: number; high: number;
  riskScore: number; shadowAiDetected: number;
  bySeverity: Record<string,number>;
}

export default function AiRiskPage() {
  const [live, setLive] = useState<LiveData | null>(null);

  useEffect(() => {
    fetch('/api/findings/ai-risk').then(r => r.json())
      .then(d => { if (d.hasLiveData) setLive(d); }).catch(() => {});
  }, []);

  const sevChart = live
    ? Object.entries(live.bySeverity).map(([name, value]) => ({ name, value }))
    : aiRiskData.owaspLlmCoverage.map(o => ({ name: o.id, value: o.incidents }));

  return (
    <>
      <Topbar title="🤖 AI Risk" subtitle="Shadow AI detection, model vulnerabilities & data exposure risks" />
      <div className="page-content animate-in">

        {live && (
          <div style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #86efac', borderRadius:12, padding:'0.875rem 1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.75rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:'#22c55e', display:'inline-block', boxShadow:'0 0 8px #22c55e' }} />
              <div>
                <div style={{ fontWeight:800, color:'#15803d', fontSize:'0.9rem' }}>Live AI Risk Data — {live.total.toLocaleString()} findings · Risk Score: {live.riskScore}</div>
                <div style={{ fontSize:'0.75rem', color:'#16a34a' }}>Shadow AI detected: {live.shadowAiDetected} · Critical: {live.critical} · High: {live.high}</div>
              </div>
            </div>
            <Link href="/dashboard/findings" style={{ fontSize:'0.78rem', fontWeight:700, color:'#16a34a', textDecoration:'none', border:'1px solid #86efac', padding:'0.375rem 0.875rem', borderRadius:8 }}>View Findings →</Link>
          </div>
        )}

        <div className="grid-4">
          {[
            { label:'AI Risk Score',       value: live ? `${live.riskScore}/100`         : `${aiRiskData.overallAiRiskScore}/100`, accent:'#7c3aed', delta: live ? 'Computed live'         : 'Overall risk' },
            { label:'Total Findings',      value: live ? live.total.toLocaleString()      : aiRiskData.approvedAiTools,             accent:'#3b82f6', delta: live ? 'From real scans'       : 'Approved AI tools' },
            { label:'Shadow AI',           value: live ? live.shadowAiDetected.toString() : aiRiskData.shadowAiToolsDetected,       accent:'#dc2626', delta: live ? 'Unauthorized tools'    : 'Unauthorized tools' },
            { label:'Risk Level',          value: live ? live.critical.toLocaleString()   : aiRiskData.riskLevel,                   accent:'#ea580c', delta: live ? 'Critical findings'     : 'Current level' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-delta delta-down">{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-title">{live ? '📊 Severity Distribution (Live)' : '📊 AI Risk Categories'}</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sevChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey={live ? 'value' : 'count'} name="Count" fill="#7c3aed" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title">{live ? '🔢 Live Severity Breakdown' : '🤖 Shadow AI Inventory'}</div>
            {live ? (
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
            ) : (
              <table className="data-table">
                <thead><tr><th>Tool</th><th>Department</th><th>Risk</th><th>Status</th></tr></thead>
                <tbody>
                  {aiRiskData.shadowAiTools.map(t => (
                    <tr key={t.tool}>
                      <td style={{ fontWeight:600, color:'#0f172a' }}>{t.tool}</td>
                      <td style={{ fontSize:'0.78rem' }}>{t.category}</td>
                      <td><span className={`badge badge-${t.dataShared === 'High' ? 'critical' : t.dataShared === 'Medium' ? 'medium' : 'low'}`}>{t.dataShared}</span></td>
                      <td><span className={`badge badge-${t.policyStatus === 'Blocked' ? 'critical' : t.policyStatus === 'Allowed' ? 'low' : 'medium'}`}>{t.policyStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
