'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { appsecData } from '@/data/mockData';
import Link from 'next/link';

interface LiveData {
  hasLiveData: boolean; total: number; critical: number; high: number; patchBacklog: number;
  bySeverity: Record<string,number>; byTool: Record<string,number>;
  topCVEs: { cveId: string|null; count: number }[];
}

// Package details for interactive SCA card
const packageDetails: Record<string, {
  name: string;
  cve: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  cvss: number;
  description: string;
  recommendation: string;
  remediationTime: string;
}> = {
  'body-parser': {
    name: 'body-parser',
    cve: 'CVE-2022-29153',
    severity: 'Critical',
    cvss: 9.8,
    description: 'Prototype pollution vulnerability in query parsing allows malicious actors to execute arbitrary code (RCE) via custom payload payloads.',
    recommendation: 'Upgrade to version 1.20.1 or higher inside package.json dependencies.',
    remediationTime: 'Immediate (< 24 hours)'
  },
  'jsonwebtoken': {
    name: 'jsonwebtoken',
    cve: 'CVE-2022-31129',
    severity: 'High',
    cvss: 8.1,
    description: 'Improper verification of JWT signatures when algorithm is set to none or using weak validation keys allows attackers to bypass core auth.',
    recommendation: 'Refactor middleware/auth.ts to require strict cryptographic signature validation.',
    remediationTime: 'Within 7 days'
  },
  'express-session': {
    name: 'express-session',
    cve: 'None Detected',
    severity: 'Low',
    cvss: 0.0,
    description: 'This package is audited and does not contain any known CVEs. Session tokens are properly hashed and configured with secure HTTPOnly parameters.',
    recommendation: 'Maintain standard package updates and ensure cookie domain rules are regularly enforced.',
    remediationTime: 'Compliant'
  }
};

