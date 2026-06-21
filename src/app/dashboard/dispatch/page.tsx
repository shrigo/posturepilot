'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useClient } from '@/context/ClientContext';
import Link from 'next/link';
import ModuleCockpitCard, { ModuleCockpitConfig, ModuleLiveData } from '@/components/ModuleCockpitCard';

const dispatchCockpitConfig: ModuleCockpitConfig = {
  title: 'Dispatch Center Telemetry',
  badge: 'Module 09',
  apiEndpoint: '/api/findings/summary',
  rings: [
    { label: 'Routed%', color: '#10b981', glowColor: 'rgba(16,185,129,0.35)' },
    { label: 'Ticketed%', color: '#a78bfa', glowColor: 'rgba(167,139,250,0.35)' },
    { label: 'Resolved%', color: '#3b82f6', glowColor: 'rgba(59,130,246,0.35)' },
  ],
  indexLabel: 'DISPATCH',
  funnel: [
    { label: 'Alerts Ingested', sublabel: 'Total security alerts ingested', color: '#7c3aed' },
    { label: 'SOAR Routed', sublabel: 'Alerts auto-routed by SOAR playbooks', color: '#ef4444' },
    { label: 'Tickets Generated', sublabel: 'Tickets created in Jira / ServiceNow', color: '#ea580c' },
    { label: 'Incidents Resolved', sublabel: 'Mitigated and closed alerts', color: '#10b981' },
  ],
  gates: ['SOAR ROUTE', 'JIRA TICKET', 'SNow SYNC'],
  syncLabel: 'Routing Integrations',
  checklist: [
    { name: 'SOAR Automation', desc: 'Verify SOAR routing rules and auto-ticket generation pipelines.' },
    { name: 'SLA Tracking', desc: 'Monitor ticket SLA breaches and escalate overdue incidents.' },
  ],
};

interface RoutingRule {
  category: string;
  leadName: string;
  leadRole: string;
  avatar: string;
  autoJira: boolean;
  autoSnow: boolean;
}

interface SoarTicket {
  id: string;
  cveId: string;
  title: string;
  asset: string;
  assignee: string;
  avatar: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Dispatched' | 'Remediation In-Flight' | 'Resolved';
  system: 'Jira' | 'ServiceNow';
  createdAt: number;
  slaLimitMs: number; // Duration of SLA in ms (e.g. 24h for critical)
}

const DEFAULT_ROUTING_RULES: RoutingRule[] = [
  { category: 'Cloud Altitude (AWS/Azure/GCP)', leadName: 'Sarah Connor', leadRole: 'Cloud Security Lead', avatar: 'SC', autoJira: true, autoSnow: false },
  { category: 'Network Runway (Perimeters/FW/VPN)', leadName: 'Devon Vance', leadRole: 'Network Ops Specialist', avatar: 'DV', autoJira: true, autoSnow: true },
  { category: 'App Security Check (OWASP/SAST/DAST)', leadName: 'Marcus Brody', leadRole: 'Application Architect', avatar: 'MB', autoJira: false, autoSnow: true },
  { category: 'Identity PreCheck (SSO/IAM/MFA)', leadName: 'Elena Rostova', leadRole: 'IAM & Zero-Trust Director', avatar: 'ER', autoJira: true, autoSnow: false },
];

