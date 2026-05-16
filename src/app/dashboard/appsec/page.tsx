'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { appsecData } from '@/data/mockData';
import Topbar from '@/components/Topbar';
import Link from 'next/link';

interface LiveData {
  hasLiveData: boolean; total: number; critical: number; high: number; patchBacklog: number;
  bySeverity: Record<string,number>; byTool: Record<string,number>;
  topCVEs: { cveId: string|null; count: number }[];
}

export default function AppsecPage() {
  const [live, setLive] = useState<LiveData | null>(null);

  useEffect(() => {
    fetch('/api/findings/appsec').then(r => r.json())
      .then(d => { if (d.hasLiveData) setLive(d); }).catch(() => {});
  }, []);

  const sevChart: any[] = live
    ? Object.entries(live.bySeverity).map(([name, value]) => ({ name, value }))
    : appsecData.owaspTop10;

  return (
    <>
      <Topbar title="🔐 Application Security" subtitle="OWASP findings, SAST/DAST results & dependency vulnerabilities" />
      <div className="page-content animate-in">

        {live && (
          <div style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #86efac', borderRadius:12, padding:'0.875rem 1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.75rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:'#22c55e', display:'inline-block', boxShadow:'0 0 8px #22c55e' }} />
              <div>
                <div style={{ fontWeight:800, color:'#15803d', fontSize:'0.9rem' }}>Live Data — {live.total.toLocaleString()} AppSec findings</div>
                <div style={{ fontSize:'0.75rem', color:'#16a34a' }}>Tools: {Object.keys(live.byTool).join(', ') || 'AppSec scanners'} · Patch backlog: {live.patchBacklog}</div>
              </div>
            </div>
            <Link href="/dashboard/findings?severity=Critical" style={{ fontSize:'0.78rem', fontWeight:700, color:'#16a34a', textDecoration:'none', border:'1px solid #86efac', padding:'0.375rem 0.875rem', borderRadius:8 }}>View Critical →</Link>
          </div>
        )}

        <div className="grid-4">
          {[
            { label:'Total App Findings', value: live ? live.total.toLocaleString()        : appsecData.totalFindings,       accent:'#7c3aed', delta: live ? 'Real scan data'    : 'Active vulnerabilities' },
            { label:'Critical',           value: live ? live.critical.toLocaleString()      : appsecData.critical,            accent:'#dc2626', delta: live ? 'Immediate action'  : 'CVSS ≥ 9.0' },
            { label:'High Severity',      value: live ? live.high.toLocaleString()          : appsecData.high,                accent:'#ea580c', delta: live ? 'Within 7 days'    : 'CVSS 7.0–8.9' },
            { label:'Patch Backlog',      value: live ? live.patchBacklog.toLocaleString()  : appsecData.patchBacklogApps,    accent:'#d97706', delta: live ? 'Crit + High'       : 'Awaiting fix' },
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
            <div className="card-title">{live ? '📊 Findings by Severity (Live)' : '📊 OWASP Top 10 Distribution'}</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sevChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="value" name={live ? 'Findings' : 'Count'} fill="#7c3aed" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title">{live ? '🎯 Top CVEs (Live)' : '🔍 Scan Coverage'}</div>
            {live ? (
              <table className="data-table">
                <thead><tr><th>CVE ID</th><th>Count</th><th>Type</th></tr></thead>
                <tbody>
                  {live.topCVEs.map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'#7c3aed', fontWeight:600 }}>{c.cveId || 'N/A'}</td>
                      <td style={{ fontWeight:700 }}>{c.count}</td>
                      <td><span className="badge badge-critical">AppSec</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {appsecData.scanCoverage.map(s => (
                  <div key={s.type} style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                    <span style={{ fontSize:'0.78rem', color:'#0f172a', fontWeight:600, width:90 }}>{s.type}</span>
                    <div style={{ flex:1 }}>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar-fill" style={{ width:`${s.coverage}%`, background:'#7c3aed' }} />
                      </div>
                    </div>
                    <span style={{ fontWeight:700, fontSize:'0.82rem', color:'#7c3aed', width:40, textAlign:'right' }}>{s.coverage}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
