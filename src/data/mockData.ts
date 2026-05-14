// PosturePilot — Realistic Mock Data
// Based on industry-average security metrics for a 500-person mid-market company

export const mockTenant = {
  name: 'Acme Financial Corp',
  industry: 'Financial Services',
  assetCount: 1247,
  lastScanDate: '2026-05-13T18:42:00Z',
  plan: 'Professional',
};

// ── 1. Cyber Posture ──────────────────────────────────────────────────────────
export const postureData = {
  score: 74,
  grade: 'C+',
  trend: -3, // dropped 3 points from last month
  threatLevel: 'Elevated',
  controlCoverage: 82,
  openCriticals: 14,
  activeThreatCampaigns: 3,
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
  ],
};

// ── 2. Cloud Security ─────────────────────────────────────────────────────────
export const cloudData = {
  totalAssets: 342,
  misconfiguredAssets: 38,
  complianceScore: 71,
  storageExposure: 4, // buckets publicly accessible
  assets: [
    { type: 'Compute', count: 148, iamRisk: 'High', storageExposure: 'Medium', configStatus: 'Compliant' },
    { type: 'Storage', count: 89,  iamRisk: 'Medium', storageExposure: 'At Risk', configStatus: 'At Risk' },
    { type: 'Identity', count: 67, iamRisk: 'High', storageExposure: 'Low', configStatus: 'Compliant' },
    { type: 'Network', count: 38,  iamRisk: 'Low', storageExposure: 'Medium', configStatus: 'Compliant' },
  ],
  misconfigByCategory: [
    { name: 'Compute', critical: 8, high: 12, medium: 6 },
    { name: 'Storage', critical: 4, high: 3, medium: 9 },
    { name: 'Identity', critical: 2, high: 8, medium: 4 },
    { name: 'Network', critical: 1, high: 4, medium: 7 },
  ],
  iamMetrics: {
    totalAccounts: 312,
    mfaEnabled: 267,
    mfaCoverage: 85.6,
    privilegedAccounts: 28,
    orphanedAccounts: 11,
    staleCredentials: 17, // no login > 90 days
    excessivePermissions: 34,
  },
  vpcFindings: {
    openPorts: 7,
    publicSubnets: 12,
    unencryptedBuckets: 4,
    loggingDisabled: 9,
  },
};

// ── 3. Network Security ───────────────────────────────────────────────────────
export const networkData = {
  firewallEvents: {
    total: 94821,
    blocked: 87342,
    allowed: 7479,
    blockRate: 92.1,
  },
  topBlockedSources: [
    { ip: '203.0.113.45', country: '🇨🇳 CN', count: 18640, type: 'Port Scan' },
    { ip: '198.51.100.22', country: '🇷🇺 RU', count: 12330, type: 'Brute Force' },
    { ip: '192.0.2.178',  country: '🇧🇷 BR', count: 9870, type: 'C2 Traffic' },
    { ip: '10.0.0.15',    country: '🏠 Internal', count: 4450, type: 'Policy Violation' },
    { ip: '172.16.0.8',   country: '🏠 Internal', count: 3210, type: 'Malware' },
  ],
  vpnStats: {
    activeSessions: 47,
    totalUsers: 312,
    failedAuths24h: 23,
    topLocation: 'New York, US',
  },
  idsAlerts: {
    today: 34,
    critical: 4,
    high: 12,
    medium: 18,
  },
  weeklyFirewallTrend: [
    { day: 'Mon', blocked: 13200, allowed: 980 },
    { day: 'Tue', blocked: 11800, allowed: 1120 },
    { day: 'Wed', blocked: 15600, allowed: 1040 },
    { day: 'Thu', blocked: 12900, allowed: 1380 },
    { day: 'Fri', blocked: 14100, allowed: 1560 },
    { day: 'Sat', blocked: 9800,  allowed: 760 },
    { day: 'Sun', blocked: 9942,  allowed: 639 },
  ],
};