const SEED_TICKETS: SoarTicket[] = [
  {
    id: 'JIRA-SEC-1249',
    cveId: 'CVE-2026-3400',
    title: 'Palo Alto PAN-OS Command Injection in GlobalProtect',
    asset: 'edge-ingress-fw01',
    assignee: 'Devon Vance',
    avatar: 'DV',
    severity: 'Critical',
    status: 'Remediation In-Flight',
    system: 'Jira',
    createdAt: Date.now() - 3.6 * 60 * 60 * 1000, // 3.6 hours ago
    slaLimitMs: 24 * 60 * 60 * 1000, // 24 hours
  },
  {
    id: 'SNOW-INC-9281',
    cveId: 'CVE-2026-9800',
    title: 'OpenSSH Race Condition root shell execution (regreSSHion)',
    asset: 'core-db-01.internal',
    assignee: 'Elena Rostova',
    avatar: 'ER',
    severity: 'Critical',
    status: 'Open',
    system: 'ServiceNow',
    createdAt: Date.now() - 5.2 * 60 * 60 * 1000, // 5.2 hours ago
    slaLimitMs: 24 * 60 * 60 * 1000,
  },
  {
    id: 'JIRA-SEC-3102',
    cveId: 'CVE-2026-1124',
    title: 'AWS S3 bucket unauthenticated policy data leakage',
    asset: 's3://customer-vault-backup',
    assignee: 'Sarah Connor',
    avatar: 'SC',
    severity: 'High',
    status: 'Dispatched',
    system: 'Jira',
    createdAt: Date.now() - 1.1 * 60 * 60 * 1000, // 1.1 hours ago
    slaLimitMs: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  {
    id: 'SNOW-INC-8341',
    cveId: 'CVE-2025-21762',
    title: 'Fortinet FortiOS SSL-VPN Remote Code Execution',
    asset: 'vpn-gateway-02',
    assignee: 'Marcus Brody',
    avatar: 'MB',
    severity: 'Critical',
    status: 'Resolved',
    system: 'ServiceNow',
    createdAt: Date.now() - 48 * 60 * 60 * 1000,
    slaLimitMs: 24 * 60 * 60 * 1000,
  }
];

const SEED_LOGS = [
  '[08:14:02 SOAR-INGEST] Polling Wiz & Qualys active scan APIs...',
  '[08:14:03 SOAR-PARSER] Universal Finding Schema (UFS) conversion completed: 4 vulnerabilities parsed.',
  '[08:14:03 SOAR-ROUTER] Routing Rule matched: Category "Network Runway" -> Assigned Devon Vance.',
  '[08:14:04 SOAR-JIRA] Created Jira incident JIRA-SEC-1249 with High Priority.',
  '[08:14:04 SOAR-SLA] SLA Altimeter initialized: 24h hard patch threshold.',
  '[08:14:05 SOAR-ROUTER] Routing Rule matched: Category "Identity PreCheck" -> Assigned Elena Rostova.',
  '[08:14:06 SOAR-SNOW] Created ServiceNow incident SNOW-INC-9281. Asset reference: core-db-01.internal.',
  '[08:14:08 SOAR-INTEGRATION] Webhook triggered. Slack notification sent to #secops-alerts.',
];

export default function DispatchCenterPage() {
  const { currentClient } = useClient();
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([]);
  const [tickets, setTickets] = useState<SoarTicket[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [ticker, setTicker] = useState<number>(0);
  const [simulationState, setSimulationState] = useState<'idle' | 'running'>('idle');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  
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
      .catch(err => console.error('[dispatch fetch]', err));
    return () => { active = false; };
  }, [currentClient.key]);

  // ── Load rules: DB first, then localStorage fallback ──
  const loadRules = useCallback(async () => {
    try {
      const res = await fetch('/api/soar/rules');
      if (res.ok) {
        const dbRules: RoutingRule[] = await res.json();
        if (dbRules.length > 0) {
          setRoutingRules(dbRules);
          localStorage.setItem('posturepilot_routing_rules', JSON.stringify(dbRules));
          return;
        }
      }
    } catch { /* network offline — fall through */ }
    // Fallback: localStorage or seed
    const saved = localStorage.getItem('posturepilot_routing_rules');
    if (saved) {
      setRoutingRules(JSON.parse(saved));
    } else {
      setRoutingRules(DEFAULT_ROUTING_RULES);
      localStorage.setItem('posturepilot_routing_rules', JSON.stringify(DEFAULT_ROUTING_RULES));
    }
  }, []);

  // ── Load tickets: DB first, then localStorage fallback ──
  const loadTickets = useCallback(async () => {
    try {
      const res = await fetch('/api/soar/tickets');
      if (res.ok) {
        const dbTickets = await res.json();
        if (dbTickets.length > 0) {
          // DB stores createdAt as ISO string; convert to timestamp ms
          const hydrated = dbTickets.map((t: Record<string, unknown>) => ({
            ...t,
            createdAt: typeof t.createdAt === 'string' ? new Date(t.createdAt).getTime() : t.createdAt,
          }));
          setTickets(hydrated);
          localStorage.setItem('posturepilot_soar_tickets', JSON.stringify(hydrated));
          return;
        }
      }
    } catch { /* fall through */ }
    const saved = localStorage.getItem('posturepilot_soar_tickets');
    if (saved) {
      setTickets(JSON.parse(saved));
    } else {
      setTickets(SEED_TICKETS);
      localStorage.setItem('posturepilot_soar_tickets', JSON.stringify(SEED_TICKETS));
    }
  }, []);

  // ── Load logs: DB first, then localStorage fallback ──
  const loadLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/soar/logs');
      if (res.ok) {
        const dbLogs: Array<{ message: string }> = await res.json();
        if (dbLogs.length > 0) {
          const msgs = dbLogs.map(l => l.message);
          setLogs(msgs);
          localStorage.setItem('posturepilot_soar_logs', JSON.stringify(msgs));
          return;
        }
      }
    } catch { /* fall through */ }
    const saved = localStorage.getItem('posturepilot_soar_logs');
    if (saved) {
      setLogs(JSON.parse(saved));
    } else {
      setLogs(SEED_LOGS);
      localStorage.setItem('posturepilot_soar_logs', JSON.stringify(SEED_LOGS));
    }
  }, []);

  useEffect(() => {
    loadRules();
    loadTickets();
    loadLogs();
  }, [loadRules, loadTickets, loadLogs]);

  // Update clock ticker every second for live SLA
  useEffect(() => {
    const timer = setInterval(() => {
      setTicker(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll terminal log
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Sync to both localStorage and DB
  const updateRules = (updated: RoutingRule[]) => {
    setRoutingRules(updated);
    localStorage.setItem('posturepilot_routing_rules', JSON.stringify(updated));
  };

  const saveRuleToDB = async (rule: RoutingRule) => {
    try {
      await fetch('/api/soar/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule),
      });
    } catch { /* silent — localStorage is the fallback */ }
  };

  const updateTickets = (updated: SoarTicket[]) => {
    setTickets(updated);
    localStorage.setItem('posturepilot_soar_tickets', JSON.stringify(updated));
  };

  const updateLogs = (updated: string[]) => {
    setLogs(updated);
    localStorage.setItem('posturepilot_soar_logs', JSON.stringify(updated));
  };

  const toggleAutoJira = (index: number) => {
    const next = [...routingRules];
    next[index].autoJira = !next[index].autoJira;
    updateRules(next);
    saveRuleToDB(next[index]);
    addLog(`[SOAR-CONFIG] ${next[index].category} Jira auto-ticket toggled ${next[index].autoJira ? 'ON' : 'OFF'}.`);
  };

  const toggleAutoSnow = (index: number) => {
    const next = [...routingRules];
    next[index].autoSnow = !next[index].autoSnow;
    updateRules(next);
    saveRuleToDB(next[index]);
    addLog(`[SOAR-CONFIG] ${next[index].category} ServiceNow escalation toggled ${next[index].autoSnow ? 'ON' : 'OFF'}.`);
  };

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const formatted = `[${timestamp} USER] ${msg}`;
    const nextLogs = [...logs, formatted];
    updateLogs(nextLogs);
  };

  const clearAllLogs = async () => {
    updateLogs([]);
    try { await fetch('/api/soar/logs', { method: 'DELETE' }); } catch { /* silent */ }
  };

  const handleResolveTicket = async (ticketId: string) => {
    const nextTickets = tickets.map(t => {
      if (t.id === ticketId) {
        addLog(`[TICKET-RESOLVE] Ticket ${t.id} (${t.cveId}) marked as RESOLVED by ${currentClient.name} operator.`);
        return { ...t, status: 'Resolved' as const };
      }
      return t;
    });
    updateTickets(nextTickets);
    // Persist resolve to DB
    try {
      await fetch('/api/soar/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticketId, status: 'Resolved' }),
      });
    } catch { /* silent */ }
  };

  const handleManualIngestSimulate = () => {
    if (simulationState !== 'idle') return;
    setSimulationState('running');
    
    const randomCveNum = Math.floor(Math.random() * 8000 + 1000);
    const newCve = `CVE-2026-${randomCveNum}`;
    const newTitle = `Adversary exploit activity detected in shadow infrastructure assets`;
    const newAsset = `prod-ingress-k8s-node-${Math.floor(Math.random() * 8 + 1)}`;
    const category = 'Network Runway (Perimeters/FW/VPN)';
    const lead = routingRules.find(r => r.category.includes('Network')) || routingRules[1];

    const pipelineSteps = [
      `[SOC-SIMULATOR] Simulating real-time alert ingestion pipeline...`,
      `[SOAR-INGEST] Dynamic vulnerability discovery triggered on ${newAsset}.`,
      `[SOAR-ANALYZER] Correlating CVSS and EPSS scoring vectors for ${newCve}...`,
      `[SOAR-ANALYZER] CVSS: 9.8 (Critical) | EPSS: 86.4%. Weaponization footprint confirmed.`,
      `[SOAR-ROUTER] Routing Policy match: "${category}". Dispatch assigned to Lead ${lead.leadName} (${lead.leadRole}).`,
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < pipelineSteps.length) {
        setLogs(prev => {
          const next = [...prev, `[${new Date().toLocaleTimeString()} SOAR] ${pipelineSteps[currentStep]}`];
          localStorage.setItem('posturepilot_soar_logs', JSON.stringify(next));
          return next;
        });
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Spawn actual ticket if rules indicate
        const ticketId = `JIRA-SEC-${Math.floor(Math.random() * 8000 + 2000)}`;
        const newTicket: SoarTicket = {
          id: ticketId,
          cveId: newCve,
          title: newTitle,
          asset: newAsset,
          assignee: lead.leadName,
          avatar: lead.avatar,
          severity: 'Critical',
          status: 'Open',
          system: 'Jira',
          createdAt: Date.now(),
          slaLimitMs: 24 * 60 * 60 * 1000,
        };

        setTickets(prev => {
          const next = [newTicket, ...prev];
          localStorage.setItem('posturepilot_soar_tickets', JSON.stringify(next));
          return next;
        });

        setLogs(prev => {
          const finalLog = `[${new Date().toLocaleTimeString()} SOAR] Created active ticket ${ticketId} assigned to ${lead.leadName} automatically!`;
          const next = [...prev, finalLog];
          localStorage.setItem('posturepilot_soar_logs', JSON.stringify(next));
          return next;
        });

        setSimulationState('idle');
      }
    }, 800);
  };

  const getSlaTimeRemaining = (t: SoarTicket) => {
    if (t.status === 'Resolved') return { text: 'SLA MET', color: '#16a34a', percent: 100 };
    
    const elapsed = Date.now() - t.createdAt;
    const remaining = t.slaLimitMs - elapsed;
    
    if (remaining <= 0) {
      return { text: 'BREACHED', color: '#dc2626', percent: 0 };
    }
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    const pct = Math.max(0, Math.min(100, Math.round((remaining / t.slaLimitMs) * 100)));
    
    let color = '#16a34a';
    if (pct < 30) color = '#dc2626';
    else if (pct < 65) color = '#ea580c';
    
    const timeStr = hours > 24 
      ? `${Math.floor(hours/24)}d ${hours%24}h remaining`
      : `${hours}h ${minutes}m ${seconds}s remaining`;

    return { text: timeStr, color, percent: pct };
  };

  return (
    <div className="page-content animate-in" style={{ paddingBottom: '3rem' }}>
      
      {/* Top Banner Alert */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        color: '#fff',
        marginBottom: '1rem',
        border: '1px solid #4c1d95',
        boxShadow: '0 8px 32px rgba(76, 29, 149, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ fontSize: '2rem' }}>🚨</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#f3e8ff' }}>
              SOAR Automated Dispatch Center
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#d8b4fe', fontWeight: 500 }}>
              Operational gateway. Auto-maps parsed scan CVE findings to developer ticketing backends with 1-click active triage override.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={handleManualIngestSimulate}
            disabled={simulationState !== 'idle'}
            style={{
              background: simulationState === 'idle' ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : '#4c1d95',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.55rem 1.125rem',
              borderRadius: '8px',
              border: 'none',
              cursor: simulationState === 'idle' ? 'pointer' : 'not-allowed',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            {simulationState === 'idle' ? '⚡ Simulate Scanner Ingest' : 'Processing alert pipeline...'}
          </button>
          
          <button 
            onClick={() => {
              if (window.confirm('Reset SOAR database to original seeds?')) {
                localStorage.removeItem('posturepilot_soar_tickets');
                localStorage.removeItem('posturepilot_soar_logs');
                localStorage.removeItem('posturepilot_routing_rules');
                setTickets(SEED_TICKETS);
                setLogs(SEED_LOGS);
                setRoutingRules(DEFAULT_ROUTING_RULES);
                window.location.reload();
              }
            }}
            style={{
              background: '#1e293b',
              color: '#94a3b8',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.55rem 0.875rem',
              borderRadius: '8px',
              border: '1px solid #334155',
              cursor: 'pointer'
            }}
          >
            🔄 Reset Seed
          </button>
        </div>
      </div>

      {/* Cockpit telemetry card */}
      <ModuleCockpitCard config={dispatchCockpitConfig} live={liveData} />

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem', marginBottom: '1rem' }}>
        
        {/* Ticket Routing Matrix Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              <span>🎛️</span> Dynamic Gate Ownership & Routing Matrix
            </div>
            <p style={{ fontSize: '0.7rem', color: '#64748b', margin: '0 0 1rem 0' }}>
              Define which engineering leads own incoming vulnerabilities from ingestion pipelines. Active toggles immediately trigger backend Jira/ServiceNow ticket creations.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {routingRules.map((rule, idx) => (
                <div key={rule.category} style={{
                  padding: '0.75rem 1rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #1e293b, #475569)',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {rule.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{rule.category}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 1 }}>
                        Lead assignee: <strong style={{ color: '#334155' }}>{rule.leadName}</strong> ({rule.leadRole})
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {/* Jira Toggle */}
                    <button
                      onClick={() => toggleAutoJira(idx)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        background: rule.autoJira ? '#3b82f6' : '#cbd5e1',
                        color: '#fff',
                        transition: 'all 0.15s'
                      }}
                    >
                      {rule.autoJira ? '✓ Auto-Jira' : 'Jira Off'}
                    </button>

                    {/* SNow Toggle */}
                    <button
                      onClick={() => toggleAutoSnow(idx)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        background: rule.autoSnow ? '#ff5a1f' : '#cbd5e1',
                        color: '#fff',
                        transition: 'all 0.15s'
                      }}
                    >
                      {rule.autoSnow ? '✓ Auto-SNow' : 'SNow Off'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: '1.25rem',
            background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
            border: '1px solid #bfdbfe',
            padding: '0.75rem',
            borderRadius: 10,
            fontSize: '0.72rem',
            color: '#1e3a8a',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>💡</span>
            <span><strong>Pro-Tip Shrigo:</strong> Toggles immediately override the live parser. Files uploaded in <strong>Scan Check-In</strong> automatically create tickets aligned to this matrix!</span>
          </div>
        </div>

        {/* Live SOAR Terminal Log Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', minHeight: 380 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulse-dot 2s infinite' }} />
              Live SOAR Orchestrator Console
            </span>
            <button 
              onClick={clearAllLogs}
              style={{
                background: '#f1f5f9',
                color: '#64748b',
                border: 'none',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: '0.62rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Clear Logs
            </button>
          </div>

          <div style={{
            flex: 1,
            background: '#020617',
            border: '1px solid #1e293b',
            borderRadius: 12,
            padding: '0.75rem',
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            color: '#34d399',
            overflowY: 'auto',
            maxHeight: 280,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            lineHeight: '1.4'
          }}>
            {logs.length === 0 ? (
              <div style={{ color: '#475569', fontStyle: 'italic', padding: '1rem', textAlign: 'center' }}>
                Console initialized. No SOAR pipeline activity recorded yet.
              </div>
            ) : (
              logs.map((log, i) => {
                let color = '#38bdf8'; // blue default
                if (log.includes('SOAR-ROUTER') || log.includes('ROUTER')) color = '#fbbf24'; // yellow
                if (log.includes('SOAR-JIRA') || log.includes('JIRA') || log.includes('SNOW')) color = '#c084fc'; // purple
                if (log.includes('SLA') || log.includes('LIMIT')) color = '#f87171'; // red
                if (log.includes('SUCCESS') || log.includes('dispatched automatically')) color = '#34d399'; // green
                if (log.includes('USER')) color = '#94a3b8'; // grey
                return (
                  <div key={i} style={{ color, wordBreak: 'break-all' }}>
                    {log}
                  </div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>

          <div style={{
            marginTop: '0.5rem',
            display: 'flex',
            gap: '0.375rem',
            alignItems: 'center'
          }}>
            <input 
              type="text" 
              placeholder="Inject custom SOAR operation shell command..."
              onKeyDown={e => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  addLog(e.currentTarget.value.trim());
                  e.currentTarget.value = '';
                }
              }}
              style={{
                flex: 1,
                padding: '0.4rem 0.75rem',
                fontSize: '0.72rem',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                outline: 'none',
                background: '#f8fafc'
              }}
            />
            <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>[ENTER]</span>
          </div>
        </div>

      </div>

      {/* Active Tickets Ledger */}
      <div className="card">
        <div style={{
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '0.5rem',
          marginBottom: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a' }}>🎟️ Active Tickets Ledger & SLA Altimeter</h3>
            <p style={{ fontSize: '0.7rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Real-time synchronization with active Jira/ServiceNow systems. 0-to-1 click triage lets operations resolve tickets instantly.
            </p>
          </div>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
            {tickets.filter(t => t.status !== 'Resolved').length} ACTIVE OUTSTANDING INCIDENTS
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th>Ticket ID</th>
                <th>Vulnerability CVE</th>
                <th>Target Asset</th>
                <th>Responsible Lead</th>
                <th>Severity</th>
                <th>Ticket Status</th>
                <th style={{ width: 220 }}>SLA Altimeter (Ticking Live)</th>
                <th>Action Gate</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                    Operational slate clean! No tickets logged in database. Simulate ingress alerts above.
                  </td>
                </tr>
              ) : (
                tickets.map(t => {
                  const sla = getSlaTimeRemaining(t);
                  const isResolved = t.status === 'Resolved';
                  return (
                    <tr key={t.id} style={{
                      background: isResolved ? '#f0fdf4' : '#fff',
                      transition: 'background 0.15s ease'
                    }}>
                      <td>
                        <span style={{
                          fontWeight: 800,
                          color: t.system === 'Jira' ? '#3b82f6' : '#ff5a1f',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          {t.system === 'Jira' ? '🔵' : '🟠'} {t.id}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{t.cveId}</div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={t.title}>
                          {t.title}
                        </div>
                      </td>
                      <td>
                        <code style={{ fontSize: '0.7rem', color: '#475569' }}>{t.asset}</code>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: '#e2e8f0',
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {t.avatar}
                          </div>
                          <span style={{ fontWeight: 600, color: '#334155' }}>{t.assignee}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${t.severity.toLowerCase()}`}>
                          {t.severity}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 4,
                          background: isResolved ? '#dcfce7' : t.status === 'Remediation In-Flight' ? '#fef3c7' : '#fee2e2',
                          color: isResolved ? '#15803d' : t.status === 'Remediation In-Flight' ? '#b45309' : '#b91c1c'
                        }}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 700 }}>
                            <span style={{ color: sla.color }}>{sla.text}</span>
                            <span style={{ color: '#94a3b8' }}>{sla.percent}% remaining</span>
                          </div>
                          <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${sla.percent}%`,
                              background: sla.color,
                              borderRadius: 99,
                              transition: 'width 1s linear'
                            }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        {!isResolved ? (
                          <button
                            onClick={() => handleResolveTicket(t.id)}
                            style={{
                              padding: '0.25rem 0.65rem',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              background: '#16a34a',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 6,
                              cursor: 'pointer',
                              boxShadow: '0 2px 4px rgba(22, 163, 74, 0.15)'
                            }}
                          >
                            Resolve Gate
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#16a34a' }}>
                            ✓ SECURE
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
