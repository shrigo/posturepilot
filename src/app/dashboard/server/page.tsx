'use client';
import { serverData } from '@/data/mockData';
import Topbar from '@/components/Topbar';

const healthColor: Record<string, string> = { good: '#16a34a', warning: '#d97706', critical: '#dc2626' };
const healthBg:    Record<string, string> = { good: '#f0fdf4', warning: '#fffbeb', critical: '#fef2f2' };

function HealthBar({ value, label }: { value: number; label: string }) {
  const color = value >= 85 ? '#dc2626' : value >= 70 ? '#d97706' : '#16a34a';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8', marginBottom: 2 }}>
        <span>{label}</span><span style={{ fontWeight: 700, color }}>{value}%</span>
      </div>
      <div className="progress-bar-wrap" style={{ height: 5 }}>
        <div className="progress-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export default function ServerPage() {
  return (
    <>
      <Topbar title="🖥️ Server Monitoring" subtitle="CPU, memory, disk utilization & health status across all servers" />
      <div className="page-content animate-in">

        <div className="grid-4">
          {[
            { label: 'Total Servers',    value: serverData.totalServers, accent: '#3b82f6',  delta: 'All regions' },
            { label: 'Healthy',          value: serverData.healthy,      accent: '#16a34a',  delta: `${Math.round(serverData.healthy/serverData.totalServers*100)}% of fleet` },
            { label: 'Warning',          value: serverData.warning,      accent: '#d97706',  delta: 'High CPU or disk', up: true },
            { label: 'Critical',         value: serverData.critical,     accent: '#dc2626',  delta: 'Immediate attention', up: true },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className={`stat-delta ${(s as any).up ? 'delta-up' : 'delta-down'}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Fleet averages */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">📊 Fleet Average Utilization</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { label: 'Average CPU',    value: serverData.avgCpu,    color: '#3b82f6', target: '< 70%' },
              { label: 'Average Memory', value: serverData.avgMemory, color: '#7c3aed', target: '< 80%' },
              { label: 'Average Disk',   value: serverData.avgDisk,   color: '#ea580c', target: '< 75%' },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem' }}>{m.label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: m.value >= 80 ? '#dc2626' : m.value >= 65 ? '#d97706' : '#16a34a', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>{m.value}%</div>
                <div className="progress-bar-wrap" style={{ height: 10 }}>
                  <div className="progress-bar-fill" style={{ width: `${m.value}%`, background: m.value >= 80 ? '#dc2626' : m.value >= 65 ? '#d97706' : '#16a34a' }} />
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.375rem' }}>Target: {m.target}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Server table */}
        <div className="card">
          <div className="card-title">🖥️ Server Inventory</div>
          <table className="data-table">
            <thead><tr><th>Server ID</th><th>Role</th><th>CPU %</th><th>Memory %</th><th>Disk %</th><th>Uptime</th><th>Health</th></tr></thead>
            <tbody>
              {serverData.servers.map(s => (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, color: '#3b82f6' }}>{s.id}</td>
                  <td style={{ fontWeight: 600, fontSize: '0.8rem', color: '#0f172a' }}>{s.role}</td>
                  <td><span style={{ fontWeight: 700, color: s.cpu >= 85 ? '#dc2626' : s.cpu >= 70 ? '#d97706' : '#16a34a' }}>{s.cpu}%</span></td>
                  <td><span style={{ fontWeight: 700, color: s.memory >= 85 ? '#dc2626' : s.memory >= 70 ? '#d97706' : '#16a34a' }}>{s.memory}%</span></td>
                  <td><span style={{ fontWeight: 700, color: s.disk >= 85 ? '#dc2626' : s.disk >= 70 ? '#d97706' : '#16a34a' }}>{s.disk}%</span></td>
                  <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.uptime}</td>
                  <td>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20, background: healthBg[s.health], color: healthColor[s.health], border: `1px solid ${healthColor[s.health]}33`, textTransform: 'capitalize' }}>
                      {s.health === 'good' ? '✓ Healthy' : s.health === 'warning' ? '⚠ Warning' : '✕ Critical'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
