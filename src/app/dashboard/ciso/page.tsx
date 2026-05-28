'use client';
import { useState } from 'react';
import { useClient } from '@/context/ClientContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const widgetMeta = {
  summary: { label: 'Aggregate Score HUD', icon: '📊', bg: '#f5f3ff', border: '#ddd6fe', activeBorder: '#7c3aed' },
  posture: { label: 'Joint Compliance Trend', icon: '📈', bg: '#f0f9ff', border: '#bae6fd', activeBorder: '#0284c7' },
  framework: { label: 'Regulatory Framework Target Conformance', icon: '📋', bg: '#ecfeff', border: '#a5f3fc', activeBorder: '#0891b2' },
  patching: { label: 'Vulnerability & Patching Efficiency Score', icon: '🩹', bg: '#f0fdf4', border: '#bbf7d0', activeBorder: '#10b981' },
  threats: { label: 'Cross-Tenant Threats', icon: '🛡️', bg: '#fef2f2', border: '#fecaca', activeBorder: '#dc2626' },
  remediation: { label: 'Security Stack Config', icon: '🔌', bg: '#fff7ed', border: '#fed7aa', activeBorder: '#ea580c' }
};

export default function CISOPage() {
  const { isEnterpriseMode } = useClient();

  // CISO Executive View Settings (Higher Management Customizations)
  const [selectedTenants, setSelectedTenants] = useState<string[]>(['WELLS', 'TOYOTA', 'UR', 'CISCO', 'DISNEY']);
  const [viewWidgets, setViewWidgets] = useState<Record<string, boolean>>({
    summary: true,
    posture: true,
    framework: true,
    threats: true,
    remediation: true,
    patching: true
  });

  // Widget Order Management (Site-wide layout reordering)
  const [widgetOrder, setWidgetOrder] = useState<string[]>(['summary', 'posture', 'framework', 'patching', 'threats', 'remediation']);

  const [authRole, setAuthRole] = useState<'CISO' | 'Auditor' | 'Unauthorized'>('CISO');
  const [pendingRole, setPendingRole] = useState<'CISO' | 'Auditor' | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Active Exploit Simulator States
  const [isGroupUnderAttack, setIsGroupUnderAttack] = useState(false);
  const [isGroupMitigating, setIsGroupMitigating] = useState(false);
  const [groupSimProgress, setGroupSimProgress] = useState(0);

  // Active Integrations States
  const [activeIntegrations, setActiveIntegrations] = useState<Record<string, boolean>>({
    cspm: true,
    cnapp: true,
    sast: true,
    sca: true
  });

  // Board Report Modal States
  const [showReportModal, setShowReportModal] = useState(false);
  const [isCompilingReport, setIsCompilingReport] = useState(false);
  const [reportProgress, setReportProgress] = useState(0);
  const [reportLogs, setReportLogs] = useState<string[]>([]);

  // Dynamic Tenant Metadata based on Integration toggles and Attack Wave
  const tenantsMetadata = [
    { 
      key: 'WELLS', 
      name: 'Wells Fargo', 
      avatar: 'WF', 
      assets: activeIntegrations.cnapp ? 14240 : 9800, 
      compliance: isGroupUnderAttack 
        ? 34 
        : Math.max(20, 76 - (!activeIntegrations.cnapp ? 20 : 0) - (!activeIntegrations.sast ? 15 : 0)), 
      criticals: isGroupUnderAttack ? 48 : (12 + (!activeIntegrations.cnapp ? 10 : 0)), 
      backlog: isGroupUnderAttack ? 382 : 184, 
      badgeColor: '#dc2626' 
    },
    {
      key: 'TOYOTA',
      name: 'Toyota',
      avatar: 'TY',
      assets: activeIntegrations.cnapp ? 9450 : 6200,
      compliance: isGroupUnderAttack ? 42 : Math.max(20, 85 - (!activeIntegrations.cnapp ? 15 : 0) - (!activeIntegrations.sast ? 10 : 0)),
      criticals: isGroupUnderAttack ? 36 : (6 + (!activeIntegrations.cnapp ? 8 : 0)),
      backlog: isGroupUnderAttack ? 210 : 78,
      badgeColor: '#ea580c'
    },
    { 
      key: 'UR', 
      name: 'United Rentals', 
      avatar: 'UR', 
      assets: activeIntegrations.cspm ? 5120 : 3100, 
      compliance: isGroupUnderAttack 
        ? 44 
        : Math.max(25, 91 - (!activeIntegrations.cspm ? 25 : 0) - (!activeIntegrations.sca ? 10 : 0)), 
      criticals: isGroupUnderAttack ? 32 : (3 + (!activeIntegrations.cspm ? 18 : 0)), 
      backlog: isGroupUnderAttack ? 218 : 45, 
      badgeColor: '#10b981' 
    },
    {
      key: 'CISCO',
      name: 'CISCO',
      avatar: 'CS',
      assets: activeIntegrations.cspm ? 28400 : 19000,
      compliance: isGroupUnderAttack ? 58 : Math.max(30, 96 - (!activeIntegrations.cspm ? 10 : 0) - (!activeIntegrations.sca ? 5 : 0)),
      criticals: isGroupUnderAttack ? 22 : (1 + (!activeIntegrations.cspm ? 6 : 0)),
      backlog: isGroupUnderAttack ? 84 : 12,
      badgeColor: '#06b6d4'
    },
    {
      key: 'DISNEY',
      name: 'Disney',
      avatar: 'WD',
      assets: activeIntegrations.cspm ? 12650 : 8500,
      compliance: isGroupUnderAttack ? 38 : Math.max(20, 81 - (!activeIntegrations.cspm ? 18 : 0) - (!activeIntegrations.sca ? 12 : 0)),
      criticals: isGroupUnderAttack ? 41 : (8 + (!activeIntegrations.cspm ? 14 : 0)),
      backlog: isGroupUnderAttack ? 280 : 115,
      badgeColor: '#a855f7'
    }
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
  const activeTenantsComplianceSum = activeTenants.reduce((sum, t) => sum + t.compliance, 0);
  const integrationMultiplier = Object.values(activeIntegrations).filter(Boolean).length / 4;
  
  const patchingScore = isGroupUnderAttack
    ? 28
    : (activeTenants.length > 0 
        ? Math.round((activeTenantsComplianceSum / activeTenants.length) * (0.8 + 0.2 * integrationMultiplier))
        : 0);

  const patchingGrade = patchingScore >= 90 ? 'A' : patchingScore >= 80 ? 'B+' : patchingScore >= 70 ? 'B-' : patchingScore >= 60 ? 'C+' : 'D';
  const patchingGradeColor = patchingScore >= 90 ? '#10b981' : patchingScore >= 80 ? '#7c3aed' : patchingScore >= 70 ? '#ea580c' : '#dc2626';

  const mttrCritical = isGroupUnderAttack
    ? 24.8
    : (activeTenants.length > 0 
        ? parseFloat((activeTenants.reduce((sum, t) => {
            const base = t.key === 'WELLS' ? 6.5 : t.key === 'TOYOTA' ? 4.5 : t.key === 'UR' ? 3.0 : t.key === 'CISCO' ? 1.5 : 5.0;
            return sum + base * (2 - integrationMultiplier);
          }, 0) / activeTenants.length).toFixed(1))
        : 0);

  const mttrHigh = isGroupUnderAttack
    ? 45.3
    : (activeTenants.length > 0 
        ? parseFloat((activeTenants.reduce((sum, t) => {
            const base = t.key === 'WELLS' ? 20.5 : t.key === 'TOYOTA' ? 15.0 : t.key === 'UR' ? 8.0 : t.key === 'CISCO' ? 4.2 : 14.5;
            return sum + base * (2 - integrationMultiplier);
          }, 0) / activeTenants.length).toFixed(1))
        : 0);

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

  // Group Simulation Handlers
  const handleTriggerGroupAttack = () => {
    setIsGroupUnderAttack(true);
    setIsGroupMitigating(false);
  };

  const handleTriggerGroupMitigation = () => {
    setIsGroupMitigating(true);
    setGroupSimProgress(0);
    
    const interval = setInterval(() => {
      setGroupSimProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGroupUnderAttack(false);
          setIsGroupMitigating(false);
          // Restore all integrations too if they were toggled off
          setActiveIntegrations({ cspm: true, cnapp: true, sast: true, sca: true });
          return 100;
        }
        return prev + 5;
      });
    }, 120);
  };

  // Board Report Compiler Handler
  const handleCompileReport = () => {
    setShowReportModal(true);
    setIsCompilingReport(true);
    setReportProgress(0);
    setReportLogs([]);

    const logsList = [
      'Initializing CISO Cross-Tenant Security Audit Report Compilation...',
      'Retrieving subsidiary ledger telemetry from Acme Financial Corp...',
      'Retrieving subsidiary ledger telemetry from Unified Rentals...',
      'Querying asset integration databases for active EDR heartbeats...',
      'Validating GRC framework audits (SOC 2, ISO 27001, HIPAA)...',
      'Calculating mean MTTR averages and outstanding SLA Warn metrics...',
      'Generating aggregate CISO posture trend projections...',
      'Signing briefing document with CISO digital private key...',
      'Briefing document ready for executive presentation!'
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setReportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompilingReport(false);
          return 100;
        }
        
        // Add log message
        const newLog = logsList[currentLogIndex];
        if (newLog) {
          setReportLogs(l => [...l, `[${new Date().toLocaleTimeString()}] ${newLog}`]);
          currentLogIndex++;
        }
        return prev + 12.5;
      });
    }, 200);
  };

  // Combined charts data
  const combinedTrendData = [
    { week: 'Week 1', WELLS: 64, TOYOTA: 79, UR: 84, CISCO: 90, DISNEY: 76, Combined: 78.6 },
    { week: 'Week 2', WELLS: 68, TOYOTA: 81, UR: 86, CISCO: 92, DISNEY: 78, Combined: 81.0 },
    { week: 'Week 3', WELLS: 72, TOYOTA: 83, UR: 88, CISCO: 94, DISNEY: 79, Combined: 83.2 },
    { week: 'Week 4', WELLS: 70, TOYOTA: 86, UR: 91, CISCO: 96, DISNEY: 82, Combined: 85.0 },
    { 
      week: 'Week 5', 
      WELLS: tenantsMetadata[0].compliance, 
      TOYOTA: tenantsMetadata[1].compliance, 
      UR: tenantsMetadata[2].compliance, 
      CISCO: tenantsMetadata[3].compliance, 
      DISNEY: tenantsMetadata[4].compliance, 
      Combined: avgCompliance 
    },
  ];

  // Business Unit Framework Breakdown Data
  const frameworkComplianceData = [
    { 
      name: 'NIST CSF', 
      WELLS: activeIntegrations.cnapp ? 76 : 45, 
      TOYOTA: activeIntegrations.cnapp ? 85 : 55, 
      UR: activeIntegrations.cspm ? 91 : 60, 
      CISCO: activeIntegrations.cspm ? 96 : 70, 
      DISNEY: activeIntegrations.cspm ? 81 : 50 
    },
    { 
      name: 'SOC 2', 
      WELLS: activeIntegrations.sast ? 72 : 48, 
      TOYOTA: activeIntegrations.sast ? 82 : 52, 
      UR: activeIntegrations.sca ? 89 : 65, 
      CISCO: activeIntegrations.sca ? 95 : 75, 
      DISNEY: activeIntegrations.sca ? 78 : 55 
    },
    { 
      name: 'ISO 27001', 
      WELLS: activeIntegrations.cnapp && activeIntegrations.sast ? 68 : 35, 
      TOYOTA: activeIntegrations.cnapp && activeIntegrations.sast ? 78 : 42, 
      UR: activeIntegrations.cspm && activeIntegrations.sca ? 88 : 50, 
      CISCO: activeIntegrations.cspm && activeIntegrations.sca ? 94 : 68, 
      DISNEY: activeIntegrations.cspm && activeIntegrations.sca ? 76 : 44 
    },
    { 
      name: 'HIPAA', 
      WELLS: activeIntegrations.sast ? 75 : 40, 
      TOYOTA: activeIntegrations.sast ? 60 : 35, 
      UR: activeIntegrations.cspm ? 82 : 50, 
      CISCO: activeIntegrations.cspm ? 90 : 65, 
      DISNEY: activeIntegrations.cspm ? 85 : 52 
    }
  ];

  return (
    <div className="page-content animate-in" style={{ paddingBottom: '2.5rem' }}>
      
      {/* ── CISO SECURE AUTHORIZATION GATE BAR ── */}
      <div style={{
        background: authRole === 'CISO' ? 'linear-gradient(135deg, #0f172a, #1e293b)' : authRole === 'Auditor' ? '#f8fafc' : '#fee2e2',
        border: authRole === 'CISO' ? (isGroupUnderAttack ? '1px solid #ef4444' : '1px solid #10b981') : authRole === 'Auditor' ? '1px solid #cbd5e1' : '1px solid #f87171',
        borderRadius: 16, padding: '1.25rem 1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        boxShadow: authRole === 'CISO' ? (isGroupUnderAttack ? '0 0 20px rgba(239, 68, 68, 0.2)' : '0 4px 20px rgba(16, 185, 129, 0.1)') : 'none', transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: authRole === 'CISO' ? (isGroupUnderAttack ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)') : authRole === 'Auditor' ? '#e2e8f0' : '#fee2e2',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
          }}>
            {authRole === 'CISO' ? (isGroupUnderAttack ? '🚨' : '👨‍✈️') : authRole === 'Auditor' ? '💼' : '🔒'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: authRole === 'CISO' ? (isGroupUnderAttack ? '#ef4444' : '#34d399') : authRole === 'Auditor' ? '#64748b' : '#ef4444' }}>
                {authRole === 'CISO' ? (isGroupUnderAttack ? '⚠️ LIVE SECURITY CAMPAIGN DETECTED' : 'EXECUTIVE PROFILE ACTIVE') : authRole === 'Auditor' ? 'AUDIT READ-ONLY ROLE' : 'ACCESS DENIED'}
              </span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: authRole === 'CISO' ? (isGroupUnderAttack ? '#ef4444' : '#10b981') : authRole === 'Auditor' ? '#64748b' : '#ef4444' }} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: authRole === 'CISO' ? '#fff' : '#0f172a', margin: '2px 0 0' }}>
              CISO Executive Management Console
            </h4>
            <p style={{ fontSize: '0.74rem', color: authRole === 'CISO' ? '#94a3b8' : '#64748b', marginTop: 2 }}>
              {authRole === 'CISO' ? (isGroupUnderAttack ? 'Critical breach simulation in progress. Multi-tenant assets compromised.' : 'Granted root access to aggregate multiple enterprise business units.') : authRole === 'Auditor' ? 'Authorized to view overall scores without control settings.' : 'Unauthorized role. Re-authenticate to access executive views.'}
            </p>
          </div>
        </div>

        {/* Dynamic Simulator Role Controls & CISO Action Tools */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px', marginRight: 12 }}>
            {authRole === 'CISO' && (
              <>
                <button
                  onClick={handleTriggerGroupAttack}
                  disabled={isGroupUnderAttack || isGroupMitigating}
                  style={{
                    padding: '0.4rem 0.8rem', border: 'none', borderRadius: 8, fontSize: '0.72rem', fontWeight: 800,
                    cursor: (isGroupUnderAttack || isGroupMitigating) ? 'default' : 'pointer',
                    background: (isGroupUnderAttack || isGroupMitigating) ? '#334155' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: (isGroupUnderAttack || isGroupMitigating) ? '#64748b' : '#fff',
                    transition: 'all 0.2s',
                    boxShadow: (isGroupUnderAttack || isGroupMitigating) ? 'none' : '0 2px 8px rgba(239, 68, 68, 0.25)'
                  }}
                >
                  💥 Simulate Group Attack
                </button>
                <button
                  onClick={handleTriggerGroupMitigation}
                  disabled={!isGroupUnderAttack || isGroupMitigating}
                  style={{
                    padding: '0.4rem 0.8rem', border: 'none', borderRadius: 8, fontSize: '0.72rem', fontWeight: 800,
                    cursor: (!isGroupUnderAttack || isGroupMitigating) ? 'default' : 'pointer',
                    background: (!isGroupUnderAttack || isGroupMitigating) ? '#334155' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: (!isGroupUnderAttack || isGroupMitigating) ? '#64748b' : '#fff',
                    transition: 'all 0.2s',
                    boxShadow: (!isGroupUnderAttack || isGroupMitigating) ? 'none' : '0 2px 8px rgba(16, 185, 129, 0.25)'
                  }}
                >
                  🛡️ Deploy Group Mitigation
                </button>
                <button
                  onClick={handleCompileReport}
                  style={{
                    padding: '0.4rem 0.8rem', border: '1px solid #7c3aed', borderRadius: 8, fontSize: '0.72rem', fontWeight: 800,
                    cursor: 'pointer',
                    background: 'rgba(124, 58, 237, 0.15)',
                    color: '#c084fc',
                    transition: 'all 0.2s'
                  }}
                >
                  Briefing Report 📄
                </button>
              </>
            )}
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: authRole === 'CISO' ? '#94a3b8' : '#64748b' }}>Role:</span>
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
          background: '#f8fafc', border: `1px solid ${pendingRole === 'CISO' ? '#10b981' : '#7c3aed'}`, borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1rem',
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
              👨‍✈️ Authenticate as CISO
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
          <div className="card" style={{ marginBottom: '1rem', padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16 }}>
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
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>1. Aggregate Business Units</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                  {tenantsMetadata.map(tenant => {
                    const isChecked = selectedTenants.includes(tenant.key);
                    return (
                      <label 
                        key={tenant.key} 
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1rem', background: isChecked ? '#f8fafc' : '#ffffff', 
                          border: isChecked ? `1.5px solid ${tenant.badgeColor}` : '1px solid #e2e8f0', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
                          flex: 1
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
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  2. Customize & Reorder Telemetry Widgets
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
                  {widgetOrder.map((key, index) => {
                    const meta = widgetMeta[key as keyof typeof widgetMeta];
                    const isChecked = viewWidgets[key];
                    return (
                      <div 
                        key={key}
                        style={{ 
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', 
                          background: isChecked ? meta.bg : '#ffffff', 
                          border: isChecked ? `1.5px solid ${meta.activeBorder}` : `1.5px solid ${meta.border}`, 
                          borderRadius: 10, transition: 'all 0.15s',
                          flex: 1
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

          {/* Group Mitigation Active Loader */}
          {isGroupMitigating && (
            <div className="card" style={{ marginBottom: '1rem', padding: '1.25rem', border: '1px solid #bbf7d0', background: '#f0fdf4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#16a34a', fontFamily: 'monospace', fontWeight: 800, marginBottom: 4 }}>
                <span>🛡️ ORCHESTRATING CROSS-TENANT HOT-PATCH SERVICE DAEMON:</span>
                <span>{Math.round(groupSimProgress)}%</span>
              </div>
              <div style={{ height: 8, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${groupSimProgress}%`, background: '#10b981', transition: 'width 0.15s ease' }} />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DYNAMIC TELEMETRY WIDGET FEED */}
          {/* ========================================================================= */}
          {widgetOrder.map((widgetId) => {
            if (!viewWidgets[widgetId]) return null;

            switch (widgetId) {
              case 'summary':
                return (
                  <div key="summary" style={{ marginBottom: '1rem' }}>
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
                        <div className="stat-card-accent" style={{ background: isGroupUnderAttack ? '#ef4444' : '#10b981' }} />
                        <div className="stat-label">Unified Compliance Score</div>
                        <div className="stat-value" style={{ color: isGroupUnderAttack ? '#ef4444' : '#10b981', fontSize: '1.8rem' }}>{avgCompliance}%</div>
                        <div className="stat-delta delta-up" style={{ color: isGroupUnderAttack ? '#dc2626' : (avgCompliance >= 80 ? '#10b981' : '#ea580c') }}>
                          {isGroupUnderAttack ? '🔴 OUT OF COMPLIANCE SLA' : (avgCompliance >= 80 ? '🟢 Meets target SLA threshold' : '🟡 Needs security patches')}
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
                        <div className="stat-card-accent" style={{ background: isGroupUnderAttack ? '#ef4444' : '#ea580c' }} />
                        <div className="stat-label">SLA Warn Status</div>
                        <div className="stat-value" style={{ color: isGroupUnderAttack ? '#dc2626' : '#ea580c', fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', height: '100%', display: 'flex', alignItems: 'center' }}>
                          {isGroupUnderAttack ? 'CRITICAL SYSTEM BREACH' : slaStatus}
                        </div>
                        <div className="stat-delta delta-down" style={{ color: slaStatus === 'CONFORMANCE' && !isGroupUnderAttack ? '#10b981' : '#dc2626' }}>
                          {totalBacklog} total issues in queue
                        </div>
                      </div>
                    </div>
                  </div>
                );

              case 'posture':
                return (
                  <div key="posture" style={{ marginBottom: '1rem' }}>
                    {/* Left: Joint Compliance Ratios (History & Projections) */}
                    <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
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
                              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[20, 100]} />
                              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                              {selectedTenants.includes('WELLS') && <Area type="monotone" dataKey="WELLS" name="Wells Fargo" stroke="#dc2626" strokeWidth={2} fill="none" />}
                              {selectedTenants.includes('TOYOTA') && <Area type="monotone" dataKey="TOYOTA" name="Toyota" stroke="#ea580c" strokeWidth={2} fill="none" />}
                              {selectedTenants.includes('UR') && <Area type="monotone" dataKey="UR" name="United Rentals" stroke="#10b981" strokeWidth={2} fill="none" />}
                              {selectedTenants.includes('CISCO') && <Area type="monotone" dataKey="CISCO" name="CISCO" stroke="#06b6d4" strokeWidth={2} fill="none" />}
                              {selectedTenants.includes('DISNEY') && <Area type="monotone" dataKey="DISNEY" name="Disney" stroke="#a855f7" strokeWidth={2} fill="none" />}
                              {selectedTenants.length > 1 && <Area type="monotone" dataKey="Combined" name="CISO Combined Average" stroke={isGroupUnderAttack ? '#ef4444' : '#7c3aed'} strokeWidth={3} fill="url(#colorCombined)" />}
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>
                );

              case 'framework':
                return (
                  <div key="framework" style={{ marginBottom: '1rem' }}>
                    {/* Right: Regulatory Framework Target Conformance */}
                    <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
                      <div className="card-title">📊 Regulatory Framework Target Conformance</div>
                      <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.85rem' }}>
                        Side-by-side compliance ratings against global standards.
                      </p>
                      <div style={{ flex: 1 }}>
                        {activeTenants.length === 0 ? (
                          <div style={{ color: '#64748b', fontStyle: 'italic', margin: 'auto', textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Select at least one subsidiary in the Configurator Panel to plot framework comparison...
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={frameworkComplianceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 100]} />
                              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                              {selectedTenants.includes('WELLS') && <Bar dataKey="WELLS" name="Wells Fargo" fill="#dc2626" radius={[4, 4, 0, 0]} barSize={6} />}
                              {selectedTenants.includes('TOYOTA') && <Bar dataKey="TOYOTA" name="Toyota" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={6} />}
                              {selectedTenants.includes('UR') && <Bar dataKey="UR" name="United Rentals" fill="#10b981" radius={[4, 4, 0, 0]} barSize={6} />}
                              {selectedTenants.includes('CISCO') && <Bar dataKey="CISCO" name="CISCO" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={6} />}
                              {selectedTenants.includes('DISNEY') && <Bar dataKey="DISNEY" name="Disney" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={6} />}
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>
                );

              case 'threats':
                return (
                  <div key="threats" style={{ marginBottom: '1rem' }}>
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
                              {isGroupUnderAttack && (
                                <tr style={{ background: '#fef2f2', animation: 'pulse-dot 2s infinite' }}>
                                  <td style={{ fontWeight: 700, color: '#dc2626' }}>
                                    group-wide-perimeter
                                    <span style={{ display: 'block', fontSize: '0.58rem', fontWeight: 600, color: '#ef4444' }}>Joint Enterprise Breach</span>
                                  </td>
                                  <td style={{ color: '#dc2626', fontWeight: 700 }}>🔥 SQL Injection & DDoS Exploit Wave Campaign</td>
                                  <td><span style={{ fontWeight: 700, color: '#dc2626' }}>CRITICAL</span></td>
                                  <td><span className="badge badge-critical">Active Breach</span></td>
                                </tr>
                              )}
                              {[
                                { name: 'swift-payment-router', bu: 'Wells Fargo', key: 'WELLS', vector: 'Weak JWT Decoding Scheme', severity: 'Critical', status: 'In Review' },
                                { name: 'factory-can-bus', bu: 'Toyota', key: 'TOYOTA', vector: 'OT Modbus Public Ingress', severity: 'High', status: 'In Review' },
                                { name: 'telemetry-cache', bu: 'United Rentals', key: 'UR', vector: 'Public Ingress Bucket Rules', severity: 'High', status: 'Mitigated' },
                                { name: 'compiler-pipeline', bu: 'CISCO', key: 'CISCO', vector: 'Leaked GitHub Builder Secret', severity: 'Critical', status: 'Secured' },
                                { name: 'streaming-cdn', bu: 'Disney', key: 'DISNEY', vector: 'Exposed media rig cache', severity: 'Medium', status: 'Secured' },
                              ]
                              .filter(t => selectedTenants.includes(t.key))
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
                  <div key="patching" style={{ marginBottom: '1rem' }}>
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
                              { 
                                label: 'Remediation Conformances', 
                                value: `${activeTenants.reduce((sum, t) => sum + (t.key === 'WELLS' ? 418 : t.key === 'TOYOTA' ? 280 : t.key === 'UR' ? 598 : t.key === 'CISCO' ? 840 : 490), 0).toLocaleString()} CVEs`, 
                                pct: `${avgCompliance}%`, 
                                desc: 'Resolved within SLA deadlines', 
                                color: '#10b981' 
                              },
                              { 
                                label: 'Outstanding SLA Deviations', 
                                value: `${totalBacklog.toLocaleString()} CVEs`, 
                                pct: `${Math.max(0, 100 - avgCompliance)}%`, 
                                desc: 'Pending or past deadline', 
                                color: '#dc2626' 
                              }
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
                  <div key="remediation" style={{ marginBottom: '1rem' }}>
                    {/* WIDGET 4: REMEDIATION & INTEGRATIONS MAP */}
                    <div className="card" style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16 }}>
                      <div className="card-title" style={{ marginBottom: '1rem' }}>🔌 Combined Scanner Integration Status Mapping</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        {[
                          { key: 'cspm', name: isEnterpriseMode ? 'Wiz CSPM' : 'SkyArmor CSPM', category: 'Cloud Security', bu: 'Joint', color: '#0ea5e9' },
                          { key: 'cnapp', name: isEnterpriseMode ? 'Prisma Cloud' : 'PrismShield CNAPP', category: 'Compliance', bu: 'Acme Financial', color: '#c084fc' },
                          { key: 'sast', name: isEnterpriseMode ? 'Checkmarx AST' : 'CodeVerify AST', category: 'Application SAST', bu: 'Unified Rentals', color: '#10b981' },
                          { key: 'sca', name: isEnterpriseMode ? 'Snyk SCA' : 'DepGuard SCA', category: 'Dependencies', bu: 'Joint', color: '#f43f5e' }
                        ].map((integ) => {
                          const isActive = activeIntegrations[integ.key as keyof typeof activeIntegrations];
                          return (
                            <div 
                              key={integ.key} 
                              style={{ 
                                padding: '1rem', 
                                background: '#f8fafc', 
                                border: '1px solid #e2e8f0', 
                                borderRadius: 12, 
                                borderLeft: `4px solid ${integ.color}`,
                                opacity: isActive ? 1 : 0.5,
                                transition: 'opacity 0.2s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: '120px'
                              }}
                            >
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{integ.name}</span>
                                  <span style={{ fontSize: '0.58rem', fontWeight: 800, color: isActive ? '#10b981' : '#dc2626', background: isActive ? '#dcfce7' : '#fee2e2', padding: '1px 5px', borderRadius: 4 }}>
                                    {isActive ? 'Active' : 'Offline'}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{integ.category}</div>
                                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 4, fontWeight: 600 }}>Scope: <span style={{ color: '#0f172a', fontWeight: 700 }}>{integ.bu}</span></div>
                              </div>
                              
                              {/* Toggle switch */}
                              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6rem', color: '#475569', fontWeight: 800, cursor: 'pointer' }}>
                                  <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={() => setActiveIntegrations(prev => ({ ...prev, [integ.key]: !isActive }))}
                                    style={{ accentColor: integ.color, cursor: 'pointer' }}
                                  />
                                  <span>{isActive ? 'DISCONNECT' : 'CONNECT'}</span>
                                </label>
                              </div>
                            </div>
                          );
                        })}
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

      {/* ── CISO BOARD BRIEFING COMPILER OVERLAY MODAL ── */}
      {showReportModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: 20, border: '1px solid #cbd5e1',
            width: '100%', maxWidth: '800px', height: '90vh', display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.05em' }}>CISO BOARD BRIEFING PORTAL</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: '2px 0 0' }}>📄 Executive Cyber Risk Briefing</h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, color: '#94a3b8',
                  padding: '0.4rem 0.8rem', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
              >
                Close Portal ×
              </button>
            </div>

            {/* Compilation Console logs */}
            {isCompilingReport ? (
              <div style={{ flex: 1, background: '#090d16', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#c084fc', fontFamily: 'monospace' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>⚙️</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Compiling Executive Report: {Math.round(reportProgress)}%</div>
                
                {/* Console Log stream box */}
                <div style={{
                  width: '100%', maxWidth: '600px', height: '200px', background: '#020617', border: '1px solid #1e293b',
                  borderRadius: 12, padding: '1rem', display: 'flex', flexDirection: 'column', gap: 6,
                  overflowY: 'auto', textAlign: 'left', fontSize: '0.72rem', color: '#34d399'
                }}>
                  {reportLogs.map((log, idx) => (
                    <div key={idx} style={{ opacity: idx === reportLogs.length - 1 ? 1 : 0.5 }}>{log}</div>
                  ))}
                  <div style={{ width: 1, height: 1 }} />
                </div>
              </div>
            ) : (
              /* Compiled Report details */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '2rem', gap: '1.5rem', background: '#f8fafc' }}>
                {/* Summary Card */}
                <div className="card" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0f172a' }}>Briefing Summary Statistics</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', background: '#dcfce7', padding: '2px 6px', borderRadius: 6 }}>VERIFIED SECURE</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Consolidated Posture Score</div>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: avgCompliance >= 80 ? '#10b981' : '#dc2626' }}>{avgCompliance}/100</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Aggregate Open Risks</div>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: totalCriticals > 10 ? '#dc2626' : '#ea580c' }}>{totalCriticals} Critical</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>SLA Conformance Rate</div>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: patchingScore >= 80 ? '#10b981' : '#7c3aed' }}>{patchingScore}%</div>
                    </div>
                  </div>
                </div>

                {/* BU Breakdown Table */}
                <div className="card" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem' }}>Business Unit Ledger Matrix</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '8px 0', color: '#64748b' }}>SUBSIDIARY NAME</th>
                        <th style={{ padding: '8px 0', color: '#64748b' }}>COMPLIANCE</th>
                        <th style={{ padding: '8px 0', color: '#64748b' }}>CRITICALS</th>
                        <th style={{ padding: '8px 0', color: '#64748b' }}>ASSETS SCOPE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTenants.map(tenant => (
                        <tr key={tenant.key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 0', fontWeight: 800, color: '#0f172a' }}>{tenant.name}</td>
                          <td style={{ padding: '12px 0', color: tenant.compliance >= 80 ? '#10b981' : '#ea580c', fontWeight: 800 }}>{tenant.compliance}%</td>
                          <td style={{ padding: '12px 0', color: '#dc2626', fontWeight: 800 }}>{tenant.criticals} Risks</td>
                          <td style={{ padding: '12px 0', color: '#475569', fontWeight: 700 }}>{tenant.assets} assets</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Audit Action Directive */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', border: '1px solid #cbd5e1', borderRadius: 16, padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>CISO Remediation Action Directives</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4, margin: 0 }}>
                    1. **EDR deployment target**: Increase Unified Rentals agent coverage from 89% to 95% within 14 calendar days. <br />
                    2. **Vulnerability Mitigation SLA**: Ensure all Acme Financial Critical CVSS 9.8 vulnerabilities are hot-patched within 48 hours to avert active campaign vectors. <br />
                    3. **Identity Remediation**: Complete the IAM migration of Entra ID directories to prevent unauthenticated API access.
                  </div>
                </div>
              </div>
            )}
            
            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem', background: '#f1f5f9', borderTop: '1px solid #e2e8f0',
              display: 'flex', justifyContent: 'flex-end', gap: '8px'
            }}>
              <button
                onClick={() => window.print()}
                disabled={isCompilingReport}
                style={{
                  padding: '0.5rem 1.25rem', fontSize: '0.78rem', fontWeight: 800,
                  borderRadius: 8, cursor: isCompilingReport ? 'default' : 'pointer', border: '1px solid #cbd5e1',
                  background: isCompilingReport ? '#cbd5e1' : '#ffffff', color: isCompilingReport ? '#94a3b8' : '#475569'
                }}
              >
                🖨️ Print Board Report
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                style={{
                  padding: '0.5rem 1.25rem', fontSize: '0.78rem', fontWeight: 800,
                  borderRadius: 8, cursor: 'pointer', border: 'none',
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
