'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useClient } from '@/context/ClientContext';
import ModuleCockpitCard, { ModuleCockpitConfig, ModuleLiveData } from '@/components/ModuleCockpitCard';

const radarCockpitConfig: ModuleCockpitConfig = {
  title: 'Risk Radar Telemetry',
  badge: 'Module 06',
  apiEndpoint: '/api/findings/summary',
  rings: [
    { label: 'KEV%', color: '#10b981', glowColor: 'rgba(16,185,129,0.35)' },
    { label: 'EPSS%', color: '#a78bfa', glowColor: 'rgba(167,139,250,0.35)' },
    { label: 'Triaged%', color: '#3b82f6', glowColor: 'rgba(59,130,246,0.35)' },
  ],
  indexLabel: 'RADAR',
  funnel: [
    { label: 'CVE Database', sublabel: 'Total CVE findings cataloged', color: '#7c3aed' },
    { label: 'KEV Matched', sublabel: 'CISA KEV active exploits matched', color: '#ef4444' },
    { label: 'EPSS > 0.6', sublabel: 'High EPSS score exploit probability', color: '#ea580c' },
    { label: 'Actionable Risks', sublabel: 'Top prioritized risks needing triage', color: '#10b981' },
  ],
  gates: ['KEV MATCH', 'EPSS FILTER', 'TRIAGE GATE'],
  syncLabel: 'Telemetry Feeds Scanned',
  checklist: [
    { name: 'KEV Prioritization', desc: 'Prioritize CISA KEV active exploit vectors dynamically.' },
    { name: 'EPSS Score Scaling', desc: 'Incorporate EPSS predictability models for risk assessment.' },
  ],
};

interface TriageFinding {
  id: string;
  cve: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  cvss: number;
  epss: number;
  isKev: boolean;
  asset: string;
  tier: 'Tier-1 Prod' | 'Tier-2 Core' | 'Internal' | 'Dev/Test';
  status: 'Open' | 'Dispatched' | 'Patched' | 'Suppressed';
}

const INITIAL_TRIAGE_FINDINGS: TriageFinding[] = [
  { id: 'tf-01', cve: 'CVE-2026-3400', title: 'Palo Alto PAN-OS Command Injection in GlobalProtect', severity: 'Critical', cvss: 9.8, epss: 0.91, isKev: true, asset: 'edge-ingress-fw01', tier: 'Tier-1 Prod', status: 'Open' },
  { id: 'tf-02', cve: 'CVE-2026-9800', title: 'OpenSSH Race Condition root shell execution (regreSSHion)', severity: 'Critical', cvss: 9.0, epss: 0.88, isKev: true, asset: 'core-db-01.internal', tier: 'Tier-1 Prod', status: 'Open' },
  { id: 'tf-03', cve: 'CVE-2026-1124', title: 'AWS S3 bucket unauthenticated policy data leakage leakage', severity: 'Critical', cvss: 9.1, epss: 0.72, isKev: false, asset: 's3://customer-vault-backup', tier: 'Tier-1 Prod', status: 'Open' },
  { id: 'tf-04', cve: 'CVE-2025-21762', title: 'Fortinet FortiOS SSL-VPN Remote Code Execution', severity: 'Critical', cvss: 9.8, epss: 0.93, isKev: true, asset: 'vpn-gateway-02', tier: 'Tier-1 Prod', status: 'Open' },
  { id: 'tf-05', cve: 'CVE-2025-0282', title: 'Ivanti Connect Secure stack buffer overflow bypass', severity: 'Critical', cvss: 8.8, epss: 0.85, isKev: true, asset: 'connect-sec-01', tier: 'Tier-2 Core', status: 'Open' },
  { id: 'tf-06', cve: 'CVE-2025-3401', title: 'Apache Tomcat RCE via crafted HTTP/2 stream headers', severity: 'High', cvss: 8.2, epss: 0.62, isKev: false, asset: 'tomcat-srv-web3', tier: 'Tier-2 Core', status: 'Open' },
  { id: 'tf-07', cve: 'CVE-2025-8891', title: 'Linux Kernel netfilter privilege escalation exploit', severity: 'High', cvss: 7.8, epss: 0.18, isKev: false, asset: 'prod-k8s-node04', tier: 'Tier-1 Prod', status: 'Open' },
  { id: 'tf-08', cve: 'CVE-2025-44487', title: 'HTTP/2 Rapid Reset DDoS protocol vulnerabilities', severity: 'High', cvss: 7.5, epss: 0.54, isKev: true, asset: 'edge-loadbalancer-01', tier: 'Tier-1 Prod', status: 'Open' },
  { id: 'tf-09', cve: 'CVE-2025-1086', title: 'Local privilege escalation in nf_tables subsystems', severity: 'High', cvss: 7.8, epss: 0.12, isKev: false, asset: 'corp-auth-directory', tier: 'Tier-2 Core', status: 'Open' },
  { id: 'tf-10', cve: 'CVE-2025-47221', title: 'PostgreSQL Server unauthenticated query injection', severity: 'Medium', cvss: 6.5, epss: 0.08, isKev: false, asset: 'dev-fleet-db01', tier: 'Dev/Test', status: 'Open' },
];

