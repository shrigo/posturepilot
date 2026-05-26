'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useClient } from '@/context/ClientContext';
import Link from 'next/link';

// CVE Status indicator colors
const statusColor: Record<string, string> = {
  'KEV Listed':     '#dc2626',
  'Active Exploit': '#ea580c',
  'PoC Available':  '#d97706',
  'Patch Available':'#16a34a',
  'Mitigated':      '#10b981',
};

interface LiveSummary {
  total: number; critical: number; high: number; riskScore: number;
  slaCompliance: number; avgCvss: string; bySeverity: Record<string,number>;
  byTool: Record<string,number>; recentScans: { id:string; sourceTool:string; findingCount:number; createdAt:string }[];
  topCVEs: { cveId:string|null; count:number }[];
}

// Client-Specific Cyber Posture Metadata Mappings
const clientPostureMeta = {
  ACME: {
    baseScore: 74,
    threatLevel: 'Elevated',
    controlCoverage: 82,
    baseCriticals: 14,
    deltaText: '↓3 vs last month',
    threatDelta: 'Elevated since May 9',
    monthlyTrend: [
      { month: 'Dec', score: 68 },
      { month: 'Jan', score: 71 },
      { month: 'Feb', score: 77 },
      { month: 'Mar', score: 80 },
      { month: 'Apr', score: 77 },
      { month: 'May', score: 74 },
    ],
    threatIntelFeed: [
      { id: 'TI-001', cve: 'CVE-2025-21762', title: 'Fortinet SSL-VPN Auth Bypass', cvss: 9.8, epss: 0.91, status: 'KEV Listed', severity: 'critical', published: '2026-05-10' },
      { id: 'TI-002', cve: 'CVE-2025-0282',  title: 'Ivanti Connect Secure Stack Overflow', cvss: 9.0, epss: 0.88, status: 'KEV Listed', severity: 'critical', published: '2026-05-09' },
      { id: 'TI-003', cve: 'CVE-2025-3400',  title: 'Palo Alto PAN-OS Command Injection', cvss: 8.2, epss: 0.62, status: 'Active Exploit', severity: 'high', published: '2026-05-08' },
      { id: 'TI-004', cve: 'CVE-2025-1234',  title: 'Apache Tomcat RCE via HTTP/2', cvss: 7.5, epss: 0.34, status: 'PoC Available', severity: 'high', published: '2026-05-06' },
      { id: 'TI-005', cve: 'CVE-2025-8891',  title: 'OpenSSH Race Condition (regreSSHion)', cvss: 7.0, epss: 0.18, status: 'Patch Available', severity: 'medium', published: '2026-05-04' },
    ]
  },
  UR: {
    baseScore: 88,
    threatLevel: 'Optimal',
    controlCoverage: 94,
    baseCriticals: 4,
    deltaText: '↑4 vs last month',
    threatDelta: 'Secured on May 18',
    monthlyTrend: [
      { month: 'Dec', score: 80 },
      { month: 'Jan', score: 82 },
      { month: 'Feb', score: 85 },
      { month: 'Mar', score: 89 },
      { month: 'Apr', score: 87 },
      { month: 'May', score: 88 },
    ],
    threatIntelFeed: [
      { id: 'TI-001', cve: 'CVE-2025-21762', title: 'Fortinet SSL-VPN Auth Bypass', cvss: 9.8, epss: 0.91, status: 'KEV Listed', severity: 'critical', published: '2026-05-10' },
      { id: 'TI-003', cve: 'CVE-2025-3400',  title: 'Palo Alto PAN-OS Command Injection', cvss: 8.2, epss: 0.62, status: 'Active Exploit', severity: 'high', published: '2026-05-08' },
      { id: 'TI-005', cve: 'CVE-2025-8891',  title: 'OpenSSH Race Condition (regreSSHion)', cvss: 7.0, epss: 0.18, status: 'Patch Available', severity: 'medium', published: '2026-05-04' },
    ]
  }
};

