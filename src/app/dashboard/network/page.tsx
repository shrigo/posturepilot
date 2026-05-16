'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { networkData } from '@/data/mockData';
import Topbar from '@/components/Topbar';
import Link from 'next/link';

interface LiveData {
  hasLiveData: boolean; total: number; critical: number; high: number;
  slaBreached: number; openPorts: number;
  bySeverity: Record<string,number>; byTool: Record<string,number>;
  topCVEs: { cveId: string|null; count: number }[];
}

export default function NetworkPage() {
  const [live, setLive] = useState<LiveData | null>(null);

  useEffect(() => {
    fetch('/api/findings/network').then(r => r.json())
      .then(d => { if (d.hasLiveData) setLive(d); }).catch(() => {});
  }, []);

  const sevChartData = live
    ? Object.entries(live.bySeverity).map(([name, value]) => ({ name, value }))
    : networkData.weeklyFirewallTrend;

  return (
    <>
      <Topbar title="🌐 Network Security" subtitle="Firewall events, IDS alerts, blocked IPs & VPN sessions" />
      <div className="page-content animate-in">

        {/* Live banner */}
        {live && (
          <div style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #86efac', borderRadius:12, padding:'0.875rem 1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.75rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:'#22c55e', display:'inline-block', boxShadow:'0 0 8px #22c55e' }} />
              <div>
                <div style={{ fontWeight:800, color:'#15803d', fontSize:'0.9rem' }}>Live Data Active — {live.total.toLocaleString()} network findings</div>
                <div style={{ fontSize:'0.75rem', color:'#16a34a' }}>Tools: {Object.keys(live.byTool).join(', ') || 'Network scanners'} · SLA Breached: {live.slaBreached}</div>
              </div>
            </div>
            <Link href="/dashboard/findings?tool=network" style={{ fontSize:'0.78rem', fontWeight:700, color:'#16a34a', textDecoration:'none', border:'1px solid #86efac', padding:'0.375rem 0.875rem', borderRadius:8 }}>View All Findings →</Link>
          </div>
        )}

        <div className="grid-4">
          {[
            { label: 'Total Findings',       value: live ? live.total.toLocaleString()       : networkData.firewallEvents.total.toLocaleString(),    accent: '#7c3aed', delta: live ? 'From real scans'        : 'Last 24 hours' },
            { label: 'Critical',             value: live ? live.critical.toLocaleString()     : networkData.firewallEvents.blocked.toLocaleString(),   accent: '#dc2626', delta: live ? 'Needs immediate action' : `${networkData.firewallEvents.blockRate}% block rate` },
            { label: 'High Severity',        value: live ? live.high.toLocaleString()         : networkData.idsAlerts.today,                           accent: '#ea580c', delta: live ? 'Escalate within 7 days' : `${networkData.idsAlerts.critical} critical` },
            { label: 'SLA Breached',         value: live ? live.slaBreached.toLocaleString()  : networkData.vpnStats.activeSessions,                  accent: '#ef4444', delta: live ? 'Past deadline'          : `${networkData.vpnStats.failedAuths24h} failed auths` },
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
            <div className="card-title">{live ? '📊 Findings by Severity' : '📊 Weekly Firewall Activity'}</div>
            <ResponsiveContainer width="100%" height={220}>
              {live ? (
                <BarChart data={sevChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="value" name="Findings" fill="#3b82f6" radius={[3,3,0,0]} />
                </BarChart>
              ) : (
                <BarChart data={networkData.weeklyFirewallTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: any) => v.toLocaleString()} />
                  <Bar dataKey="blocked" name="Blocked" fill="#dc2626" radius={[3,3,0,0]} />
                  <Bar dataKey="allowed" name="Allowed" fill="#3b82f6" radius={[3,3,0,0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title">{live ? '🎯 Top CVEs from Live Scans' : '🚫 Top Blocked Sources'}</div>
            {live ? (
              <table className="data-table">
                <thead><tr><th>CVE ID</th><th>Count</th><th>Severity</th></tr></thead>
                <tbody>
                  {live.topCVEs.map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'#3b82f6', fontWeight:600 }}>{c.cveId || 'N/A'}</td>
                      <td style={{ fontWeight:700 }}>{c.count}</td>
                      <td><span className="badge badge-critical">Network</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="data-table">
                <thead><tr><th>Source IP</th><th>Country</th><th>Count</th><th>Type</th></tr></thead>
                <tbody>
                  {networkData.topBlockedSources.map(s => (
                    <tr key={s.ip}>
                      <td style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'#3b82f6', fontWeight:600 }}>{s.ip}</td>
                      <td style={{ fontSize:'0.78rem' }}>{s.country}</td>
                      <td style={{ fontWeight:700, color:'#0f172a' }}>{s.count.toLocaleString()}</td>
                      <td><span className={`badge badge-${s.type === 'Malware' || s.type === 'C2 Traffic' ? 'critical' : s.type === 'Brute Force' ? 'high' : 'medium'}`}>{s.type}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Severity breakdown when live */}
        {live && (
          <div className="card">
            <div className="card-title">🔢 Severity Breakdown</div>
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
        )}

        {/* Mock VPN / IDS when no live data */}
        {!live && (
          <div className="grid-2">
            <div className="card">
              <div className="card-title">🔒 VPN Status</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                {[
                  { label:'Active Sessions', value: networkData.vpnStats.activeSessions, color:'#3b82f6' },
                  { label:'Total VPN Users', value: networkData.vpnStats.totalUsers, color:'#7c3aed' },
                  { label:'Failed Auths (24h)', value: networkData.vpnStats.failedAuths24h, color:'#dc2626' },
                  { label:'Top Location', value: networkData.vpnStats.topLocation, color:'#059669' },
                ].map(m => (
                  <div key={m.label} style={{ padding:'0.75rem', background:'#f8fafc', borderRadius:10, border:'1px solid #e2e8f0' }}>
                    <div style={{ fontSize:'0.65rem', color:'#94a3b8', fontWeight:600, textTransform:'uppercase' }}>{m.label}</div>
                    <div style={{ fontSize: typeof m.value === 'string' ? '0.9rem' : '1.375rem', fontWeight:800, color:m.color, marginTop:'0.25rem' }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-title">🚨 IDS Alert Breakdown</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {[
                  { level:'Critical', count: networkData.idsAlerts.critical, color:'#dc2626' },
                  { level:'High',     count: networkData.idsAlerts.high,     color:'#ea580c' },
                  { level:'Medium',   count: networkData.idsAlerts.medium,   color:'#d97706' },
                ].map(a => (
                  <div key={a.level} style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                    <span className={`badge badge-${a.level.toLowerCase()}`}>{a.level}</span>
                    <div style={{ flex:1 }}>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar-fill" style={{ width:`${(a.count / networkData.idsAlerts.today) * 100}%`, background:a.color }} />
                      </div>
                    </div>
                    <span style={{ fontWeight:700, fontSize:'0.85rem', color:a.color, width:24, textAlign:'right' }}>{a.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