export default function SecureTriagePage() {
  const { currentClient } = useClient();
  // Funnel settings
  const [minCvss, setMinCvss] = useState<number>(7.0);
  const [minEpss, setMinEpss] = useState<number>(10);
  const [requireKev, setRequireKev] = useState<boolean>(false);
  const [tier1Only, setTier1Only] = useState<boolean>(false);

  // Findings list status
  const [findings, setFindings] = useState<TriageFinding[]>(INITIAL_TRIAGE_FINDINGS);
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [isPatching, setIsPatching] = useState<string | null>(null);

  // Fetch live findings data
  const [liveData, setLiveData] = useState<ModuleLiveData | null>(null);
  useEffect(() => {
    let active = true;
    fetch('/api/findings/summary')
      .then(res => res.json())
      .then(data => {
        if (active && !data.error) {
          setLiveData(data);
        }
      })
      .catch(err => console.error('[secure fetch]', err));
    return () => { active = false; };
  }, [currentClient.key]);

  // Calculate live funnel numbers
  const rawFindings = 10000;
  
  // F1 Severity Gate reduction calculation
  const afterSeverity = Math.round(rawFindings * (Math.max(10, 100 - (minCvss * 10)) / 100));
  
  // F2 Exploitability reduction calculation
  const epssFactor = requireKev ? 0.08 : (Math.max(5, 100 - minEpss) / 100);
  const afterExploit = Math.round(afterSeverity * 0.32 * epssFactor);

  // F3 Asset Criticality reduction calculation
  const tierFactor = tier1Only ? 0.35 : 1.0;
  const actionableCount = Math.max(8, Math.round(afterExploit * 0.18 * tierFactor));

  // Filter actual table findings based on configuration
  const filteredFindings = findings.filter(f => {
    if (f.cvss < minCvss) return false;
    if (requireKev && !f.isKev) return false;
    if (f.epss * 100 < minEpss) return false;
    if (tier1Only && f.tier !== 'Tier-1 Prod') return false;
    return true;
  });

  // SOAR Ticketing Synchronizers
  const syncJiraToSoar = (cve: string, title: string, asset: string, severity: 'Critical' | 'High' | 'Medium' | 'Low', cvss: number) => {
    if (typeof window === 'undefined') return;
    try {
      const savedRules = localStorage.getItem('posturepilot_routing_rules');
      const rules = savedRules ? JSON.parse(savedRules) : [
        { category: 'Cloud Altitude (AWS/Azure/GCP)', leadName: 'Sarah Connor', leadRole: 'Cloud Security Lead', avatar: 'SC', autoJira: true, autoSnow: false },
        { category: 'Network Runway (Perimeters/FW/VPN)', leadName: 'Devon Vance', leadRole: 'Network Ops Specialist', avatar: 'DV', autoJira: true, autoSnow: true },
        { category: 'App Security Check (OWASP/SAST/DAST)', leadName: 'Marcus Brody', leadRole: 'Application Architect', avatar: 'MB', autoJira: false, autoSnow: true },
        { category: 'Identity PreCheck (SSO/IAM/MFA)', leadName: 'Elena Rostova', leadRole: 'IAM & Zero-Trust Director', avatar: 'ER', autoJira: true, autoSnow: false },
      ];

      // Determine Lead Assignee based on vulnerability asset target
      let lead = rules[2]; // Default: Marcus Brody (AppSec)
      const targetAsset = asset.toLowerCase();
      if (targetAsset.includes('db') || targetAsset.includes('vault') || targetAsset.includes('s3')) {
        lead = rules[0]; // Sarah Connor (Cloud)
      } else if (targetAsset.includes('fw') || targetAsset.includes('vpn') || targetAsset.includes('gateway') || targetAsset.includes('loadbalancer')) {
        lead = rules[1]; // Devon Vance (Network)
      } else if (targetAsset.includes('auth') || targetAsset.includes('directory')) {
        lead = rules[3]; // Elena Rostova (Identity)
      }

      const savedTickets = localStorage.getItem('posturepilot_soar_tickets');
      let tickets = savedTickets ? JSON.parse(savedTickets) : [];

      const savedLogs = localStorage.getItem('posturepilot_soar_logs');
      let logs = savedLogs ? JSON.parse(savedLogs) : [];

      const timestamp = new Date().toLocaleTimeString();
      const ticketId = `JIRA-SEC-${Math.floor(Math.random() * 8000 + 2000)}`;

      // Create new ticket object
      const newTicket = {
        id: ticketId,
        cveId: cve,
        title: title,
        asset: asset,
        assignee: lead.leadName,
        avatar: lead.avatar,
        severity: severity,
        status: 'Dispatched',
        system: 'Jira',
        createdAt: Date.now(),
        slaLimitMs: severity === 'Critical' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
      };

      tickets.unshift(newTicket);
      logs.push(`[${timestamp} SOAR-OVERRIDE] Manual override dispatch triggered by operator on Risk Radar.`);
      logs.push(`[${timestamp} SOAR-ROUTER] Routing mapped asset "${asset}" to Lead: ${lead.leadName}.`);
      logs.push(`[${timestamp} SOAR-JIRA] Dispatched ticket ${ticketId} with live ticking SLA Altimeter.`);

      localStorage.setItem('posturepilot_soar_tickets', JSON.stringify(tickets));
      localStorage.setItem('posturepilot_soar_logs', JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  };

  const syncHotPatchToSoar = (cve: string, asset: string) => {
    if (typeof window === 'undefined') return;
    try {
      const savedTickets = localStorage.getItem('posturepilot_soar_tickets');
      let tickets = savedTickets ? JSON.parse(savedTickets) : [];

      const savedLogs = localStorage.getItem('posturepilot_soar_logs');
      let logs = savedLogs ? JSON.parse(savedLogs) : [];

      const timestamp = new Date().toLocaleTimeString();
      logs.push(`[${timestamp} SOAR-MITIGATE] Manual EDR hot-patch patch action initialized for ${cve} on ${asset}.`);
      
      let matchedCount = 0;
      tickets = tickets.map((t: any) => {
        if (t.cveId === cve) {
          matchedCount++;
          return { ...t, status: 'Resolved' };
        }
        return t;
      });

      if (matchedCount > 0) {
        logs.push(`[${timestamp} SOAR-RESOLVE] Auto-resolved ${matchedCount} associated tickets in live ledger.`);
      } else {
        logs.push(`[${timestamp} SOAR-MITIGATE] Hot-patched successfully! Active ticket ledger on gate remains clear.`);
      }

      localStorage.setItem('posturepilot_soar_tickets', JSON.stringify(tickets));
      localStorage.setItem('posturepilot_soar_logs', JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  };

  const syncSnoozeToSoar = (cve: string) => {
    if (typeof window === 'undefined') return;
    try {
      const savedLogs = localStorage.getItem('posturepilot_soar_logs');
      let logs = savedLogs ? JSON.parse(savedLogs) : [];
      const timestamp = new Date().toLocaleTimeString();
      logs.push(`[${timestamp} SOAR-SNOOZE] Vulnerability ${cve} marked as suppressed (snoozed) by operator.`);
      localStorage.setItem('posturepilot_soar_logs', JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  };

  // Action Handlers
  const handleJiraDispatch = (id: string, cve: string) => {
    const f = findings.find(x => x.id === id);
    if (f) {
      syncJiraToSoar(f.cve, f.title, f.asset, f.severity, f.cvss);
    }
    setFindings(prev => prev.map(f => f.id === id ? { ...f, status: 'Dispatched' } : f));
    setActionLog(prev => [`[JIRA] Created ticket SEC-JIRA-${Math.floor(Math.random() * 9000 + 1000)} for ${cve}. Assigned to SecOps team.`, ...prev.slice(0, 10)]);
  };

  const handleHotPatch = (id: string, cve: string, asset: string) => {
    setIsPatching(id);
    setActionLog(prev => [`[SOC-PATCH] Spawning remediation micro-container for ${cve} on ${asset}...`, ...prev]);

    setTimeout(() => {
      syncHotPatchToSoar(cve, asset);
      setActionLog(prev => [
        `[EDR-SECURE] Enforcing SSH and perimeter port blocks on ${asset}.`,
        `[SUCCESS] Vulnerability hot-patched successfully for ${cve}!`,
        ...prev
      ]);
      setFindings(prev => prev.map(f => f.id === id ? { ...f, status: 'Patched' } : f));
      setIsPatching(null);
    }, 1200);
  };

  const handleSnooze = (id: string, cve: string) => {
    syncSnoozeToSoar(cve);
    setFindings(prev => prev.map(f => f.id === id ? { ...f, status: 'Suppressed' } : f));
    setActionLog(prev => [`[SUPPRESSED] CVE ${cve} marked as suppressed for 90 days (Accepted business risk).`, ...prev.slice(0, 10)]);
  };

  const handleReset = () => {
    setFindings(INITIAL_TRIAGE_FINDINGS.map(f => ({ ...f, status: 'Open' })));
    setMinCvss(7.0);
    setMinEpss(10);
    setRequireKev(false);
    setTier1Only(false);
    setActionLog([`[RESET] All triage conditions restored to baseline defaults.`]);
  };

  return (
    <div className="page-content animate-in" style={{ paddingBottom: '2.5rem' }}>
      
      {/* Dynamic Sticky Banner */}
      <div className="sticky-alert-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', boxShadow: '0 0 8px #7c3aed' }} />
          <div>
            <div style={{ fontWeight: 800, color: '#6d28d9', fontSize: '0.9rem' }}>
              PosturePilot Risk Radar Command Center
            </div>
            <div style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600 }}>
              Hyper-prioritized exposure and triage engine · Active filtering of active exploit vectors
            </div>
          </div>
        </div>
        <button 
          onClick={handleReset} 
          style={{ 
            fontSize: '0.78rem', fontWeight: 700, color: '#6d28d9', background: 'rgba(255, 255, 255, 0.4)', 
            border: '1px solid #c084fc', padding: '0.375rem 0.875rem', borderRadius: 8, cursor: 'pointer',
            transition: 'all 0.15s'
          }}
        >
          🔄 Reset Filters
        </button>
      </div>

      <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
        {[
          { label: 'Total Ingested CVEs', value: rawFindings.toLocaleString(), accent: '#7c3aed', delta: 'From active Wiz/Qualys scans', target: 'Consolidated database' },
          { label: 'High Severity Threats', value: afterSeverity.toLocaleString(), accent: '#4f46e5', delta: `CVSS ≥ ${minCvss.toFixed(1)} threshold`, target: `${filteredFindings.length} match filters` },
          { label: 'Exploitable Vectors', value: afterExploit.toLocaleString(), accent: '#ea580c', delta: 'KEV & EPSS matched', target: `${findings.filter(f => f.isKev).length} active KEV listed` },
          { label: 'Actionable Risks', value: actionableCount.toLocaleString(), accent: '#16a34a', delta: 'Production priority targets', target: `Noise cut by ${((1 - (actionableCount/rawFindings)) * 100).toFixed(1)}%` },
        ].map((s, idx) => {
          const dist = { critical: 15, high: 35, medium: 40, low: 10 };
          return (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value" style={{ color: s.accent }}>{s.value}</div>
              </div>
              
              {idx === 0 ? (
                <div style={{ marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.4rem' }}>
                  {/* Multi-segment vulnerability severity distribution bar */}
                  <div style={{ height: 6, background: '#e2e8f0', borderRadius: 99, display: 'flex', overflow: 'hidden', marginBottom: '0.3rem' }}>
                    <div style={{ width: `${dist.critical}%`, background: '#dc2626' }} title={`Critical: ${dist.critical}%`} />
                    <div style={{ width: `${dist.high}%`, background: '#ea580c' }} title={`High: ${dist.high}%`} />
                    <div style={{ width: `${dist.medium}%`, background: '#fbbf24' }} title={`Medium: ${dist.medium}%`} />
                    <div style={{ width: `${dist.low}%`, background: '#16a34a' }} title={`Low: ${dist.low}%`} />
                  </div>
                  {/* Miniature Severity Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '0.55rem', fontWeight: 800, color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626' }} /> CRT {dist.critical}%</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ea580c' }} /> HIGH {dist.high}%</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24' }} /> MED {dist.medium}%</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }} /> LOW {dist.low}%</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="stat-delta" style={{ color: '#475569', fontSize: '0.72rem', fontWeight: 600, marginTop: '0.25rem' }}>{s.delta}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.25rem' }}>{s.target}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cockpit telemetry card */}
      <ModuleCockpitCard config={radarCockpitConfig} live={liveData} />

      {/* Funnel Config + Funnel Results Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1rem', marginBottom: '1rem' }}>
        
        {/* Step-by-Step Funnel Configurator */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span>🎛️</span> Triage Funnel Parameters
          </div>
          
          {/* Filter 1 */}
          <div style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, background: '#e0e7ff', color: '#4f46e5', padding: '1px 6px', borderRadius: 4 }}>FILTER 1</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>Severity Gate (CVSS)</span>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#4f46e5', background: '#e0e7ff', padding: '1px 6px', borderRadius: 4 }}>
                CVSS ≥ {minCvss.toFixed(1)}
              </span>
            </div>
            <input 
              type="range" 
              min="0.0" 
              max="9.5" 
              step="0.5"
              value={minCvss} 
              onChange={e => setMinCvss(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#4f46e5', cursor: 'pointer' }}
            />
          </div>

          {/* Filter 2 */}
          <div style={{ padding: '0.75rem', background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, background: '#ffedd5', color: '#ea580c', padding: '1px 6px', borderRadius: 4 }}>FILTER 2</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>Exploitability (EPSS & KEV)</span>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#ea580c', background: '#ffedd5', padding: '1px 6px', borderRadius: 4 }}>
                EPSS ≥ {minEpss}%
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="90" 
              value={minEpss} 
              onChange={e => setMinEpss(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#ea580c', cursor: 'pointer', marginBottom: '0.5rem' }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.72rem', fontWeight: 700, color: '#c2410c', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={requireKev} 
                onChange={e => setRequireKev(e.target.checked)}
                style={{ accentColor: '#ea580c' }}
              />
              Restrict to CISA KEV Listed Threats Only (Severe exploit probability)
            </label>
          </div>

          {/* Filter 3 */}
          <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, background: '#fee2e2', color: '#dc2626', padding: '1px 6px', borderRadius: 4 }}>FILTER 3</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>Asset Criticality Gate</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#dc2626' }}>Production Priority</span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.72rem', fontWeight: 700, color: '#991b1b', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={tier1Only} 
                onChange={e => setTier1Only(e.target.checked)}
                style={{ accentColor: '#dc2626' }}
              />
              Isolate Tier-1 Production External Assets Only (Fewer items, high risk)
            </label>
          </div>
        </div>

        {/* Funnel Reduction Visualization Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="card-title">📉 Vulnerability Noise Reduction Funnel</div>
          <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>
            See how policy filters dynamically isolate noise. Hover steps to analyze.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', padding: '0.5rem 0' }}>
            {[
              { label: 'Raw Ingested', val: rawFindings, pct: 100, color: '#cbd5e1', bg: '#f1f5f9' },
              { label: 'After Severity Gate (CVSS)', val: afterSeverity, pct: Math.round((afterSeverity/rawFindings)*100), color: '#4f46e5', bg: '#e0e7ff' },
              { label: 'After Exploitability Gate', val: afterExploit, pct: Math.round((afterExploit/rawFindings)*100), color: '#ea580c', bg: '#ffedd5' },
              { label: 'Prioritized Actionable Items', val: actionableCount, pct: Math.round((actionableCount/rawFindings)*100), color: '#16a34a', bg: '#dcfce7' },
            ].map(step => (
              <div key={step.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, marginBottom: 2 }}>
                  <span style={{ color: '#475569' }}>{step.label}</span>
                  <span style={{ color: step.color }}>
                    {step.val.toLocaleString()} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({step.pct}%)</span>
                  </span>
                </div>
                <div style={{ height: 16, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${step.pct}%`, 
                    background: `linear-gradient(90deg, ${step.color}, ${step.color}dd)`, 
                    borderRadius: 6,
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', 
            border: '1px solid #86efac', 
            borderRadius: 10, 
            padding: '0.5rem 0.75rem',
            textAlign: 'center',
            fontSize: '0.74rem',
            color: '#15803d',
            fontWeight: 800
          }}>
            🎉 Funnel Triage cuts out {((1 - (actionableCount/rawFindings)) * 100).toFixed(2)}% of aggregate security alert noise!
          </div>
        </div>
      </div>

      {/* 6 Metric cards with custom bar displays */}
      <div className="grid-3" style={{ marginBottom: '1rem' }}>
        {[
          {
            title: "Runway Reduction Gates", icon: "📉", color: "#16a34a", desc: "Triage noise reduction gates",
            bars: [
              { l: "Raw Ingested", v: 100, n: rawFindings },
              { l: "Severity Gate", v: Math.max(10, Math.round((afterSeverity/rawFindings)*100)), n: afterSeverity },
              { l: "Exploit Check", v: Math.max(5, Math.round((afterExploit/rawFindings)*100)), n: afterExploit },
              { l: "Actionable", v: Math.max(1, Math.round((actionableCount/rawFindings)*100)), n: actionableCount },
            ]
          },
          {
            title: "CVSS Airspeed Ranges", icon: "📊", color: "#4f46e5", desc: "Filtered CVSS airspeed bands",
            bars: [
              { l: "Critical 9-10", v: minCvss >= 9 ? 100 : 25, n: minCvss >= 9 ? Math.round(actionableCount) : Math.round(actionableCount * 0.3) },
              { l: "High 7-8.9", v: minCvss >= 7 ? 80 : 0, n: minCvss >= 7 && minCvss < 9 ? Math.round(actionableCount * 0.7) : 0 },
              { l: "Medium 4-6.9", v: minCvss <= 4 ? 30 : 0, n: 0 },
              { l: "Low/Info 0-3.9", v: minCvss === 0 ? 10 : 0, n: 0 },
            ]
          },
          {
            title: "EPSS Storm Likelihood", icon: "⚡", color: "#ea580c", desc: "Real weaponized exploit check",
            bars: [
              { l: "EPSS > 50%", v: 100, n: Math.round(actionableCount * 0.4) },
              { l: "EPSS 10-50%", v: minEpss <= 10 ? 70 : 0, n: Math.round(actionableCount * 0.6) },
              { l: "EPSS 1-10%", v: minEpss <= 1 ? 20 : 0, n: 0 },
              { l: "No Exploit", v: minEpss === 0 ? 5 : 0, n: 0 },
            ]
          },
          {
            title: "Hangar Asset Tiers", icon: "🏢", color: "#dc2626", desc: "Host server tier prioritization",
            bars: [
              { l: "Tier-1 Prod", v: 100, n: Math.round(actionableCount * 0.7) },
              { l: "Tier-2 Core", v: tier1Only ? 0 : 60, n: tier1Only ? 0 : Math.round(actionableCount * 0.3) },
              { l: "Internal", v: tier1Only ? 0 : 20, n: 0 },
              { l: "Dev/Test", v: tier1Only ? 0 : 5, n: 0 },
            ]
          },
          {
            title: "KEV Turbulence Rates", icon: "🔐", color: "#7c3aed", desc: "CISA KEV active weaponization coverage",
            bars: [
              { l: "KEV Match", v: 100, n: requireKev ? actionableCount : Math.round(actionableCount * 0.4) },
              { l: "Weaponized", v: 75, n: Math.round(actionableCount * 0.3) },
              { l: "PoC Available", v: 55, n: Math.round(actionableCount * 0.3) },
              { l: "No Exploit", v: requireKev ? 0 : 10, n: 0 },
            ]
          },
          {
            title: "SLA Altimeter Deadlines", icon: "⏰", color: "#d97706", desc: "Hard GRC remediation deadlines",
            bars: [
              { l: "Critical 24h", v: 100, n: Math.round(actionableCount * 0.3) },
              { l: "High 7d", v: 60, n: Math.round(actionableCount * 0.7) },
              { l: "Medium 30d", v: 15, n: 0 },
              { l: "Low 90d", v: 5, n: 0 },
            ]
          }
        ].map(tile => (
          <div key={tile.title} className="card" style={{ padding: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>{tile.icon}</span>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>{tile.title}</span>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 500 }}>{tile.desc}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {tile.bars.map(b => (
                <div key={b.l} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ fontSize: '0.58rem', color: '#64748b', width: 72, flexShrink: 0 }}>{b.l}</span>
                  <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 99 }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${b.v}%`, 
                      background: b.n > 0 ? tile.color : '#e2e8f0', 
                      borderRadius: 99,
                      opacity: b.n > 0 ? 1 : 0.2,
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.58rem', fontWeight: 800, color: b.n > 0 ? tile.color : '#94a3b8', width: 28, textAlign: 'right', flexShrink: 0 }}>
                    {b.n > 0 ? b.n.toLocaleString() : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actionable Findings Table */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a' }}>📋 Prioritized Action Items Ledger</h3>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              The final actionable vulnerabilities matching all configured filters. Dispatch directly to developers.
            </div>
          </div>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac' }}>
            {filteredFindings.length} HIGH-PRIORITY ACTION ITEMS
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ fontSize: '0.75rem' }}>
            <thead>
              <tr>
                <th>CVE ID</th>
                <th>Vulnerability Description</th>
                <th>CVSS</th>
                <th>EPSS</th>
                <th>Asset Target</th>
                <th>Asset Tier</th>
                <th>Remediation Triage Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFindings.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                    No critical actionable alerts found matching current filters. Tweak CVSS or EPSS gates to expand the search.
                  </td>
                </tr>
              ) : (
                filteredFindings.map(f => (
                  <tr key={f.id} style={{ 
                    background: f.status === 'Patched' ? '#f0fdf4' : f.status === 'Suppressed' ? '#f8fafc' : '#fff',
                    opacity: f.status === 'Suppressed' ? 0.6 : 1,
                    transition: 'all 0.15s ease' 
                  }}>
                    <td>
                      <span style={{ 
                        fontFamily: 'monospace', fontWeight: 700, 
                        color: f.status === 'Patched' ? '#10b981' : '#4f46e5' 
                      }}>
                        {f.cve}
                      </span>
                      {f.isKev && (
                        <span style={{ display: 'block', fontSize: '0.58rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', marginTop: 2 }}>
                          🔥 KEV LISTED
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{f.title}</div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: 1 }}>Source: Qualys VMDR API scan</div>
                    </td>
                    <td><span style={{ fontWeight: 700, color: '#dc2626' }}>{f.cvss.toFixed(1)}</span></td>
                    <td><span style={{ fontWeight: 700, color: '#ea580c' }}>{(f.epss * 100).toFixed(0)}%</span></td>
                    <td><code style={{ fontSize: '0.72rem', color: '#475569' }}>{f.asset}</code></td>
                    <td>
                      <span className={`badge badge-${f.tier === 'Tier-1 Prod' ? 'critical' : 'medium'}`}>
                        {f.tier}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {f.status === 'Open' ? (
                          <>
                            <button
                              onClick={() => handleJiraDispatch(f.id, f.cve)}
                              style={{ fontSize: '0.65rem', fontWeight: 800, background: '#4f46e5', color: '#fff', border: 'none', padding: '3px 7px', borderRadius: 4, cursor: 'pointer' }}
                            >
                              Dispatch Jira
                            </button>
                            <button
                              onClick={() => handleHotPatch(f.id, f.cve, f.asset)}
                              disabled={isPatching !== null}
                              style={{ fontSize: '0.65rem', fontWeight: 800, background: '#16a34a', color: '#fff', border: 'none', padding: '3px 7px', borderRadius: 4, cursor: isPatching !== null ? 'not-allowed' : 'pointer' }}
                            >
                              {isPatching === f.id ? 'Patching…' : 'Hot-patch'}
                            </button>
                            <button
                              onClick={() => handleSnooze(f.id, f.cve)}
                              style={{ fontSize: '0.65rem', fontWeight: 800, background: 'none', border: '1px solid #cbd5e1', color: '#64748b', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}
                            >
                              Snooze
                            </button>
                          </>
                        ) : f.status === 'Dispatched' ? (
                          <span style={{ color: '#4f46e5', fontWeight: 800, fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 2 }}>
                            ✓ JIRA DISPATCHED
                          </span>
                        ) : f.status === 'Patched' ? (
                          <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 2 }}>
                            🟢 PATCHED & SECURE
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontWeight: 800, fontSize: '0.68rem' }}>
                            SNOOZED / SNOOZED
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Logs terminal */}
      <div className="card" style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Triage Dispatch & Patch Console
          </span>
          <button 
            onClick={() => setActionLog([])}
            style={{ 
              fontSize: '0.6rem', fontWeight: 800, background: '#1e293b', border: '1px solid #334155', 
              color: '#94a3b8', padding: '1px 6px', borderRadius: 4, cursor: 'pointer' 
            }}
          >
            Clear
          </button>
        </div>
        
        <div style={{ 
          height: '100px', overflowY: 'auto', background: '#020617', padding: '0.75rem', borderRadius: 8, 
          fontFamily: 'monospace', fontSize: '0.7rem', color: '#38bdf8', border: '1px solid #1e293b',
          lineHeight: '1.4'
        }}>
          {actionLog.length === 0 ? (
            <div style={{ color: '#475569', fontStyle: 'italic' }}>Triage Dispatch console active. Choose an action action above...</div>
          ) : (
            actionLog.map((log, idx) => (
              <div key={idx} style={{
                color: log.startsWith('[JIRA') ? '#a78bfa' : log.startsWith('[SUP') ? '#94a3b8' : log.includes('SUCCESS') ? '#34d399' : '#38bdf8',
                marginBottom: 2
              }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
