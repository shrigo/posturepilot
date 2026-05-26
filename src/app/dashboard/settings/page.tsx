'use client';
import { useClient } from '@/context/ClientContext';

export default function SettingsPage() {
  const { 
    currentClient, 
    isEnterpriseMode, 
    setIsEnterpriseMode, 
    slaThresholds, 
    setSlaThresholds 
  } = useClient();

  return (
    <>
      <div className="page-content animate-in" style={{ paddingBottom: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          
          {/* Column 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Tenant Info */}
            <div className="card">
              <div className="card-title">🏢 Tenant Information</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Organization', value: currentClient.name },
                  { label: 'Industry', value: 'Financial Services' },
                  { label: 'Plan', value: 'Professional' },
                  { label: 'Primary CISO', value: currentClient.key === 'UR' ? 'admin@unifiedrentals.com' : 'admin@acmefinancial.com' },
                  { label: 'Asset Count', value: `${currentClient.assets} assets` },
                  { label: 'Last Scan', value: currentClient.scanDate },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{f.label}</span>
                    <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700 }}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Telemetry Integrations */}
            <div className="card">
              <div className="card-title">🛡️ Advanced Telemetry Integrations</div>
              <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '1rem' }}>
                Connect external cloud security scanners to aggregate real-time posture indicators.
              </p>
              
              <div style={{ padding: '1rem', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 12, marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>🧙‍♂️</span>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#581c87' }}>Enterprise Wiz Integration</div>
                      <div style={{ fontSize: '0.7rem', color: '#701a75', fontWeight: 600 }}>Active Multi-Cloud Asset Telemetry</div>
                    </div>
                  </div>
                  
                  {/* Sleek Toggle Switch */}
                  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={isEnterpriseMode}
                      onChange={e => setIsEnterpriseMode(e.target.checked)}
                      style={{ opacity: 0, width: 0, height: 0 }} 
                    />
                    <span style={{
                      position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: isEnterpriseMode ? '#7c3aed' : '#cbd5e1',
                      borderRadius: 24, transition: '0.2s',
                      boxShadow: isEnterpriseMode ? '0 2px 6px rgba(124, 58, 237, 0.3)' : 'none'
                    }} />
                    <span style={{
                      position: 'absolute', content: '""', height: 18, width: 18, left: isEnterpriseMode ? 22 : 3, bottom: 3,
                      backgroundColor: 'white', borderRadius: '50%', transition: '0.2s'
                    }} />
                  </label>
                </div>
                
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#6b21a8', lineHeight: '1.4' }}>
                  {isEnterpriseMode 
                    ? "✓ Currently querying Wiz asset graph API. Custom security dashboards and compliance indicators are active." 
                    : "Connect Wiz API to pull live vulnerability reports directly into the CISO dashboard."}
                </p>
              </div>
              
              <div style={{ padding: '0.85rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>SkyArmor Hybrid Engine</div>
                  </div>
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 6px', borderRadius: 10, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                    RUNNING
                  </span>
                </div>
                <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.72rem', color: '#64748b', lineHeight: '1.3' }}>
                  PosturePilot's local hybrid agent is active, auditing network topology parameters and EDR heartbeats continuously.
                </p>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* SLA Deadlines */}
            <div className="card">
              <div className="card-title">⏰ SLA Remediation Thresholds</div>
              <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '1rem' }}>
                Customize policy remediation deadlines. Changes instantly recalculate SLA breach indicators and posture scores across the platform.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Critical SLA */}
                <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#991b1b' }}>🚨 Critical Severity SLA</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#991b1b', background: '#fee2e2', padding: '2px 8px', borderRadius: 6 }}>
                      {slaThresholds.critical} days
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="15" 
                    value={slaThresholds.critical} 
                    onChange={e => setSlaThresholds({ ...slaThresholds, critical: parseInt(e.target.value) })}
                    style={{ width: '100%', accentColor: '#ef4444', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#ef4444', marginTop: 4, fontWeight: 700 }}>
                    <span>1 day (Aggressive)</span>
                    <span>15 days (Relaxed)</span>
                  </div>
                </div>
                
                {/* High SLA */}
                <div style={{ padding: '0.75rem', background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#c2410c' }}>🔥 High Severity SLA</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#c2410c', background: '#ffedd5', padding: '2px 8px', borderRadius: 6 }}>
                      {slaThresholds.high} days
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="60" 
                    value={slaThresholds.high} 
                    onChange={e => setSlaThresholds({ ...slaThresholds, high: parseInt(e.target.value) })}
                    style={{ width: '100%', accentColor: '#ea580c', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#ea580c', marginTop: 4, fontWeight: 700 }}>
                    <span>10 days</span>
                    <span>60 days</span>
                  </div>
                </div>
                
                {/* Medium SLA */}
                <div style={{ padding: '0.75rem', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#b45309' }}>⚠️ Medium Severity SLA</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: 6 }}>
                      {slaThresholds.med} days
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="30" 
                    max="180" 
                    value={slaThresholds.med} 
                    onChange={e => setSlaThresholds({ ...slaThresholds, med: parseInt(e.target.value) })}
                    style={{ width: '100%', accentColor: '#d97706', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#d97706', marginTop: 4, fontWeight: 700 }}>
                    <span>30 days</span>
                    <span>180 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* API Keys */}
            <div className="card">
              <div className="card-title">🔑 API Keys</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Qualys Webhook Key',  key: 'pp_wh_qual_••••••••••••3a4f', active: true },
                  { label: 'Tenable Webhook Key', key: 'pp_wh_tenb_••••••••••••9c2d', active: true },
                  { label: 'SIEM Integration Key',key: 'pp_api_siem_••••••••••••1b8e', active: false },
                ].map(k => (
                  <div key={k.label} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>{k.label}</span>
                      <span className={`badge badge-${k.active ? 'low' : 'medium'}`}>{k.active ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#64748b' }}>{k.key}</div>
                  </div>
                ))}
                <button style={{ padding: '0.625rem', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)' }}>
                  + Generate New API Key
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