// ── 4. Information Security / Compliance ──────────────────────────────────────
export const infosecData = {
  overallCompliance: 73,
  frameworks: [
    { name: 'SOC 2 Type II', progress: 78, status: 'In Progress', owner: 'Security Team', dueDate: '2026-08-31' },
    { name: 'ISO 27001',     progress: 62, status: 'In Progress', owner: 'IT Security', dueDate: '2026-10-15' },
    { name: 'NIST CSF 2.0',  progress: 81, status: 'On Track',    owner: 'CISO Office', dueDate: '2026-07-01' },
    { name: 'PCI DSS 4.0',   progress: 88, status: 'On Track',    owner: 'Compliance', dueDate: '2026-06-30' },
    { name: 'HIPAA',         progress: 45, status: 'At Risk',     owner: 'Privacy Office', dueDate: '2026-09-01' },
  ],
  policyReview: [
    { policy: 'Access Control Policy',   owner: 'IT Security',  progress: 85, status: 'On Track',  lastReview: '2026-03-15' },
    { policy: 'Data Classification',     owner: 'Data Office',  progress: 65, status: 'At Risk',   lastReview: '2025-11-01' },
    { policy: 'Incident Response Plan',  owner: 'SOC',          progress: 90, status: 'On Track',  lastReview: '2026-04-20' },
    { policy: 'Awareness Training',      owner: 'HR Security',  progress: 72, status: 'On Track',  lastReview: '2026-02-10' },
    { policy: 'Business Continuity',     owner: 'Risk Mgmt',    progress: 40, status: 'Overdue',   lastReview: '2025-08-15' },
  ],
  auditFindings: {
    total: 47,
    open: 18,
    inProgress: 14,
    closed: 15,
    overdue: 5,
  },
  trainingCompletion: {
    phishing: 87,
    securityAwareness: 79,
    dataPrivacy: 91,
    incidentResponse: 68,
  },
};

// ── 5. Security KPIs ──────────────────────────────────────────────────────────
export const kpiData = {
  mtta: 28,           // Mean Time to Acknowledge (minutes)
  mttr: 14.2,         // Mean Time to Remediate (hours) — critical vulns
  patchSla: 84,       // % patched within SLA
  closureRate: 91,    // % of tickets closed (last 30 days)
  overallScore: 78,
  grade: 'B-',
  patchBacklog: 234,  // vulns past SLA
  openTickets: 47,
  criticalOpenTickets: 8,
  monthlyKpis: [
    { month: 'Dec', mtta: 42, mttr: 19.1, patchSla: 71, closureRate: 84 },
    { month: 'Jan', mtta: 38, mttr: 17.8, patchSla: 74, closureRate: 86 },
    { month: 'Feb', mtta: 34, mttr: 16.2, patchSla: 78, closureRate: 88 },
    { month: 'Mar', mtta: 31, mttr: 15.4, patchSla: 80, closureRate: 89 },
    { month: 'Apr', mtta: 29, mttr: 14.8, patchSla: 82, closureRate: 90 },
    { month: 'May', mtta: 28, mttr: 14.2, patchSla: 84, closureRate: 91 },
  ],
  byTeam: [
    { team: 'Infrastructure',  assigned: 89, resolved: 78, slaCompliance: 87, avgMttr: 12.4 },
    { team: 'Application Dev', assigned: 67, resolved: 58, slaCompliance: 79, avgMttr: 18.2 },
    { team: 'Cloud Ops',       assigned: 54, resolved: 51, slaCompliance: 94, avgMttr: 9.8 },
    { team: 'End User Compute',assigned: 42, resolved: 40, slaCompliance: 95, avgMttr: 6.2 },
    { team: 'Network',         assigned: 28, resolved: 24, slaCompliance: 82, avgMttr: 14.7 },
  ],
};

