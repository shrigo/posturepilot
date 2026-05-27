'use client';
import { useState, useEffect } from 'react';
import { useClient } from '@/context/ClientContext';

// Standard identity directory connections
const clientIdentityMeta = {
  WELLS: {
    baseScore: 68,
    riskLevel: 'Medium-High',
    totalUsers: 24800,
    privilegedAdmins: 184,
    orphanedKeys: 24,
    driftPermissions: 42,
    mfaCoverage: 91.2,
    directoryType: 'Microsoft Entra ID Premium',
    ssoIndicator: '🌐 Active SSO Integration: Entra ID WF-Secure API Connected',
    indicators: [
      { name: 'Active User Permissions', count: '14,240 Scopes' },
      { name: 'MFA Coverage Rate', count: '91.2%' },
      { name: 'API Key Staleness (>90d)', count: '48 Keys' }
    ],
    anomalies: [
      { id: 'AN-01', user: 'security-audit@wellsfargo.com', alert: 'SWIFT Vault Impossible Travel', desc: 'Session logins from New York, US and Berlin, Germany within 15 minutes targeting SWIFT databases.', severity: 'critical' },
      { id: 'AN-02', user: 'temp-admin@wellsfargo.com', alert: 'Privileged Transaction Inactivity', desc: 'Active administrator banking session without active browser events > 2 hours.', severity: 'high' },
      { id: 'AN-03', user: 'api-service-sync@wells.internal', alert: 'SSO Token Drift Detection', desc: 'Access token generated with excessive wildcards and unencrypted egress rules.', severity: 'medium' }
    ],
    roles: [
      { id: 'RL-01', name: 'SWIFT Admin Group', usersCount: 12, permissionLevel: 'Root Administrator', driftStatus: 'Excessive Wildcards' },
      { id: 'RL-02', name: 'Contractor SSO Access', usersCount: 45, permissionLevel: 'Developer Access', driftStatus: 'MFA Bypass Active' },
      { id: 'RL-03', name: 'Database Sync Profile', usersCount: 6, permissionLevel: 'DB Owner Root', driftStatus: 'Stale Credentials (>90d)' }
    ]
  },
  TOYOTA: {
    baseScore: 82,
    riskLevel: 'Medium',
    totalUsers: 9450,
    privilegedAdmins: 78,
    orphanedKeys: 8,
    driftPermissions: 19,
    mfaCoverage: 95.8,
    directoryType: 'Okta SSO (Toyota ID Link)',
    ssoIndicator: '🌐 Active SSO Integration: Toyota Okta Portal Linked',
    indicators: [
      { name: 'Active User Permissions', count: '9,450 Scopes' },
      { name: 'MFA Coverage Rate', count: '95.8%' },
      { name: 'API Key Staleness (>90d)', count: '14 Keys' }
    ],
    anomalies: [
      { id: 'AN-01', user: 'ics-engineer@toyota-motor.com', alert: 'PLC Modbus Anomaly Ingress', desc: 'Robotic assembly line Modbus controller scanned by an unauthenticated developer SSO token.', severity: 'critical' },
      { id: 'AN-02', user: 'supplier-portal@toyota-motor.com', alert: 'SSO Token Infiltration sweep', desc: 'Supplier credential active on internal QA repositories from a Tor egress proxy.', severity: 'high' }
    ],
    roles: [
      { id: 'RL-01', name: 'ICS Plant Engineer Group', usersCount: 18, permissionLevel: 'Factory Owner Root', driftStatus: 'Excessive IAM Permissions' },
      { id: 'RL-02', name: 'Vendor Portal Support', usersCount: 32, permissionLevel: 'Partner SSO Access', driftStatus: 'MFA Bypass Active' }
    ]
  },
  UR: {
    baseScore: 91,
    riskLevel: 'Optimal',
    totalUsers: 5120,
    privilegedAdmins: 45,
    orphanedKeys: 2,
    driftPermissions: 7,
    mfaCoverage: 98.2,
    directoryType: 'Microsoft Entra ID',
    ssoIndicator: '🌐 Active SSO Integration: United Rentals Entra ID Connected',
    indicators: [
      { name: 'Active User Permissions', count: '5,120 Scopes' },
      { name: 'MFA Coverage Rate', count: '98.2%' },
      { name: 'API Key Staleness (>90d)', count: '2 Keys' }
    ],
    anomalies: [
      { id: 'AN-04', user: 'fleet-ops-admin@unitedrentals.com', alert: 'Orphaned SSH Key Authentication', desc: 'Successful login utilizing an orphaned, stale SSH key without active ticket logs.', severity: 'critical' },
      { id: 'AN-05', user: 'rental-portal-sync@ur.internal', alert: 'API Key Anomaly', desc: 'Unusual outbound request volume initiated within 2 minutes.', severity: 'high' }
    ],
    roles: [
      { id: 'RL-04', name: 'Global Fleet Sync Profile', usersCount: 3, permissionLevel: 'Root Owner', driftStatus: 'Stale SSH Key Used' },
      { id: 'RL-05', name: 'Customer Portal Support', usersCount: 18, permissionLevel: 'Support Agent Access', driftStatus: 'Excessive IAM Permissions' }
    ]
  },
  CISCO: {
    baseScore: 96,
    riskLevel: 'Optimal',
    totalUsers: 28400,
    privilegedAdmins: 12,
    orphanedKeys: 1,
    driftPermissions: 3,
    mfaCoverage: 99.7,
    directoryType: 'Duo Federated SSO Portal',
    ssoIndicator: '🌐 Active SSO Integration: Duo Enterprise Identity Synced',
    indicators: [
      { name: 'Active User Permissions', count: '28,400 Scopes' },
      { name: 'MFA Coverage Rate', count: '99.7%' },
      { name: 'API Key Staleness (>90d)', count: '0 Keys' }
    ],
    anomalies: [
      { id: 'AN-01', user: 'devops-lead@cisco.com', alert: 'Leaked GitHub Builder Secret', desc: 'SSO session linked to compiler script pipeline showing leaked token calls from a foreign subnet.', severity: 'critical' }
    ],
    roles: [
      { id: 'RL-01', name: 'Duo Root Security Architects', usersCount: 5, permissionLevel: 'Global Tenant Admin', driftStatus: 'Privilege Drift Scanned' }
    ]
  },
  DISNEY: {
    baseScore: 81,
    riskLevel: 'Medium',
    totalUsers: 12650,
    privilegedAdmins: 115,
    orphanedKeys: 12,
    driftPermissions: 28,
    mfaCoverage: 94.6,
    directoryType: 'Disney Okta Active Directory',
    ssoIndicator: '🌐 Active SSO Integration: Disney Okta Directory Sync Active',
    indicators: [
      { name: 'Active User Permissions', count: '12,650 Scopes' },
      { name: 'MFA Coverage Rate', count: '94.6%' },
      { name: 'API Key Staleness (>90d)', count: '18 Keys' }
    ],
    anomalies: [
      { id: 'AN-01', user: 'cdn-editor@disney.com', alert: 'Media CDN Render Farm Anomaly', desc: 'SSO login targeting unreleased render servers showing impossible travel session shifts.', severity: 'critical' },
      { id: 'AN-02', user: 'writer-temp@disney.com', alert: 'Stale Writer SSO Session Active', desc: 'Privileged writer session open for over 6 hours without browser focus events.', severity: 'high' }
    ],
    roles: [
      { id: 'RL-01', name: 'CDN Render Farm Admin Group', usersCount: 14, permissionLevel: 'Grid Administrator', driftStatus: 'Excessive IAM Permissions' },
      { id: 'RL-02', name: 'Creative Portal Access', usersCount: 85, permissionLevel: 'Developer Access', driftStatus: 'Stale Credentials (>90d)' }
    ]
  }
};

