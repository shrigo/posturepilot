'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cloudData } from '@/data/mockData';
import Topbar from '@/components/Topbar';
import Link from 'next/link';

const riskColor: Record<string, string> = { High: '#dc2626', Medium: '#d97706', Low: '#16a34a', Compliant: '#059669', 'At Risk': '#dc2626' };

interface CloudSummary {
  hasCloudTools: boolean; total: number; critical: number; high: number;
  misconfigCount: number; complianceScore: number;
  bySeverity: Record<string, number>; byTool: Record<string, number>;
  topCVEs: { cveId: string | null; count: number }[];
}

export default function CloudPage() {
  const [live, setLive]   = useState<CloudSummary | null>(null);
  const mfaPct            = cloudData.iamMetrics.mfaCoverage;

  useEffect(() => {
    fetch('/api/findings/cloud')
      .then(r => r.json())
      .then(d => { if (d.total > 0) setLive(d); })
      .catch(() => {});
  }, []);

  const hasLive = !!live;

  const topStats = hasLive ? [
    { label: 'Total Cloud Findings',  value: live!.total.toLocaleString(),      accent: '#0891b2', delta: `${live!.critical} Critical` },
    { label: 'Misconfigurations',     value: live!.misconfigCount.toLocaleString(), accent: '#dc2626', delta: 'Cloud keyword matches' },
    { label: 'Cloud Compliance',      value: `${live!.complianceScore}%`,        accent: '#7c3aed', delta: 'Based on severity ratio' },
    { label: 'High Risk Findings',    value: live!.high.toLocaleString(),         accent: '#ea580c', delta: 'Action within 7 days' },
  ] : [
    { label: 'Total Cloud Assets',     value: String(cloudData.totalAssets),           accent: '#0891b2', delta: '↑18 this month' },
    { label: 'Misconfigured Assets',   value: String(cloudData.misconfiguredAssets),   accent: '#dc2626', delta: '↓7 from last scan' },
    { label: 'Cloud Compliance Score', value: `${cloudData.complianceScore}%`,         accent: '#7c3aed', delta: '↑3% improvement' },
    { label: 'Public Buckets Exposed', value: String(cloudData.storageExposure),       accent: '#ea580c', delta: 'Needs immediate fix' },
  ];

  return (
    <>
      <Topbar title="☁️ Cloud Security" subtitle="Misconfigurations, IAM risk & storage exposure across cloud assets" />
      <div className="page-content animate-in">

        {/* Live banner */}
        {hasLive && (
          <div style={{ background:'linear-gradient(135deg,#eff6ff,#dbeafe)', border:'1px solid #93c5fd', borderRadius:12, padding:'0.875rem 1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.75rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:'#3b82f6', display:'inline-block', boxShadow:'0 0 8px #3b82f6' }} />
              <div>
                <div style={{ fontWeight:800, color:'#1d4ed8', fontSize:'0.9rem' }}>
                  Live Cloud Data — {live!.total.toLocaleString()} findings
                  {live!.hasCloudTools && ` from ${Object.keys(live!.byTool).join(', ')}`}
                </div>
                <div style={{ fontSize:'0.75rem', color:'#2563eb' }}>
                  Compliance Score: {live!.complianceScore}% · Critical: {live!.critical} · High: {live!.high}
                </div>
              </div>
            </div>
            <Link href="/dashboard/upload" style={{ fontSize:'0.78rem', fontWeight:700, color:'#1d4ed8', textDecoration:'none', border:'1px solid #93c5fd', padding:'0.375rem 0.875rem', borderRadius:8 }}>
              + Upload Cloud Scan →
            </Link>
          </div>
        )}

        {/* Top stats */}
        <div className="grid-4">
          {topStats.map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ fontSize: s.value.length > 5 ? '1.5rem' : '2rem' }}>{s.value}</div>
              <div className="stat-delta delta-down">{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Top CVEs (live) + misconfig chart */}
        {hasLive && live!.topCVEs.length > 0 && (
          <div className="grid-2" style={{ marginBottom:'1.25rem' }}>
            <div className="card">
              <div className="card-title">🔑 Top Cloud CVEs (Live)</div>
              <table className="data-table">
                <thead><tr><th>CVE ID</th><th>Occurrences</th><th>Priority</th></tr></thead>
                <tbody>
                  {live!.topCVEs.map((c, i) => (
                    <tr key={c.cveId || i}>
                      <td><span style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'#2563eb', fontWeight:600 }}>{c.cveId || '—'}</span></td>
                      <td><strong>{c.count}</strong></td>
                      <td><span className={`badge badge-${i < 2 ? 'critical' : i < 4 ? 'high' : 'medium'}`}>{i < 2 ? 'Patch Now' : i < 4 ? 'High' : 'Medium'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card">
              <div className="card-title">📊 Live Severity Breakdown</div>
              {['Critical','High','Medium','Low','Info'].map(sev => {
                const count = live!.bySeverity[sev] || 0;
                const pct   = live!.total > 0 ? Math.round((count / live!.total) * 100) : 0;
                const colors: Record<string, string> = { Critical:'#dc2626', High:'#ea580c', Medium:'#d97706', Low:'#16a34a', Info:'#3b82f6' };
                const c = colors[sev];
                return (
                  <div key={sev} style={{ marginBottom:'0.625rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem', marginBottom:'3px' }}>
                      <span style={{ fontWeight:600, color:'#475569' }}>{sev}</span>
                      <span style={{ fontWeight:700, color:c }}>{count} <span style={{ color:'#94a3b8', fontWeight:400 }}>({pct}%)</span></span>
                    </div>
                    <div style={{ height:7, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:c, borderRadius:99, transition:'width 0.6s' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid-2">
          {/* Misconfig chart */}
          <div className="card">
            <div className="card-title">☁️ Misconfigurations by Category {!hasLive && <span style={{ fontSize:'0.65rem', color:'#94a3b8', fontWeight:400 }}>(sample data)</span>}</div>
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

          {/* IAM */}
          <div className="card">
            <div className="card-title">🪪 IAM Risk Dashboard <span style={{ fontSize:'0.65rem', color:'#94a3b8', fontWeight:400 }}>(sample)</span></div>
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
                { label: 'Total Accounts',          value: cloudData.iamMetrics.totalAccounts,        color: '#3b82f6' },
                { label: 'Privileged Accounts',     value: cloudData.iamMetrics.privilegedAccounts,   color: '#7c3aed' },
                { label: 'Orphaned Accounts',       value: cloudData.iamMetrics.orphanedAccounts,     color: '#dc2626' },
                { label: 'Stale Credentials (90d)', value: cloudData.iamMetrics.staleCredentials,     color: '#ea580c' },
                { label: 'Excessive Permissions',   value: cloudData.iamMetrics.excessivePermissions, color: '#d97706' },
                { label: 'MFA Enabled',             value: cloudData.iamMetrics.mfaEnabled,           color: '#059669' },
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
          <div className="card-title">📋 Cloud Asset Summary <span style={{ fontSize:'0.65rem', color:'#94a3b8', fontWeight:400 }}>(sample — connect AWS Security Hub for live data)</span></div>
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

        {/* No data CTA */}
        {!hasLive && (
          <div style={{ textAlign:'center', padding:'1.5rem', color:'#94a3b8', borderTop:'1px solid #e2e8f0', marginTop:'1.25rem' }}>
            <div style={{ fontSize:'0.85rem', marginBottom:'0.75rem' }}>
              Connect <strong>AWS Security Hub</strong>, <strong>Wiz</strong>, or <strong>Prisma Cloud</strong> for live cloud findings
            </div>
            <Link href="/dashboard/upload" style={{ background:'linear-gradient(135deg,#0891b2,#0e7490)', color:'#fff', padding:'0.5rem 1.25rem', borderRadius:8, textDecoration:'none', fontWeight:700, fontSize:'0.82rem' }}>
              Upload Cloud Scan →
            </Link>
          </div>
        )}

      </div>
    </>
  );
}