// ── 6. Application Security ───────────────────────────────────────────────────
export const appsecData = {
  totalFindings: 847,
  openFindings: 312,
  critical: 14,
  high: 67,
  medium: 148,
  low: 83,
  patchBacklogApps: 128,
  criticalApps: 5,
  applications: [
    { name: 'Customer Portal',  sast: 12, dast: 7,  severity: 'High',     remediation: 'In Progress' },
    { name: 'Payment Gateway',  sast: 4,  dast: 18, severity: 'Critical', remediation: 'Overdue' },
    { name: 'HR Portal',        sast: 28, dast: 6,  severity: 'High',     remediation: 'In Progress' },
    { name: 'Mobile App',       sast: 9,  dast: 3,  severity: 'Medium',   remediation: 'Planned' },
    { name: 'API Gateway',      sast: 15, dast: 18, severity: 'Critical', remediation: 'Overdue' },
    { name: 'Admin Dashboard',  sast: 6,  dast: 4,  severity: 'Medium',   remediation: 'In Progress' },
  ],
  owaspTop10: [
    { id: 'A01', name: 'Broken Access Control', findings: 34, trend: 'up' },
    { id: 'A02', name: 'Cryptographic Failures', findings: 18, trend: 'down' },
    { id: 'A03', name: 'Injection', findings: 12, trend: 'stable' },
    { id: 'A04', name: 'Insecure Design', findings: 29, trend: 'up' },
    { id: 'A05', name: 'Security Misconfiguration', findings: 41, trend: 'up' },
    { id: 'A06', name: 'Vulnerable Components', findings: 87, trend: 'down' },
  ],
  containerSecurity: {
    totalImages: 147,
    scannedImages: 134,
    criticalVulnImages: 12,
    highVulnImages: 38,
    passedImages: 84,
    iacMisconfigs: 23,
    pipelineFailures: 7,
  },
};

// ── 7. Traffic Monitoring ─────────────────────────────────────────────────────
export const trafficData = {
  inboundGbps: 12.4,
  outboundGbps: 3.8,
  anomaliesDetected: 7,
  activeAlerts: 3,
  protocolMix: [
    { name: 'HTTPS', value: 45, color: '#3b82f6' },
    { name: 'TCP',   value: 25, color: '#7c3aed' },
    { name: 'UDP',   value: 15, color: '#0891b2' },
    { name: 'DNS',   value: 10, color: '#059669' },
    { name: 'Other', value: 5,  color: '#94a3b8' },
  ],
  hourlyTraffic: [
    { hour: '00:00', inbound: 2.1, outbound: 0.8 },
    { hour: '02:00', inbound: 1.4, outbound: 0.5 },
    { hour: '04:00', inbound: 1.2, outbound: 0.4 },
    { hour: '06:00', inbound: 3.8, outbound: 1.2 },
    { hour: '08:00', inbound: 9.2, outbound: 3.1 },
    { hour: '10:00', inbound: 12.4, outbound: 3.8 },
    { hour: '12:00', inbound: 14.1, outbound: 4.2 },
    { hour: '14:00', inbound: 13.7, outbound: 4.0 },
    { hour: '16:00', inbound: 11.8, outbound: 3.6 },
    { hour: '18:00', inbound: 7.4, outbound: 2.4 },
    { hour: '20:00', inbound: 4.9, outbound: 1.7 },
    { hour: '22:00', inbound: 3.2, outbound: 1.1 },
  ],
  trafficSpikes: [
    { time: '10:14 AM', magnitude: '+340%', type: 'DDoS Attempt', resolved: true },
    { time: '02:33 AM', magnitude: '+180%', type: 'Outbound Exfil Suspected', resolved: false },
    { time: 'Yesterday 4:50 PM', magnitude: '+95%', type: 'Unusual Port Activity', resolved: true },
  ],
};

