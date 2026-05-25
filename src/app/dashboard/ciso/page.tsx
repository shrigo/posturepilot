'use client';
import { useState } from 'react';
import { useClient } from '@/context/ClientContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const widgetMeta = {
  summary: { label: 'Aggregate Score HUD', icon: '📊' },
  posture: { label: 'Joint Compliance Trend', icon: '📈' },
  threats: { label: 'Cross-Tenant Threats', icon: '🛡️' },
  patching: { label: 'Patching & MTTR Score', icon: '🩹' },
  remediation: { label: 'Security Stack Config', icon: '🔌' }
};

export default function CISOPage() {
  const { isEnterpriseMode } = useClient();

  // CISO Executive View Settings (Higher Management Customizations)
  const [selectedTenants, setSelectedTenants] = useState<string[]>(['ACME', 'UR']);
  const [viewWidgets, setViewWidgets] = useState<Record<string, boolean>>({
    summary: true,
    posture: true,
    threats: true,
    remediation: true,
    patching: true
  });

  // Widget Order Management (Site-wide layout reordering)
  const [widgetOrder, setWidgetOrder] = useState<string[]>(['summary', 'posture', 'patching', 'threats', 'remediation']);

  const [authRole, setAuthRole] = useState<'CISO' | 'Auditor' | 'Unauthorized'>('CISO');
  const [pendingRole, setPendingRole] = useState<'CISO' | 'Auditor' | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Business Units Base Metadata
  const tenantsMetadata = [
    { key: 'ACME', name: 'Acme Financial Corp', avatar: 'AC', assets: 1247, compliance: 71, criticals: 14, backlog: 234, badgeColor: '#3b82f6' },
    { key: 'UR', name: 'Unified Rentals', avatar: 'UR', assets: 3842, compliance: 89, criticals: 4, backlog: 92, badgeColor: '#10b981' }
  ];

  // Filtered active tenants to construct combined view
  const activeTenants = tenantsMetadata.filter(t => selectedTenants.includes(t.key));

  // Compute Combined Aggregations in real-time
  const totalAssets = activeTenants.reduce((sum, t) => sum + t.assets, 0);
  const avgCompliance = activeTenants.length > 0 
    ? Math.round(activeTenants.reduce((sum, t) => sum + t.compliance, 0) / activeTenants.length) 
    : 0;
  const totalCriticals = activeTenants.reduce((sum, t) => sum + t.criticals, 0);
  const totalBacklog = activeTenants.reduce((sum, t) => sum + t.backlog, 0);

  // SLA status based on aggregate compliance
  const slaStatus = avgCompliance >= 85 ? 'CONFORMANCE' : avgCompliance >= 75 ? 'DEVIATION' : 'CRITICAL BREACH';

  // Dynamic Patching & MTTR values based on selected tenants (Aggregate site-wide)
  const patchingScore = selectedTenants.length === 2 
    ? 78 
    : selectedTenants.includes('ACME') 
      ? 68 
      : selectedTenants.includes('UR') 
        ? 87 
        : 0;

  const patchingGrade = patchingScore >= 85 ? 'A-' : patchingScore >= 75 ? 'B+' : patchingScore >= 65 ? 'B-' : 'N/A';
  const patchingGradeColor = patchingScore >= 85 ? '#10b981' : patchingScore >= 75 ? '#7c3aed' : patchingScore >= 65 ? '#ea580c' : '#94a3b8';

  const mttrCritical = selectedTenants.length === 2 
    ? 4.8 
    : selectedTenants.includes('ACME') 
      ? 6.5 
      : selectedTenants.includes('UR') 
        ? 3.0 
        : 0;

  const mttrHigh = selectedTenants.length === 2 
    ? 14.3 
    : selectedTenants.includes('ACME') 
      ? 20.5 
      : selectedTenants.includes('UR') 
        ? 8.0 
        : 0;

  // Toggle tenant in combined view
  const toggleTenant = (key: string) => {
    setSelectedTenants(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // Toggle widgets
  const toggleWidget = (key: string) => {
    setViewWidgets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Reorder widgets dynamically
  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= widgetOrder.length) return;
    
    const newOrder = [...widgetOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[nextIndex];
    newOrder[nextIndex] = temp;
    setWidgetOrder(newOrder);
  };

  // Secure Role Switch Lock Simulator
  const handleAuthChange = (role: 'CISO' | 'Auditor' | 'Unauthorized') => {
    if (role === 'CISO' || role === 'Auditor') {
      setPendingRole(role);
      setPassword('');
      setPasswordError(false);
    } else {
      setAuthRole(role);
      setPendingRole(null);
    }
  };

  const verifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pendingRole === 'CISO') {
      if (password === 'ciso123' || password === 'admin') {
        setAuthRole('CISO');
        setPendingRole(null);
        setPasswordError(false);
      } else {
        setPasswordError(true);
      }
    } else if (pendingRole === 'Auditor') {
      if (password === 'auditor123' || password === 'audit') {
        setAuthRole('Auditor');
        setPendingRole(null);
        setPasswordError(false);
      } else {
        setPasswordError(true);
      }
    }
  };

  // Combined charts data
  const combinedTrendData = [
    { week: 'Week 1', ACME: 64, UR: 82, Combined: 73 },
    { week: 'Week 2', ACME: 68, UR: 84, Combined: 76 },
    { week: 'Week 3', ACME: 72, UR: 85, Combined: 785 },
    { week: 'Week 4', ACME: 70, UR: 89, Combined: 79.5 },
    { week: 'Week 5', ACME: 71, UR: 89, Combined: 80 },
  ];

  return (
    <div className="page-content animate-in" style={{ paddingBottom: '2.5rem' }}>
      
      {/* ── CISO SECURE AUTHORIZATION GATE BAR ── */}
      <div style={{
        background: authRole === 'CISO' ? 'linear-gradient(135deg, #0f172a, #1e293b)' : authRole === 'Auditor' ? '#f8fafc' : '#fee2e2',
        border: authRole === 'CISO' ? '1px solid #10b981' : authRole === 'Auditor' ? '1px solid #cbd5e1' : '1px solid #f87171',
        borderRadius: 16, padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        boxShadow: authRole === 'CISO' ? '0 4px 20px rgba(16, 185, 129, 0.1)' : 'none', transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: authRole === 'CISO' ? 'rgba(16, 185, 129, 0.15)' : authRole === 'Auditor' ? '#e2e8f0' : '#fee2e2',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
          }}>
            {authRole === 'CISO' ? '👑' : authRole === 'Auditor' ? '💼' : '🔒'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: authRole === 'CISO' ? '#34d399' : authRole === 'Auditor' ? '#64748b' : '#ef4444' }}>
                {authRole === 'CISO' ? 'EXECUTIVE PROFILE ACTIVE' : authRole === 'Auditor' ? 'AUDIT READ-ONLY ROLE' : 'ACCESS DENIED'}
              </span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: authRole === 'CISO' ? '#10b981' : authRole === 'Auditor' ? '#64748b' : '#ef4444' }} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: authRole === 'CISO' ? '#fff' : '#0f172a', margin: '2px 0 0' }}>
              CISO Executive Management Console
            </h4>
            <p style={{ fontSize: '0.74rem', color: authRole === 'CISO' ? '#94a3b8' : '#64748b', marginTop: 2 }}>
              {authRole === 'CISO' ? 'Granted root access to aggregate multiple enterprise business units.' : authRole === 'Auditor' ? 'Authorized to view overall scores without control settings.' : 'Unauthorized role. Re-authenticate to access executive views.'}
            </p>
          </div>
        </div>

        {/* Dynamic Simulator Role Controls */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: authRole === 'CISO' ? '#94a3b8' : '#64748b' }}>Simulation Role Switcher:</span>
          {['CISO', 'Auditor', 'Unauthorized'].map(r => (
            <button
              key={r}
              onClick={() => handleAuthChange(r as any)}
              style={{
                fontSize: '0.7rem', fontWeight: 800, padding: '0.35rem 0.65rem', borderRadius: 8, cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                background: authRole === r ? (r === 'CISO' ? '#10b981' : r === 'Auditor' ? '#475569' : '#dc2626') : '#e2e8f0',
                color: authRole === r ? '#fff' : '#475569'
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ── SECURITY CREDENTIALS LOCK PROMPT ── */}
      {pendingRole && (
        <div style={{
          background: '#f8fafc', border: `1px solid ${pendingRole === 'CISO' ? '#10b981' : '#7c3aed'}`, borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.25rem',
          display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 420,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
            🔒 Enter {pendingRole === 'CISO' ? 'CISO Executive' : 'Auditor'} Access Credentials
          </div>
          <form onSubmit={verifyPassword} style={{ display: 'flex', gap: 6 }}>
            <input
              type="password"
              placeholder={`Enter password (hint: ${pendingRole === 'CISO' ? 'ciso123' : 'auditor123'})`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ flex: 1, padding: '0.375rem 0.75rem', fontSize: '0.78rem', borderRadius: 6, border: passwordError ? '1.5px solid #ef4444' : '1px solid #cbd5e1' }}
              autoFocus
            />
            <button type="submit" style={{ padding: '0.375rem 0.85rem', fontSize: '0.78rem', fontWeight: 800, color: '#fff', background: pendingRole === 'CISO' ? '#10b981' : '#7c3aed', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Verify
            </button>
          </form>
          {passwordError && (
            <div style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 700 }}>
              ❌ Incorrect password. Try '{pendingRole === 'CISO' ? 'ciso123' : 'auditor123'}' or '{pendingRole === 'CISO' ? 'admin' : 'audit'}'.
            </div>
          )}
        </div>
      )}

      {/* ── GATE BLOCKED STATE ── */}
      {authRole === 'Unauthorized' ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', border: '1px solid #fee2e2', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#991b1b', marginBottom: '0.5rem' }}>Confidential Executive Dashboard</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: 460, margin: '0 auto 1.5rem' }}>
            This cockpit contains combined risk levels across all subsidiaries. Access is restricted to chief-level executives and authorized auditors. Please authenticate to proceed.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => handleAuthChange('CISO')} 
              style={{ 
                padding: '0.6rem 1.5rem', fontSize: '0.8rem', fontWeight: 800, background: '#ef4444', color: '#fff', 
                border: 'none', borderRadius: 8, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              👑 Authenticate as CISO
            </button>
            <button 
              onClick={() => handleAuthChange('Auditor')} 
              style={{ 
                padding: '0.6rem 1.5rem', fontSize: '0.8rem', fontWeight: 800, background: '#f1f5f9', color: '#475569', 
                border: '1px solid #cbd5e1', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              💼 Authenticate as Auditor
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ========================================================================= */}
          {/* CISO CONFIGURATOR PANEL (COMBINED VIEW SETTINGS) */}
          {/* ========================================================================= */}
          <div className="card" style={{ marginBottom: '1.25rem', padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16 }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>⚙️ Executive Cockpit Configurator</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>Choose which subsidiaries are aggregated and select your custom telemetry widgets layout.</p>
              </div>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe' }}>
                CONFIG PANEL
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {/* Tenant selector checkboxes */}
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>1. Aggregate Business Units</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.50rem' }}>
                  {tenantsMetadata.map(tenant => {
                    const isChecked = selectedTenants.includes(tenant.key);
                    return (
                      <label 
                        key={tenant.key} 
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1rem', background: isChecked ? '#f8fafc' : '#ffffff', 
                          border: isChecked ? `1.5px solid ${tenant.badgeColor}` : '1px solid #e2e8f0', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s' 
                        }}
                      >
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          disabled={authRole === 'Auditor'}
                          onChange={() => toggleTenant(tenant.key)}
                          style={{ accentColor: tenant.badgeColor, cursor: 'pointer' }}
                        />
                        <div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{tenant.name}</span>
                          <span style={{ display: 'block', fontSize: '0.62rem', color: '#94a3b8' }}>
                            Assets: {tenant.assets} · Compliance: {tenant.compliance}% · Critical Risks: {tenant.criticals}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Widget selector checkboxes & Reordering List */}
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  2. Customize & Reorder Telemetry Widgets
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {widgetOrder.map((key, index) => {
                    const meta = widgetMeta[key as keyof typeof widgetMeta];
                    const isChecked = viewWidgets[key];
                    return (
                      <div 
                        key={key}
                        style={{ 
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', 
                          background: isChecked ? '#f5f3ff' : '#ffffff', 
                          border: isChecked ? '1.5px solid #7c3aed' : '1px solid #e2e8f0', 
                          borderRadius: 10, transition: 'all 0.15s'
                        }}
                      >
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flex: 1, fontSize: '0.76rem', fontWeight: 700, color: '#475569' }}>
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            disabled={authRole === 'Auditor'}
                            onChange={() => toggleWidget(key)}
                            style={{ accentColor: '#7c3aed', cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: '0.9rem' }}>{meta.icon}</span>
                          <span>{meta.label}</span>
                        </label>
                        
                        {/* Reordering Controls */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => moveWidget(index, 'up')}
                            disabled={index === 0 || authRole === 'Auditor'}
                            title="Move Up"
                            style={{
                              background: '#f1f5f9', border: 'none', borderRadius: 6, width: 24, height: 24, 
                              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (index === 0 || authRole === 'Auditor') ? 'not-allowed' : 'pointer',
                              fontSize: '0.65rem', fontWeight: 'bold', color: (index === 0 || authRole === 'Auditor') ? '#cbd5e1' : '#475569', transition: 'all 0.15s'
                            }}
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => moveWidget(index, 'down')}
                            disabled={index === widgetOrder.length - 1 || authRole === 'Auditor'}
                            title="Move Down"
                            style={{
                              background: '#f1f5f9', border: 'none', borderRadius: 6, width: 24, height: 24, 
                              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (index === widgetOrder.length - 1 || authRole === 'Auditor') ? 'not-allowed' : 'pointer',
                              fontSize: '0.65rem', fontWeight: 'bold', color: (index === widgetOrder.length - 1 || authRole === 'Auditor') ? '#cbd5e1' : '#475569', transition: 'all 0.15s'
                            }}
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DYNAMIC TELEMETRY WIDGET FEED */}
          {/* ========================================================================= */}
          {widgetOrder.map((widgetId) => {
            if (!viewWidgets[widgetId]) return null;

            switch (widgetId) {
              case 'summary':
                return (
                  <div key="summary" style={{ marginBottom: '1.25rem' }}>
                    {/* WIDGET 1: AGGREGATED SCORE HUD CARDS */}
                    <div className="grid-4">
                      <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div className="stat-card-accent" style={{ background: '#7c3aed' }} />
                          <div className="stat-label">Combined Assets Count</div>
                          <div className="stat-value" style={{ color: '#7c3aed', fontSize: '1.8rem' }}>{totalAssets.toLocaleString()}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', fontSize: '0.58rem', fontWeight: 800, color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '0.35rem', marginTop: '0.5rem' }}>
                          {activeTenants.map(t => (
                            <span key={t.key} style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: t.badgeColor }}>
                              {t.avatar}: {t.assets}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-card-accent" style={{ background: '#10b981' }} />
                        <div className="stat-label">Unified Compliance Score</div>
                        <div className="stat-value" style={{ color: '#10b981', fontSize: '1.8rem' }}>{avgCompliance}%</div>
                        <div className="stat-delta delta-up" style={{ color: avgCompliance >= 80 ? '#10b981' : '#ea580c' }}>
                          {avgCompliance >= 80 ? '🟢 Meets target SLA threshold' : '🟡 Needs security patches'}
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-card-accent" style={{ background: '#dc2626' }} />
                        <div className="stat-label">Total Open Critical Risks</div>
                        <div className="stat-value" style={{ color: '#dc2626', fontSize: '1.8rem' }}>{totalCriticals}</div>
                        <div style={{ display: 'flex', gap: '4px', fontSize: '0.58rem', fontWeight: 800, color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '0.35rem', marginTop: '0.5rem' }}>
                          {activeTenants.map(t => (
                            <span key={t.key} style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#dc2626' }}>
                              {t.avatar}: {t.criticals} Critical
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-card-accent" style={{ background: '#ea580c' }} />
                        <div className="stat-label">SLA Warn Status</div>
                        <div className="stat-value" style={{ color: '#ea580c', fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', height: '100%', display: 'flex', alignItems: 'center' }}>
                          {slaStatus}
                        </div>
                        <div className="stat-delta delta-down" style={{ color: slaStatus === 'CONFORMANCE' ? '#10b981' : '#dc2626' }}>
                          {totalBacklog} total issues in queue
                        </div>
                      </div>
                    </div>
                  </div>
                );

              case 'posture':
                return (
                  <div key="posture" style={{ marginBottom: '1.25rem' }}>
                    {/* WIDGET 2: JOINT COMPLIANCE TRENDS AreaChart */}
                    <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
                      <div className="card-title">📈 Joint Compliance Ratios (History & Projections)</div>
                      <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.85rem' }}>
                        Historical posture trajectory comparing subsidiaries to CISO unified target score.
                      </p>
                      <div style={{ flex: 1 }}>
                        {activeTenants.length === 0 ? (
                          <div style={{ color: '#64748b', fontStyle: 'italic', margin: 'auto', textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Select at least one subsidiary in the Configurator Panel to plot compliance trends...
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={combinedTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                              <defs>
                                <linearGradient id="colorCombined" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[50, 100]} />
                              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                              {selectedTenants.includes('ACME') && <Area type="monotone" dataKey="ACME" name="Acme Financial" stroke="#3b82f6" strokeWidth={2} fill="none" />}
                              {selectedTenants.includes('UR') && <Area type="monotone" dataKey="UR" name="Unified Rentals" stroke="#10b981" strokeWidth={2} fill="none" />}
                              {selectedTenants.length > 1 && <Area type="monotone" dataKey="Combined" name="CISO Combined Average" stroke="#7c3aed" strokeWidth={3} fill="url(#colorCombined)" />}
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>
                );

              case 'threats':
                return (
                  <div key="threats" style={{ marginBottom: '1.25rem' }}>
                    {/* WIDGET 3: CROSS-TENANT TARGETED THREATS */}
                    <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
                      <div className="card-title">🛡️ Cross-Tenant Executive Threat Ledger</div>
                      <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.85rem' }}>
                        Targeted, normalized vulnerabilities requiring direct CISO visibility.
                      </p>
                      <div style={{ flex: 1, overflowY: 'auto' }}>
                        {activeTenants.length === 0 ? (
                          <div style={{ color: '#64748b', fontStyle: 'italic', margin: 'auto', textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Select a subsidiary in the config panel to query joint threat feeds...
                          </div>
                        ) : (
                          <table className="data-table" style={{ fontSize: '0.76rem' }}>
                            <thead>
                              <tr>
                                <th>Asset & BU</th>
                                <th>Threat Vector</th>
                                <th>Severity</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { name: 'payment-processor', bu: 'Acme Financial', vector: 'Weak JWT Decoding Scheme', severity: 'Critical', status: 'In Review' },
                                { name: 'telemetry-cache', bu: 'Unified Rentals', vector: 'Public Ingress Bucket Rules', severity: 'High', status: 'Mitigated' },
                                { name: 'auth-middleware', bu: 'Acme Financial', vector: 'SQL Injection Signature Pattern', severity: 'Critical', status: 'SLA Breach' },
                                { name: 'inventory-db', bu: 'Unified Rentals', vector: 'Unencrypted backup database', severity: 'Medium', status: 'Secured' },
                              ]
                              .filter(t => selectedTenants.includes(t.bu === 'Acme Financial' ? 'ACME' : 'UR'))
                              .map((threat, idx) => (
                                <tr key={idx}>
                                  <td style={{ fontWeight: 700, color: '#0f172a' }}>
                                    {threat.name}
                                    <span style={{ display: 'block', fontSize: '0.58rem', fontWeight: 600, color: '#64748b' }}>{threat.bu}</span>
                                  </td>
                                  <td>{threat.vector}</td>
                                  <td>
                                    <span style={{ fontWeight: 700, color: threat.severity === 'Critical' ? '#dc2626' : threat.severity === 'High' ? '#ea580c' : '#d97706' }}>
                                      {threat.severity}
                                    </span>
                                  </td>
                                  <td>
                                    <span className={`badge badge-${threat.status === 'Secured' || threat.status === 'Mitigated' ? 'low' : 'critical'}`}>
                                      {threat.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                );

              case 'patching':
                return (
                  <div key="patching" style={{ marginBottom: '1.25rem' }}>
                    {/* WIDGET 3.5: VULNERABILITY & PATCHING PERFORMANCE COCKPIT */}
                    <div className="card" style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16 }}>
                      <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>🩹 Vulnerability & Patching Efficiency Score</h3>
                          <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>Audit MTTR remediation velocity and verify compliance with corporate security SLA targets.</p>
                        </div>
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: '#ecfdf5', color: '#10b981', border: '1px solid #a7f3d0' }}>
                          PATCHING METRICS
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 1fr', gap: '2rem' }}>
                        {/* Column 1: Patching Success Rate Progress Ring */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #f1f5f9', paddingRight: '1.5rem' }}>
                          <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                              <circle cx="60" cy="60" r="50" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                              <circle 
                                cx="60" cy="60" r="50" 
                                stroke={patchingGradeColor} 
                                strokeWidth="10" 
                                fill="transparent" 
                                strokeDasharray={`${2 * Math.PI * 50}`}
                                strokeDashoffset={`${2 * Math.PI * 50 * (1 - patchingScore / 100)}`}
                                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                              />
                            </svg>
                            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <span style={{ fontSize: '1.75rem', fontWeight: 900, color: patchingGradeColor, letterSpacing: '-0.04em' }}>{patchingScore}%</span>
                              <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>EFFICIENCY</span>
                            </div>
                          </div>
                          <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b' }}>COMBINED GRADE: </span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: patchingGradeColor }}>{patchingGrade}</span>
                          </div>
                        </div>

                        {/* Column 2: Mean Time to Remediate (MTTR) by Severity */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.75rem' }}>⚡ Mean Time to Remediate (MTTR)</div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            {[
                              { severity: 'Critical', value: mttrCritical, limit: 7, color: '#dc2626' },
                              { severity: 'High Alert', value: mttrHigh, limit: 30, color: '#ea580c' }
                            ].map(item => {
                              const pct = Math.min(100, (item.value / item.limit) * 100);
                              return (
                                <div key={item.severity} style={{ fontSize: '0.74rem' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: 3 }}>
                                    <span style={{ color: '#0f172a' }}>{item.severity} MTTR</span>
                                    <span style={{ color: item.color }}>{item.value} days <span style={{ color: '#94a3b8', fontWeight: 500 }}>(SLA: &lt;{item.limit}d)</span></span>
                                  </div>
                                  <div className="progress-bar-wrap" style={{ height: 6 }}>
                                    <div className="progress-bar-fill" style={{ width: `${pct}%`, background: item.color }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Column 3: SLA Conformances Ratio */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '1rem', borderLeft: '1px solid #f1f5f9' }}>
                          <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.65rem' }}>🎯 SLA Compliance Distribution</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.50rem' }}>
                            {[
                              { label: 'Remediation Conformances', value: selectedTenants.length === 2 ? '1,016 CVEs' : selectedTenants.includes('ACME') ? '418 CVEs' : '598 CVEs', pct: '88%', desc: 'Resolved within SLA deadlines', color: '#10b981' },
                              { label: 'Outstanding SLA Deviations', value: selectedTenants.length === 2 ? '326 CVEs' : selectedTenants.includes('ACME') ? '234 CVEs' : '92 CVEs', pct: '12%', desc: 'Pending or past deadline', color: '#dc2626' }
                            ].map((sla, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '1.25rem' }}>{idx === 0 ? '🟢' : '🔴'}</span>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0f172a' }}>{sla.value}</span>
                                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: sla.color, background: `${sla.color}15`, padding: '1px 4px', borderRadius: 4 }}>{sla.pct}</span>
                                  </div>
                                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{sla.label} · {sla.desc}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );

              case 'remediation':
                return (
                  <div key="remediation" style={{ marginBottom: '1.25rem' }}>
                    {/* WIDGET 4: REMEDIATION & INTEGRATIONS MAP */}
                    <div className="card" style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16 }}>
                      <div className="card-title" style={{ marginBottom: '1rem' }}>🔌 Combined Scanner Integration Status Mapping</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        {[
                          { name: isEnterpriseMode ? 'Wiz CSPM' : 'SkyArmor CSPM', category: 'Cloud Security', bu: 'Joint', state: 'Active', color: '#0ea5e9' },
                          { name: isEnterpriseMode ? 'Prisma Cloud' : 'PrismShield CNAPP', category: 'Compliance', bu: 'Acme Financial', state: 'Active', color: '#c084fc' },
                          { name: isEnterpriseMode ? 'Checkmarx AST' : 'CodeVerify AST', category: 'Application SAST', bu: 'Unified Rentals', state: 'Connected', color: '#10b981' },
                          { name: isEnterpriseMode ? 'Snyk SCA' : 'DepGuard SCA', category: 'Dependencies', bu: 'Joint', state: 'Active', color: '#f43f5e' }
                        ].map((integ, idx) => (
                          <div key={idx} style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, borderLeft: `4px solid ${integ.color}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{integ.name}</span>
                              <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#10b981', background: '#dcfce7', padding: '1px 5px', borderRadius: 4 }}>
                                {integ.state}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{integ.category}</div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 4, fontWeight: 600 }}>Coverage Scope: <span style={{ color: '#0f172a', fontWeight: 700 }}>{integ.bu}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );

              default:
                return null;
            }
          })}
        </>
      )}

    </div>
  );
}
