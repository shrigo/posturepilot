'use client';
import { useEffect, useState } from 'react';
import { serverData } from '@/data/mockData';
import { useClient } from '@/context/ClientContext';
import Link from 'next/link';

const healthColor: Record<string, string> = { good: '#16a34a', warning: '#d97706', critical: '#dc2626' };

interface LiveData {
  hasLiveData: boolean; total: number; critical: number; high: number;
  slaBreached: number; patchedHosts: number; unhealthyHosts: number;
  bySeverity: Record<string,number>; byTool: Record<string,number>;
  topCVEs: { cveId: string|null; count: number }[];
}

export default function ServerPage() {
  const { currentClient } = useClient();
  const [live, setLive] = useState<LiveData | null>(null);

  useEffect(() => {
    fetch('/api/findings/server').then(r => r.json())
      .then(d => { if (d.hasLiveData) setLive(d); }).catch(() => {});
  }, []);

  // Resolve dynamic CISO metrics based on active client key
  const totalServers = live ? live.total : (currentClient.key === 'UR' ? 3842 : 1247);
  const criticalFindings = live ? live.critical : (currentClient.key === 'UR' ? 4 : 14);
  const unhealthyHosts = live ? live.unhealthyHosts : (currentClient.key === 'UR' ? 6 : 17);
  const slaBreached = live ? live.slaBreached : (currentClient.key === 'UR' ? 4 : 14);

  return (
    <>
      <div className="page-content animate-in">

        {/* Dynamic CISO Executive Server Sticky Banner */}
        <div className="sticky-alert-banner">
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', boxShadow: '0 0 8px #7c3aed' }} />
            <div>
              <div style={{ fontWeight:800, color:'#6d28d9', fontSize:'0.9rem' }}>
                Server & Endpoint EDR telemetry Center — {currentClient.name}
              </div>
              <div style={{ fontSize:'0.75rem', color:'#7c3aed', fontWeight: 600 }}>
                EDR Agent Enrollment: <span style={{ fontWeight: 800 }}>100% Active ●</span> · Total Managed Workloads: <span style={{ fontWeight: 800 }}>{totalServers.toLocaleString()} servers</span> · Unhealthy Workloads: <span style={{ fontWeight: 800 }}>{unhealthyHosts} flagged</span> · Critical EDR Patches: {criticalFindings}
              </div>
            </div>
          </div>
          <Link href="/dashboard/findings?tool=server" style={{ fontSize:'0.78rem', fontWeight:700, color:'#7c3aed', textDecoration:'none', border:'1px solid #c084fc', padding:'0.375rem 0.875rem', borderRadius:8, background: 'rgba(255, 255, 255, 0.4)' }}>
            View Endpoint Findings →
          </Link>
        </div>

        <div className="grid-4">
          {[
            { label:'Total Servers',     value: totalServers.toLocaleString(), accent:'#3b82f6', delta: 'Enterprise workloads' },
            { label:'Critical Findings', value: `${criticalFindings}`,         accent:'#dc2626', delta: 'Requires patch sweep' },
            { label:'Unhealthy',         value: `${unhealthyHosts}`,           accent:'#ea580c', delta: 'Failing EDR diagnostics' },
            { label:'SLA Breached',      value: `${slaBreached}`,              accent:'#d97706', delta: 'Overdue VM patches' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.accent }}>{s.value}</div>
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
            <div className="card-title">🖥️ Server Health Overview</div>
            <table className="data-table">
              <thead><tr><th>Server ID</th><th>Role</th><th>CPU %</th><th>Memory %</th><th>Disk %</th><th>Uptime</th><th>Health</th></tr></thead>
              <tbody>
                {serverData.servers.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontFamily:'monospace', fontSize:'0.78rem', fontWeight:600, color:'#0f172a' }}>{s.id}</td>
                    <td style={{ fontSize:'0.78rem' }}>{s.role}</td>
                    <td style={{ fontWeight:700, color: s.cpu > 80 ? '#dc2626' : s.cpu > 60 ? '#d97706' : '#16a34a' }}>{s.cpu}%</td>
                    <td style={{ fontWeight:700, color: s.memory > 80 ? '#dc2626' : s.memory > 60 ? '#d97706' : '#16a34a' }}>{s.memory}%</td>
                    <td style={{ fontWeight:700, color: s.disk > 80 ? '#dc2626' : s.disk > 60 ? '#d97706' : '#16a34a' }}>{s.disk}%</td>
                    <td style={{ fontSize:'0.75rem', color:'#64748b' }}>{s.uptime}</td>
                    <td><span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background: healthColor[s.health] }} /></td>
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
