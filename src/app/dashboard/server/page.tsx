'use client';
import { useEffect, useState } from 'react';
import { serverData } from '@/data/mockData';
import Topbar from '@/components/Topbar';
import Link from 'next/link';

const healthColor: Record<string, string> = { good: '#16a34a', warning: '#d97706', critical: '#dc2626' };

interface LiveData {
  hasLiveData: boolean; total: number; critical: number; high: number;
  slaBreached: number; patchedHosts: number; unhealthyHosts: number;
  bySeverity: Record<string,number>; byTool: Record<string,number>;
  topCVEs: { cveId: string|null; count: number }[];
}

export default function ServerPage() {
  const [live, setLive] = useState<LiveData | null>(null);

  useEffect(() => {
    fetch('/api/findings/server').then(r => r.json())
      .then(d => { if (d.hasLiveData) setLive(d); }).catch(() => {});
  }, []);

  return (
    <>
      <Topbar title="🖥️ Server & Endpoint Security" subtitle="Patch status, EDR coverage & endpoint health monitoring" />
      <div className="page-content animate-in">

        {live && (
          <div style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #86efac', borderRadius:12, padding:'0.875rem 1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.75rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:'#22c55e', display:'inline-block', boxShadow:'0 0 8px #22c55e' }} />
              <div>
                <div style={{ fontWeight:800, color:'#15803d', fontSize:'0.9rem' }}>Live Data — {live.total.toLocaleString()} server/endpoint findings</div>
                <div style={{ fontSize:'0.75rem', color:'#16a34a' }}>Tools: {Object.keys(live.byTool).join(', ') || 'Endpoint scanners'} · Unhealthy hosts: {live.unhealthyHosts} · SLA breached: {live.slaBreached}</div>
              </div>
            </div>
            <Link href="/dashboard/findings" style={{ fontSize:'0.78rem', fontWeight:700, color:'#16a34a', textDecoration:'none', border:'1px solid #86efac', padding:'0.375rem 0.875rem', borderRadius:8 }}>View Findings →</Link>
          </div>
        )}

        <div className="grid-4">
          {[
            { label:'Total Findings',    value: live ? live.total.toLocaleString()         : serverData.totalEndpoints,   accent:'#3b82f6', delta: live ? 'Real scans'           : 'Managed endpoints' },
            { label:'Critical',          value: live ? live.critical.toLocaleString()       : serverData.criticalPatches,  accent:'#dc2626', delta: live ? 'Immediate action'     : 'Critical patches' },
            { label:'Unhealthy Hosts',   value: live ? live.unhealthyHosts.toLocaleString() : serverData.unhealthyHosts,   accent:'#ea580c', delta: live ? 'Need attention'       : 'Failing checks' },
            { label:'SLA Breached',      value: live ? live.slaBreached.toLocaleString()    : serverData.offlineHosts,     accent:'#d97706', delta: live ? 'Past deadline'         : 'Offline hosts' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-delta delta-down">{s.delta}</div>
            </div>
          ))}
        </div>

        {live ? (
          <div className="grid-2">
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
            <div className="card">
              <div className="card-title">🎯 Top CVEs from Live Scans</div>
              <table className="data-table">
                <thead><tr><th>CVE ID</th><th>Count</th><th>Category</th></tr></thead>
                <tbody>
                  {live.topCVEs.map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'#3b82f6', fontWeight:600 }}>{c.cveId || 'N/A'}</td>
                      <td style={{ fontWeight:700 }}>{c.count}</td>
                      <td><span className="badge badge-critical">Server</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-title">🖥️ Endpoint Health Overview</div>
            <table className="data-table">
              <thead><tr><th>Host</th><th>OS</th><th>Patch Status</th><th>EDR</th><th>Last Seen</th><th>Health</th></tr></thead>
              <tbody>
                {serverData.endpoints.map(e => (
                  <tr key={e.host}>
                    <td style={{ fontFamily:'monospace', fontSize:'0.78rem', fontWeight:600, color:'#0f172a' }}>{e.host}</td>
                    <td style={{ fontSize:'0.78rem' }}>{e.os}</td>
                    <td><span className={`badge badge-${e.patchStatus === 'Up to date' ? 'low' : e.patchStatus === 'Pending' ? 'medium' : 'critical'}`}>{e.patchStatus}</span></td>
                    <td><span style={{ fontSize:'0.75rem', fontWeight:700, color: e.edrInstalled ? '#16a34a' : '#dc2626' }}>{e.edrInstalled ? '✓ Active' : '✗ Missing'}</span></td>
                    <td style={{ fontSize:'0.75rem', color:'#64748b' }}>{e.lastSeen}</td>
                    <td><span className="stat-card-accent" style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background: healthColor[e.health] }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
