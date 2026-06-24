'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { useClient } from '@/context/ClientContext';
import { cloudData } from '@/data/mockData';
import Link from 'next/link';
import ModuleCockpitCard, { ModuleCockpitConfig, ModuleLiveData } from '@/components/ModuleCockpitCard';

const cloudCockpitConfig: ModuleCockpitConfig = {
  title: 'Cloud Altitude Telemetry',
  badge: 'Module 02',
  apiEndpoint: '/api/findings/cloud',
  rings: [
    { label: 'IAM%', color: '#10b981', glowColor: 'rgba(16,185,129,0.35)' },
    { label: 'Storage%', color: '#a78bfa', glowColor: 'rgba(167,139,250,0.35)' },
    { label: 'Compute%', color: '#3b82f6', glowColor: 'rgba(59,130,246,0.35)' },
  ],
  indexLabel: 'ALTITUDE',
  funnel: [
    { label: 'Cloud Assets', sublabel: 'Total cloud resources inventory', color: '#7c3aed' },
    { label: 'IAM Drifts', sublabel: 'IAM permission drift alerts', color: '#ef4444' },
    { label: 'Exposed Buckets', sublabel: 'Publicly readable storage containers', color: '#ea580c' },
    { label: 'Quarantined Keys', sublabel: 'Stale / leaked cloud credentials quarantined', color: '#10b981' },
  ],
  gates: ['IAM AUDIT', 'BUCKET SCAN', 'KEY ROTATE'],
  syncLabel: 'CNAPP Nodes Connected',
  checklist: [
    { name: 'CIS Benchmark Audited', desc: 'Verify CIS controls compliance across AWS/Azure/GCP environments.' },
    { name: 'Credential Protection', desc: 'Secure cloud service accounts and rotate credential access keys.' },
  ],
};

// Detailed public cloud storage buckets configured per tenant
const initialExposedBuckets: Record<string, { id: string; name: string; type: string; provider: string; exposure: string; status: 'Exposed' | 'Secured' }[]> = {
  ACME: [
    { id: 'b1', name: 'acme-financial-invoice-db', type: 'AWS S3', provider: 'Amazon Web Services', exposure: 'Public Ingress Rule', status: 'Exposed' },
    { id: 'b2', name: 'customer-id-cards-temp', type: 'AWS S3', provider: 'Amazon Web Services', exposure: 'AllUsers Read Permission', status: 'Exposed' },
    { id: 'b3', name: 'billing-cache-storage', type: 'GCS', provider: 'Google Cloud Platform', exposure: 'Public Read Access', status: 'Exposed' },
    { id: 'b4', name: 'marketing-assets-pub', type: 'Azure Blob', provider: 'Microsoft Azure', exposure: 'Anonymous Access Allowed', status: 'Exposed' },
    { id: 'b4-oci', name: 'acme-core-backup-oci', type: 'OCI Object', provider: 'Oracle Cloud Infrastructure', exposure: 'Public Object Access', status: 'Exposed' }
  ],
  UR: [
    { id: 'b5', name: 'ur-fleet-telemetry-cache', type: 'AWS S3', provider: 'Amazon Web Services', exposure: 'Public Ingress Rule', status: 'Exposed' },
    { id: 'b5-oci', name: 'ur-logistics-archive-oci', type: 'OCI Object', provider: 'Oracle Cloud Infrastructure', exposure: 'Public Bucket Access', status: 'Exposed' }
  ]
};

const riskColor: Record<string, string> = { 
  High: '#dc2626', 
  Medium: '#d97706', 
  Low: '#16a34a', 
  Compliant: '#059669', 
  'At Risk': '#dc2626' 
};