export default function PosturePage() {
  const { 
    currentClient, 
    isEnterpriseMode, 
    isUnderAttack, 
    setIsUnderAttack, 
    isMitigating, 
    setIsMitigating,
    slaThresholds
  } = useClient();

  const [live, setLive]           = useState<LiveSummary | null>(null);
  const [liveErr, setLiveErr]     = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Remediated/Mitigated CVEs state
  const [mitigatedCves, setMitigatedCves] = useState<Record<string, boolean>>({});

  // Active Hot-Patch terminal simulation states
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isPatching, setIsPatching] = useState(false);
  const [activePatchCve, setActivePatchCve] = useState<string | null>(null);

  // Fetch real uploaded scan logs summary if available
  useEffect(() => {
    fetch('/api/findings/summary')
      .then(r => r.json())
      .then(d => { if (d.total > 0) setLive(d); })
      .catch(() => setLiveErr(true));
  }, []);

  // Reset mitigated states and logs whenever client changes
  useEffect(() => {
    setMitigatedCves({});
    setTerminalLogs([
      `[SYSTEM] Cyber Posture threat feed loaded for organization: ${currentClient.name}`,
      `[SYSTEM] Real-time CVE audit synchronizations successfully calibrated.`,
      `[INFO] Choose an active KEV exploit below or use the Threat Sandbox in the header...`
    ]);
    setActivePatchCve(null);
    setIsPatching(false);
    setIsUnderAttack(false);
    setIsMitigating(false);
  }, [currentClient.key]);

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const res  = await fetch('/api/reports/executive');
      if (!res.ok) throw new Error('Failed');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `PosturePilot-Report-${new Date().toISOString().slice(0,10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { alert('Report generation failed — please upload a scan first.'); }
    finally { setDownloading(false); }
  };

  // Resolve active client mock data structure
  const activeMeta = clientPostureMeta[currentClient.key as 'ACME' | 'UR'] || clientPostureMeta.ACME;

  // Real-time recalculated scores based on mitigations, attacks, and SLA thresholds
  const mitigatedCount = Object.keys(mitigatedCves).length;
  
  // Calculate dynamic SLA threshold penalty (tighter SLAs penalize score until fixed)
  const slaBreachPenalty = Math.max(0, (7 - slaThresholds.critical) * 2) + Math.max(0, (30 - slaThresholds.high) * 0.5);
  
  let postureScore = Math.max(30, Math.min(100, activeMeta.baseScore + (mitigatedCount * 3) - Math.round(slaBreachPenalty)));
  let openCriticals = Math.max(0, activeMeta.baseCriticals - mitigatedCount + Math.round(slaBreachPenalty / 2));
  let controlCoverage = Math.max(20, Math.min(100, activeMeta.controlCoverage + (mitigatedCount * 2) - Math.round(slaBreachPenalty * 0.8)));
  let threatLevel = openCriticals > 10 ? 'Elevated' : openCriticals > 5 ? 'Elevated Alert' : openCriticals > 0 ? 'Medium Risk' : 'Secure & Patched';
  
  if (isUnderAttack) {
    postureScore = 42;
    openCriticals = 47;
    controlCoverage = 35;
    threatLevel = 'Critical Breach';
  }

  // Dynamic monthly line-chart trend reflecting hot-patches
  const dynamicMonthlyTrend = activeMeta.monthlyTrend.map((t, idx) => {
    if (idx === activeMeta.monthlyTrend.length - 1) {
      return { ...t, score: postureScore };
    }
    return t;
  });

  // Hot-Patch Remediation Scanner Simulator
  const handleRemediateCve = (cveId: string, cveTitle: string) => {
    if (isPatching) return;
    setIsPatching(true);
    setActivePatchCve(cveId);
    setTerminalLogs(prev => [...prev, `[HOT-PATCH SCANNER] Spawning containerized remediation context for ${cveId}...`]);

    const scannerName = isEnterpriseMode ? 'Wiz API' : 'SkyArmor hybrid engine';
    const patchSequence = [
      `[HOT-PATCH SCANNER] Restricting ingress port vectors via ${scannerName}...`,
      `[HOT-PATCH SCANNER] Pushing network firewall isolation ACL rule to AWS Security Hub...`,
      `[VERIFY] Querying active processes... [PORT SECURED]`,
      `[INTEGRATION] Pushing telemetry update logs to GRC Govematic dashboard...`,
      `[SUCCESS] Vulnerability hot-patch successfully applied to ${cveId} (${cveTitle})!`,
      `[SUCCESS] Compliance calibration recalculated: Cyber Posture is now optimized.`
    ];

    let delay = 300;
    patchSequence.forEach((log, idx) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, log]);
        if (idx === patchSequence.length - 1) {
          setIsPatching(false);
          setMitigatedCves(prev => ({ ...prev, [cveId]: true }));
        }
      }, delay);
      delay += 400;
    });
  };

  // Threat Simulation Sandbox Handlers
  const handleTriggerAttack = () => {
    setIsUnderAttack(true);
    setIsMitigating(false);
    setMitigatedCves({});
    setTerminalLogs(prev => [
      ...prev,
      `[SIMULATION-START] Injecting multi-vectored threat exploits to active posture...`,
      `[DDOS] Flooding Palo Alto ingress gateway with 45 Gbps UDP packet storm! 🔴 Critical`,
      `[EXPLOIT] Exploiting OpenSSH CVSS 9.8 RCE root shell on prod host core-db-01! 🔴 Critical`,
      `[CLOUD] Public storage exposed on AWS buckets! 🔴 Critical`,
      `[ALERT] Cyber posture index degraded to 42 (🔴 Critical Risk)`
    ]);
  };

  const handleTriggerMitigation = () => {
    setIsMitigating(true);
    setTerminalLogs(prev => [
      ...prev,
      `[SOC-PLAYBOOK] Remediating active exploits. Initiating corporate threat playbooks...`,
      `[EDR] Connecting to EDR agent. Restricting SSH boundaries...`
    ]);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        `[FIREWALL] Pushing BGP Route-Map block to border routers. Null-routing attacker subnets...`,
        `[EDR] Sending SIGKILL to miner daemon (PID 3840) on core-db-01...`
      ]);
    }, 400);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        `[CLOUD] Restricting public read ACLs on exposed AWS S3 buckets. Applying AES-256 KMS...`,
        `[AI-SHIELD] Enforcing proxy filters. Shadow AI connections terminated...`
      ]);
    }, 800);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        `[PLAYBOOK-COMPLETE] All active vectors mitigated successfully! Posture score restored to optimal. 🟢 Safe`
      ]);
      setIsMitigating(false);
      setIsUnderAttack(false);
      
      // mark all default CVEs as mitigated
      const allCves: Record<string, boolean> = {};
      activeMeta.threatIntelFeed.forEach(t => {
        allCves[t.cve] = true;
      });
      setMitigatedCves(allCves);
    }, 1200);
  };

  // Run Campaign Readiness Audit Sandbox
  const handleAuditCampaign = (campaignName: string, targetSector: string) => {
    if (isPatching) return;
    setIsPatching(true);
    setActivePatchCve(campaignName);
    setTerminalLogs(prev => [...prev, `[CAMPAIGN AUDITOR] Conducting security gap analysis for threat campaign: ${campaignName}...`]);

    const toolsUsed = isEnterpriseMode ? 'Wiz & Prisma Cloud APIs' : 'SkyArmor & PrismShield posture aggregators';
    const auditSteps = [
      `[CAMPAIGN AUDITOR] Inspecting access boundary alignments across target: ${targetSector}...`,
      `[CAMPAIGN AUDITOR] Scanning GRC policies (Incident Response Plan, Access Controls)...`,
      `[CAMPAIGN AUDITOR] Cross-referencing security stack configurations via ${toolsUsed}...`,
      `[AUDIT SUMMARY] MFA Enforcement is active (Conforms to SOC 2 Type II controls).`,
      `[AUDIT SUMMARY] Active KEV exploits listed under Threat intel are still pending resolution.`,
      `[AUDIT COMPLETE] Campaign readiness status parsed. Mitigate remaining CVEs to bolster alignment.`
    ];

    let delay = 250;
    auditSteps.forEach((log, idx) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, log]);
        if (idx === auditSteps.length - 1) {
          setIsPatching(false);
        }
      }, delay);
      delay += 350;
    });
  };

  const handleResetVulnerabilities = () => {
    setMitigatedCves({});
    setTerminalLogs([
      `[RESET] Threat feed baseline states completely restored.`,
      `[RESET] Compliance metrics synchronized back to mock defaults.`,
      `[INFO] Choose an active KEV exploit below to hot-patch.`
    ]);
    setActivePatchCve(null);
    setIsPatching(false);
    setIsUnderAttack(false);
    setIsMitigating(false);
  };

  const hasLive = !!live;

  return (
    <div className="page-content animate-in" style={{ paddingBottom: '2.5rem' }}>

      {/* Sticky Live Data / Simulation Controller Banner */}
      <div className="sticky-alert-banner" style={{ background: isUnderAttack ? '#fef2f2' : undefined, border: isUnderAttack ? '1px solid #fecaca' : undefined }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="hud-pulse" style={{ background: isUnderAttack ? '#ef4444' : '#7c3aed', boxShadow: isUnderAttack ? '0 0 8px #ef4444' : '0 0 8px #7c3aed', width: 10, height: 10 }} />
          <div>
            <div style={{ fontWeight: 800, color: isUnderAttack ? '#b91c1c' : '#6d28d9', fontSize: '0.9rem' }}>
              {isUnderAttack ? `🚨 Interactive Breach Threat Wave Sandbox Active — ${currentClient.name}` : (hasLive ? `Live Scan Data Active — ${live!.total.toLocaleString()} findings` : `Active Threat Simulation — ${currentClient.name}`)}
            </div>
            <div style={{ fontSize: '0.75rem', color: isUnderAttack ? '#ef4444' : '#7c3aed', fontWeight: 600 }}>
              {isUnderAttack ? `Active Exploit Wave: Recalculating perimeter and host workloads...` : (hasLive ? `Source Scanner Tools: ${Object.keys(live!.byTool).join(', ')} · Avg CVSS: ${live!.avgCvss}` : `Interactive hot-patch simulator synced to CISO aggregate postures.`)}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Interactive Threat Attack Simulation Sandbox Buttons In Sticky Header */}
          <button
            onClick={handleTriggerAttack}
            disabled={isUnderAttack || isMitigating}
            style={{
              fontSize: '0.78rem', fontWeight: 800, color: '#fff', 
              background: (isUnderAttack || isMitigating) ? '#cbd5e1' : 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none', padding: '0.5rem 1rem', borderRadius: 8, cursor: (isUnderAttack || isMitigating) ? 'default' : 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.15s'
            }}
          >
            💣 Exploit Attack Wave
          </button>
          <button
            onClick={handleTriggerMitigation}
            disabled={!isUnderAttack || isMitigating}
            style={{
              fontSize: '0.78rem', fontWeight: 800, color: '#fff', 
              background: (!isUnderAttack || isMitigating) ? '#cbd5e1' : 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none', padding: '0.5rem 1rem', borderRadius: 8, cursor: (!isUnderAttack || isMitigating) ? 'default' : 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.15s'
            }}
          >
            ⚡ Run SOC Playbook
          </button>
          <button 
            onClick={handleResetVulnerabilities} 
            style={{ 
              fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', background: 'rgba(255, 255, 255, 0.7)', 
              border: '1px solid #c084fc', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '4px',
              transition: 'all 0.15s'
            }}
          >
            🔄 Reset Sandbox
          </button>
          <button onClick={downloadPDF} disabled={downloading} style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fff', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, cursor: downloading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)' }}>
            {downloading ? '⏳ Generating…' : '📄 Download Report'}
          </button>
          <Link href="/dashboard/upload" style={{ fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', textDecoration: 'none', border: '1px solid #c084fc', padding: '0.5rem 1rem', borderRadius: 8, background: 'rgba(255, 255, 255, 0.4)' }}>
            + Upload Scan →
          </Link>
        </div>
      </div>

      {/* Top Stat Card Row */}
      <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
        {((hasLive ? [
          { label: 'Total Findings',   value: live!.total.toLocaleString(),    accent: '#3b82f6', delta: `${live!.critical} Critical`, deltaColor: '#94a3b8' },
          { label: 'Risk Score',       value: `${live!.riskScore}`,            accent: '#ea580c', delta: `Avg CVSS ${live!.avgCvss}`, deltaColor: '#94a3b8' },
          { label: 'SLA Compliance',   value: `${live!.slaCompliance}%`,       accent: '#059669', delta: 'Based on scan dates', deltaColor: '#94a3b8' },
          { label: 'Open Criticals',   value: live!.critical.toLocaleString(), accent: '#dc2626', delta: `+ ${live!.high} High`, deltaColor: '#94a3b8' },
        ] : [
          { label: 'Posture Score',    value: `${postureScore}/100`,           accent: '#3b82f6', delta: isUnderAttack ? '🔴 CRITICAL BREACH RISK' : (mitigatedCount > 0 ? `🟢 Climbed +${mitigatedCount * 3} pts!` : activeMeta.deltaText), deltaColor: isUnderAttack ? '#dc2626' : (mitigatedCount > 0 ? '#10b981' : '#ef4444') },
          { label: 'Threat Level',     value: threatLevel,                     accent: '#ea580c', delta: activeMeta.threatDelta, deltaColor: '#ea580c' },
          { label: 'Control Coverage', value: `${controlCoverage}%`,           accent: '#059669', delta: isUnderAttack ? '🔴 Active exploits bypassing controls' : (mitigatedCount > 0 ? `🟢 Gained +${mitigatedCount * 2}%!` : '↑2% this month'), deltaColor: isUnderAttack ? '#dc2626' : '#10b981' },
          { label: 'Open Criticals',   value: String(openCriticals),           accent: '#dc2626', delta: isUnderAttack ? '🔴 47 network injection threats' : (mitigatedCount > 0 ? `🟢 Resolved ${mitigatedCount} criticals` : '↑4 since last scan'), deltaColor: isUnderAttack ? '#dc2626' : (mitigatedCount > 0 ? '#10b981' : '#dc2626') },
        ]) as { label: string; value: string; accent: string; delta: string; deltaColor: string }[]).map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-accent" style={{ background: s.accent }} />
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: '1.75rem', color: isUnderAttack && (s.label.includes('Score') || s.label.includes('Criticals') || s.label.includes('Level')) ? '#dc2626' : undefined }}>{s.value}</div>
            <div className="stat-delta" style={{ color: s.deltaColor || '#94a3b8', fontWeight: 800 }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Row 2: Severity / Trends Chart + Active Threat Campaigns */}
      <div className="grid-2-1" style={{ marginBottom: '1.25rem' }}>

        {hasLive ? (
          <div className="card">
            <div className="card-title">📊 Findings by Severity (Live)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { sev: 'Critical', color: '#dc2626', bg: '#fef2f2' },
                { sev: 'High',     color: '#ea580c', bg: '#fff7ed' },
                { sev: 'Medium',   color: '#d97706', bg: '#fffbeb' },
                { sev: 'Low',      color: '#16a34a', bg: '#f0fdf4' },
                { sev: 'Info',     color: '#3b82f6', bg: '#eff6ff' },
              ].map(({ sev, color, bg }) => {
                const count = live!.bySeverity[sev] || 0;
                const pct = live!.total > 0 ? Math.round((count / live!.total) * 100) : 0;
                return (
                  <div key={sev}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color }}>{sev}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color }}>{count.toLocaleString()} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({pct}%)</span></span>
                    </div>
                    <div style={{ height: 8, background: bg, borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-title">📈 Cyber Posture Score Trend (Dec - May)</div>
            <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.85rem' }}>
              Historical client posture curve. Checking off exploit hot-patches dynamically boosts active month rating.
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart key={`${currentClient.key}-${postureScore}`} data={dynamicMonthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis domain={[30, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Line type="monotone" dataKey="score" stroke={isUnderAttack ? '#ef4444' : '#3b82f6'} strokeWidth={2.5} dot={{ fill: isUnderAttack ? '#ef4444' : '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Threat campaigns sandbox */}
        <div className="card">
          <div className="card-title">🔥 Active Threat Campaigns</div>
          <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.85rem' }}>
            Known active hacking campaigns targeting your industry sector.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { name: 'FIN7 (Ransomware)', target: currentClient.key === 'ACME' ? 'Financial processing' : 'Fleet Rentals telemetry', severity: 'critical', ttps: 'T1059, T1486' },
              { name: 'Lazarus APT',       target: currentClient.key === 'ACME' ? 'Banking databases' : 'Supply chains',   severity: 'high',     ttps: 'T1190, T1566' },
              { name: 'DarkGate Loader',   target: 'Corporate phish nets', severity: 'high',     ttps: 'T1566.001'    },
            ].map(c => (
              <div key={c.name} style={{ padding: '0.65rem 0.75rem', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{c.name}</div>
                    <span className={`badge badge-${isUnderAttack ? 'critical' : c.severity}`}>{isUnderAttack ? 'critical' : c.severity}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Target: {c.target}</div>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: 1 }}>TTPs: {c.ttps}</div>
                </div>
                {!hasLive && (
                  <button 
                    onClick={() => handleAuditCampaign(c.name, c.target)}
                    disabled={isPatching || isMitigating}
                    style={{ 
                      fontSize: '0.64rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6, border: 'none', 
                      background: '#475569', color: '#fff', cursor: (isPatching || isMitigating) ? 'not-allowed' : 'pointer', marginTop: 6,
                      alignSelf: 'flex-start', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.15s'
                    }}
                  >
                    Audit Campaign Readiness
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Threat Intelligence Feed / KEV Exploit Patching */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>🚨 Threat Intelligence Feed — Known Exploited Vulnerabilities</h3>
            <p style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>
              Real-time threat feed mapping active corporate vulnerabilities. Tapping "Remediate & Patch" locks threat vectors immediately.
            </p>
          </div>
          <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5' }}>
            KEV LISTING ACTIVE
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ fontSize: '0.76rem' }}>
            <thead>
              <tr>
                <th>CVE ID</th>
                <th>Title</th>
                <th>CVSS</th>
                <th>EPSS</th>
                <th>Status & Actions</th>
                <th>Severity</th>
                <th>Published</th>
              </tr>
            </thead>
            <tbody>
              {activeMeta.threatIntelFeed.map(t => {
                const isCveMitigated = !!mitigatedCves[t.cve];
                return (
                  <tr key={t.id} style={{ background: isCveMitigated ? '#f0fdf4' : (isUnderAttack ? '#fef2f2' : 'transparent'), transition: 'all 0.2s' }}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: isCveMitigated ? '#10b981' : (isUnderAttack ? '#ef4444' : '#3b82f6'), fontWeight: 600 }}>{t.cve}</span></td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{t.title}</td>
                    <td><span style={{ fontWeight: 700, color: t.cvss >= 9 ? '#dc2626' : t.cvss >= 7 ? '#ea580c' : '#d97706' }}>{t.cvss}</span></td>
                    <td><span style={{ fontWeight: 700, color: t.epss >= 0.7 ? '#dc2626' : '#d97706' }}>{(t.epss * 100).toFixed(0)}%</span></td>
                    <td>
                      {isCveMitigated ? (
                        <span style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                          🟢 Mitigated & Patched
                        </span>
                      ) : isUnderAttack ? (
                        <span style={{ color: '#dc2626', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4, animation: 'pulse-dot 1s infinite' }}>
                          🔴 Active Exploit Wave
                        </span>
                      ) : hasLive ? (
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: statusColor[t.status], background: `${statusColor[t.status]}15`, padding: '2px 8px', borderRadius: 20 }}>
                          {t.status}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRemediateCve(t.cve, t.title)}
                          disabled={isPatching || isMitigating}
                          style={{ 
                            fontSize: '0.68rem', fontWeight: 800, background: '#7c3aed', color: '#fff', 
                            border: 'none', padding: '3px 8px', borderRadius: 6, cursor: (isPatching || isMitigating) ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 6px rgba(124,58,237,0.1)', transition: 'all 0.15s'
                          }}
                        >
                          Remediate & Patch
                        </button>
                      )}
                    </td>
                    <td><span className={`badge badge-${isCveMitigated ? 'low' : (isUnderAttack ? 'critical' : t.severity)}`}>{isCveMitigated ? 'low' : (isUnderAttack ? 'Critical' : t.severity)}</span></td>
                    <td style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.published}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4: Glassmorphic scrolling GRC & Threat Patch Terminal */}
      <div className="card" style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 16, padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.50rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: (isPatching || isMitigating) ? '#ef4444' : '#10b981', display: 'inline-block' }} />
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Vulnerability Hot-Patch & Threat Intel Console
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
              color: log.startsWith('[ERR') || log.includes('🔴') ? '#f87171' : log.startsWith('[WARN') ? '#fbbf24' : log.startsWith('[HOT-PATCH') ? '#c084fc' : log.startsWith('[SUCCESS') || log.includes('Safe') ? '#34d399' : log.startsWith('[CAMPAIGN') || log.startsWith('[SIM') ? '#38bdf8' : '#38bdf8',
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
