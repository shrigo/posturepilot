'use client';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';

export default function SettingsPage() {
  return (
    <>
      <Topbar title="⚙️ Settings" subtitle="Tenant configuration, API keys & integrations" />
      <div className="page-content animate-in">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="card">
            <div className="card-title">🏢 Tenant Information</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Organization', value: 'Acme Financial Corp' },
                { label: 'Industry', value: 'Financial Services' },
                { label: 'Plan', value: 'Professional' },
                { label: 'Primary CISO', value: 'admin@acmefinancial.com' },
                { label: 'Asset Count', value: '1,247 assets' },
                { label: 'Last Scan', value: 'May 13, 2026 6:42 PM' },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{f.label}</span>
                  <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>

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
              <button style={{ padding: '0.625rem', background: 'linear-gradient(135deg, #3b82f6, #0891b2)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                + Generate New API Key
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