export default function CloudPage() {
  const { currentClient, isEnterpriseMode } = useClient();
  const mfaPct = cloudData.iamMetrics.mfaCoverage;

  // Simulator State Management
  const [remediatedIds, setRemediatedIds] = useState<string[]>([]);
  const [cloudFilter, setCloudFilter] = useState<'ALL' | 'AWS' | 'Azure' | 'GCP' | 'OCI'>('ALL');
  const [connectedTools, setConnectedTools] = useState<Record<string, boolean>>({ native: true, skyarmor: false, prismshield: true });
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [activeTool, setActiveTool] = useState<'native' | 'skyarmor' | 'prismshield'>('native');

  // Reset simulator values on client change for repeatable demo presentations
  useEffect(() => {
    setRemediatedIds([]);
    setSyncLogs([]);
    setSyncProgress(0);
    setIsSyncing(false);
    setCloudFilter('ALL');
  }, [currentClient.key]);

  // Fetch live findings data
  const [liveData, setLiveData] = useState<ModuleLiveData | null>(null);
  useEffect(() => {
    let active = true;
    fetch('/api/findings/cloud')
      .then(res => res.json())
      .then(data => {
        if (active && !data.error) {
          setLiveData(data);
        }
      })
      .catch(err => console.error('[cloud fetch]', err));
    return () => { active = false; };
  }, [currentClient.key]);

  // Resolve exposed storage buckets for dynamic calculation
  const bucketsList = initialExposedBuckets[currentClient.key] || [];
  const filteredBuckets = bucketsList.filter(b => {
    if (cloudFilter === 'ALL') return true;
    if (cloudFilter === 'AWS') return b.type.startsWith('AWS');
    if (cloudFilter === 'Azure') return b.type.startsWith('Azure');
    if (cloudFilter === 'GCP') return b.type.startsWith('GCS');
    if (cloudFilter === 'OCI') return b.type.startsWith('OCI');
    return true;
  });

  const activeBuckets = filteredBuckets.map(b => ({
    ...b,
    status: remediatedIds.includes(b.id) ? ('Secured' as const) : ('Exposed' as const)
  }));

  const exposedCount = activeBuckets.filter(b => b.status === 'Exposed').length;
  const remediatedCount = activeBuckets.filter(b => b.status === 'Secured').length;

  const cloudWeights = { ALL: 1.0, AWS: 0.5, Azure: 0.3, GCP: 0.15, OCI: 0.05 };
  const w = cloudWeights[cloudFilter];

  // Dynamic values driven by active client context & interactive remediation actions
  const baseAssets = Math.round((currentClient.key === 'UR' ? 3842 : 1247) * w);
  const baseCompliance = currentClient.key === 'UR' ? 89 : 71;
  const dynamicCompliance = Math.min(100, baseCompliance + (remediatedCount * 6));
  const baseMisconfigs = Math.round((currentClient.key === 'UR' ? 16 : 38) * w);
  const dynamicMisconfigs = Math.max(0, baseMisconfigs - (remediatedCount * 3));

  const topStats = [
    { label: 'Total Cloud Assets', value: baseAssets.toLocaleString(), accent: '#7c3aed', delta: `Verifying subnet rules` },
    { label: 'Misconfigured Assets', value: String(dynamicMisconfigs), accent: '#dc2626', delta: `Detected by active agents` },
    { label: 'Cloud Compliance Score', value: `${dynamicCompliance}%`, accent: '#7c3aed', delta: `Syncing CIS benchmarks` },
    { label: 'Public Buckets Exposed', value: String(exposedCount), accent: '#ea580c', delta: `Needs immediate remediation` },
  ];

  // Dynamic bar data based on dynamic compliance level
  const dynamicBarData = [
    { name: 'Compute', critical: Math.round((currentClient.key === 'UR' ? 2 : 8) * w), high: Math.round((currentClient.key === 'UR' ? 3 : 12) * w), medium: Math.round((currentClient.key === 'UR' ? 1 : 6) * w) },
    { name: 'Storage', critical: Math.max(0, Math.round(((currentClient.key === 'UR' ? 1 : 4) - remediatedCount) * w)), high: Math.round((currentClient.key === 'UR' ? 1 : 3) * w), medium: Math.round((currentClient.key === 'UR' ? 4 : 9) * w) },
    { name: 'Identity', critical: Math.round((currentClient.key === 'UR' ? 0 : 2) * w), high: Math.round((currentClient.key === 'UR' ? 4 : 8) * w), medium: Math.round((currentClient.key === 'UR' ? 2 : 4) * w) },
    { name: 'Network', critical: Math.round((currentClient.key === 'UR' ? 1 : 1) * w), high: Math.round((currentClient.key === 'UR' ? 2 : 4) * w), medium: Math.round((currentClient.key === 'UR' ? 3 : 7) * w) },
  ];

  // Interactive CNAPP scanning worker
  const runConnectorSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncProgress(0);
    setSyncLogs([
      `[INIT] Bootstrapping CNAPP security orchestrator node...`,
      `[AUTH] Authenticating session credentials with multi-cloud accounts...`
    ]);

    const scannerSteps: Record<string, { progress: number; log: string }[]> = {
      native: [
        { progress: 15, log: `[PosturePilot Engine] Establishing direct secure API credentials tunnel...` },
        { progress: 35, log: `[Direct AWS IAM] Swapping credentials & checking S3 bucket ACL configurations...` },
        { progress: 55, log: `[Direct Azure AppReg] Querying Blob Storage anonymous read access policies...` },
        { progress: 75, log: `[Direct GCP ServiceAccount] Auditing Cloud Storage permissions & KMS encryption...` },
        { progress: 90, log: `[Direct OCI APIKey] Scanning Oracle Cloud Object Storage buckets in Ashburn-1 namespace...` },
        { progress: 100, log: `[COMPLETE] PosturePilot Direct Sweep finished. Identified ${exposedCount} vulnerable multi-cloud buckets. Synced!` }
      ],
      skyarmor: [
        { progress: 25, log: isEnterpriseMode ? `[Wiz CSPM] Establishing secure API link to Wiz tenant cloud...` : `[SkyArmor CSPM] Establishing secure session via SkyArmor API Gateway...` },
        { progress: 60, log: isEnterpriseMode ? `[Wiz CSPM] Ingesting agentless VM scans, Orca vulnerability indices & Lacework triggers...` : `[SkyArmor CSPM] Ingesting external agentless VM & Kubernetes workload vulnerability telemetry...` },
        { progress: 100, log: isEnterpriseMode ? `[COMPLETE] Wiz CSPM, Orca & Lacework API data successfully synced.` : `[COMPLETE] SkyArmor CSPM telemetry ingested successfully. Zero critical alerts.` }
      ],
      prismshield: [
        { progress: 25, log: isEnterpriseMode ? `[Prisma Cloud] Tunnelling to Palo Alto Prisma Cloud compliance aggregate...` : `[PrismShield CNAPP] Connecting to PrismShield multicloud compliance controller...` },
        { progress: 60, log: isEnterpriseMode ? `[Prisma Cloud] Extracting active Prisma configuration audits, Sysdig metrics & CIS reports...` : `[PrismShield CNAPP] Pulling unified configuration audit logs & CIS benchmark reports...` },
        { progress: 100, log: isEnterpriseMode ? `[COMPLETE] Prisma Cloud & Sysdig compliance telemetry synced. Dashboard refreshed.` : `[COMPLETE] PrismShield compliance telemetry synced. PosturePilot dashboards updated.` }
      ]
    };

    const targetSteps = scannerSteps[activeTool];
    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex < targetSteps.length) {
        const step = targetSteps[stepIndex];
        setSyncProgress(step.progress);
        setSyncLogs(prev => [...prev, step.log]);
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsSyncing(false);
      }
    }, 800);
  };

  // Perform cloud bucket lock down remediation
  const remediateBucket = (bucketId: string) => {
    const bucket = bucketsList.find(b => b.id === bucketId);
    setRemediatedIds(prev => [...prev, bucketId]);
    
    setIsSyncing(true);
    setSyncProgress(10);
    setSyncLogs(prev => [...prev, `[SHIELD] Locking down public storage bucket '${bucket?.name || 'Bucket'}'...`]);

    setTimeout(() => {
      setSyncProgress(50);
      setSyncLogs(prev => [...prev, `[IAM POLICY] Enforcing private access ACL policies on '${bucket?.type || 'S3'}'...`]);
    }, 400);

    setTimeout(() => {
      setSyncProgress(100);
      setSyncLogs(prev => [
        ...prev, 
        `[ENCRYPTION] Enabling standard KMS encryption key block policies...`,
        `[COMPLETE] Bucket '${bucket?.name || 'Bucket'}' is now secured! Status: 🟢 Encrypted (Safe)`
      ]);
      setIsSyncing(false);
    }, 800);
  };

  return (
    <>
      <div className="page-content animate-in">

        {/* Dynamic Tool Connection Alert Banner */}
        <div className="sticky-alert-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', boxShadow: '0 0 8px #7c3aed' }} />
            <div>
              <div style={{ fontWeight: 800, color: '#6d28d9', fontSize: '0.9rem' }}>
                PosturePilot Cloud Security Command Center // {isEnterpriseMode ? 'Wiz CSPM & Prisma CNAPP' : 'SkyArmor CSPM & PrismShield CNAPP'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600 }}>
                Active Cloud Scope: <span style={{ fontWeight: 800 }}>{cloudFilter === 'ALL' ? 'AWS, Azure, GCP & OCI (All accounts)' : `${cloudFilter} Account Scope`}</span> · Exposure: {exposedCount} buckets vulnerable · Cloud Score: {dynamicCompliance}%
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={cloudFilter}
              onChange={(e) => setCloudFilter(e.target.value as any)}
              style={{
                fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', background: 'rgba(255, 255, 255, 0.4)', 
                border: '1px solid #c084fc', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)', outline: 'none'
              }}
            >
              <option value="ALL">☁️ All Cloud Providers (Unified)</option>
              <option value="AWS">☁️ AWS Accounts Only</option>
              <option value="Azure">☁️ Microsoft Azure Only</option>
              <option value="GCP">☁️ Google Cloud Only</option>
              <option value="OCI">☁️ Oracle Cloud Only</option>
            </select>
            <button 
              onClick={() => {
                setRemediatedIds(bucketsList.map(b => b.id));
                setIsSyncing(true);
                setSyncProgress(0);
                setSyncLogs([
                  `[SHIELD] Mass lock initiated across all exposed cloud storage objects...`,
                  `[SHIELD] Blocking public anonymous access on all ${bucketsList.length} buckets...`,
                  `[ENCRYPTION] Enforcing KMS encryption block policies...`,
                  `[COMPLETE] Multi-cloud secure posture updated. 100% compliant!`
                ]);
              }}
              style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', padding: '0.5rem 1.25rem', borderRadius: 8, cursor: 'pointer', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)' }}
            >
              🔒 Remediate All Exposures
            </button>
          </div>
        </div>

        {/* Dynamic HUD cards */}
        <div className="grid-4">
          {topStats.map((s, idx) => {
            const isAssetCard = idx === 0;
            const dist = currentClient.key === 'UR' 
              ? { aws: 50, azure: 25, gcp: 15, oci: 10 }
              : { aws: 40, azure: 30, gcp: 20, oci: 10 };
            
            return (
              <div key={s.label} className="stat-card">
                <div>
                  <div className="stat-card-accent" style={{ background: s.accent }} />
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value" style={{ color: s.accent, fontSize: '1.8rem', lineHeight: '1.15' }}>{s.value}</div>
                </div>
                
                {isAssetCard ? (
                  <div style={{ marginTop: '0.65rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                    {/* Multi-segment cloud distribution bar */}
                    <div style={{ height: 6, background: '#e2e8f0', borderRadius: 99, display: 'flex', overflow: 'hidden', marginBottom: '0.3rem' }}>
                      <div style={{ width: `${dist.aws}%`, background: '#FF9900' }} title={`AWS: ${dist.aws}%`} />
                      <div style={{ width: `${dist.azure}%`, background: '#0078D4' }} title={`Azure: ${dist.azure}%`} />
                      <div style={{ width: `${dist.gcp}%`, background: '#06b6d4' }} title={`GCP: ${dist.gcp}%`} />
                      <div style={{ width: `${dist.oci}%`, background: '#f43f5e' }} title={`OCI: ${dist.oci}%`} />
                    </div>
                    {/* Miniature Cloud Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '0.55rem', fontWeight: 800, color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF9900' }} /> AWS {dist.aws}%</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0078D4' }} /> AZ {dist.azure}%</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4' }} /> GCP {dist.gcp}%</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f43f5e' }} /> OCI {dist.oci}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="stat-delta delta-down" style={{ marginTop: '0.25rem' }}>{s.delta}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cockpit telemetry card */}
        <ModuleCockpitCard config={cloudCockpitConfig} live={liveData} />

        {/* ========================================================================= */}
        {/* CNAPP TOOLS CONNECTORS & CONSOLE LOGS ROW */}
        {/* ========================================================================= */}
        <div className="card" style={{ marginBottom: '1.25rem', padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16 }}>
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>🔌 PosturePilot Hybrid Engine & Scanner Telemetry</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>Audit native direct multi-cloud connection logs or pull telemetry from external partners.</p>
            </div>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: '#ecfeff', color: '#0891b2', border: '1px solid #a5f3fc' }}>
              HYBRID SYNC
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
            {/* Tool Connectors list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { 
                  id: 'native', 
                  title: 'PosturePilot Hybrid Engine', 
                  desc: 'Direct secure API connection to AWS, Azure, GCP & OCI', 
                  key: 'native', 
                  icon: '⚡' 
                },
                { 
                  id: 'skyarmor', 
                  title: isEnterpriseMode ? 'Wiz CSPM' : 'SkyArmor CSPM', 
                  desc: isEnterpriseMode ? 'Supports Wiz, Orca & Lacework workloads' : 'External agentless workload scan aggregator', 
                  key: 'skyarmor', 
                  icon: '✨' 
                },
                { 
                  id: 'prismshield', 
                  title: isEnterpriseMode ? 'Prisma Cloud CNAPP' : 'PrismShield CNAPP', 
                  desc: isEnterpriseMode ? 'Supports Prisma, CrowdStrike & Sysdig compliance' : 'External multicloud CIS compliance aggregator', 
                  key: 'prismshield', 
                  icon: '🔴' 
                }
              ].map(tool => {
                const isActive = connectedTools[tool.id];
                return (
                  <div
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id as any)}
                    style={{
                      padding: '0.75rem 1rem',
                      background: activeTool === tool.id ? '#ecfeff' : '#f8fafc',
                      border: activeTool === tool.id ? '2.5px solid #0891b2' : '1px solid #e2e8f0',
                      borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>{tool.icon} {tool.title}</span>
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          setConnectedTools(prev => ({ ...prev, [tool.id]: !isActive }));
                        }}
                        style={{
                          fontSize: '0.58rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4, cursor: 'pointer',
                          background: isActive ? '#dcfce7' : '#fee2e2',
                          color: isActive ? '#15803d' : '#dc2626'
                        }}
                      >
                        {isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.3 }}>{tool.desc}</div>
                  </div>
                );
              })}

              <button
                onClick={runConnectorSync}
                disabled={isSyncing || !connectedTools[activeTool]}
                style={{
                  background: isSyncing || !connectedTools[activeTool] ? '#cbd5e1' : 'linear-gradient(135deg, #0891b2, #0e7490)',
                  color: isSyncing || !connectedTools[activeTool] ? '#64748b' : '#fff', border: 'none', padding: '0.65rem',
                  borderRadius: 6, fontWeight: 800, fontSize: '0.78rem', cursor: isSyncing || !connectedTools[activeTool] ? 'default' : 'pointer',
                  boxShadow: isSyncing || !connectedTools[activeTool] ? 'none' : '0 4px 12px rgba(8, 145, 178, 0.2)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.25rem'
                }}
              >
                {!connectedTools[activeTool] ? 'Enable Scanner to Sync' : isSyncing ? 'Syncing...' : activeTool === 'native' ? 'Run PosturePilot Deep Sweep ⚡' : 'Sync External Telemetry ⚡'}
              </button>
            </div>

            {/* Simulated Logs Terminal Console */}
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '1rem', display: 'flex', flexDirection: 'column', height: '280px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem', marginBottom: '0.65rem', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                </div>
                <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', color: '#64748b' }}>cnapp_diagnostic_node@posturepilot: ~</span>
              </div>

              {isSyncing && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#22d3ee', fontFamily: 'monospace', marginBottom: 2 }}>
                    <span>DIAGNOSTIC POLLING ACTIVE:</span>
                    <span>{syncProgress}%</span>
                  </div>
                  <div style={{ height: 4, background: '#1e293b', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${syncProgress}%`, background: '#0891b2', transition: 'width 0.3s ease' }} />
                  </div>
                </div>
              )}

              <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.72rem', color: '#8ec5fc', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {syncLogs.length === 0 ? (
                  <div style={{ color: '#475569', fontStyle: 'italic', margin: 'auto', textAlign: 'center' }}>
                    Select an active cloud connector from the left panel and click<br/>"Sync Active Tool Telemetry" to pull diagnostic scanning streams...
                  </div>
                ) : (
                  syncLogs.map((log, i) => (
                    <div key={i} style={{ color: log.includes('Alert') || log.includes('WARN') ? '#fbbf24' : log.includes('COMPLETE') ? '#34d399' : '#93c5fd', whiteSpace: 'pre-wrap' }}>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE STORAGE SHIELD & IAM DETAILS ROW */}
        {/* ========================================================================= */}
        <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
          
          {/* S3 Storage Shield Simulator */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '320px' }}>
            <div className="card-title">🔒 Storage Exposure Remediation Shield</div>
            <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.85rem' }}>
              Active unencrypted storage objects public access locks.
            </p>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {activeBuckets.length === 0 ? (
                <div style={{ color: '#16a34a', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.8rem' }}>
                  🟢 Zero Public Storage Exposure Detected!
                </div>
              ) : (
                <table className="data-table" style={{ fontSize: '0.76rem' }}>
                  <thead>
                    <tr>
                      <th>Bucket Asset</th>
                      <th>Risk Policy</th>
                      <th>Status</th>
                      <th>Remediation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeBuckets.map(b => (
                      <tr key={b.id}>
                        <td style={{ fontWeight: 700, color: '#0f172a' }}>{b.name}<span style={{ display: 'block', fontSize: '0.58rem', fontWeight: 600, color: '#94a3b8' }}>{b.type} · {b.provider}</span></td>
                        <td style={{ color: '#dc2626', fontWeight: 600 }}>{b.exposure}</td>
                        <td>
                          {b.status === 'Secured' ? (
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#15803d', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} /> Encrypted (Safe)
                            </span>
                          ) : (
                            <span className="badge badge-critical" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626', display: 'inline-block', boxShadow: '0 0 6px #dc2626' }} /> Exposed!
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => remediateBucket(b.id)}
                            disabled={b.status === 'Secured'}
                            style={{
                              padding: '0.35rem 0.65rem', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: '0.62rem', cursor: b.status === 'Secured' ? 'default' : 'pointer',
                              background: b.status === 'Secured' ? '#f1f5f9' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                              color: b.status === 'Secured' ? '#94a3b8' : '#fff',
                              boxShadow: b.status === 'Secured' ? 'none' : '0 2px 6px rgba(124, 58, 237, 0.15)'
                            }}
                          >
                            {b.status === 'Secured' ? '🔒 Secured' : 'Restrict Access'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* IAM Configuration Profile */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '320px' }}>
            <div className="card-title">🪪 IAM Entitlements & Identity Risk Dashboard</div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#475569', fontWeight: 600 }}>MFA Coverage</span>
                <span style={{ fontWeight: 700, color: mfaPct >= 90 ? '#16a34a' : mfaPct >= 70 ? '#d97706' : '#dc2626' }}>{mfaPct}%</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${mfaPct}%`, background: mfaPct >= 90 ? '#16a34a' : mfaPct >= 70 ? '#d97706' : '#dc2626' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', flex: 1 }}>
              {[
                { label: 'Total Accounts', value: cloudData.iamMetrics.totalAccounts, color: '#3b82f6' },
                { label: 'Privileged Roles', value: cloudData.iamMetrics.privilegedAccounts, color: '#7c3aed' },
                { label: 'Orphaned Users', value: cloudData.iamMetrics.orphanedAccounts, color: '#dc2626' },
                { label: 'Stale Credentials', value: cloudData.iamMetrics.staleCredentials, color: '#ea580c' },
                { label: 'Excessive Perms', value: cloudData.iamMetrics.excessivePermissions, color: '#d97706' },
                { label: 'MFA Enabled', value: cloudData.iamMetrics.mfaEnabled, color: '#059669' },
              ].map(m => (
                <div key={m.label} style={{ padding: '0.5rem', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.58rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.label}</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: m.color, marginTop: '0.1rem' }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* COMPLIANCE CHARTS & ASSETS GRID */}
        {/* ========================================================================= */}
        <div className="grid-2">
          
          {/* Recharts BarChart with key remount draw animations */}
          <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
            <div className="card-title">📊 Cloud Misconfigurations by Category</div>
            <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.85rem' }}>
              Counts categorized by cloud workload layer.
            </p>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart key="cloud-category-misconfigurations" data={dynamicBarData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="critical" name="Critical" fill="#dc2626" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="high" name="High" fill="#ea580c" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="medium" name="Medium" fill="#d97706" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cloud Asset table */}
          <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
            <div className="card-title">📋 CIS Benchmark Cloud Asset Summary</div>
            <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.85rem' }}>
              Dynamic inventory mapping across all tenant resources.
            </p>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table className="data-table" style={{ fontSize: '0.78rem' }}>
                <thead>
                  <tr>
                    <th>Asset Type</th>
                    <th>Count</th>
                    <th>IAM Risk</th>
                    <th>Storage Exposure</th>
                    <th>Config Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { 
                      type: cloudFilter === 'AWS' ? 'Compute EC2 Hosts' : cloudFilter === 'Azure' ? 'Virtual Machines (VM)' : cloudFilter === 'GCP' ? 'Compute Engine VM' : cloudFilter === 'OCI' ? 'Bare Metal Shapes' : 'Unified Compute Hosts', 
                      count: Math.round((currentClient.key === 'UR' ? 418 : 148) * w), 
                      iamRisk: 'High', 
                      storageExposure: 'Medium', 
                      configStatus: 'Compliant' 
                    },
                    { 
                      type: cloudFilter === 'AWS' ? 'Storage Objects S3' : cloudFilter === 'Azure' ? 'Blob Storage Containers' : cloudFilter === 'GCP' ? 'Cloud Storage Buckets' : cloudFilter === 'OCI' ? 'Object Storage Buckets' : 'Unified Storage Buckets', 
                      count: Math.round((currentClient.key === 'UR' ? 189 : 89) * w), 
                      iamRisk: 'Medium', 
                      storageExposure: exposedCount > 0 ? 'At Risk' : 'Compliant', 
                      configStatus: exposedCount > 0 ? 'At Risk' : 'Compliant' 
                    },
                    { 
                      type: 'Identity IAM Roles', 
                      count: Math.round((currentClient.key === 'UR' ? 167 : 67) * w), 
                      iamRisk: 'High', 
                      storageExposure: 'Low', 
                      configStatus: 'Compliant' 
                    },
                    { 
                      type: cloudFilter === 'AWS' ? 'VPC Subnets & Gateway' : cloudFilter === 'Azure' ? 'VNET Subnets & WAN' : cloudFilter === 'GCP' ? 'VPC Network Subnets' : cloudFilter === 'OCI' ? 'VCN Subnets & Gateway' : 'Unified Subnet Networks', 
                      count: Math.round((currentClient.key === 'UR' ? 98 : 38) * w), 
                      iamRisk: 'Low', 
                      storageExposure: 'Medium', 
                      configStatus: 'Compliant' 
                    },
                  ].map(a => (
                    <tr key={a.type}>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>{a.type}</td>
                      <td>{a.count}</td>
                      <td><span style={{ fontWeight: 700, color: riskColor[a.iamRisk] || '#475569' }}>{a.iamRisk}</span></td>
                      <td><span style={{ fontWeight: 700, color: riskColor[a.storageExposure] || '#475569' }}>{a.storageExposure}</span></td>
                      <td><span className={`badge badge-${a.configStatus === 'Compliant' ? 'low' : 'critical'}`}>{a.configStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