export default function IdentityPage() {
  const { currentClient, isEnterpriseMode } = useClient();

  // Mitigated travel/SSO anomalies states
  const [mitigatedAnomalies, setMitigatedAnomalies] = useState<Record<string, boolean>>({});

  // Restricted/Optimized IAM roles states
  const [optimizedRoles, setOptimizedRoles] = useState<Record<string, boolean>>({});

  // Glassy terminal log states
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTask, setActiveTask] = useState<string | null>(null);

  // Sync baseline whenever client changes
  useEffect(() => {
    setMitigatedAnomalies({});
    setOptimizedRoles({});
    setActiveTask(null);
    setIsSyncing(false);
    setTerminalLogs([
      `[SSO DIRECTORY] Identity directory successfully linked: ${currentClient.name}`,
      `[SSO DIRECTORY] Connected to standard secure authentication protocols.`,
      `[INFO] Scan active anomalies or deprovision excessive privilege scopes to secure identity posture.`
    ]);
  }, [currentClient.key]);

  // Resolve active metadata
  const activeMeta = clientIdentityMeta[currentClient.key as 'WELLS' | 'TOYOTA' | 'UR' | 'CISCO' | 'DISNEY'] || clientIdentityMeta.WELLS;

  // Real-time dynamic recalculations
  const mitigatedCount = Object.keys(mitigatedAnomalies).length;
  const optimizedCount = Object.keys(optimizedRoles).length;

  const overallScore = Math.min(100, activeMeta.baseScore + (mitigatedCount * 4) + (optimizedCount * 3));
  const activeAlertsCount = Math.max(0, activeMeta.anomalies.length - mitigatedCount);
  const privilegedCount = Math.max(0, activeMeta.privilegedAdmins - optimizedCount);
  const permissionDrifts = Math.max(0, activeMeta.driftPermissions - (optimizedCount * 4));
  const zeroTrustStatus = overallScore >= 85 ? 'OPTIMIZED' : overallScore >= 75 ? 'CONFORMANCE' : 'SECURITY DEVIATION';

  // Revoke compromised SSO User Session simulator
  const handleRevokeSession = (anomalyId: string, userMail: string, alertName: string) => {
    if (isSyncing) return;
    setIsSyncing(true);
    setActiveTask(anomalyId);
    setTerminalLogs(prev => [...prev, `[IDENTITY THREAT RESPONSE] Initiating remote session revocation for ${userMail}...`]);

    const auditTool = isEnterpriseMode ? 'Prisma Cloud API' : 'PrismShield Posture CNAPP';
    const logsSequence = [
      `[IDENTITY THREAT RESPONSE] Querying directory tokens via ${activeMeta.directoryType}...`,
      `[IDENTITY THREAT RESPONSE] Transmitting active session revoke signal... [SUCCESS]`,
      `[VERIFY] Enforcing immediate MFA re-challenge key rotation...`,
      `[GRC SYNC] Logging incident containment record via ${auditTool}...`,
      `[SUCCESS] Mitigated: Session '${alertName}' revoked for ${userMail}!`,
      `[SUCCESS] Recalculating Zero Trust access ratings...`
    ];

    let delay = 250;
    logsSequence.forEach((log, idx) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, log]);
        if (idx === logsSequence.length - 1) {
          setIsSyncing(false);
          setMitigatedAnomalies(prev => ({ ...prev, [anomalyId]: true }));
        }
      }, delay);
      delay += 350;
    });
  };

  // Deprovision excessive administrative roles
  const handleRestrictRole = (roleId: string, roleName: string, driftName: string) => {
    if (isSyncing) return;
    setIsSyncing(true);
    setActiveTask(roleId);
    setTerminalLogs(prev => [...prev, `[IAM ROLE AUDITOR] Deprovisioning excessive privileges for role: ${roleName}...`]);

    const scannerName = isEnterpriseMode ? 'Wiz CSPM' : 'SkyArmor posture connector';
    const logsSequence = [
      `[IAM ROLE AUDITOR] Inspecting IAM wildcards via ${scannerName}...`,
      `[IAM ROLE AUDITOR] Removing permission drift vector: ${driftName}...`,
      `[VERIFY] Re-auditing active permission scopes... [ROLE RESTRICTED]`,
      `[SUCCESS] Deprovisioned: ${roleName} successfully optimized to standard Least Privilege!`,
      `[SUCCESS] Recalculating privileged account statistics...`
    ];

    let delay = 300;
    logsSequence.forEach((log, idx) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, log]);
        if (idx === logsSequence.length - 1) {
          setIsSyncing(false);
          setOptimizedRoles(prev => ({ ...prev, [roleId]: true }));
        }
      }, delay);
      delay += 400;
    });
  };

  // Directory Sync trigger simulator
  const handleDirectorySync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTerminalLogs(prev => [...prev, `[DIRECTORY SYNC] Initializing active user synchronization for ${activeMeta.directoryType}...`]);

    const logsSequence = [
      `[DIRECTORY SYNC] Sweeping directory membership scopes...`,
      `[DIRECTORY SYNC] Checked ${activeMeta.totalUsers} active identity tokens.`,
      `[DIRECTORY SYNC] MFA Coverage verified: ${activeMeta.mfaCoverage}% Enforced.`,
      `[DIRECTORY SYNC] Synchronized successfully! Dynamic Zero Trust rating up to date.`
    ];

    let delay = 300;
    logsSequence.forEach((log, idx) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, log]);
        if (idx === logsSequence.length - 1) {
          setIsSyncing(false);
        }
      }, delay);
      delay += 400;
    });
  };

  // Reset console sandbox
  const handleResetSandbox = () => {
    setMitigatedAnomalies({});
    setOptimizedRoles({});
    setTerminalLogs([
      `[RESET] Directory sandbox baselines completely restored.`,
      `[RESET] Identity postures synchronized back to defaults.`,
      `[INFO] Choose an active SSO travel anomaly to revoke session.`
    ]);
    setActiveTask(null);
    setIsSyncing(false);
  };

  return (
    <div className="page-content animate-in" style={{ paddingBottom: '2.5rem' }}>
      
      {/* ── STICKY DIRECTORY SYNC BANNER ── */}
      <div className="sticky-alert-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', boxShadow: '0 0 8px #7c3aed' }} />
          <div>
            <div style={{ fontWeight: 800, color: '#6d28d9', fontSize: '0.9rem' }}>
              Identity PreCheck — SSO Directory Auditing ({activeMeta.directoryType})
            </div>
            <div style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600 }}>
              {activeMeta.ssoIndicator}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handleResetSandbox}
            style={{
              fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', background: 'rgba(255, 255, 255, 0.4)', 
              border: '1px solid #c084fc', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '4px'
            }}
          >
            🔄 Reset Sandbox
          </button>
          <button 
            onClick={handleDirectorySync}
            disabled={isSyncing}
            style={{ 
              fontSize: '0.78rem', fontWeight: 800, color: '#fff', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', 
              border: 'none', padding: '0.5rem 1.25rem', borderRadius: 8, cursor: isSyncing ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)', transition: 'all 0.15s'
            }}
          >
            {isSyncing && activeTask === null ? 'Syncing...' : 'Sync SSO Directory'}
          </button>
        </div>
      </div>

      {/* ── ZERO TRUST STATS HUD ── */}
      <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
        
        {/* Aggregate Zero Trust Progress Dial */}
        <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
          <div className="stat-card-accent" style={{ background: '#7c3aed' }} />
          <div style={{ position: 'relative', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="45" cy="45" r="38" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
              <circle 
                cx="45" cy="45" r="38" 
                stroke="#7c3aed" strokeWidth="8" fill="transparent" 
                strokeDasharray={`${2 * Math.PI * 38}`}
                strokeDashoffset={`${2 * Math.PI * 38 * (1 - overallScore / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#7c3aed', letterSpacing: '-0.04em' }}>{overallScore}%</span>
            </div>
          </div>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', marginTop: 10, textTransform: 'uppercase' }}>Zero Trust Score</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent" style={{ background: '#dc2626' }} />
          <div className="stat-label">SSO Travel / Login Alerts</div>
          <div className="stat-value" style={{ color: '#dc2626', fontSize: '1.8rem', marginTop: 4 }}>{activeAlertsCount}</div>
          <div className="stat-delta" style={{ color: mitigatedCount > 0 ? '#10b981' : '#dc2626', fontWeight: 800 }}>
            {mitigatedCount > 0 ? `🟢 Revoked ${mitigatedCount} hijacked tokens` : '🚨 High CVSS travel spikes'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent" style={{ background: '#ea580c' }} />
          <div className="stat-label">Excessive IAM Drift Roles</div>
          <div className="stat-value" style={{ color: '#ea580c', fontSize: '1.8rem', marginTop: 4 }}>{permissionDrifts}</div>
          <div className="stat-delta" style={{ color: '#ea580c', fontWeight: 800 }}>
            Drifts from standard privilege
          </div>
        </div>

        <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="stat-card-accent" style={{ background: '#059669' }} />
          <div>
            <div className="stat-label">Zero Trust Status</div>
            <div className="stat-value" style={{ color: overallScore >= 80 ? '#059669' : '#ea580c', fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', marginTop: 4 }}>
              {zeroTrustStatus}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: 6 }}>
              {overallScore >= 80 ? '🟢 Identity parameters are optimal' : '🟡 Revoke active anomalies to secure credentials'}
            </div>
          </div>
        </div>

      </div>

      {/* ── ROW 2: SSO TRAVEL ANOMALIES & ROLE DRIFT AUDIT ── */}
      <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
        
        {/* SSO IDENTITY THREAT DETECTION (ITDR) WIDGET */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-title">🚨 Active SSO Travel & Authentication Anomaly Alerts</div>
          <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '1rem' }}>
            Real-time Identity Threat Detection (ITDR) showing login anomalies. Revoke compromised user tokens in real-time.
          </p>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {activeAlertsCount === 0 ? (
              <div style={{ color: '#059669', fontStyle: 'italic', margin: 'auto', textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '2.5rem' }}>🟢</span>
                <span style={{ fontWeight: 800 }}>SSO Sessions Secure! All hijacked tokens successfully revoked.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activeMeta.anomalies.map(anom => {
                  const isRevoked = !!mitigatedAnomalies[anom.id];
                  if (isRevoked) return null;
                  return (
                    <div 
                      key={anom.id}
                      style={{
                        padding: '0.75rem 1rem', background: '#fffafb', border: '1px solid #fca5a5', borderRadius: 12,
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#991b1b' }}>{anom.alert}</span>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: '#4b5563', marginTop: 1 }}>User: <strong>{anom.user}</strong></span>
                        </div>
                        <span className="badge badge-critical">{anom.severity}</span>
                      </div>
                      <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '4px 0 8px' }}>{anom.desc}</p>
                      <button
                        onClick={() => handleRevokeSession(anom.id, anom.user, anom.alert)}
                        disabled={isSyncing}
                        style={{
                          fontSize: '0.68rem', fontWeight: 800, background: '#dc2626', color: '#fff', border: 'none',
                          padding: '4px 10px', borderRadius: 6, cursor: isSyncing ? 'not-allowed' : 'pointer', alignSelf: 'flex-start',
                          boxShadow: '0 2px 6px rgba(220, 38, 38, 0.1)', transition: 'all 0.15s'
                        }}
                      >
                        Revoke Session & Lock Credential
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* HIGH PRIVILEGE ROLE DRIFT AUDITOR */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-title">🔑 High Privilege Role Drift Auditor</div>
          <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '1rem' }}>
            List high-risk administrative user roles showing permission drift. Deprovision excessive permissions to enforce Least Privilege.
          </p>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <table className="data-table" style={{ fontSize: '0.76rem' }}>
              <thead>
                <tr>
                  <th>Administrative Role</th>
                  <th>Permission Drift Status</th>
                  <th>Least Privilege Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeMeta.roles.map(role => {
                  const isOptimized = !!optimizedRoles[role.id];
                  return (
                    <tr key={role.id} style={{ background: isOptimized ? '#f0fdf4' : 'transparent', transition: 'all 0.2s' }}>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>
                        {role.name}
                        <span style={{ display: 'block', fontSize: '0.58rem', fontWeight: 600, color: '#64748b', marginTop: 1 }}>
                          Scope: {role.permissionLevel} · ({role.usersCount} users)
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${isOptimized ? 'low' : 'high'}`}>
                          {isOptimized ? 'Least Privilege Enforced' : role.driftStatus}
                        </span>
                      </td>
                      <td>
                        {isOptimized ? (
                          <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.72rem' }}>✓ Optimized Role</span>
                        ) : (
                          <button
                            onClick={() => handleRestrictRole(role.id, role.name, role.driftStatus)}
                            disabled={isSyncing}
                            style={{
                              fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6, cursor: isSyncing ? 'not-allowed' : 'pointer',
                              border: 'none', background: '#7c3aed', color: '#fff', boxShadow: '0 2px 6px rgba(124,58,237,0.1)'
                            }}
                          >
                            Restrict Role
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MFA Coverage rates card */}
          <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: 10, border: '1px dashed #cbd5e1', marginTop: '1rem' }}>
            <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>Directory MFA Coverage</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 600 }}>Active Directory Enrolled Accounts:</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#059669' }}>{activeMeta.mfaCoverage}% Enforced</span>
            </div>
            <div className="progress-bar-wrap" style={{ height: 6, marginTop: 6 }}>
              <div className="progress-bar-fill" style={{ width: `${activeMeta.mfaCoverage}%`, background: '#059669' }} />
            </div>
          </div>

        </div>

      </div>

      {/* ── GLASSMORPHIC ITDR SCROLLING CONSOLE TERMINAL ── */}
      <div className="card" style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.50rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: isSyncing ? '#ef4444' : '#10b981', display: 'inline-block' }} />
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              💻 IAM Terminal — Live Session & Privilege Deprovisioner
            </span>
          </div>
          <button 
            onClick={() => setTerminalLogs([])}
            style={{ 
              fontSize: '0.65rem', fontWeight: 800, background: '#1e293b', border: '1px solid #334155', 
              color: '#94a3b8', padding: '2px 8px', borderRadius: 4, cursor: 'pointer' 
            }}
          >
            Clear Console
          </button>
        </div>
        
        <div style={{ 
          height: '140px', overflowY: 'auto', background: '#020617', padding: '1rem', borderRadius: 10, 
          fontFamily: 'monospace', fontSize: '0.72rem', color: '#38bdf8', border: '1px solid #1e293b',
          lineHeight: '1.4'
        }}>
          {terminalLogs.map((log, idx) => (
            <div key={idx} style={{
              color: log.startsWith('[ERR') ? '#f87171' : log.startsWith('[WARN') ? '#fbbf24' : log.startsWith('[IDENTITY') ? '#c084fc' : log.startsWith('[SUCCESS') ? '#34d399' : log.startsWith('[IAM') ? '#f472b6' : '#38bdf8',
              marginBottom: 4
            }}>
              {log}
            </div>
          ))}
          <div style={{ display: 'inline-block', width: 6, height: 12, background: '#38bdf8', marginLeft: 2, verticalAlign: 'middle', animation: 'blink 1s infinite' }} />
        </div>
      </div>

    </div>
  );
}
