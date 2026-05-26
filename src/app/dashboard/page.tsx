'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useClient } from '@/context/ClientContext';
import { 
  postureData, 
  cloudData, 
  networkData, 
  infosecData, 
  kpiData, 
  appsecData, 
  serverData, 
  aiRiskData 
} from '@/data/mockData';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

export default function OverviewPage() {
  const router = useRouter();
  const { currentClient } = useClient();

  // Navigation Viewport Mode Switcher
  const [activeViewMode, setActiveViewMode] = useState<'executive' | 'tactical' | 'compliance'>('executive');
  
  // Threat Attack Simulation States
  const [isUnderAttack, setIsUnderAttack] = useState(false);
  const [isMitigating, setIsMitigating] = useState(false);
  const [simulatedScore, setSimulatedScore] = useState(currentClient.score);
  const [simProgress, setSimProgress] = useState(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [selectedTerminalModule, setSelectedTerminalModule] = useState<'All' | 'Cloud' | 'Network' | 'Server' | 'AI' | 'Compliance'>('All');
  const [liveTelemetry, setLiveTelemetry] = useState<string[]>([]);

  // Synchronize base score when active client changes
  useEffect(() => {
    setSimulatedScore(currentClient.score);
    setIsUnderAttack(false);
    setIsMitigating(false);
    setSimProgress(0);
    setSimLogs([]);
  }, [currentClient.key]);

  // Live continuous telemetry streams
  useEffect(() => {
    const interval = setInterval(() => {
      if (isUnderAttack && !isMitigating) {
        // Attack logs
        const attackLogs = [
          `[EXPLOIT] OpenSSH CVSS 9.8 payload active on host "acme-core-db-01"! CPU surge to 95%! 🔴 Critical`,
          `[DDOS-ATTACK] Inbound rate spikes to 45.8 Gbps at border router! Port sweeps detected. 🔴 Critical`,
          `[CLOUD-EXPLOIT] Anonymous public read access enabled on AWS S3 Bucket "acme-financial-audit-logs"! 🔴 Critical`,
          `[SHADOW-AI] Shadow AI tools alert: 23 unauthorized connections to Claude-3-opus API. 🔴 Warning`,
          `[VULNERABILITY] PostgreSQL SQL injection vulnerability exploited on "ur-fleet-db-01". 🔴 Critical`,
          `[IAM-LEAK] Privileged administrator API credentials leaked on public GitHub repo! 🔴 Alert`
        ];
        const log = attackLogs[Math.floor(Math.random() * attackLogs.length)];
        setLiveTelemetry(prev => [log, ...prev.slice(0, 20)]);
      } else if (isMitigating) {
        // Mitigation streams managed by setTimeout sequence, do not overwrite here
      } else {
        // Normal ops logs
        const baselineLogs = [
          `[CLOUD] Scanning S3 buckets in AWS us-east-1. Zero public objects exposed. 🟢 Compliant`,
          `[FIREWALL] Palo Alto packet scan: ALLOW TCP 192.168.12.42:5042 -> 8.8.8.8:443 🟢 Safe`,
          `[EDR-AGENT] CrowdStrike Falcon Daemon heartbeat active for virtual machine "prod-db-01". 🟢 Nominal`,
          `[AI-SHIELD] Policy check: ChatGPT personal proxy access restricted at corporate proxy edge. 🟢 Restricted`,
          `[GRC] Auto-auditing SOC 2 Trust Principles control Section CC5.1. Status: PASS 🟢 Compliant`,
          `[VPC-FLOW] NetFlow gateway: BGP routes nominal. Egress rate: 3.8 Gbps. 🟢 Nominal`,
          `[IDENTITY] Microsoft Entra ID: SSO MFA verification successful for user: CEO_Office. 🟢 Approved`
        ];
        const log = baselineLogs[Math.floor(Math.random() * baselineLogs.length)];
        setLiveTelemetry(prev => [log, ...prev.slice(0, 20)]);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [isUnderAttack, isMitigating]);

  // Filter logs in the terminal based on the selected category pill
  const filteredTelemetry = liveTelemetry.filter(log => {
    if (selectedTerminalModule === 'All') return true;
    if (selectedTerminalModule === 'Cloud' && log.includes('CLOUD')) return true;
    if (selectedTerminalModule === 'Network' && (log.includes('FIREWALL') || log.includes('DDOS') || log.includes('VPC-FLOW'))) return true;
    if (selectedTerminalModule === 'Server' && (log.includes('EDR') || log.includes('EXPLOIT'))) return true;
    if (selectedTerminalModule === 'AI' && log.includes('AI')) return true;
    if (selectedTerminalModule === 'Compliance' && (log.includes('GRC') || log.includes('IDENTITY'))) return true;
    return false;
  });

  // Trigger Exploit Attack Simulation
  const handleTriggerAttack = () => {
    setIsUnderAttack(true);
    setIsMitigating(false);
    setSimulatedScore(42);
    setSimProgress(0);
    
    const attackAnnounce = [
      `[SIMULATION-START] Injecting multi-vectored threat exploits to active tenant boundary...`,
      `[DDOS] Flooding Palo Alto ingress gateway with 45 Gbps UDP packet storm!`,
      `[EXPLOIT] Triggering OpenSSH CVSS 9.8 RCE root shell on prod host core-db-01!`,
      `[CLOUD] Modifying AWS bucket policies: ACME public storage exposed!`,
      `[AI-GOVERN] Spawning shadow AI requests to ChatGPT, leaking local telemetry!`,
      `[CISO-COCKPIT] Status Alert: Global cyber posture index degraded to 42 (🔴 Critical Risk)`
    ];
    setSimLogs(attackAnnounce);
    setLiveTelemetry(prev => [...attackAnnounce.reverse(), ...prev]);
  };

  // Trigger SOC Mitigation Playbook Simulation
  const handleTriggerMitigation = () => {
    setIsMitigating(true);
    setSimProgress(10);
    setSimLogs([
      `[SOC-PLAYBOOK] Remediating active exploits. Initiating corporate threat playbooks...`,
      `[EDR] Connecting to EDR agent. Restricting SSH boundaries...`
    ]);

    setTimeout(() => {
      setSimProgress(35);
      setSimLogs(prev => [
        ...prev,
        `[FIREWALL] Pushing BGP Route-Map block to border routers. Null-routing attacker subnets...`,
        `[EDR] Sending SIGKILL to miner daemon (PID 3840) on core-db-01. Restoring host CPU usage to 2%...`
      ]);
    }, 500);

    setTimeout(() => {
      setSimProgress(65);
      setSimLogs(prev => [
        ...prev,
        `[CLOUD] Restricting public read ACLs on exposed AWS S3 buckets. Applying AES-256 KMS blocks...`,
        `[AI-SHIELD] Enforcing proxy filters. Shadow AI connections terminated...`
      ]);
    }, 1000);

    setTimeout(() => {
      setSimProgress(90);
      setSimLogs(prev => [
        ...prev,
        `[GRC] Recalculating controls coverage. Generating new ISO/SOC audit checklist tokens...`,
        `[HEARTBEAT] Fleet nominal. EDR heartbeat integrity at 100%. Boundary secure.`
      ]);
    }, 1500);

    setTimeout(() => {
      setSimProgress(100);
      setSimLogs(prev => [
        ...prev,
        `[PLAYBOOK-COMPLETE] All active vectors mitigated successfully! Posture score restored. 🟢 Safe`
      ]);
      setIsMitigating(false);
      setIsUnderAttack(false);
      setSimulatedScore(currentClient.key === 'UR' ? 98 : 95); // climbs to fully secured state
    }, 2000);
  };

  // Interactive statistics mapped dynamically to simulation states
  const activePostScore = simulatedScore;
  const activeGrade = activePostScore > 85 ? 'A' : activePostScore > 70 ? 'C+' : 'D-';
  
  const mttrSpeed = isUnderAttack 
    ? (isMitigating ? '12.4 hrs (Mitigating)' : '48.5 hrs (Delayed)')
    : (activePostScore > 90 ? '1.2 hrs' : (currentClient.key === 'UR' ? '3.0 hrs' : '6.5 hrs'));

  const exposureIndex = isUnderAttack
    ? '47 critical CVEs'
    : (activePostScore > 90 ? '0 open CVE' : (currentClient.key === 'UR' ? '4 open CVEs' : '14 open CVEs'));

  const complianceLevel = isUnderAttack
    ? '51% compliance'
    : (activePostScore > 90 ? '98%' : (currentClient.key === 'UR' ? '89%' : '71%'));

  const humanRiskVal = isUnderAttack
    ? '🔥 Critical Risk'
    : (activePostScore > 90 ? '🟢 Protected' : (currentClient.key === 'UR' ? 'Low' : 'Med-High'));

  // 1. Posture Score Half-Donut Data
  const postureScoreData = [
    { name: 'Secure Score', value: activePostScore, fill: 'url(#postureGradient)' },
    { name: 'Risk Delta', value: 100 - activePostScore, fill: '#f1f5f9' }
  ];

  // 2. Vulnerability Severity Donut Data
  const severityDonutData = isUnderAttack 
    ? [
        { name: 'Critical', value: 24, fill: '#dc2626' },
        { name: 'High', value: 18, fill: '#ea580c' },
        { name: 'Medium', value: 5, fill: '#d97706' },
        { name: 'Low', value: 0, fill: '#16a34a' }
      ]
    : (activePostScore > 90 ? [
        { name: 'Critical', value: 0, fill: '#dc2626' },
        { name: 'High', value: 0, fill: '#ea580c' },
        { name: 'Medium', value: 2, fill: '#d97706' },
        { name: 'Low', value: 12, fill: '#16a34a' }
      ] : (currentClient.key === 'UR' ? [
        { name: 'Critical', value: 4, fill: '#dc2626' },
        { name: 'High', value: 8, fill: '#ea580c' },
        { name: 'Medium', value: 26, fill: '#d97706' },
        { name: 'Low', value: 54, fill: '#16a34a' }
      ] : [
        { name: 'Critical', value: appsecData.critical, fill: '#dc2626' },
        { name: 'High', value: appsecData.high, fill: '#ea580c' },
        { name: 'Medium', value: appsecData.medium, fill: '#d97706' },
        { name: 'Low', value: appsecData.low, fill: '#16a34a' }
      ]));

  const totalFindings = severityDonutData.reduce((acc, curr) => acc + curr.value, 0);

  // 3. Multi-Color Category Compliance Bar Data
  const categoryComplianceData = [
    { name: 'Cloud Security', score: isUnderAttack ? 35 : (activePostScore > 90 ? 98 : (currentClient.key === 'UR' ? 92 : cloudData.complianceScore)), fill: '#0891b2', label: 'CIS Benchmark' },
    { name: 'Network Firewall', score: isUnderAttack ? 25 : (activePostScore > 90 ? 100 : (currentClient.key === 'UR' ? 96 : Math.round(networkData.firewallEvents.blockRate))), fill: '#7c3aed', label: 'Packet Blocks' },
    { name: 'Compliance Audits', score: isUnderAttack ? 40 : (activePostScore > 90 ? 97 : (currentClient.key === 'UR' ? 89 : 71)), fill: '#059669', label: 'Framework Controls' },
    { name: 'Identity & Access', score: isUnderAttack ? 30 : (activePostScore > 90 ? 99 : (currentClient.key === 'UR' ? 87 : 64)), fill: '#a855f7', label: 'Zero Trust (IAM)' },
    { name: 'KPI Remediation', score: isUnderAttack ? 20 : (activePostScore > 90 ? 98 : (currentClient.key === 'UR' ? 94 : kpiData.patchSla)), fill: '#d97706', label: 'Ticket Remediation' },
    { name: 'Server Health', score: isUnderAttack ? 15 : (activePostScore > 90 ? 100 : (currentClient.key === 'UR' ? 99 : Math.round((serverData.healthy / serverData.totalServers) * 100))), fill: '#16a34a', label: 'Host Availability' }
  ];

  // 10 Security Control Cards Grid Mappings
  const modules = [
    { 
      href: '/dashboard/posture', 
      icon: '🛡️', 
      label: 'Cyber Posture', 
      color: '#3b82f6', 
      stat: isUnderAttack ? '42/100 (Critical)' : `${activePostScore}/100`, 
      sub: isUnderAttack ? '47 threat campaign anomalies' : `${postureData.openCriticals} critical open`, 
      bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)',
      progress: activePostScore
    },
    { 
      href: '/dashboard/cloud', 
      icon: '☁️', 
      label: 'Cloud Security', 
      color: '#0891b2', 
      stat: isUnderAttack ? '23 misconfigs' : (activePostScore > 90 ? '0 misconfigs' : `${cloudData.misconfiguredAssets} misconfigs`), 
      sub: `${cloudData.totalAssets} assets`, 
      bg: 'linear-gradient(135deg,#ecfeff,#cffafe)',
      progress: isUnderAttack ? 35 : (activePostScore > 90 ? 98 : cloudData.complianceScore)
    },
    { 
      href: '/dashboard/network', 
      icon: '🌐', 
      label: 'Network Security', 
      color: '#7c3aed', 
      stat: isUnderAttack ? 'DDoS packet flood' : `${networkData.idsAlerts.today} IDS alerts`, 
      sub: isUnderAttack ? 'Perimeter threshold overloaded' : `${networkData.firewallEvents.blockRate}% blocked`, 
      bg: 'linear-gradient(135deg,#faf5ff,#ede9fe)',
      progress: isUnderAttack ? 25 : (activePostScore > 90 ? 100 : Math.round(networkData.firewallEvents.blockRate))
    },
    { 
      href: '/dashboard/infosec', 
      icon: '📋', 
      label: 'Governance & Compliance', 
      color: '#059669', 
      stat: isUnderAttack ? 'Compliance at risk' : `${complianceLevel} compliance`, 
      sub: '5 frameworks tracked', 
      bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
      progress: isUnderAttack ? 40 : (activePostScore > 90 ? 97 : (currentClient.key === 'UR' ? 89 : 71))
    },
    { 
      href: '/dashboard/kpi', 
      icon: '📊', 
      label: 'Security KPIs', 
      color: '#d97706', 
      stat: isUnderAttack ? 'MTTR spike' : `Score ${isUnderAttack ? 25 : kpiData.overallScore}`, 
      sub: `MTTA ${isUnderAttack ? 95 : kpiData.mtta}m · MTTR ${isUnderAttack ? 48 : kpiData.mttr}h`, 
      bg: 'linear-gradient(135deg,#fffbeb,#fef3c7)',
      progress: isUnderAttack ? 20 : (activePostScore > 90 ? 98 : kpiData.patchSla)
    },
    { 
      href: '/dashboard/appsec', 
      icon: '🔐', 
      label: 'App Security', 
      color: '#dc2626', 
      stat: isUnderAttack ? '24 Critical Open' : (activePostScore > 90 ? '0 Critical' : `${appsecData.critical} Critical`), 
      sub: `${appsecData.totalFindings} findings`, 
      bg: 'linear-gradient(135deg,#fef2f2,#fecaca)',
      progress: isUnderAttack ? 15 : (activePostScore > 90 ? 100 : Math.max(10, 100 - Math.round((appsecData.critical / appsecData.totalFindings) * 1000)))
    },
    { 
      href: '/dashboard/traffic', 
      icon: '📡', 
      label: 'Traffic Monitor', 
      color: '#0ea5e9', 
      stat: isUnderAttack ? '45 Gbps Storm' : '12.4 Gbps', 
      sub: isUnderAttack ? 'Inbound DDoS flood' : '7 anomalies detected', 
      bg: 'linear-gradient(135deg,#f0f9ff,#bae6fd)',
      progress: isUnderAttack ? 10 : 88
    },
    { 
      href: '/dashboard/server', 
      icon: '🖥️', 
      label: 'Server Health', 
      color: '#a855f7', 
      stat: isUnderAttack ? '2 servers critical' : `${serverData.healthy}/${serverData.totalServers} Healthy`, 
      sub: isUnderAttack ? 'OpenSSH exploit active' : `${serverData.critical} critical`, 
      bg: 'linear-gradient(135deg,#fdf4ff,#f3e8ff)',
      progress: isUnderAttack ? 15 : (activePostScore > 90 ? 100 : Math.round((serverData.healthy / serverData.totalServers) * 100))
    },
    { 
      href: '/dashboard/ai-risk', 
      icon: '🤖', 
      label: 'AI Risk', 
      color: '#ea580c', 
      stat: isUnderAttack ? 'Critical leakage' : `Risk: ${aiRiskData.riskLevel}`, 
      sub: `${aiRiskData.shadowAiToolsDetected} shadow tools`, 
      bg: 'linear-gradient(135deg,#fff7ed,#fed7aa)',
      progress: isUnderAttack ? 30 : 68
    },
    { 
      href: '/dashboard/identity', 
      icon: '🔑', 
      label: 'Identity & Access', 
      color: '#a855f7', 
      stat: isUnderAttack ? '30% ZT Score' : `${currentClient.key === 'UR' ? 87 : 64}% ZT Score`, 
      sub: `${currentClient.key === 'UR' ? 'Microsoft Entra ID' : 'Okta SSO Directory'}`, 
      bg: 'linear-gradient(135deg,#fcf8ff,#f3e8ff)',
      progress: isUnderAttack ? 30 : (currentClient.key === 'UR' ? 87 : 64)
    }
  ];

  return (
    <>
      <div className="page-content animate-in" style={{ paddingBottom: '2.5rem' }}>

        {/* ========================================================================= */}
        {/* VIEW MODE SEGMENTED CONTROL CONTROLLER BAR */}
        {/* ========================================================================= */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '1rem', padding: '0.5rem 1rem', background: '#fff',
          border: '1px solid #e2e8f0', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {([
              { key: 'executive', label: '👑 Executive Cockpit', desc: 'KPI score dials, category bars, and framework lists' },
              { key: 'tactical', label: '🎛️ Tactical SOC Terminal', desc: 'Live operations event stream and security console' },
              { key: 'compliance', label: '📋 Compliance & Directory', desc: 'Framework controls, Zero Trust indicators, and IAM' }
            ] as const).map(v => (
              <button
                key={v.key}
                onClick={() => setActiveViewMode(v.key)}
                title={v.desc}
                style={{
                  padding: '0.6rem 1.125rem', borderRadius: '10px', border: 'none', fontWeight: 800, fontSize: '0.78rem',
                  cursor: 'pointer', background: activeViewMode === v.key ? '#7c3aed' : 'transparent',
                  color: activeViewMode === v.key ? '#fff' : '#64748b', transition: 'all 0.15s ease',
                  boxShadow: activeViewMode === v.key ? '0 4px 12px rgba(124, 58, 237, 0.2)' : 'none'
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, paddingRight: '0.5rem' }}>
            Layout Selection: <span style={{ fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase' }}>{activeViewMode}</span>
          </span>
        </div>

        {/* Dynamic Executive Score Banner HUD */}
        <div style={{ 
          background: isUnderAttack ? '#fef2f2' : '#ffffff', 
          borderRadius: 14, 
          padding: '0.625rem 1.5rem', 
          marginBottom: '1rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '1rem',
          border: isUnderAttack ? '1px solid #fecaca' : '1px solid #e2e8f0', 
          boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
          minHeight: '74px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {isUnderAttack && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#ef4444', animation: 'pulse-dot 1.5s infinite' }} />
          )}

          {/* Left: Client Name & Overall Posture Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <span 
                className="hud-pulse" 
                style={{ 
                  background: isUnderAttack ? '#ef4444' : (currentClient.key === 'UR' ? '#10b981' : '#3b82f6'), 
                  width: 8, 
                  height: 8, 
                  flexShrink: 0 
                }} 
              />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                  {currentClient.name}
                </div>
                <div style={{ fontSize: '0.62rem', color: isUnderAttack ? '#dc2626' : '#64748b', fontWeight: 600 }}>
                  {isUnderAttack ? '🚨 CRITICAL SECURITY THREAT ACTIVE' : 'Telemetry Sync Active ●'}
                </div>
              </div>
            </div>
            
            <div style={{ width: 1, height: 26, background: '#e2e8f0' }} />

            {/* Score HUD Display */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginRight: 4 }}>Posture Index:</span>
                <span style={{ fontSize: '1.375rem', fontWeight: 900, color: isUnderAttack ? '#dc2626' : '#0f172a', lineHeight: 1 }}>{activePostScore}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>/100</span>
                <span style={{ 
                  fontSize: '0.65rem', 
                  color: isUnderAttack ? '#dc2626' : (currentClient.key === 'UR' ? '#16a34a' : '#ea580c'), 
                  background: isUnderAttack ? 'rgba(239,68,68,0.12)' : (currentClient.key === 'UR' ? 'rgba(22,163,74,0.12)' : 'rgba(234,88,12,0.12)'), 
                  border: isUnderAttack ? '1px solid rgba(239,68,68,0.2)' : (currentClient.key === 'UR' ? '1px solid rgba(22,163,74,0.2)' : '1px solid rgba(234,88,12,0.2)'), 
                  borderRadius: 4, 
                  padding: '1px 6px', 
                  marginLeft: 8, 
                  fontWeight: 800 
                }}>
                  {isUnderAttack ? '🔥 Breach Wave Exploit' : (activePostScore > 90 ? '✓ Premium Guard' : 'Elevated Risk')}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Board-level HUD Cards */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
            {[
              { label: 'MTTR Speed', value: mttrSpeed, color: '#7c3aed', bg: 'rgba(124,58,237,0.06)', border: 'rgba(124,58,237,0.15)' },
              { label: 'Exposure Index', value: exposureIndex, color: '#dc2626', bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.15)' },
              { label: 'GRC compliance', value: complianceLevel, color: '#10b981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.15)' },
              { label: 'Human Risk', value: humanRiskVal, color: '#ea580c', bg: 'rgba(234,88,12,0.06)', border: 'rgba(234,88,12,0.15)' }
            ].map(s => (
              <div 
                key={s.label} 
                style={{ 
                  background: isUnderAttack ? 'rgba(220,38,38,0.04)' : s.bg, 
                  border: isUnderAttack ? '1px solid rgba(220,38,38,0.15)' : `1px solid ${s.border}`, 
                  borderRadius: 10, 
                  padding: '0.5rem 0.85rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  minHeight: '44px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 900, color: isUnderAttack ? '#dc2626' : '#0f172a', lineHeight: 1 }}>{s.value}</span>
                  <span style={{ fontSize: '0.58rem', color: isUnderAttack ? '#dc2626' : s.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EXECUTIVE COCKPIT VIEW MODE */}
        {/* ========================================================================= */}
        {activeViewMode === 'executive' && (
          <div className="grid-3 animate-in" style={{ marginBottom: '1rem' }}>
            
            {/* 1. HALF-DONUT POSTURE SCORE GAUGE */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '300px', background: '#fff', border: isUnderAttack ? '1px solid #fca5a5' : '1px solid #e2e8f0', borderRadius: 16, padding: '1.25rem', position: 'relative' }}>
              {isUnderAttack && (
                <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse-dot 1s infinite' }} />
                  <span style={{ fontSize: '0.58rem', color: '#dc2626', fontWeight: 800 }}>ATTACK LIVE</span>
                </div>
              )}
              <div className="card-title" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                🛡️ Posture Score Gauge & Sandbox
              </div>
              
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart key={`${currentClient.key}-${activePostScore}`}>
                    <defs>
                      <linearGradient id="postureGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={postureScoreData}
                      cx="50%"
                      cy="70%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={75}
                      outerRadius={98}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {postureScoreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Stat Overlay */}
                <div style={{ position: 'absolute', top: '68%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.45rem', fontWeight: 900, color: isUnderAttack ? '#dc2626' : '#0f172a', lineHeight: 1 }}>
                    {activePostScore}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: isUnderAttack ? '#ef4444' : '#16a34a', fontWeight: 800, background: isUnderAttack ? '#fef2f2' : '#f0fdf4', border: isUnderAttack ? '1px solid #fecaca' : '1px solid #bbf7d0', borderRadius: 4, padding: '1px 6px', display: 'inline-block', marginTop: 3 }}>
                    GRADE: {activeGrade}
                  </div>
                </div>
              </div>

              {/* Simulation Action Buttons */}
              <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem' }}>
                <button
                  onClick={handleTriggerAttack}
                  disabled={isUnderAttack || isMitigating}
                  style={{
                    flex: 1, padding: '0.45rem', border: 'none', borderRadius: 8, fontSize: '0.65rem', fontWeight: 800,
                    cursor: (isUnderAttack || isMitigating) ? 'default' : 'pointer',
                    background: (isUnderAttack || isMitigating) ? '#f1f5f9' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: (isUnderAttack || isMitigating) ? '#94a3b8' : '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s'
                  }}
                >
                  💣 Exploit Attack Wave
                </button>
                <button
                  onClick={handleTriggerMitigation}
                  disabled={!isUnderAttack || isMitigating}
                  style={{
                    flex: 1, padding: '0.45rem', border: 'none', borderRadius: 8, fontSize: '0.65rem', fontWeight: 800,
                    cursor: (!isUnderAttack || isMitigating) ? 'default' : 'pointer',
                    background: (!isUnderAttack || isMitigating) ? '#f1f5f9' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: (!isUnderAttack || isMitigating) ? '#94a3b8' : '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s'
                  }}
                >
                  ⚡ Run SOC Playbook
                </button>
              </div>
            </div>

            {/* 2. FULL DONUT VULNERABILITY SEVERITY CHART */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '300px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.25rem' }}>
              <div className="card-title" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                🍩 Severity Findings Breakdown
              </div>
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart key={`${currentClient.key}-${activePostScore}`}>
                    <Pie
                      data={severityDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={88}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {severityDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ fontSize: 11, borderRadius: 8 }}
                      formatter={(value: any, name: any) => [`${value} findings`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Central Count Overlay */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.65rem', fontWeight: 900, color: isUnderAttack ? '#dc2626' : '#0f172a', lineHeight: 1 }}>{totalFindings}</div>
                  <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: 2 }}>Open Threats</div>
                </div>
              </div>

              {/* Custom Interactive Color Legend Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.62rem', fontWeight: 800, borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                <div style={{ color: '#dc2626' }}>Critical ({severityDonutData[0]?.value || 0})</div>
                <div style={{ color: '#ea580c' }}>High ({severityDonutData[1]?.value || 0})</div>
                <div style={{ color: '#d97706' }}>Med ({severityDonutData[2]?.value || 0})</div>
                <div style={{ color: '#16a34a' }}>Low ({severityDonutData[3]?.value || 0})</div>
              </div>
            </div>

            {/* 3. MULTI-COLOR CATEGORY COMPLIANCE BAR CHART */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '300px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.25rem' }}>
              <div className="card-title" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                📊 Controls coverage distribution
              </div>
              <div style={{ flex: 1, paddingTop: '0.5rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart key={`${currentClient.key}-${activePostScore}`} data={categoryComplianceData} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#475569', fontWeight: 700 }} width={90} />
                    <Tooltip
                      contentStyle={{ fontSize: 11, borderRadius: 8 }}
                      formatter={(value: any, name: any, props: any) => [`${value}% Compliance`, props.payload.label]}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={8}>
                      {categoryComplianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem', marginTop: 4 }}>
                Recalculating network configurations and EDR parameters.
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TACTICAL SOC TERMINAL VIEW MODE */}
        {/* ========================================================================= */}
        {activeViewMode === 'tactical' && (
          <div className="grid-2-1 animate-in" style={{ marginBottom: '1rem' }}>
            {/* Left: Simulation progress and dynamic controls */}
            <div className="card" style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>🚨 Tactical Threat Simulator</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, background: isUnderAttack ? '#fef2f2' : '#f0fdf4', color: isUnderAttack ? '#ef4444' : '#22c55e', padding: '2px 8px', borderRadius: 10 }}>
                    {isUnderAttack ? 'EXPLOIT TRIGGERED' : 'SECURE OPS'}
                  </span>
                </div>
                <p style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: '1.3' }}>
                  Test your incident response capabilities. Inject cyber threats (DDoS attacks, SQL injections, SSH brute-force PIDs) and deploy automated remediations in real-time.
                </p>

                {isMitigating && (
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#7c3aed', fontFamily: 'monospace', fontWeight: 700, marginBottom: 4 }}>
                      <span>DEPLOYING SECURITY REMEDIATION PLAYBOOK:</span>
                      <span>{simProgress}%</span>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${simProgress}%`, background: '#7c3aed', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                <button
                  onClick={handleTriggerAttack}
                  disabled={isUnderAttack || isMitigating}
                  style={{
                    flex: 1, padding: '0.75rem', border: 'none', borderRadius: 10, fontSize: '0.78rem', fontWeight: 800,
                    cursor: (isUnderAttack || isMitigating) ? 'default' : 'pointer',
                    background: (isUnderAttack || isMitigating) ? '#f1f5f9' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: (isUnderAttack || isMitigating) ? '#94a3b8' : '#fff',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)', transition: 'all 0.2s'
                  }}
                >
                  💣 Trigger Vulnerability exploit Wave
                </button>
                <button
                  onClick={handleTriggerMitigation}
                  disabled={!isUnderAttack || isMitigating}
                  style={{
                    flex: 1, padding: '0.75rem', border: 'none', borderRadius: 10, fontSize: '0.78rem', fontWeight: 800,
                    cursor: (!isUnderAttack || isMitigating) ? 'default' : 'pointer',
                    background: (!isUnderAttack || isMitigating) ? '#f1f5f9' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: (!isUnderAttack || isMitigating) ? '#94a3b8' : '#fff',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)', transition: 'all 0.2s'
                  }}
                >
                  ⚡ Run Automated mitigation shaper
                </button>
              </div>
            </div>

            {/* Right: Simulation Logs Terminal */}
            <div className="card" style={{ height: '300px', display: 'flex', flexDirection: 'column', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem', marginBottom: '0.65rem', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                </div>
                <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', color: '#64748b' }}>playbook_simulator@posturepilot: ~</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.72rem', color: '#c084fc', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {simLogs.length === 0 ? (
                  <div style={{ color: '#475569', fontStyle: 'italic', margin: 'auto', textAlign: 'center', fontSize: '0.74rem' }}>
                    Simulator inactive. Click "Trigger Vulnerability Exploit Wave"<br/>on the left to observe multithreaded mitigation telemetry...
                  </div>
                ) : (
                  simLogs.map((log, i) => (
                    <div key={i} style={{ color: log.includes('COMPLETE') || log.includes('Nominal') || log.includes('Safe') ? '#34d399' : log.includes('BGP') || log.includes('CLOUD') ? '#fbbf24' : '#f87171', whiteSpace: 'pre-wrap' }}>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* COMPLIANCE & DIRECTORY VIEW MODE */}
        {/* ========================================================================= */}
        {activeViewMode === 'compliance' && (
          <div className="grid-2 animate-in" style={{ marginBottom: '1rem' }}>
            
            {/* GRC compliance checks */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>📋 GRC Framework Audit Progress</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, background: '#ecfdf5', color: '#10b981', padding: '2px 6px', borderRadius: 10 }}>Framework Checklists</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'center' }}>
                {[
                  { name: 'SOC 2 Type II Compliance', pct: isUnderAttack ? 35 : (activePostScore > 90 ? 98 : (currentClient.key === 'UR' ? 89 : 71)), color: '#10b981' },
                  { name: 'ISO 27001:2022 Security Rule', pct: isUnderAttack ? 25 : (activePostScore > 90 ? 97 : (currentClient.key === 'UR' ? 85 : 64)), color: '#3b82f6' },
                  { name: 'PCI-DSS v4.0 Credit Standards', pct: isUnderAttack ? 40 : (activePostScore > 90 ? 99 : (currentClient.key === 'UR' ? 95 : 78)), color: '#7c3aed' },
                  { name: 'HIPAA Privacy Safeguards', pct: isUnderAttack ? 30 : (activePostScore > 90 ? 96 : (currentClient.key === 'UR' ? 88 : 68)), color: '#06b6d4' },
                  { name: 'NIST Cyber Security Framework', pct: isUnderAttack ? 32 : (activePostScore > 90 ? 98 : (currentClient.key === 'UR' ? 90 : 70)), color: '#ea580c' }
                ].map(f => (
                  <div key={f.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: 3 }}>
                      <span>{f.name}</span>
                      <span style={{ color: f.color }}>{f.pct}%</span>
                    </div>
                    <div className="progress-bar-wrap" style={{ height: 8, background: '#f1f5f9' }}>
                      <div className="progress-bar-fill" style={{ width: `${f.pct}%`, background: f.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zero Trust Directory Indicators */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>🔑 Identity & Access (Zero Trust) Posture</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, background: '#f5f3ff', color: '#7c3aed', padding: '2px 6px', borderRadius: 10 }}>
                  {currentClient.key === 'UR' ? 'Microsoft Entra ID' : 'Okta SSO Directory'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1rem', flex: 1, alignItems: 'center' }}>
                {/* Circular MFA Progress Dial */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #f1f5f9', paddingRight: '1rem' }}>
                  <div style={{ position: 'relative', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="45" cy="45" r="36" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                      <circle 
                        cx="45" cy="45" r="36" 
                        stroke="#7c3aed" 
                        strokeWidth="6" 
                        fill="transparent" 
                        strokeDasharray={`${2 * Math.PI * 36}`}
                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - (isUnderAttack ? 45.6 : (activePostScore > 90 ? 100.0 : (currentClient.key === 'UR' ? 98.2 : 85.6))) / 100)}`}
                        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#7c3aed', letterSpacing: '-0.04em' }}>
                        {isUnderAttack ? '45.6%' : (activePostScore > 90 ? '100%' : (currentClient.key === 'UR' ? '98.2%' : '85.6%'))}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748b', marginTop: 6, textTransform: 'uppercase', textAlign: 'center' }}>MFA Coverage</div>
                </div>

                {/* Identity Telemetry Indicators */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { label: 'Active SSO Users', value: currentClient.key === 'UR' ? 478 : 312, icon: '👥' },
                    { label: 'Privileged Admins', value: isUnderAttack ? 45 : (currentClient.key === 'UR' ? 12 : 28), icon: '👑' },
                    { label: 'API Keys Stale (>90d)', value: isUnderAttack ? 19 : (currentClient.key === 'UR' ? 2 : 17), icon: '🔑' },
                    { label: 'SSO Travel Spikes', value: isUnderAttack ? 14 : (currentClient.key === 'UR' ? 2 : 3), icon: '🚨' }
                  ].map(item => (
                    <div key={item.label} style={{ padding: '0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.58rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        <span>{item.icon}</span>
                        <span>{item.label.split(' ')[0]}</span>
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 900, color: isUnderAttack && item.label.includes('Spikes') ? '#dc2626' : '#0f172a', marginTop: 2 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* RESPONSIVE SECURITY CONTROL MODULE GRID */}
        {/* ========================================================================= */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#475569', marginBottom: '1rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          ⚡ Security Control Modules & Sub-Telemetry <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#eef2ff', color: '#4f46e5' }}>10 active layers</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
          {modules.map(m => (
            <div 
              key={m.href} 
              className="overview-module-card animate-in" 
              onClick={() => router.push(m.href)} 
              style={{ 
                background: m.bg, 
                border: `1px solid ${m.color}22`,
                position: 'relative',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '160px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              {/* Card Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '1.625rem' }}>{m.icon}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: m.color, background: `${m.color}15`, border: `1px solid ${m.color}30`, borderRadius: 20, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {m.label}
                  </div>
                </div>

                {/* Stat Display */}
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: isUnderAttack && (m.label.includes('Cloud') || m.label.includes('Network') || m.label.includes('Server') || m.label.includes('App') || m.label.includes('Traffic')) ? '#dc2626' : '#0f172a', letterSpacing: '-0.02em' }}>
                  {m.stat}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '1px' }}>
                  {m.sub}
                </div>
              </div>

              {/* Miniature Progress bar */}
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', fontWeight: 700, color: m.color, marginBottom: 2 }}>
                  <span>Security Health</span>
                  <span>{m.progress}%</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.6)', borderRadius: 99, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <div style={{ height: '100%', width: `${m.progress}%`, background: m.color, borderRadius: 99, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* LIVE UNIFIED SOC EVENT CONSOLE TERMINAL */}
        {/* ========================================================================= */}
        <div className="card" style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '320px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem', marginBottom: '0.65rem', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                🖥️ Live Unified Security Operations Terminal
                <span className="hud-pulse" style={{ width: 6, height: 6, background: '#10b981' }} />
              </span>
            </div>
            <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', color: '#64748b' }}>unified_soc_engine@posturepilot: ~</span>
          </div>

          {/* Module Filter Pills Inside Terminal */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {(['All', 'Cloud', 'Network', 'Server', 'AI', 'Compliance'] as const).map(pill => (
              <button
                key={pill}
                onClick={() => setSelectedTerminalModule(pill)}
                style={{
                  fontFamily: 'monospace', fontSize: '0.58rem', fontWeight: 800,
                  padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', border: 'none',
                  background: selectedTerminalModule === pill ? '#7c3aed' : '#1e293b',
                  color: selectedTerminalModule === pill ? '#fff' : '#a78bfa',
                  transition: 'all 0.15s ease'
                }}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Continuous capture packet scroll block */}
          <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.72rem', color: '#c084fc', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {filteredTelemetry.length === 0 ? (
              <div style={{ color: '#475569', fontStyle: 'italic', margin: 'auto', textAlign: 'center', fontSize: '0.74rem' }}>
                No active threat logs captured in the "{selectedTerminalModule}" layer. Watching gateway sub-channels...
              </div>
            ) : (
              filteredTelemetry.map((log, i) => {
                const isCrit = log.includes('🔴') || log.includes('EXPLOIT') || log.includes('DDOS');
                const isWarn = log.includes('Warning') || log.includes('Alert');
                return (
                  <div 
                    key={i} 
                    style={{ 
                      color: isCrit ? '#f87171' : isWarn ? '#fbbf24' : '#38bdf8', 
                      fontSize: '0.68rem',
                      borderBottom: '1px solid rgba(255,255,255,0.02)',
                      paddingBottom: '2px'
                    }}
                  >
                    {log}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </>
  );
}
