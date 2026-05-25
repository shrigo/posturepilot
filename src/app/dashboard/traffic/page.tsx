'use client';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { trafficData } from '@/data/mockData';
import { useClient } from '@/context/ClientContext';
import Link from 'next/link';

interface LiveData {
  hasLiveData: boolean; total: number; critical: number; high: number;
  activeAlerts: number; anomalies: number;
  bySeverity: Record<string,number>;
  topCVEs: { cveId: string|null; count: number }[];
}

export default function TrafficPage() {
  const { currentClient } = useClient();
  const [live, setLive] = useState<LiveData | null>(null);

  useEffect(() => {
    fetch('/api/findings/traffic').then(r => r.json())
      .then(d => { if (d.hasLiveData) setLive(d); }).catch(() => {});
  }, []);

  // Resolve dynamic CISO metrics based on active client key
  const totalFindings = live ? live.total : (currentClient.key === 'UR' ? 38420 : 12470);
  const activeAlerts = live ? live.activeAlerts : (currentClient.key === 'UR' ? 3 : 34);
  const activeAnomalies = live ? live.anomalies : (currentClient.key === 'UR' ? 1 : 3);
  const activeInbound = live ? `${live.total} Gbps` : (currentClient.key === 'UR' ? '38.4 Gbps' : '12.4 Gbps');
  const activeOutbound = live ? `${live.high} Gbps` : (currentClient.key === 'UR' ? '12.5 Gbps' : '4.8 Gbps');

  return (
    <>
      <div className="page-content animate-in">

        {/* Dynamic CISO Executive Traffic Sticky Banner */}
        <div className="sticky-alert-banner">
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', boxShadow: '0 0 8px #7c3aed' }} />
            <div>
              <div style={{ fontWeight:800, color:'#6d28d9', fontSize:'0.9rem' }}>
                Perimeter Traffic Monitor & NetFlow Analyzer — {currentClient.name}
              </div>
              <div style={{ fontSize:'0.75rem', color:'#7c3aed', fontWeight: 600 }}>
                Inbound Ingress: <span style={{ fontWeight: 800 }}>{activeInbound}</span> · Outbound egress: <span style={{ fontWeight: 800 }}>{activeOutbound}</span> · Active Firewall Anomalies: <span style={{ fontWeight: 800 }}>{activeAnomalies} flagged</span> · Incident Response Alerts: {activeAlerts}
              </div>
            </div>
          </div>
          <Link href="/dashboard/findings?tool=traffic" style={{ fontSize:'0.78rem', fontWeight:700, color:'#7c3aed', textDecoration:'none', border:'1px solid #c084fc', padding:'0.375rem 0.875rem', borderRadius:8, background: 'rgba(255, 255, 255, 0.4)' }}>
            View Network Findings →
          </Link>
        </div>

        <div className="grid-4">
          {[
            { label:'Inbound Traffic',  value: activeInbound,     accent:'#0891b2', delta: 'Perimeter gateway rates' },
            { label:'Active Alerts',    value: `${activeAlerts}`, accent:'#dc2626', delta: 'Requires administrative action' },
            { label:'Anomalies',        value: `${activeAnomalies}`, accent:'#d97706', delta: 'Flagged socket sweeps today' },
            { label:'Outbound Traffic',  value: activeOutbound,    accent:'#ea580c', delta: 'Encrypted tunnel egress' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.accent }}>{s.value}</div>
              <div className="stat-delta delta-down">{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-title">📈 {live ? 'Severity Distribution (Live)' : 'Traffic Volume (24h)'}</div>
            <ResponsiveContainer width="100%" height={220}>
              {live ? (
                <AreaChart data={Object.entries(live.bySeverity).map(([name, value]) => ({ name, value }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Area type="monotone" dataKey="value" stroke="#0891b2" fill="#e0f2fe" strokeWidth={2} />
                </AreaChart>
              ) : (
                <AreaChart data={trafficData.hourlyTraffic}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: any) => `${v} Gbps`} />
                  <Area type="monotone" dataKey="inbound" stroke="#0891b2" fill="#e0f2fe" strokeWidth={2} />
                  <Area type="monotone" dataKey="outbound" stroke="#7c3aed" fill="#f3e8ff" strokeWidth={2} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title">{live ? '🎯 Top CVEs (Live)' : '🚨 Traffic Spikes'}</div>
            {live ? (
              <table className="data-table">
                <thead><tr><th>CVE ID</th><th>Count</th><th>Type</th></tr></thead>
                <tbody>
                  {live.topCVEs.map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'#0891b2', fontWeight:600 }}>{c.cveId || 'N/A'}</td>
                      <td style={{ fontWeight:700 }}>{c.count}</td>
                      <td><span className="badge badge-critical">Traffic</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="data-table">
                <thead><tr><th>Time</th><th>Magnitude</th><th>Type</th><th>Status</th></tr></thead>
                <tbody>
                  {trafficData.trafficSpikes.map((s, i) => (
                    <tr key={i}>
                      <td style={{ fontSize:'0.75rem', color:'#64748b' }}>{s.time}</td>
                      <td style={{ fontWeight:700, color:'#dc2626' }}>{s.magnitude}</td>
                      <td style={{ fontSize:'0.78rem', fontWeight:600 }}>{s.type}</td>
                      <td><span className={`badge badge-${s.resolved ? 'low' : 'critical'}`}>{s.resolved ? 'Resolved' : 'Active'}</span></td>
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
