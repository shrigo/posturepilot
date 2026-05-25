'use client';
import { useClient } from '@/context/ClientContext';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { currentClient, setClient, isEnterpriseMode, setIsEnterpriseMode } = useClient();

  return (
    <div className="topbar-wrapper">
      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-title">{title}</div>
          {subtitle && <div className="topbar-subtitle">{subtitle}</div>}
        </div>
        <div className="topbar-right">
          <div className="hud-telemetry">
            <span className="hud-pulse" />
            <span>SYS.SEC_V3.8 // ACTIVE</span>
          </div>
          <div 
            onClick={() => setIsEnterpriseMode(!isEnterpriseMode)}
            style={{ 
              cursor: 'pointer', 
              userSelect: 'none', 
              fontSize: '0.72rem', 
              fontWeight: 700, 
              background: isEnterpriseMode ? 'linear-gradient(135deg, #0f172a, #1e293b)' : 'linear-gradient(135deg, #f8fafc, #f1f5f9)', 
              color: isEnterpriseMode ? '#38bdf8' : '#475569', 
              border: isEnterpriseMode ? '1px solid #38bdf8' : '1px solid #cbd5e1', 
              borderRadius: 8, 
              padding: '4px 10px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              transition: 'all 0.2s',
              boxShadow: isEnterpriseMode ? '0 0 10px rgba(56, 189, 248, 0.25)' : 'none'
            }}
            title="Click to toggle between White-Label & Enterprise competitor naming modes"
          >
            <span>{isEnterpriseMode ? '💼 Enterprise Mode' : '🛡️ White-Label'}</span>
          </div>
          <div 
            className="topbar-tenant" 
            style={{ cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s' }}
            onClick={() => setClient(currentClient.key === 'ACME' ? 'UR' : 'ACME')}
            title="Click to switch sample client dashboard"
          >
            <div className="topbar-dot" />
            {currentClient.name} <span style={{ fontSize: '0.65rem', marginLeft: 4 }}>▼</span>
          </div>
          <div style={{ fontSize: '0.75rem', background: 'var(--low-bg)', border: '1px solid var(--low-border)', borderRadius: 6, padding: '3px 10px', fontWeight: 600, color: 'var(--low)' }}>
            Last scan: {currentClient.scanDate}
          </div>
          <div 
            className="topbar-avatar" 
            style={{ 
              background: currentClient.key === 'UR' ? 'linear-gradient(135deg, #7c3aed, #059669)' : 'linear-gradient(135deg, var(--brand-blue), var(--brand-teal))',
              transition: 'all 0.3s ease' 
            }}
          >
            {currentClient.avatar}
          </div>
          <button className="logout-btn" onClick={() => window.location.href = '/login'}>Sign out</button>
        </div>
      </header>
    </div>
  );
}