// ── 8. Server Monitoring ──────────────────────────────────────────────────────
export const serverData = {
  totalServers: 64,
  healthy: 54,
  warning: 7,
  critical: 3,
  servers: [
    { id: 'SRV-01', role: 'Web (Prod)',   cpu: 42, memory: 61, disk: 48, uptime: '47d', health: 'good' },
    { id: 'SRV-02', role: 'DB Primary',   cpu: 76, memory: 72, disk: 68, uptime: '18d', health: 'warning' },
    { id: 'SRV-03', role: 'API Gateway',  cpu: 35, memory: 55, disk: 40, uptime: '32d', health: 'good' },
    { id: 'SRV-04', role: 'Auth Server',  cpu: 60, memory: 66, disk: 59, uptime: '22d', health: 'good' },
    { id: 'SRV-05', role: 'Mail Relay',   cpu: 91, memory: 88, disk: 76, uptime: '3d',  health: 'critical' },
    { id: 'SRV-06', role: 'Log Collector',cpu: 28, memory: 45, disk: 82, uptime: '55d', health: 'warning' },
    { id: 'SRV-07', role: 'Backup Node',  cpu: 12, memory: 34, disk: 91, uptime: '61d', health: 'critical' },
    { id: 'SRV-08', role: 'Dev/Test',     cpu: 55, memory: 58, disk: 44, uptime: '9d',  health: 'good' },
  ],
  avgCpu: 49.9,
  avgMemory: 59.9,
  avgDisk: 63.5,
};

// ── 9. AI Risk & Governance ───────────────────────────────────────────────────
export const aiRiskData = {
  overallAiRiskScore: 62, // 0-100, higher = more risk
  riskLevel: 'Medium-High',
  shadowAiToolsDetected: 23,
  approvedAiTools: 7,
  sensitiveDataExposure: 'Medium',

  owaspLlmCoverage: [
    { id: 'LLM01', name: 'Prompt Injection',       status: 'Not Implemented', risk: 'critical', incidents: 3 },
    { id: 'LLM02', name: 'Insecure Output Handling',status: 'Partial',        risk: 'high',     incidents: 1 },
    { id: 'LLM03', name: 'Training Data Poisoning', status: 'Implemented',    risk: 'medium',   incidents: 0 },
    { id: 'LLM04', name: 'Model DoS',               status: 'Partial',        risk: 'medium',   incidents: 2 },
    { id: 'LLM05', name: 'Supply Chain Vulns',       status: 'Not Implemented',risk: 'high',     incidents: 0 },
    { id: 'LLM06', name: 'Sensitive Info Disclosure',status: 'Implemented',   risk: 'high',     incidents: 1 },
    { id: 'LLM07', name: 'Insecure Plugin Design',   status: 'Partial',       risk: 'medium',   incidents: 0 },
    { id: 'LLM08', name: 'Excessive Agency',         status: 'Not Implemented',risk: 'high',     incidents: 1 },
    { id: 'LLM09', name: 'Overreliance',             status: 'Implemented',   risk: 'low',      incidents: 0 },
    { id: 'LLM10', name: 'Model Theft',              status: 'Partial',       risk: 'medium',   incidents: 0 },
  ],

  shadowAiTools: [
    { tool: 'ChatGPT (Personal)',    users: 142, dataShared: 'High',   policyStatus: 'Blocked', category: 'LLM' },
    { tool: 'Midjourney',           users: 38,  dataShared: 'Low',    policyStatus: 'Allowed', category: 'Image Gen' },
    { tool: 'GitHub Copilot (unlic)',users: 27,  dataShared: 'Medium', policyStatus: 'Pending', category: 'Code Gen' },
    { tool: 'Perplexity AI',        users: 19,  dataShared: 'Medium', policyStatus: 'Pending', category: 'Search' },
    { tool: 'Claude (Personal)',     users: 14,  dataShared: 'High',   policyStatus: 'Blocked', category: 'LLM' },
  ],

  regulatoryCompliance: [
    { framework: 'EU AI Act', coverage: 41, status: 'At Risk',     deadline: '2026-08-02' },
    { framework: 'NIST AI RMF', coverage: 58, status: 'In Progress', deadline: '2026-12-31' },
    { framework: 'ISO 42001',   coverage: 34, status: 'At Risk',     deadline: '2027-01-01' },
  ],

  incidentsByMonth: [
    { month: 'Dec', incidents: 2 },
    { month: 'Jan', incidents: 3 },
    { month: 'Feb', incidents: 1 },
    { month: 'Mar', incidents: 4 },
    { month: 'Apr', incidents: 6 },
    { month: 'May', incidents: 8 },
  ],
};
