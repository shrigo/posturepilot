'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { trafficData } from '@/data/mockData';
import Topbar from '@/components/Topbar';

export default function TrafficPage() {
  return (
    <>
      <Topbar title="📡 Traffic Monitoring" subtitle="Inbound/outbound traffic, protocol mix & anomaly detection" />
      <div className="page-content animate-in">

        <div className="grid-4">
          {[
            { label: 'Inbound Traffic',      value: `${trafficData.inboundGbps} Gbps`,  accent: '#3b82f6', delta: 'Peak: 14.1 Gbps at noon' },
            { label: 'Outbound Traffic',     value: `${trafficData.outboundGbps} Gbps`, accent: '#7c3aed', delta: 'Normal range' },
            { label: 'Anomalies Detected',   value: trafficData.anomaliesDetected,        accent: '#dc2626', delta: 'Last 24 hours', up: true },
            { label: 'Active Alerts',        value: trafficData.activeAlerts,             accent: '#ea580c', delta: '1 unresolved spike', up: true },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ fontSize: typeof s.value === 'string' ? '1.625rem' : '2rem' }}>{s.value}</div>
              <div className={`stat-delta ${(s as any).up ? 'delta-up' : 'delta-neutral'}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Traffic area chart */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">📈 24-Hour Traffic (Inbound vs Outbound Gbps)</div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trafficData.hourlyTraffic}>
              <defs>
                <linearGradient id="inboundGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outboundGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit=" G" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: any) => `${v} Gbps`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="inbound"  name="Inbound"  stroke="#3b82f6" fill="url(#inboundGrad)"  strokeWidth={2} />
              <Area type="monotone" dataKey="outbound" name="Outbound" stroke="#7c3aed" fill="url(#outboundGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid-2">
          {/* Protocol mix */}
          <div className="card">
            <div className="card-title">🥧 Protocol Distribution</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <PieChart width={180} height={180}>
                <Pie data={trafficData.protocolMix} cx={90} cy={90} innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                  {trafficData.protocolMix.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {trafficData.protocolMix.map(p => (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>{p.name}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', marginLeft: 'auto' }}>{p.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Traffic spikes */}
          <div className="card">
            <div className="card-title">⚡ Traffic Spike Alerts</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {trafficData.trafficSpikes.map((spike, i) => (
                <div key={i} style={{ padding: '0.875rem', background: spike.resolved ? '#f8fafc' : '#fef2f2', borderRadius: 10, border: `1px solid ${spike.resolved ? '#e2e8f0' : '#fecaca'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>{spike.type}</span>
                    <span className={`badge badge-${spike.resolved ? 'low' : 'critical'}`}>{spike.resolved ? 'Resolved' : 'Active'}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{spike.time} · Magnitude: <span style={{ fontWeight: 700, color: '#dc2626' }}>{spike.magnitude}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