export default function AppsecPage() {
  const [live, setLive] = useState<LiveData | null>(null);

  // ASPM Dynamic Interaction States
  const [onboardingStep, setOnboardingStep] = useState<'orchestrate' | 'dependency' | 'iac' | 'patch'>('orchestrate');
  const [selectedScanTool, setSelectedScanTool] = useState<'SAST' | 'DAST' | 'SCA' | 'Secrets' | 'IaC'>('SAST');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanComplete, setScanComplete] = useState(false);

  // Interactive SCA Tree selection
  const [selectedPackage, setSelectedPackage] = useState<'body-parser' | 'jsonwebtoken' | 'express-session'>('body-parser');

  // IaC Shield Configurations
  const [iacShieldActive, setIacShieldActive] = useState(false);

  // Git Auto-Patching State
  const [vulnerabilities, setVulnerabilities] = useState([
    {
      id: 'vuln1',
      title: 'Upgrade body-parser to resolve Prototype Pollution (RCE)',
      file: 'package.json',
      type: 'Software Composition Analysis (SCA)',
      severity: 'Critical',
      patched: false,
      codeBefore: `  "dependencies": {\n-   "body-parser": "1.19.0",\n    "express": "^4.17.1"\n  }`,
      codeAfter: `  "dependencies": {\n+   "body-parser": "1.20.1", // Resolved Secure Version\n    "express": "^4.17.1"\n  }`,
      impactBacklog: 14,
      impactFindings: 1,
      metricType: 'critical'
    },
    {
      id: 'vuln2',
      title: 'Enforce JWT Cryptographic Verification in middleware/auth.ts',
      file: 'middleware/auth.ts',
      type: 'Static Application Security Testing (SAST)',
      severity: 'High',
      patched: false,
      codeBefore: `  const token = req.headers.authorization;\n- const decoded = jwt.decode(token); // Vulnerable to signature bypass\n  req.user = decoded;`,
      codeAfter: `  const token = req.headers.authorization;\n+ const decoded = jwt.verify(token, process.env.JWT_SECRET); // Strict verification\n  req.user = decoded;`,
      impactBacklog: 12,
      impactFindings: 1,
      metricType: 'high'
    },
    {
      id: 'vuln3',
      title: 'Restrict Public Ingress in main.tf Security Groups',
      file: 'main.tf',
      type: 'Infrastructure as Code (IaC) Security',
      severity: 'High',
      patched: false,
      codeBefore: `  ingress {\n    from_port   = 22\n    to_port     = 22\n-   cidr_blocks = ["0.0.0.0/0"] // Open ingress rule\n  }`,
      codeAfter: `  ingress {\n    from_port   = 22\n    to_port     = 22\n+   cidr_blocks = ["10.0.0.0/8"] // Secured within private VPC subnet\n  }`,
      impactBacklog: 12,
      impactFindings: 1,
      metricType: 'high'
    },
    {
      id: 'vuln4',
      title: 'Scrub Hardcoded GitHub Client Secret from server.ts',
      file: 'server.ts',
      type: 'Secrets Leakage Detection',
      severity: 'High',
      patched: false,
      codeBefore: `- const clientSecret = "gh_oauth_7f2cd18a995e8b3bc1c08d51";\n  const clientID = "gh_id_23910c81";`,
      codeAfter: `+ const clientSecret = process.env.GITHUB_CLIENT_SECRET; // Loaded securely from Env\n  const clientID = "gh_id_23910c81";`,
      impactBacklog: 8,
      impactFindings: 1,
      metricType: 'high'
    }
  ]);
  const [selectedVulnId, setSelectedVulnId] = useState('vuln1');
  const [isPatching, setIsPatching] = useState(false);

  useEffect(() => {
    fetch('/api/findings/appsec').then(r => r.json())
      .then(d => { if (d.hasLiveData) setLive(d); }).catch(() => {});
  }, []);

  // Triggering ASPM scan simulation
  const startSecurityScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    setScanLogs([
      `[INIT] Spawning ASPM security orchestration worker...`,
      `[CONFIG] Connecting API tunnels to Checkmarx One Cloud and Wiz CNAPP...`
    ]);

    const scannerSteps: Record<string, { progress: number; log: string }[]> = {
      SAST: [
        { progress: 20, log: `[SAST] Initiating Checkmarx One AST Engine on local repositories...` },
        { progress: 50, log: `[SAST] Checkmarx Alert: Identified weak JWT decoding in middleware/auth.ts (CX-AST-3810)` },
        { progress: 80, log: `[SAST] Compiling code flow graph matching signature algorithms...` },
        { progress: 100, log: `[COMPLETE] Checkmarx SAST engine check complete. 1 High vulnerability logged.` }
      ],
      DAST: [
        { progress: 20, log: `[DAST] Launching Checkmarx One DAST scanner sweep on production endpoints...` },
        { progress: 50, log: `[DAST] Probing cross-site scripting (XSS) and SQL injection payloads...` },
        { progress: 80, log: `[DAST] Ingress router returned standard HTTP 403 Forbidden. Safe endpoint state verified.` },
        { progress: 100, log: `[COMPLETE] Checkmarx DAST automated probe finished. 0 new findings.` }
      ],
      SCA: [
        { progress: 25, log: `[SCA] Invoking Checkmarx One SCA Package Dependency scanner...` },
        { progress: 55, log: `[SCA] Checkmarx SCA Alert: Dependency 'body-parser@1.19.0' is vulnerable to CVE-2022-29153!` },
        { progress: 80, log: `[SCA] Matching active node overrides inside package-lock.json...` },
        { progress: 100, log: `[COMPLETE] Checkmarx SCA check finished. 1 Critical dependency vulnerability discovered.` }
      ],
      Secrets: [
        { progress: 30, log: `[SECRETS] Spawning Wiz Secrets scanner and regex credentials scraper...` },
        { progress: 65, log: `[SECRETS] Wiz Alert: Found hardcoded GitHub Client Secret inside server.ts (line 12)!` },
        { progress: 85, log: `[SECRETS] Auditing configuration parameters & .env profiles...` },
        { progress: 100, log: `[COMPLETE] Wiz Secrets scan finished. 1 High secret credentials leak discovered.` }
      ],
      IaC: [
        { progress: 25, log: `[IaC] Running Wiz CLI Ingress Analyzer on IaC Terraform configurations...` },
        { progress: 60, log: `[IaC] Wiz Alert: Open security group ingress rule detected on main.tf (CIDR: 0.0.0.0/0)` },
        { progress: 85, log: `[IaC] Checking compliance against NIST SP 800-53 cloud controls...` },
        { progress: 100, log: `[COMPLETE] Wiz CNAPP IaC configuration scan finished. 1 High warning logged.` }
      ]
    };

    const targetSteps = scannerSteps[selectedScanTool];
    let currentStepIndex = 0;

    const interval = setInterval(() => {
      if (currentStepIndex < targetSteps.length) {
        const step = targetSteps[currentStepIndex];
        setScanProgress(step.progress);
        setScanLogs(prev => [...prev, step.log]);
        currentStepIndex++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        setScanComplete(true);
      }
    }, 800);
  };

  // Deploying git patch
  const deployCodePatch = (vulnId: string) => {
    if (isPatching) return;
    setIsPatching(true);
    setTimeout(() => {
      setVulnerabilities(prev =>
        prev.map(v => v.id === vulnId ? { ...v, patched: true } : v)
      );
      // Auto toggle active step if specific patch is deployed
      const targetVuln = vulnerabilities.find(v => v.id === vulnId);
      if (targetVuln?.id === 'vuln3') {
        setIacShieldActive(true);
      }
      setIsPatching(false);
      alert(`Auto-Patch applied successfully! Code repository pushed. Vulnerability is resolved.`);
    }, 1200);
  };

  // Dynamic Diffs calculations based on applied patches
  const baseFindings = live ? live.total : 4850;
  const baseCritical = live ? live.critical : 12;
  const baseHigh = live ? live.high : 34;
  const baseBacklog = live ? live.patchBacklog : 46;

  const patchedBacklogDeduction = vulnerabilities.reduce((acc, v) => acc + (v.patched ? v.impactBacklog : 0), 0);
  const patchedCriticalDeduction = vulnerabilities.reduce((acc, v) => acc + (v.patched && v.metricType === 'critical' ? v.impactFindings : 0), 0);
  const patchedHighDeduction = vulnerabilities.reduce((acc, v) => acc + (v.patched && v.metricType === 'high' ? v.impactFindings : 0), 0);
  const patchedFindingsDeduction = patchedCriticalDeduction * 150 + patchedHighDeduction * 80;

  const dynamicFindings = Math.max(0, baseFindings - patchedFindingsDeduction);
  const dynamicCritical = Math.max(0, baseCritical - patchedCriticalDeduction);
  const dynamicHigh = Math.max(0, baseHigh - patchedHighDeduction);
  const dynamicBacklog = Math.max(0, baseBacklog - patchedBacklogDeduction);

  const activePatchedCount = vulnerabilities.filter(v => v.patched).length;

  const sevChart = [
    { name: 'Critical', value: dynamicCritical },
    { name: 'High', value: dynamicHigh },
    { name: 'Medium', value: live ? (live.bySeverity['Medium'] || 45) : 45 },
    { name: 'Low', value: live ? (live.bySeverity['Low'] || 120) : 120 }
  ];

  return (
    <>
      <div className="page-content animate-in">

        {/* Premium Dynamic Alert Banner */}
        <div style={{ background: 'linear-gradient(135deg, #ede9fe, #dbeafe)', border: '1px solid #c084fc', borderRadius: 12, padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', boxShadow: '0 0 8px #7c3aed' }} />
            <div>
              <div style={{ fontWeight: 800, color: '#6d28d9', fontSize: '0.9rem' }}>
                ASPM Unified Command Center // Checkmarx One & Wiz CNAPP Synced
              </div>
              <div style={{ fontSize: '0.75rem', color: '#7c3aed' }}>
                Checkmarx One (SAST/SCA): <span style={{ color: '#16a34a', fontWeight: 800 }}>Connected ●</span> · Wiz CNAPP (IaC/Secrets): <span style={{ color: '#16a34a', fontWeight: 800 }}>Active ●</span> · Auto-Patched Assets: {activePatchedCount} of {vulnerabilities.length}
              </div>
            </div>
          </div>
          <Link href="/dashboard/findings" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7c3aed', textDecoration: 'none', border: '1px solid #c084fc', padding: '0.375rem 0.875rem', borderRadius: 8 }}>
            Browse All CVE Findings →
          </Link>
        </div>

        {/* Dynamic KPI stats cards */}
        <div className="grid-4">
          {[
            { label: 'Total App Findings', value: dynamicFindings.toLocaleString(), accent: '#7c3aed', delta: 'Dynamic calculated score' },
            { label: 'Critical', value: String(dynamicCritical), accent: '#dc2626', delta: 'CVSS ≥ 9.0 (RCE & injection)' },
            { label: 'High Severity', value: String(dynamicHigh), accent: '#ea580c', delta: 'CVSS 7.0–8.9 (Secrets & auth)' },
            { label: 'Patch Backlog', value: String(dynamicBacklog), accent: '#d97706', delta: 'Awaiting git code release' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.accent }}>{s.value}</div>
              <div className="stat-delta delta-down">{s.delta}</div>
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE CONTROLS TABS */}
        {/* ========================================================================= */}
        <div className="card" style={{ marginBottom: '1.25rem', padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>⚙️ ASPM Orchestration & Threat Control Center</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>Run orchestrator scanner checks, visualize dependency tree security, and apply git configurations.</p>
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '3px 10px', borderRadius: 20, background: '#ede9fe', color: '#7c3aed', border: '1px solid #ddd6fe' }}>
              POSTUREPILOT ASPM SHIELD
            </span>
          </div>

          {/* 4 Interactive Navigation Steps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {[
              { id: 'orchestrate', title: 'ASPM Scanners', desc: 'Trigger automated code scanners', icon: '🔍', completed: scanComplete },
              { id: 'dependency', title: 'SCA Package Tree', desc: 'Browse dependency relationships', icon: '🌳', completed: vulnerabilities.find(v => v.id === 'vuln1')?.patched },
              { id: 'iac', title: 'IaC Ingress Shield', desc: 'Configure cloud ingress proxy rules', icon: '🏗️', completed: iacShieldActive },
              { id: 'patch', title: 'Auto-Patching Engine', desc: 'Deploy automatic git code patches', icon: '⚡', completed: activePatchedCount === vulnerabilities.length }
            ].map(step => (
              <div
                key={step.id}
                onClick={() => setOnboardingStep(step.id as any)}
                style={{
                  background: onboardingStep === step.id ? 'linear-gradient(135deg, #f5f3ff, #ede9fe)' : '#fff',
                  border: onboardingStep === step.id ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                  borderRadius: 12, padding: '0.85rem 1rem', cursor: 'pointer', position: 'relative',
                  transition: 'all 0.2s', boxShadow: onboardingStep === step.id ? '0 4px 12px rgba(124, 58, 237, 0.12)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                  <span style={{ fontSize: '1.2rem' }}>{step.icon}</span>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>{step.title}</span>
                  {step.completed && (
                    <span style={{ marginLeft: 'auto', background: '#dcfce7', color: '#15803d', fontSize: '0.6rem', fontWeight: 800, padding: '1px 6px', borderRadius: 10 }}>
                      ✓ Secure
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.3 }}>{step.desc}</div>
              </div>
            ))}
          </div>

          {/* DYNAMIC TAB CONTROLLERS */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem' }}>

            {/* TAB 1: ASPM SCANNERS */}
            {onboardingStep === 'orchestrate' && (
              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.25rem' }}>
                <div style={{ background: '#fff', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>🛡️ Security Orchestrator Check</div>
                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }}>SELECT TARGET SCANNER</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {['SAST', 'DAST', 'SCA', 'Secrets', 'IaC'].map(tool => (
                        <button
                          key={tool}
                          onClick={() => setSelectedScanTool(tool as any)}
                          disabled={isScanning}
                          style={{
                            textAlign: 'left', padding: '0.45rem 0.75rem', fontSize: '0.78rem',
                            background: selectedScanTool === tool ? '#f5f3ff' : '#fff',
                            border: selectedScanTool === tool ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                            borderRadius: 6, fontWeight: selectedScanTool === tool ? 800 : 500, cursor: 'pointer',
                            color: selectedScanTool === tool ? '#6d28d9' : '#334155'
                          }}
                        >
                          {tool === 'SAST' && '🔍 SAST (Static Code Audit)'}
                          {tool === 'DAST' && '🌐 DAST (Dynamic Endpoint Probe)'}
                          {tool === 'SCA' && '🌳 SCA (Package Dependency Tree)'}
                          {tool === 'Secrets' && '🔑 Secrets (API Key Discovery)'}
                          {tool === 'IaC' && '🏗️ IaC (Terraform Configuration Audit)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={startSecurityScan}
                    disabled={isScanning}
                    style={{
                      background: isScanning ? '#cbd5e1' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                      color: isScanning ? '#64748b' : '#fff', border: 'none', padding: '0.6rem',
                      borderRadius: 6, fontWeight: 800, fontSize: '0.78rem', cursor: isScanning ? 'default' : 'pointer',
                      boxShadow: isScanning ? 'none' : '0 4px 12px rgba(124, 58, 237, 0.2)', textTransform: 'uppercase', letterSpacing: '0.04em'
                    }}
                  >
                    {isScanning ? '🔍 Scanning Repository...' : 'Run Security Scan ⚡'}
                  </button>
                </div>

                {/* Simulated Logs Terminal Console */}
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '1rem', display: 'flex', flexDirection: 'column', height: '275px', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308' }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                    </div>
                    <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', color: '#64748b' }}>orchestrator_node@posturepilot: ~</span>
                  </div>

                  {isScanning && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#c084fc', fontFamily: 'monospace', marginBottom: 2 }}>
                        <span>ORCHESTRATING SCAN:</span>
                        <span>{scanProgress}%</span>
                      </div>
                      <div style={{ height: 4, background: '#1e293b', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${scanProgress}%`, background: '#7c3aed', transition: 'width 0.3s ease' }} />
                      </div>
                    </div>
                  )}

                  <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.72rem', color: '#a78bfa', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {scanLogs.length === 0 ? (
                      <div style={{ color: '#475569', fontStyle: 'italic', margin: 'auto', textAlign: 'center' }}>
                        Select a scanning tool from the left panel and click<br/>"Run Security Scan" to trigger the telemetry output logs...
                      </div>
                    ) : (
                      scanLogs.map((log, i) => (
                        <div key={i} style={{ color: log.includes('Alert') || log.includes('Warning') ? '#fbbf24' : log.includes('COMPLETE') ? '#34d399' : '#a78bfa', whiteSpace: 'pre-wrap' }}>
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SCA DEPENDENCY TREE */}
            {onboardingStep === 'dependency' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>
                {/* Dependency flow diagram */}
                <div style={{ background: '#fff', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>🌳 Software Composition Analysis (SCA) Dependency Tree Map</span>
                    <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#7c3aed' }}>CLICK NODE TO INSPECT</span>
                  </div>

                  {/* HTML Flowchart tree */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', position: 'relative', padding: '1rem 0' }}>
                    
                    {/* Root Node */}
                    <div style={{ background: '#f8fafc', border: '2px solid #64748b', borderRadius: 10, padding: '0.6rem 1.25rem', textAlign: 'center', zIndex: 2 }}>
                      <span style={{ fontSize: '1.3rem', display: 'block' }}>🏢</span>
                      <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#1e293b' }}>app-gateway (Root)</span>
                    </div>

                    {/* Paths row */}
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', position: 'relative', gap: '1rem' }}>
                      
                      {/* Package 1 */}
                      <div
                        onClick={() => setSelectedPackage('express-session')}
                        style={{
                          flex: 1, background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: 10,
                          padding: '0.5rem 0.75rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                          boxShadow: selectedPackage === 'express-session' ? '0 0 10px rgba(34, 197, 94, 0.4)' : 'none'
                        }}
                      >
                        <span style={{ fontSize: '1.2rem', display: 'block' }}>🔒</span>
                        <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#15803d' }}>express-session</span>
                        <div style={{ fontSize: '0.58rem', color: '#16a34a', fontWeight: 700, marginTop: 2 }}>SECURED</div>
                      </div>

                      {/* Package 2 */}
                      <div
                        onClick={() => setSelectedPackage('body-parser')}
                        style={{
                          flex: 1,
                          background: vulnerabilities.find(v => v.id === 'vuln1')?.patched ? '#f0fdf4' : '#fef2f2',
                          border: `2px solid ${vulnerabilities.find(v => v.id === 'vuln1')?.patched ? '#22c55e' : '#ef4444'}`,
                          borderRadius: 10, padding: '0.5rem 0.75rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                          boxShadow: selectedPackage === 'body-parser' ? '0 0 12px currentColor' : 'none',
                          color: vulnerabilities.find(v => v.id === 'vuln1')?.patched ? '#16a34a' : '#ef4444'
                        }}
                      >
                        <span style={{ fontSize: '1.2rem', display: 'block' }}>📦</span>
                        <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#0f172a' }}>body-parser</span>
                        <div style={{ fontSize: '0.58rem', fontWeight: 800, marginTop: 2 }}>
                          {vulnerabilities.find(v => v.id === 'vuln1')?.patched ? 'SECURED (PATCHED)' : 'CRITICAL VULN'}
                        </div>
                      </div>

                      {/* Package 3 */}
                      <div
                        onClick={() => setSelectedPackage('jsonwebtoken')}
                        style={{
                          flex: 1,
                          background: vulnerabilities.find(v => v.id === 'vuln2')?.patched ? '#f0fdf4' : '#fffbeb',
                          border: `2px solid ${vulnerabilities.find(v => v.id === 'vuln2')?.patched ? '#22c55e' : '#f59e0b'}`,
                          borderRadius: 10, padding: '0.5rem 0.75rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                          boxShadow: selectedPackage === 'jsonwebtoken' ? '0 0 12px currentColor' : 'none',
                          color: vulnerabilities.find(v => v.id === 'vuln2')?.patched ? '#16a34a' : '#f59e0b'
                        }}
                      >
                        <span style={{ fontSize: '1.2rem', display: 'block' }}>🔑</span>
                        <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#0f172a' }}>jsonwebtoken</span>
                        <div style={{ fontSize: '0.58rem', fontWeight: 800, marginTop: 2 }}>
                          {vulnerabilities.find(v => v.id === 'vuln2')?.patched ? 'SECURED (PATCHED)' : 'HIGH VULN'}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Threat details sidebar */}
                {(() => {
                  const pkg = packageDetails[selectedPackage];
                  if (!pkg) return null;
                  const isPatched = selectedPackage === 'express-session' || 
                                    (selectedPackage === 'body-parser' && vulnerabilities.find(v => v.id === 'vuln1')?.patched) ||
                                    (selectedPackage === 'jsonwebtoken' && vulnerabilities.find(v => v.id === 'vuln2')?.patched);

                  return (
                    <div style={{ background: '#fff', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0f172a' }}>🌳 Package Inquest</span>
                        <span style={{
                          fontSize: '0.58rem', fontWeight: 800, padding: '1px 6px', borderRadius: 4,
                          background: isPatched ? '#dcfce7' : pkg.severity === 'Critical' ? '#fee2e2' : '#ffedd5',
                          color: isPatched ? '#15803d' : pkg.severity === 'Critical' ? '#dc2626' : '#ea580c'
                        }}>{isPatched ? 'Safe' : pkg.severity}</span>
                      </div>

                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{pkg.name}</div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.65rem', fontWeight: 700 }}>
                        <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: 4 }}>CVE: {pkg.cve}</span>
                        {!isPatched && <span style={{ background: '#fef2f2', color: '#dc2626', padding: '2px 6px', borderRadius: 4 }}>CVSS: {pkg.cvss}</span>}
                      </div>

                      <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.4 }}>
                        {pkg.description}
                      </div>

                      <div style={{ background: isPatched ? '#f0fdf4' : '#fffbeb', border: `1px solid ${isPatched ? '#bbf7d0' : '#fde68a'}`, padding: '0.65rem', borderRadius: 6, marginTop: 'auto' }}>
                        <div style={{ fontSize: '0.58rem', fontWeight: 800, color: isPatched ? '#16a34a' : '#b45309', textTransform: 'uppercase', marginBottom: 2 }}>Remediation Strategy</div>
                        <p style={{ fontSize: '0.74rem', color: isPatched ? '#15803d' : '#92400e', lineHeight: 1.35 }}>
                          {isPatched ? 'Package security verified. This dependency contains zero active vulnerabilities.' : pkg.recommendation}
                        </p>
                        {!isPatched && (
                          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#b45309', marginTop: 4 }}>
                            SLA Window: <span style={{ textDecoration: 'underline' }}>{pkg.remediationTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 3: IAC CONFIGURATION SHIELD */}
            {onboardingStep === 'iac' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>
                <div style={{ background: '#fff', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: 8, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>🏗️ Infrastructure as Code (IaC) Network Security Group Ingress</span>
                    <span style={{ fontSize: '0.58rem', fontWeight: 800, color: iacShieldActive ? '#16a34a' : '#dc2626' }}>
                      {iacShieldActive ? 'SHIELD PROTECTED' : 'VULNERABLE'}
                    </span>
                  </div>

                  {/* IaC network diagram */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '1.5rem 0', gap: '1rem' }}>
                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0.5rem 1rem', textAlign: 'center' }}>
                      <span style={{ fontSize: '1.2rem', display: 'block' }}>🌐</span>
                      <span style={{ fontWeight: 800, fontSize: '0.72rem', color: '#475569' }}>Public Internet</span>
                    </div>

                    <div style={{ height: 2, background: iacShieldActive ? '#22c55e' : '#ef4444', flex: 1, position: 'relative' }}>
                      <div style={{
                        position: 'absolute', top: -3, left: '50%', width: 8, height: 8, borderRadius: '50%',
                        background: iacShieldActive ? '#22c55e' : '#ef4444', boxShadow: '0 0 8px currentColor'
                      }} />
                    </div>

                    <div style={{
                      background: iacShieldActive ? '#f0fdf4' : '#fee2e2',
                      border: `1.5px solid ${iacShieldActive ? '#22c55e' : '#fca5a5'}`,
                      borderRadius: 8, padding: '0.5rem 1rem', textAlign: 'center'
                    }}>
                      <span style={{ fontSize: '1.2rem', display: 'block' }}>🛡️</span>
                      <span style={{ fontWeight: 800, fontSize: '0.72rem', color: '#0f172a' }}>Ingress SG</span>
                      <div style={{ fontSize: '0.58rem', fontWeight: 800, color: iacShieldActive ? '#16a34a' : '#dc2626' }}>
                        {iacShieldActive ? 'Internal VPC (10.0.0.0/8)' : 'Public (0.0.0.0/0)'}
                      </div>
                    </div>

                    <div style={{ height: 2, background: '#cbd5e1', flex: 1 }} />

                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0.5rem 1rem', textAlign: 'center' }}>
                      <span style={{ fontSize: '1.2rem', display: 'block' }}>🖥️</span>
                      <span style={{ fontWeight: 800, fontSize: '0.72rem', color: '#475569' }}>EC2 Instances</span>
                    </div>
                  </div>
                </div>

                {/* Configuration control panel */}
                <div style={{ background: '#fff', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>🏗️ Terraform Subnet Shield</div>
                  <p style={{ fontSize: '0.74rem', color: '#64748b' }}>Lock cloud infrastructure open pathways and restrict network endpoints to private VPC internal scopes.</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.6rem 0.85rem', marginTop: 'auto' }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a' }}>Ingress Proxy Shield</span>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 2 }}>Enforces AWS PrivateLink & VPN tunnels</div>
                    </div>
                    {/* Toggle */}
                    <label style={{ position: 'relative', display: 'inline-block', width: 36, height: 20, cursor: 'pointer', flexShrink: 0 }}>
                      <input
                        type="checkbox"
                        checked={iacShieldActive}
                        onChange={() => {
                          setIacShieldActive(!iacShieldActive);
                          // Auto trigger the tf patch
                          setVulnerabilities(prev =>
                            prev.map(v => v.id === 'vuln3' ? { ...v, patched: !iacShieldActive } : v)
                          );
                        }}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: iacShieldActive ? '#7c3aed' : '#cbd5e1',
                        borderRadius: 20, transition: '0.3s',
                        boxShadow: iacShieldActive ? '0 0 8px rgba(124,58,237,0.3)' : 'none'
                      }} />
                      <span style={{
                        position: 'absolute', left: 2, bottom: 2, width: 16, height: 16,
                        backgroundColor: '#fff', borderRadius: '50%', transition: '0.3s',
                        transform: iacShieldActive ? 'translateX(16px)' : 'none'
                      }} />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: AUTO-PATCHING ENGINE */}
            {onboardingStep === 'patch' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#fff', border: '1px solid #cbd5e1', padding: '1rem', borderRadius: 8 }}>
                <span style={{ fontSize: '2.5rem' }}>⚡</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', marginBottom: 2 }}>Automated Git Repository Code Patches</div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 8 }}>
                    Scan files for hardcoded credentials, security vulnerabilities, or misconfigured open subnets. Deploy patches directly to active pipelines.
                  </p>
                  <button
                    onClick={() => {
                      setVulnerabilities(prev =>
                        prev.map(v => ({ ...v, patched: true }))
                      );
                      setIacShieldActive(true);
                      alert('Global Auto-Patching completed. All 4 code vulnerabilities resolved securely!');
                    }}
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', border: 'none', padding: '0.45rem 1.1rem', borderRadius: 6, fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Deploy All Git Patches in One-Click
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ========================================================================= */}
        {/* AUTOMATED AI CODE SECURITY & SINGLE-CLICK AUTO-PATCHING */}
        {/* ========================================================================= */}
        <div className="card" style={{ marginBottom: '1.25rem', padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16 }}>
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>⚡ ASPM Automated Code Security & Single-Click Auto-Patching</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>Scan development code repositories and auto-deploy git patches instantly to secure leaks.</p>
            </div>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: '#ede9fe', color: '#7c3aed', border: '1px solid #ddd6fe' }}>
              REMEDIATION ENGINE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
            
            {/* Vulnerability lists */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {vulnerabilities.map(v => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVulnId(v.id)}
                  style={{
                    padding: '0.75rem 1rem', background: selectedVulnId === v.id ? '#f5f3ff' : '#f8fafc',
                    border: selectedVulnId === v.id ? '2.5px solid #7c3aed' : '1px solid #e2e8f0',
                    borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.58rem', fontWeight: 800, fontFamily: 'monospace', color: '#7c3aed', background: '#ede9fe', padding: '1px 5px', borderRadius: 4 }}>{v.file}</span>
                    <span style={{
                      fontSize: '0.58rem', fontWeight: 800, padding: '1px 6px', borderRadius: 4,
                      background: v.patched ? '#dcfce7' : v.severity === 'Critical' ? '#fee2e2' : '#ffedd5',
                      color: v.patched ? '#15803d' : v.severity === 'Critical' ? '#dc2626' : '#ea580c'
                    }}>{v.patched ? 'Patched' : v.severity}</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0f172a', lineHeight: 1.3 }}>{v.title}</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 4 }}>Patch Reduction: -{v.impactBacklog} Backlog</div>
                </div>
              ))}
            </div>

            {/* Side-by-side Git Code Diff Viewer */}
            {(() => {
              const vuln = vulnerabilities.find(v => v.id === selectedVulnId);
              if (!vuln) return null;

              return (
                <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #cbd5e1', borderRadius: 8, overflow: 'hidden' }}>
                  
                  {/* File status bar */}
                  <div style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#334155', fontWeight: 700 }}>git diff HEAD -- {vuln.file}</span>
                    <button
                      onClick={() => deployCodePatch(vuln.id)}
                      disabled={vuln.patched || isPatching}
                      style={{
                        background: vuln.patched ? '#16a34a' : isPatching ? '#d97706' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                        color: '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 800, padding: '0.35rem 0.85rem',
                        borderRadius: 6, cursor: vuln.patched || isPatching ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      {vuln.patched ? '✓ Patched & Safe' : isPatching ? 'Applying Patch...' : 'Deploy Auto-Patch ⚡'}
                    </button>
                  </div>

                  {/* Terminal diff display */}
                  <div style={{ background: '#0f172a', padding: '1rem', fontFamily: 'monospace', fontSize: '0.72rem', overflowX: 'auto', flex: 1, minHeight: '140px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {vuln.patched ? (
                      vuln.codeAfter.split('\n').map((line, i) => (
                        <div key={i} style={{ color: line.startsWith('+') ? '#4ade80' : '#94a3b8', background: line.startsWith('+') ? 'rgba(74, 222, 128, 0.08)' : 'transparent', padding: '2px 4px' }}>
                          {line}
                        </div>
                      ))
                    ) : (
                      vuln.codeBefore.split('\n').map((line, i) => (
                        <div key={i} style={{ color: line.startsWith('-') ? '#f87171' : '#94a3b8', background: line.startsWith('-') ? 'rgba(248, 113, 113, 0.08)' : 'transparent', padding: '2px 4px' }}>
                          {line}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })()}

          </div>
        </div>

        {/* Existing Severity Distribution Chart & scan coverage deck */}
        <div className="grid-2">
          <div className="card">
            <div className="card-title">📊 Live Findings by Severity</div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Vulnerability counts distributed across CVSS severity tiers. Deploy patches to reduce counts dynamically.
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sevChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="value" name="Findings" fill="#7c3aed" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-title">🔍 Scan Coverage & Integration Metrics</div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Parsed results from Snyk, Trufflehog, AWS Inspector, and local static analysis.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'center' }}>
              {[
                { name: 'app-gateway (Root)', sast: 8, dast: 4, color: '#7c3aed' },
                { name: 'auth-service', sast: 4, dast: 2, color: '#4f46e5' },
                { name: 'payment-processor', sast: 5, dast: 1, color: '#06b6d4' },
                { name: 'notify-worker', sast: 2, dast: 0, color: '#10b981' }
              ].map(s => {
                const totalVal = s.sast + s.dast;
                return (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 600, width: 130, flexShrink: 0 }}>{s.name}</span>
                    <div style={{ flex: 1 }}>
                      <div className="progress-bar-wrap" style={{ height: 8 }}>
                        <div className="progress-bar-fill" style={{ width: `${Math.min(100, totalVal * 8)}%`, background: s.color }} />
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: s.color, width: 60, textTransform: 'uppercase', textAlign: 'right' }}>
                      {totalVal} vulns
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
