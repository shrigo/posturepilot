'use client';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { trafficData } from '@/data/mockData';
import Topbar from '@/components/Topbar';
import Link from 'next/link';

interface LiveData {
  hasLiveData: boolean; total: number; critical: number; high: number;
  activeAlerts: number; anomalies: number;
  bySeverity: Record<string,number>;
  topCVEs: { cveId: string|null; count: number }[];
}

export default function TrafficPage() {
  const [live, setLive] = useState<LiveData | null>(null);

  useEffect(() => {
    fetch('/api/findings/traffic').then(r => r.json())
      .then(d => { if (d.hasLiveData) setLive(d); }).catch(() => {});
  }, []);

  return (
    <>
      <Topbar title="📡 Traffic Monitor" subtitle="Network traffic analysis, anomaly detection & bandwidth usage" />
      <div className="page-content animate-in">

        {live && (
          <div style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #86efac', borderRadius:12, padding:'0.875rem 1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.75rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:'#22c55e', display:'inline-block', boxShadow:'0 0 8px #22c55e' }} />
              <div>
                <div style={{ fontWeight:800, color:'#15803d', fontSize:'0.9rem' }}>Live Traffic Findings — {live.total.toLocaleString()} total</div>
                <div style={{ fontSize:'0.75rem', color:'#16a34a' }}>Active alerts: {live.activeAlerts} · Anomalies: {live.anomalies} · Critical: {live.critical}</div>
              </div>
            </div>
            <Link href="/dashboard/findings" style={{ fontSize:'0.78rem', fontWeight:700, color:'#16a34a', textDecoration:'none', border:'1px solid #86efac', padding:'0.375rem 0.875rem', borderRadius:8 }}>View Findings →</Link>
          </div>
        )}

        <div className="grid-4">
          {[
            { label:'Inbound Traffic',  value: live ? live.total.toLocaleString()        : `${trafficData.inboundGbps} Gbps`,     accent:'#0891b2', delta: live ? 'Real data'         : 'Current' },
            { label:'Active Alerts',    value: live ? live.activeAlerts.toLocaleString() : trafficData.activeAlerts,              accent:'#dc2626', delta: live ? 'Critical severity' : 'Needs action' },
            { label:'Anomalies',        value: live ? live.anomalies.toLocaleString()    : trafficData.anomaliesDetected,         accent:'#d97706', delta: live ? 'Detected patterns' : 'Detected today' },
            { label:'High Severity',    value: live ? live.high.toLocaleString()         : `${trafficData.outboundGbps} Gbps`,   accent:'#ea580c', delta: live ? 'Escalate 7 days'  : 'Outbound' },
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
