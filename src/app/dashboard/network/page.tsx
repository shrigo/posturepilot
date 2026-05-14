'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { networkData } from '@/data/mockData';
import Topbar from '@/components/Topbar';

export default function NetworkPage() {
  return (
    <>
      <Topbar title="🌐 Network Security" subtitle="Firewall events, IDS alerts, blocked IPs & VPN sessions" />
      <div className="page-content animate-in">

        <div className="grid-4">
          {[
            { label: 'Total Firewall Events',  value: networkData.firewallEvents.total.toLocaleString(),   accent: '#7c3aed', delta: 'Last 24 hours' },
            { label: 'Blocked Events',         value: networkData.firewallEvents.blocked.toLocaleString(), accent: '#059669', delta: `${networkData.firewallEvents.blockRate}% block rate` },
            { label: 'IDS Alerts Today',       value: networkData.idsAlerts.today,                         accent: '#dc2626', delta: `${networkData.idsAlerts.critical} critical`, up: true },
            { label: 'Active VPN Sessions',    value: networkData.vpnStats.activeSessions,                 accent: '#3b82f6', delta: `${networkData.vpnStats.failedAuths24h} failed auths` },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className={`stat-delta ${(s as any).up ? 'delta-up' : 'delta-down'}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-title">📊 Weekly Firewall Activity</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={networkData.weeklyFirewallTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: any) => v.toLocaleString()} />
                <Bar dataKey="blocked" name="Blocked" fill="#dc2626" radius={[3,3,0,0]} />
                <Bar dataKey="allowed" name="Allowed" fill="#3b82f6" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title">🚫 Top Blocked Sources</div>
            <table className="data-table">
              <thead><tr><th>Source IP</th><th>Country</th><th>Count</th><th>Type</th></tr></thead>
              <tbody>
                {networkData.topBlockedSources.map(s => (
                  <tr key={s.ip}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#3b82f6', fontWeight: 600 }}>{s.ip}</td>
                    <td style={{ fontSize: '0.78rem' }}>{s.country}</td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{s.count.toLocaleString()}</td>
                    <td><span className={`badge badge-${s.type === 'Malware' || s.type === 'C2 Traffic' ? 'critical' : s.type === 'Brute Force' ? 'high' : 'medium'}`}>{s.type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-title">🔒 VPN Status</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { label: 'Active Sessions', value: networkData.vpnStats.activeSessions, color: '#3b82f6' },
                { label: 'Total VPN Users', value: networkData.vpnStats.totalUsers, color: '#7c3aed' },
                { label: 'Failed Auths (24h)', value: networkData.vpnStats.failedAuths24h, color: '#dc2626' },
                { label: 'Top Location', value: networkData.vpnStats.topLocation, color: '#059669' },
              ].map(m => (
                <div key={m.label} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{m.label}</div>
                  <div style={{ fontSize: typeof m.value === 'string' ? '0.9rem' : '1.375rem', fontWeight: 800, color: m.color, marginTop: '0.25rem' }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">🚨 IDS Alert Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { level: 'Critical', count: networkData.idsAlerts.critical, color: '#dc2626', bg: '#fef2f2' },
                { level: 'High',     count: networkData.idsAlerts.high,     color: '#ea580c', bg: '#fff7ed' },
                { level: 'Medium',   count: networkData.idsAlerts.medium,   color: '#d97706', bg: '#fffbeb' },
              ].map(a => (
                <div key={a.level} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`badge badge-${a.level.toLowerCase()}`}>{a.level}</span>
                  <div style={{ flex: 1 }}>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill" style={{ width: `${(a.count / networkData.idsAlerts.today) * 100}%`, background: a.color }} />
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: a.color, width: 24, textAlign: 'right' }}>{a.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
