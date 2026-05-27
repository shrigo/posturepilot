'use client';
import { useState } from 'react';
import { useClient, clients } from '@/context/ClientContext';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { currentClient, setClient, isEnterpriseMode, setIsEnterpriseMode } = useClient();
  const [menuOpen, setMenuOpen] = useState(false);

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
          
          <div style={{ position: 'relative', zIndex: 999 }}>
            <div 
              className="topbar-tenant" 
              style={{ cursor: 'pointer', userSelect: 'none', transition: 'all 0.2s' }}
              onClick={() => setMenuOpen(!menuOpen)}
              title="Click to switch sample client dashboard"
            >
              <div className="topbar-dot" />
              {currentClient.name} <span style={{ fontSize: '0.65rem', marginLeft: 4 }}>▼</span>
            </div>
            {menuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 6,
                background: '#fff',
                border: '1px solid #e0e7ff',
                borderRadius: 12,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                minWidth: 220,
                padding: '6px 0',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '6px 12px', fontSize: '0.62rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9', marginBottom: 4 }}>
                  Switch Enterprise Tenant
                </div>
                {Object.values(clients).map((c) => (
                  <div
                    key={c.key}
                    onClick={() => {
                      setClient(c.key);
                      setMenuOpen(false);
                    }}
                    style={{
                      padding: '8px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: currentClient.key === c.key ? '#4f46e5' : '#475569',
                      background: currentClient.key === c.key ? '#f5f3ff' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (currentClient.key !== c.key) e.currentTarget.style.background = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (currentClient.key !== c.key) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span>{c.name}</span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      background: c.score > 90 ? '#dcfce7' : c.score > 80 ? '#fffbeb' : '#fee2e2',
                      color: c.score > 90 ? '#16a34a' : c.score > 80 ? '#d97706' : '#dc2626',
                      padding: '2px 6px',
                      borderRadius: 6
                    }}>{c.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.75rem', background: 'var(--low-bg)', border: '1px solid var(--low-border)', borderRadius: 6, padding: '3px 10px', fontWeight: 600, color: 'var(--low)' }}>
            Last scan: {currentClient.scanDate}
          </div>
          <div 
            className="topbar-avatar" 
            style={{ 
              background: currentClient.key === 'UR' ? 'linear-gradient(135deg, #10b981, #059669)' :
                          currentClient.key === 'WELLS' ? 'linear-gradient(135deg, #dc2626, #991b1b)' :
                          currentClient.key === 'TOYOTA' ? 'linear-gradient(135deg, #ea580c, #c2410c)' :
                          currentClient.key === 'CISCO' ? 'linear-gradient(135deg, #06b6d4, #0891b2)' :
                          'linear-gradient(135deg, #a855f7, #7e22ce)',
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
