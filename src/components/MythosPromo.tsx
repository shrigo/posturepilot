"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useClient } from "@/context/ClientContext";


interface FeatureDetail {
  name: string;
  desc: string;
}

interface Metric {
  val: string;
  label: string;
  desc: string[];
}

interface FeatureModule {
  id: string;
  title: string;
  icon: string;
  desc: string;
  tagline: string;
  coreFeatures: FeatureDetail[];
  funnelMetrics: Metric[];
  funnelStages: string[];
  enterpriseFeatures: FeatureDetail[];
  terminalTitle: string;
  terminalDesc: string;
}

const MODULES_DATA: FeatureModule[] = [
  {
    id: "posture",
    title: "Posture Clearance",
    icon: "🛡️",
    desc: "Joint posture index & real-time clearance.",
    tagline: "Continuous operational gates to validate system posture and block exposure.",
    coreFeatures: [
      { name: "Joint Posture Index (JPI)", desc: "Dynamic real-time calculation of your complete security posture across code, cloud, and hosts." },
      { name: "Real-Time Clearance Gates", desc: "Auto-validate build integrity and block deployment of unapproved scripts and configuration changes." },
      { name: "Threat Intelligence Sync", desc: "Sync live threat intelligence feeds directly into systemic risk grading calculations." }
    ],
    funnelMetrics: [
      { val: "4.18M", label: "Raw Detections", desc: ["Discovered across all assets", "Uncontextualized risk data"] },
      { val: "320.6K", label: "Grouped Risk Flags", desc: ["Consolidated into clusters", "Eliminates duplicate alerts"] },
      { val: "42.1K", label: "Exposed Assets", desc: ["Publicly facing vulnerables", "Active threat intel correlation"] },
      { val: "12.4K", label: "Auto-Cleared Gates", desc: ["Cleared at deployment gates", "Safe configuration pathways"] }
    ],
    funnelStages: ["Raw Assets", "Posture Flags", "Exposed Risks", "Auto-Cleared"],
    enterpriseFeatures: [
      { name: "Executive Flight Deck", desc: "Real-time, customizable posture dashboard designed specifically for CISO board-level reporting." },
      { name: "Clearance Audit Trails", desc: "Automated audit logs proving posture gate clearance compliance to regulatory inspectors." }
    ],
    terminalTitle: "Active Posture Clearance Gates",
    terminalDesc: "Real-time telemetry showing gate validation and pass/fail states across active clusters."
  },
  {
    id: "cloud",
    title: "Cloud Altitude",
    icon: "☁️",
    desc: "Multicloud asset drift & exposed buckets.",
    tagline: "Map multicloud assets, detect policy drifts, and secure exposed storage.",
    coreFeatures: [
      { name: "Unified Cloud Inventory", desc: "Map AWS, Azure, GCP, and SaaS assets in a single pane with real-time dependency relations." },
      { name: "IAM Privilege Drift Scanner", desc: "Discover over-privileged IAM keys, orphaned credentials, and temporary admin permissions." },
      { name: "Public Storage Bucket Auditor", desc: "Scan and detect exposed S3 buckets, public databases, and unencrypted file structures." }
    ],
    funnelMetrics: [
      { val: "850.4K", label: "Cloud Resources", desc: ["Monitored VM/serverless nodes", "Active database instances"] },
      { val: "42.1K", label: "IAM & Bucket Drifts", desc: ["Policy baseline deviations", "Over-privileged credentials"] },
      { val: "3.88K", label: "Critical Exposures", desc: ["Public storage databases", "Unencrypted VM volumes"] },
      { val: "810", label: "Auto-Quarantined Keys", desc: ["Revoked cloud secrets", "Restricted storage buckets"] }
    ],
    funnelStages: ["Cloud Resources", "Drift Flags", "Exposures", "Quarantined"],
    enterpriseFeatures: [
      { name: "Secret Leakage Alerting", desc: "Revoke exposed cloud credentials and API keys in under 2 seconds upon repository commit." },
      { name: "Continuous CSPM Auditing", desc: "Continuous mapping of cloud configuration states against CIS benchmarks and custom policies." }
    ],
    terminalTitle: "Multicloud Altitude Topology",
    terminalDesc: "Live mapping of active cloud workloads, VM server instances, and public bucket triggers."
  },
  {
    id: "network",
    title: "Network Runway",
    icon: "🌐",
    desc: "Perimeter log analysis & VPN health.",
    tagline: "Defend perimeter endpoints and monitor firewall log telemetry.",
    coreFeatures: [
      { name: "Perimeter Log Ingestion", desc: "Audit millions of network packet requests at border firewalls and security gateways." },
      { name: "IDS/IPS Threat Signatures", desc: "Block rogue port scans, brute force attempts, and IP probing waves automatically." },
      { name: "VPN Gateway Inspector", desc: "Audit active VPN tunnel health, track user sessions, and map login geo-locations." }
    ],
    funnelMetrics: [
      { val: "142.6M", label: "Inbound Packets", desc: ["Traffic processed at edge", "Raw traffic log volume"] },
      { val: "3.12M", label: "Boundary Hits", desc: ["Connection requests to nodes", "Filtered border logs"] },
      { val: "182.4K", label: "Rogue Port Probes", desc: ["Probing alerts from botnets", "High risk source IPs"] },
      { val: "4,210", label: "IP Ranges Geo-blocked", desc: ["Dynamic firewall bans", "Zero-Trust network blocks"] }
    ],
    funnelStages: ["Traffic Logs", "Boundary Hits", "Port Scans", "Banned IPs"],
    enterpriseFeatures: [
      { name: "Autonomous Segregation", desc: "Isolate compromised server instances from the network runway to stop lateral threat movement." },
      { name: "Banned IP Geo-blocking", desc: "Ban entire malicious IP ranges dynamically based on threat reputation scores." }
    ],
    terminalTitle: "Edge Firewall Gateway Logs",
    terminalDesc: "Real-time border traffic monitoring showing blocked inbound packets and IP ranges."
  },
  {
    id: "appsec",
    title: "App Security Check",
    icon: "🔐",
    desc: "Vulnerability funnel & CI/CD blocks.",
    tagline: "Secure software supply chains and enforce CI/CD pipeline blocks.",
    coreFeatures: [
      { name: "SAST/DAST Consolidation", desc: "Unify static and dynamic application scans from Nessus, Snyk, and GitHub in a single queue." },
      { name: "SBOM Export Engine", desc: "Generate and export Software Bill of Materials (SBOM) in CycloneDX compliance format." },
      { name: "Dependency Vulnerability Scanner", desc: "Detect unpatched package vulnerabilities and licenses in third-party code imports." }
    ],
    funnelMetrics: [
      { val: "120.4K", label: "Imports Scanned", desc: ["Libraries analyzed in code", "Commit packages processed"] },
      { val: "18.2K", label: "Vulnerability Alerts", desc: ["Outdated library warnings", "Static code analysis findings"] },
      { val: "4.22K", label: "OWASP Violations", desc: ["SQLi, XSS, and CSRF flaws", "High risk library exploits"] },
      { val: "128", label: "Pipeline Builds Blocked", desc: ["Blocked deployment builds", "Owner remediation routing"] }
    ],
    funnelStages: ["Total Imports", "Outdated Alert", "OWASP Flaws", "Blocked Builds"],
    enterpriseFeatures: [
      { name: "Pipeline Quality Gates", desc: "Fail and lock compilation pipelines automatically when critical weaponized CVEs are detected." },
      { name: "Developer Remediation Routing", desc: "Trace vulnerabilities to individual developers and automatically route tickets to code owners." }
    ],
    terminalTitle: "Vulnerability Pipeline Funnel",
    terminalDesc: "Continuous code analysis funnel monitoring commits and failing builds with unpatched CVEs."
  },
  {
    id: "ai-risk",
    title: "AI Risk",
    icon: "🤖",
    desc: "Shadow AI models & unvetted LLM usage.",
    tagline: "Discover shadow LLM usage and block data leaks via prompts.",
    coreFeatures: [
      { name: "Shadow AI Discovery", desc: "Track unapproved developer usage of external LLM tools, ChatGPT, and unapproved API keys." },
      { name: "LLM Vulnerability Auditing", desc: "Spot vulnerabilities, security cracks, and license compliance flaws in local AI models." },
      { name: "Active Prompt Redaction", desc: "Redact customer emails, API credentials, and internal source code from LLM prompts." }
    ],
    funnelMetrics: [
      { val: "250.8K", label: "GenAI Prompts", desc: ["Outbound prompts scanned", "Developer and admin requests"] },
      { val: "14.2K", label: "Unvetted API Calls", desc: ["Shadow AI model usage", "Local unapproved web portals"] },
      { val: "2.84K", label: "DLP Prompts Flagged", desc: ["Prompts containing secrets", "Exposed keys intercepted"] },
      { val: "2,840", label: "PII Prompts Redacted", desc: ["Redacted prompts with tokens", "Zero model data leakage"] }
    ],
    funnelStages: ["Total Prompts", "Shadow Models", "Flagged Data", "Auto-Redacted"],
    enterpriseFeatures: [
      { name: "AI Policy Firewall", desc: "Apply dynamic DLP rules to intercept and block proprietary data exfiltration to public AI platforms." },
      { name: "AI Agent Sandboxing", desc: "Enforce runtime permission blocks on active AI agents to prevent unapproved system actions." }
    ],
    terminalTitle: "AI Prompt DLP Firewall",
    terminalDesc: "Active inspection of LLM requests with real-time redaction of sensitive credentials."
  },
  {
    id: "secure",
    title: "Risk Radar",
    icon: "📡",
    desc: "Hyper-prioritization & noise reduction.",
    tagline: "Hyper-prioritize vulnerability fixing by predicting exploitation.",
    coreFeatures: [
      { name: "CISA KEV & EPSS Triage", desc: "Filter out 95% of harmless noise by focusing only on vulnerabilities with active exploits." },
      { name: "Asset-Context Modifiers", desc: "Adjust severity scores based on environment characteristics like public internet exposure." },
      { name: "Noise Suppression Filter", desc: "De-duplicate scanner reports across Qualys, Tenable, Nessus, and Wiz into single targets." }
    ],
    funnelMetrics: [
      { val: "3.84M", label: "CVE Records", desc: ["Total database vulnerabilities", "Consolidated scanner findings"] },
      { val: "180.2K", label: "Asset Exposures", desc: ["Exposures on running systems", "Filters out offline targets"] },
      { val: "8,510", label: "Exploitable CVEs", desc: ["CVEs with known exploit scripts", "EPSS > 0.6 and CISA KEV"] },
      { val: "420", label: "Actionable Triaged Risks", desc: ["Top priority exposures", "Suppresses harmless noise"] }
    ],
    funnelStages: ["Raw Findings", "Asset Exposures", "Exploitable", "Actionable Risks"],
    enterpriseFeatures: [
      { name: "Remediation Velocity Trends", desc: "Forecast time-to-remediate trends using historical team fix speeds and SLAs." },
      { name: "Automated Triage Queues", desc: "Automatically group critical exposures and send them to patch deployment queues." }
    ],
    terminalTitle: "Risk Radar Scanning Coordinates",
    terminalDesc: "Scanning active vulnerabilities, displaying exploitable blips, and CVSS parameters."
  },
  {
    id: "identity",
    title: "Identity PreCheck",
    icon: "🔑",
    desc: "MFA gaps & privileged access drift.",
    tagline: "Stop privilege access drifts and audit SSO directory directories.",
    coreFeatures: [
      { name: "SSO Directory Audits", desc: "Sync Okta, Entra ID, and Google directories to audit user and machine permissions." },
      { name: "Zero-Trust MFA Enforcer", desc: "Instantly detect accounts with disabled MFA, bypass policies, or weak authentication." },
      { name: "Orphan Account Deprovisioner", desc: "Auto-expire and disable inactive accounts, stale SSH keys, and dormant admin roles." }
    ],
    funnelMetrics: [
      { val: "15.4K", label: "SSO Identities", desc: ["User and machine credentials", "Directory accounts tracked"] },
      { val: "1.82K", label: "Privilege Drifts", desc: ["Accounts with elevated access", "Permissive IAM roles"] },
      { val: "640", label: "MFA Policy Gaps", desc: ["Accounts with weak MFA", "SMS bypass conditions"] },
      { val: "48", label: "Orphan Accounts Disabled", desc: ["Stale admin roles deprovisioned", "Rotated active credentials"] }
    ],
    funnelStages: ["Active Identities", "Elevated Roles", "MFA Gaps", "Orphans Disabled"],
    enterpriseFeatures: [
      { name: "Privileged Access Drift Tracker", desc: "Detect accounts with permanent admin status and enforce temporary permission baselines." },
      { name: "Session Hijack Alerts", desc: "Flag suspicious logins, fast travel anomalies, and sessions drifting across remote locations." }
    ],
    terminalTitle: "Identity Authentication PreCheck",
    terminalDesc: "Zero-Trust SSO validation checks, credential state telemetry, and privilege escalation audits."
  },
  {
    id: "infosec",
    title: "Compliance Checkpoint",
    icon: "📋",
    desc: "Continuous SOC2 & ISO27001 readiness.",
    tagline: "Maintain continuous audit readiness for SOC2 and ISO27001.",
    coreFeatures: [
      { name: "Continuous Controls Mapping", desc: "Map production data automatically to SOC2, ISO27001, PCI-DSS, and HIPAA frameworks." },
      { name: "Automated Evidence Collector", desc: "Continuously pull system configuration logs and store as audit-ready evidence artifacts." },
      { name: "Real-time Readiness Score", desc: "Access continuous gap analysis, configuration readiness ratings, and audit status reports." }
    ],
    funnelMetrics: [
      { val: "1,200", label: "Security Controls", desc: ["Regulatory guidelines mapped", "SOC2/ISO27001 baselines"] },
      { val: "320", label: "Daily Evidence Logs", desc: ["Configs collected automatically", "Paperwork-free audit trails"] },
      { val: "42", label: "Policy Violations", desc: ["Systems failing compliance checks", "Violations routed to leads"] },
      { val: "0", label: "Critical Gaps", desc: ["Audit readiness at 99%+", "Automatic report exporter"] }
    ],
    funnelStages: ["Standard Rules", "Evidence Uploads", "Policy Gaps", "Audit Gaps"],
    enterpriseFeatures: [
      { name: "Policy Violation Inbox", desc: "Alert engineering team leads immediately when production configurations violate compliance controls." },
      { name: "Automated Auditor Access", desc: "Provide external compliance auditors read-only access to pre-collected evidence vaults." }
    ],
    terminalTitle: "Continuous Audit Compliance Monitor",
    terminalDesc: "Readiness percentages for SOC2, ISO, and PCI compliance with continuous logs mapping."
  },
  {
    id: "dispatch",
    title: "Dispatch Center",
    icon: "🚨",
    desc: "Automated SOAR playbooks & ticketing.",
    tagline: "Route security incident tickets dynamically using SOAR runbooks.",
    coreFeatures: [
      { name: "SOAR Automated Runbooks", desc: "Execute incident containment and investigation scripts based on threat classification and assets." },
      { name: "Jira/ServiceNow Bi-Sync", desc: "Sync ticket states, incident comments, assignee data, and priority levels bidirectionally." },
      { name: "Active Owner Assignment", desc: "Trace code authorship and asset tags to automatically assign incident tickets to the correct owner." }
    ],
    funnelMetrics: [
      { val: "18.4K", label: "Security Alerts", desc: ["EDR and scanner logs processed", "Raw alert pipeline volume"] },
      { val: "4.21K", label: "Tickets Generated", desc: ["Unique actionable incidents", "Suppresses duplicate alerts"] },
      { val: "1,120", label: "High Priority Incidents", desc: ["Critical alerts requiring fix", "Assigned based on ownership"] },
      { val: "1,120", label: "Incidents Resolved", desc: ["Closed and verified dynamically", "Auto-postmortem reports"] }
    ],
    funnelStages: ["Alerts Received", "Tickets Created", "Priority Targets", "Auto-Resolved"],
    enterpriseFeatures: [
      { name: "Slack/Teams War Rooms", desc: "Spin up incident collaboration rooms and notify responders when critical breaches occur." },
      { name: "AI Post-Mortem Generator", desc: "Create comprehensive root-cause analysis reports on resolved incidents with one click." }
    ],
    terminalTitle: "SOAR Incident Dispatch Routing",
    terminalDesc: "Central alert core routing actions, sync logs, and incident escalation paths to Jira and Slack."
  },
  {
    id: "server",
    title: "Fleet Health",
    icon: "🖥️",
    desc: "Patch status, EDR agents & endpoint health.",
    tagline: "Maintain endpoint hygiene, patch compliance, and EDR health.",
    coreFeatures: [
      { name: "EDR Coverage Verification", desc: "Verify EDR agents (CrowdStrike, SentinelOne) are active and transmitting across all servers." },
      { name: "Host OS Kernel Patching", desc: "Deploy operating system updates and critical security patches to endpoints automatically." },
      { name: "Unpatched CVE Discovery", desc: "Audit local packages, outdated system libraries, and security vulnerabilities on VMs." }
    ],
    funnelMetrics: [
      { val: "45.8K", label: "Fleet Workloads", desc: ["Monitored server instances", "VMs and office endpoints"] },
      { val: "8.22K", label: "Compliance Gaps", desc: ["Outdated configurations", "Missing security benchmarks"] },
      { val: "1,240", label: "Critical Host CVEs", desc: ["Vulnerabilities on workloads", "Exploitable OS kernels"] },
      { val: "128", label: "Patches Deployed", desc: ["OS patches pushed to VMs", "EDR agents updated/verified"] }
    ],
    funnelStages: ["Total Workloads", "Baselines Gaps", "Critical Host CVEs", "Patches Deployed"],
    enterpriseFeatures: [
      { name: "Zombie VM Discovery", desc: "Scan cloud architectures to identify, flag, and terminate forgotten or unmanaged developer servers." },
      { name: "Config Baseline Audits", desc: "Audit server configurations continuously against CIS Benchmarks and company parameters." }
    ],
    terminalTitle: "Fleet Server Health Dashboard",
    terminalDesc: "Blinking LED blade grid showing server patch states, EDR coverage, and update progress."
  },
  {
    id: "traffic",
    title: "Traffic Control",
    icon: "🎛️",
    desc: "Flow anomaly, bandwidth & ports.",
    tagline: "Inspect flow anomalies, geo-fencing, and port exposures.",
    coreFeatures: [
      { name: "Flow Anomaly Detection", desc: "Detect unexpected data transfers between secure subnets and unauthorized locations." },
      { name: "Bandwidth Peak Analyzer", desc: "Track high volume transfers and network bandwidth spikes to block data exfiltration attempts." },
      { name: "Port Exposure Matrix", desc: "Verify network perimeters and warn when unauthorized service ports (like SSH or RDP) open." }
    ],
    funnelMetrics: [
      { val: "2.44B", label: "Packets Logged", desc: ["DNS queries and flows monitored", "Raw packet session count"] },
      { val: "12.1M", label: "Protocol Anomalies", desc: ["Packets violating standards", "Unexpected SSH connections"] },
      { val: "852K", label: "Geo-Fence Hits", desc: ["Banned ASN connections", "Geo-location packet checks"] },
      { val: "4,510", label: "Blocked Payloads", desc: ["Outbound payloads terminated", "Suspicious source ports closed"] }
    ],
    funnelStages: ["Packets Monitored", "Anomalous flows", "Geo-Fenced Hits", "Blocked Payloads"],
    enterpriseFeatures: [
      { name: "Deep Packet Inspection", desc: "Analyze network packet payloads and protocol headers for advanced threat profiling." },
      { name: "Dynamic Bandwidth Limiting", desc: "Throttle bandwidth automatically on suspicious transfers to mitigate data theft." }
    ],
    terminalTitle: "Bandwidth Flow Wave Anomaly Tracker",
    terminalDesc: "Live bezier curve traffic monitoring showing throughput peaks, port matrix checks, and geo-alerts."
  },
  {
    id: "kpi",
    title: "Flight Telemetry (KPIs)",
    icon: "📊",
    desc: "MTTA/MTTR & patch SLA compliance.",
    tagline: "Track MTTA, MTTR, and patch SLA compliance in real-time.",
    coreFeatures: [
      { name: "MTTA Response Trends", desc: "Measure average time spent acknowledging critical alerts across engineering groups." },
      { name: "MTTR Remediation Trends", desc: "Track average hours spent deploying patches and configuring fixes to resolve risks." },
      { name: "Patch SLA Compliance", desc: "Enforce patching deadlines and alert team leads before grace periods expire." }
    ],
    funnelMetrics: [
      { val: "48.2h", label: "Baseline MTTR", desc: ["Unmanaged risk lifespan", "Vulnerability fix speed standard"] },
      { val: "12.4h", label: "Mean Acknowledge", desc: ["Alert assignment time", "MTTA across support groups"] },
      { val: "3.52h", label: "Mean Remediation", desc: ["Critical asset fix time", "MTTR on core workloads"] },
      { val: "1.82h", label: "Current Resolution", desc: ["Resolution speed achieved", "SLA compliance sustained"] }
    ],
    funnelStages: ["Legacy MTTR", "Acknowledge Speed", "Remediation Speed", "Autopilot Resolution"],
    enterpriseFeatures: [
      { name: "Team Velocity Reports", desc: "Compare risk reduction velocity and patch compliance performance across business departments." },
      { name: "Executive KPI Telemetry", desc: "Export automated dashboard metrics proving security operations ROI to board members." }
    ],
    terminalTitle: "Remediation MTTR Velocity Curve",
    terminalDesc: "SLA trend line tracking Mean Time to Remediate drop-offs over weekly iterations."
  }
];

export default function MythosPromo({ onClose, initialSlide = 0 }: { onClose: () => void; initialSlide?: number }) {
  const { currentClient, isEnterpriseMode, isUnderAttack, slaThresholds } = useClient();
  const [activeModuleId, setActiveModuleId] = useState<string>(MODULES_DATA[0].id);
  const [activeSlide, setActiveSlide] = useState<number>(initialSlide);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(initialSlide === 0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = 3;

  // Auto-play logic transitions slides, then modules
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        setActiveSlide((currentSlide) => {
          if (currentSlide < totalSlides - 1) {
            return currentSlide + 1;
          } else {
            // Move to next module first slide
            setActiveModuleId((currentMod) => {
              const currentIdx = MODULES_DATA.findIndex((m) => m.id === currentMod);
              const nextIdx = (currentIdx + 1) % MODULES_DATA.length;
              return MODULES_DATA[nextIdx].id;
            });
            return 0;
          }
        });
      }, 8000);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying]);

  const handleManualModuleSelect = (id: string) => {
    setActiveModuleId(id);
    setActiveSlide(0);
    setIsAutoPlaying(false);
  };

  const handleManualSlideSelect = (slideIndex: number) => {
    setActiveSlide(slideIndex);
    setIsAutoPlaying(false);
  };

  const handleNextSlide = () => {
    setIsAutoPlaying(false);
    if (activeSlide < totalSlides - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      const currentIdx = MODULES_DATA.findIndex((m) => m.id === activeModuleId);
      const nextIdx = (currentIdx + 1) % MODULES_DATA.length;
      setActiveModuleId(MODULES_DATA[nextIdx].id);
      setActiveSlide(0);
    }
  };

  const handlePrevSlide = () => {
    setIsAutoPlaying(false);
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    } else {
      const currentIdx = MODULES_DATA.findIndex((m) => m.id === activeModuleId);
      const prevIdx = (currentIdx - 1 + MODULES_DATA.length) % MODULES_DATA.length;
      setActiveModuleId(MODULES_DATA[prevIdx].id);
      setActiveSlide(totalSlides - 1);
    }
  };

  const clientScaleFactors: Record<string, number> = {
    WELLS: 1.0,
    TOYOTA: 0.65,
    UR: 0.35,
    CISCO: 2.0,
    DISNEY: 0.9,
  };

  const activeModuleStatic = MODULES_DATA.find((m) => m.id === activeModuleId) || MODULES_DATA[0];

  const activeModule = useMemo(() => {
    const scale = clientScaleFactors[currentClient.key] || 1.0;
    const mod = { ...activeModuleStatic };

    if (mod.id === 'posture') {
      const rawNum = Math.round(4180000 * scale * (isUnderAttack ? 3.5 : 1.0));
      const groupedNum = Math.round(320600 * scale * (isUnderAttack ? 4.0 : 1.0));
      const exposedNum = Math.round(42100 * scale * (isUnderAttack ? 5.2 : 1.0));
      const clearedMultiplier = isUnderAttack ? 0.25 : (1.0 + (slaThresholds.critical - 7) * 0.05);
      const clearedNum = Math.round(12400 * scale * clearedMultiplier);

      const formatNum = (n: number) => {
        if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
        if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
        return n.toLocaleString();
      };

      mod.funnelMetrics = [
        { val: formatNum(rawNum), label: "Raw Detections", desc: ["Discovered across all assets", "Uncontextualized risk data"] },
        { val: formatNum(groupedNum), label: "Grouped Risk Flags", desc: ["Consolidated into clusters", "Eliminates duplicate alerts"] },
        { val: formatNum(exposedNum), label: "Exposed Assets", desc: ["Publicly facing vulnerables", "Active threat intel correlation"] },
        { val: formatNum(clearedNum), label: "Auto-Cleared Gates", desc: ["Cleared at deployment gates", "Safe configuration pathways"] }
      ];
    }

    return mod;
  }, [activeModuleStatic, currentClient, isUnderAttack, isEnterpriseMode, slaThresholds]);

  const slaBreachPenalty = Math.max(0, (7 - slaThresholds.critical) * 2) + Math.max(0, (30 - slaThresholds.high) * 0.5);
  let postureScore = Math.max(30, Math.min(100, (currentClient.key === 'UR' ? 91 : currentClient.key === 'CISCO' ? 96 : currentClient.key === 'TOYOTA' ? 85 : currentClient.key === 'DISNEY' ? 81 : 76) - Math.round(slaBreachPenalty)));
  if (isUnderAttack) {
    postureScore = 42;
  }

  const codePct = Math.min(100, Math.round(postureScore * 1.0));
  const cloudPct = Math.min(100, Math.round(postureScore * 0.95));
  const hostsPct = Math.min(100, Math.round(postureScore * 0.87));

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Backdrop */}
      <div 
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(8px)" }} 
        onClick={onClose}
      />
      
      {/* Modal Box */}
      <div className="mythos-promo-modal" id="mythos-promo">
        <style>{`
          .mythos-promo-modal {
            background: #ffffff;
            color: #0f172a;
            width: 96vw;
            max-width: 1440px;
            height: 76vh;
            max-height: 800px;
            border-radius: 20px;
            position: relative;
            overflow: hidden;
            font-family: Inter, system-ui, -apple-system, sans-serif;
            display: grid;
            grid-template-columns: 300px 1fr;
            box-sizing: border-box;
            z-index: 10;
            box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.35);
            border: 1px solid #cbd5e1;
          }
          .mythos-sidebar {
            background: #f8fafc;
            border-right: 1px solid #e2e8f0;
            height: 100%;
            padding: 0;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-sizing: border-box;
          }
          .mythos-sidebar::-webkit-scrollbar {
            display: none;
          }
          .mythos-sidebar-logo {
            padding: 0.8rem 0.75rem;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            background: #fff;
          }
          .mythos-sidebar-modules {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            padding: 0.4rem 0.5rem;
            overflow: hidden;
          }
          .mythos-tab {
            padding: 0.35rem 0.55rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            border-left: 4px solid transparent;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            gap: 0.08rem;
            flex-shrink: 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          }
          .mythos-tab:hover {
            background: #f1f5f9;
          }
          .mythos-tab.active {
            background: rgba(124, 58, 237, 0.05);
            border-left: 4px solid #7c3aed;
            box-shadow: 0 4px 12px rgba(124, 58, 237, 0.04);
          }
          .mythos-right-canvas {
            background: #ffffff;
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
            padding: 1.2rem 1.6rem 1rem;
          }
          .mythos-right-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.6rem;
            flex-shrink: 0;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 0.5rem;
          }
          .mythos-close-btn {
            background: #f1f5f9;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #475569;
            transition: background 0.2s;
            margin-top: -2px;
          }
          .mythos-close-btn:hover {
            background: #cbd5e1;
          }
          .mythos-slideshow-frame {
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
            position: relative;
            justify-content: center;
          }
          .mythos-canvas-body {
            flex: 1;
            min-height: 0;
            padding: 0 6.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            animation: slideFadeIn 0.35s ease-out forwards;
          }
          .mythos-split-grid {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 2rem;
            height: 100%;
            align-items: stretch;
          }
          .mythos-split-left {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 390px;
            background: #090d16;
            border-radius: 14px;
            border: 1px solid #e2e8f0;
            position: relative;
            overflow: hidden;
            box-shadow: inset 0 0 40px rgba(0,0,0,0.8);
          }
          .mythos-split-right {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 1.2rem;
          }
          .mythos-feature-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 0.75rem 1rem;
            display: flex;
            align-items: flex-start;
            gap: 0.65rem;
            transition: all 0.2s ease;
          }
          .mythos-feature-item:hover {
            border-color: #cbd5e1;
            background: #f1f5f9;
          }
          .mythos-metric-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 1rem;
            width: 100%;
            margin-bottom: 0.6rem;
          }
          .mythos-metric-col {
            border-right: 1px dashed #cbd5e1;
            padding-right: 0.75rem;
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
            min-width: 0;
            overflow: hidden;
          }
          .mythos-metric-col:last-child {
            border-right: none;
            padding-right: 0;
          }
          .mythos-funnel-container {
            width: 100%;
            height: 200px;
            margin: 0.5rem 0;
            background: #f8fafc;
            border-radius: 12px;
            border: 1.5px solid #7c3aed;
            box-shadow: 0 0 10px rgba(124, 58, 237, 0.15);
            padding: 0.4rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
          }
          .mythos-terminal {
            background: #090d16;
            border: 1px solid #1e293b;
            border-radius: 14px;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            position: relative;
            overflow: hidden;
            height: 260px;
            box-shadow: inset 0 0 40px rgba(0,0,0,0.85);
          }
          .mythos-terminal-overlay {
            position: absolute;
            bottom: 0.75rem;
            left: 0.75rem;
            right: 0.75rem;
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 8px;
            padding: 0.4rem 0.6rem;
            font-family: monospace;
            font-size: 0.65rem;
            color: #a5b4fc;
            z-index: 10;
          }
          .mythos-nav-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: #7c3aed;
            border: 1px solid #7c3aed;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            color: #ffffff;
            transition: all 0.2s ease;
            z-index: 50;
            box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
          }
          .mythos-nav-arrow:hover {
            background: #ffffff;
            color: #7c3aed;
            border-color: rgba(124, 58, 237, 0.3);
            box-shadow: 0 6px 15px rgba(0,0,0,0.1);
          }
          .mythos-nav-arrow.left {
            left: -0.6rem;
          }
          .mythos-nav-arrow.right {
            right: -0.6rem;
          }
          .mythos-dash-indicator {
            width: 18px;
            height: 4px;
            border-radius: 2px;
            background: #cbd5e1;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .mythos-dash-indicator.active {
            background: #2563eb;
            box-shadow: 0 0 4px rgba(37, 99, 235, 0.5);
          }
          
          @keyframes slideFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes rotateClockwise {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes rotateCounterClockwise {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes scanline {
            0% { transform: translateY(-110px); }
            50% { transform: translateY(110px); }
            100% { transform: translateY(-110px); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes dash {
            to {
              stroke-dashoffset: -40;
            }
          }
          @keyframes pulseRed {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.6); }
          }
          @keyframes growBar {
            from { width: 0; }
          }
          @keyframes radarSweep {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes jpiScanline {
            0% { transform: translateY(0px); opacity: 0.6; }
            50% { transform: translateY(198px); opacity: 0.3; }
            100% { transform: translateY(0px); opacity: 0.6; }
          }
          
          @media(max-width: 980px) {
            .mythos-promo-modal {
              grid-template-columns: 1fr;
              height: auto;
              max-height: 92vh;
              overflow-y: auto;
            }
            .mythos-sidebar {
              border-right: none;
              border-bottom: 1px solid #e2e8f0;
              height: auto;
              flex-direction: column;
              padding: 0;
            }
            .mythos-sidebar-logo {
              padding: 0.5rem;
              border-bottom: 1px solid #e2e8f0;
            }
            .mythos-sidebar-modules {
              flex-direction: row;
              overflow-x: auto;
              overflow-y: hidden;
              padding: 0.5rem;
              scroll-snap-type: x mandatory;
              gap: 0.5rem;
            }
            .mythos-tab {
              min-width: 185px;
              scroll-snap-align: start;
              border-left: none;
              border-bottom: 3px solid transparent;
            }
            .mythos-tab.active {
              border-left: none;
              border-bottom: 3px solid #7c3aed;
            }
            .mythos-right-canvas {
              height: auto;
              padding: 1rem;
            }
            .mythos-canvas-body {
              padding: 0 1.5rem;
            }
            .mythos-split-grid {
              grid-template-columns: 1fr;
              grid-template-rows: auto auto;
              gap: 1rem;
            }
            .mythos-split-left {
              height: 180px;
            }
            .mythos-terminal {
              height: 180px;
            }
            .mythos-metric-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 0.75rem;
            }
            .mythos-metric-col {
              border-right: none;
              border-bottom: 1px dashed #cbd5e1;
              padding-bottom: 0.5rem;
            }
            .mythos-nav-arrow {
              display: none;
            }
          }
        `}</style>

        {/* Left Tabs Sidebar */}
        <div className="mythos-sidebar">
          {/* Logo at top */}
          <div className="mythos-sidebar-logo">
            <img 
              src="/hlogotag_v2.jpg" 
              alt="PosturePilot" 
              style={{ height: "68px", width: "auto", objectFit: "contain" }}
            />
          </div>

          {/* Modules spread evenly */}
          <div className="mythos-sidebar-modules">
            {MODULES_DATA.map((feat) => (
              <div
                key={feat.id}
                className={`mythos-tab ${activeModuleId === feat.id ? 'active' : ''}`}
                onClick={() => handleManualModuleSelect(feat.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.9rem" }}>{feat.icon}</span>
                  <span style={{ fontSize: "0.74rem", fontWeight: activeModuleId === feat.id ? 800 : 600, color: activeModuleId === feat.id ? "#7c3aed" : "#475569" }}>{feat.title}</span>
                </div>
                <div style={{ fontSize: "0.62rem", color: "#64748b", marginTop: "0.02rem", paddingLeft: "1.35rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {feat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Slideshow Canvas */}
        <div className="mythos-right-canvas">
          {/* Header block */}
          <div className="mythos-right-header">
            <div style={{ flex: 1, textAlign: "right", paddingRight: "0.75rem" }}>
              <h2 style={{ fontSize: "1.55rem", fontWeight: 900, letterSpacing: "-0.02em", color: "#0f172a", margin: 0 }}>
                The <span style={{ background: "linear-gradient(90deg, #7c3aed, #4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Post-Mythos</span> Era Demands More.
              </h2>
              <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0.2rem 0 0", lineHeight: 1.3 }}>
                Explore the 12 core cockpit pillars of the PosturePilot Risk Operations Center (ROC).
              </p>
            </div>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="mythos-close-btn"
              style={{ marginTop: 0, flexShrink: 0 }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Slideshow Frame */}
          <div className="mythos-slideshow-frame">
            {/* Left & Right Chevrons */}
            {activeSlide < 3 && (
              <>
                {!(activeSlide === 0 && MODULES_DATA.findIndex(m => m.id === activeModuleId) === 0) && (
                  <button onClick={handlePrevSlide} className="mythos-nav-arrow left" aria-label="Previous Slide">‹</button>
                )}
                <button onClick={handleNextSlide} className="mythos-nav-arrow right" aria-label="Next Slide">›</button>
              </>
            )}
            
            {/* Slide Body */}
            <div className="mythos-canvas-body" key={`${activeModuleId}-${activeSlide}`}>
              
              {/* SLIDE 1: Core Capabilities & Graphic */}
              {activeSlide === 0 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ textAlign: "left", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#2563eb", letterSpacing: "0.15em", textTransform: "uppercase" }}>COCKPIT PREVIEW</div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", margin: "0.15rem 0" }}>
                      {activeModule.title}
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0 }}>
                      {activeModule.tagline}
                    </p>
                  </div>
                  
                  <div className="mythos-split-grid">
                    {/* Left Animated SVG */}
                    <div className="mythos-split-left">
                      
                      {/* Posture Clearance */}
                      {activeModuleId === "posture" && (
                        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 0 280 215" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                            <defs>
                              <radialGradient id="jpiCore" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor={isUnderAttack ? "#ef4444" : "#10b981"} stopOpacity="0.18" />
                                <stop offset="100%" stopColor={isUnderAttack ? "#ef4444" : "#10b981"} stopOpacity="0" />
                              </radialGradient>
                              <filter id="glow-g">
                                <feGaussianBlur stdDeviation="1.8" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                              </filter>
                            </defs>

                            {/* ── Background orbit rings ── */}
                            <circle cx="100" cy="100" r="72" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            <circle cx="100" cy="100" r="56" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            {/* Rotating orbit dot */}
                            <circle cx="100" cy="28" r="2.2" fill="#7c3aed" opacity="0.7" style={{ transformOrigin: "100px 100px", animation: "rotateClockwise 8s linear infinite" }} />

                            {/* ── Outer ring: Host Posture ── */}
                            <circle cx="100" cy="100" r="72" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                            <circle cx="100" cy="100" r="72" fill="none" stroke="#3b82f6" strokeWidth="6"
                              strokeDasharray={`${2 * Math.PI * 72}`} strokeDashoffset={`${2 * Math.PI * 72 * (1 - hostsPct / 100)}`} strokeLinecap="round"
                              style={{ transform: "rotate(-90deg)", transformOrigin: "100px 100px", filter: "drop-shadow(0 0 3px rgba(59,130,246,0.5))", transition: "stroke-dashoffset 0.8s ease" }} />
                            <text x="100" y="-172" textAnchor="middle" fill="#3b82f6" fontSize="7" fontFamily="monospace" fontWeight="700"
                              style={{ transform: "rotate(90deg) translateY(-100px)", transformOrigin: "100px 100px" }}>HOSTS {hostsPct}%</text>

                            {/* ── Middle ring: Cloud Posture ── */}
                            <circle cx="100" cy="100" r="56" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                            <circle cx="100" cy="100" r="56" fill="none" stroke="#a78bfa" strokeWidth="6"
                              strokeDasharray={`${2 * Math.PI * 56}`} strokeDashoffset={`${2 * Math.PI * 56 * (1 - cloudPct / 100)}`} strokeLinecap="round"
                              style={{ transform: "rotate(-90deg)", transformOrigin: "100px 100px", filter: "drop-shadow(0 0 3px rgba(167,139,250,0.5))", transition: "stroke-dashoffset 0.8s ease" }} />

                            {/* ── Inner ring: Code Posture ── */}
                            <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                            <circle cx="100" cy="100" r="40" fill="none" stroke="#10b981" strokeWidth="6"
                              strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - codePct / 100)}`} strokeLinecap="round"
                              style={{ transform: "rotate(-90deg)", transformOrigin: "100px 100px", filter: "drop-shadow(0 0 4px rgba(16,185,129,0.6))", transition: "stroke-dashoffset 0.8s ease" }} />

                            {/* ── Core glow fill ── */}
                            <circle cx="100" cy="100" r="30" fill="url(#jpiCore)" />

                            {/* ── JPI Center label ── */}
                            <text x="100" y="96" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="900">{postureScore}%</text>
                            <text x="100" y="108" textAnchor="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">JPI SCORE</text>

                            {/* ── Legend labels — horizontal strip at bottom ── */}
                            <line x1="10" y1="178" x2="250" y2="178" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                            <circle cx="30" cy="188" r="4" fill="#10b981" />
                            <text x="38" y="192" fill="#cbd5e1" fontSize="6.5" fontFamily="monospace">Code {codePct}%</text>
                            <circle cx="105" cy="188" r="4" fill="#a78bfa" />
                            <text x="113" y="192" fill="#cbd5e1" fontSize="6.5" fontFamily="monospace">Cloud {cloudPct}%</text>
                            <circle cx="180" cy="188" r="4" fill="#3b82f6" />
                            <text x="188" y="192" fill="#cbd5e1" fontSize="6.5" fontFamily="monospace">Hosts {hostsPct}%</text>

                            {/* ── Clearance Gates panel (right side) ── */}
                            <text x="198" y="38" textAnchor="start" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">CLEARANCE GATES</text>

                            {/* Gate 1: Build — PASS */}
                            <rect x="198" y="46" width="70" height="18" rx="4" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.35)" strokeWidth="0.8" />
                            <circle cx="208" cy="55" r="3.5" fill="#10b981" filter="url(#glow-g)" />
                            <text x="215" y="58" fill="#10b981" fontSize="6.5" fontFamily="monospace" fontWeight="700">BUILD</text>
                            <text x="265" y="58" textAnchor="end" fill="#10b981" fontSize="6" fontFamily="monospace" fontWeight="900">PASS</text>

                            {/* Gate 2: Deploy — PASS */}
                            <rect x="198" y="70" width="70" height="18" rx="4" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.35)" strokeWidth="0.8" />
                            <circle cx="208" cy="79" r="3.5" fill="#10b981" filter="url(#glow-g)" />
                            <text x="215" y="82" fill="#10b981" fontSize="6.5" fontFamily="monospace" fontWeight="700">DEPLOY</text>
                            <text x="265" y="82" textAnchor="end" fill="#10b981" fontSize="6" fontFamily="monospace" fontWeight="900">PASS</text>

                            {/* Gate 3: Config — FAIL when under attack */}
                            <rect 
                              x="198" 
                              y="94" 
                              width="70" 
                              height="18" 
                              rx="4" 
                              fill={isUnderAttack ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)"} 
                              stroke={isUnderAttack ? "rgba(239,68,68,0.45)" : "rgba(16,185,129,0.35)"} 
                              strokeWidth="0.8" 
                            />
                            <circle 
                              cx="208" 
                              cy="103" 
                              r="3.5" 
                              fill={isUnderAttack ? "#ef4444" : "#10b981"} 
                              style={isUnderAttack ? { animation: "pulseRed 1.2s infinite" } : {}} 
                            />
                            <text x="215" y="106" fill={isUnderAttack ? "#ef4444" : "#10b981"} fontSize="6.5" fontFamily="monospace" fontWeight="700">CONFIG</text>
                            <text x="265" y="106" textAnchor="end" fill={isUnderAttack ? "#ef4444" : "#10b981"} fontSize="6" fontFamily="monospace" fontWeight="900">
                              {isUnderAttack ? "FAIL" : "PASS"}
                            </text>

                            {/* ── Threat Intel Sync node ── */}
                            <text x="198" y="128" textAnchor="start" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">THREAT INTEL SYNC</text>
                            <circle cx="208" cy="145" r="6" fill="none" stroke="rgba(245,158,11,0.2)" strokeWidth="1" style={{ animation: "pulseGlow 2s infinite" }} />
                            <circle cx="208" cy="145" r="4" fill="#f59e0b" opacity="0.9" />
                            <text x="215" y="149" fill="#fbbf24" fontSize="6.5" fontFamily="monospace" fontWeight="700">
                              {isUnderAttack ? "ATTACK WAVE" : "5 FEEDS LIVE"}
                            </text>

                            {/* ── Scanline overlay ── */}
                            <rect x="0" y="0" width="280" height="2" fill={isUnderAttack ? "rgba(239,68,68,0.18)" : "rgba(16,185,129,0.15)"} rx="1"
                              style={{ animation: "jpiScanline 3.5s linear infinite", transformOrigin: "center" }} />
                            {/* Separator lines between legend items */}
                            <line x1="97" y1="182" x2="97" y2="194" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                            <line x1="172" y1="182" x2="172" y2="194" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                          </svg>
                        </div>
                      )}

                      {/* Cloud Altitude */}
                      {activeModuleId === "cloud" && (
                        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 -2 260 215" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                            <defs>
                              <radialGradient id="cloudHub" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                              </radialGradient>
                            </defs>

                            {/* ── Connection lines from providers to hub ── */}
                            {/* AWS → Hub */}
                            <line x1="46" y1="59" x2="114" y2="108" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="4 3"
                              style={{ animation: "dash 3s linear infinite" }} />
                            {/* Azure → Hub */}
                            <line x1="130" y1="80" x2="130" y2="108" stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="4 3"
                              style={{ animation: "dash 4s linear infinite" }} />
                            {/* GCP → Hub */}
                            <line x1="214" y1="59" x2="146" y2="108" stroke="#10b981" strokeWidth="1.2" strokeDasharray="4 3"
                              style={{ animation: "dash 3.5s linear infinite" }} />
                            {/* Hub → Exposed bucket (red dashed) */}
                            <line x1="110" y1="122" x2="68" y2="150" stroke="#ef4444" strokeWidth="1.4" strokeDasharray="3 3"
                              style={{ animation: "dash 2s linear infinite" }} />

                            {/* ── AWS Node — name centered ── */}
                            <rect x="6" y="15" width="80" height="44" rx="6" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
                            <text x="46" y="35" textAnchor="middle" dominantBaseline="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="900">AWS</text>
                            <text x="46" y="49" textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">850K resources</text>

                            {/* AWS status badge on line */}
                            <rect x="8" y="64" width="38" height="14" rx="3" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.35)" strokeWidth="0.7" />
                            <circle cx="15" cy="71" r="2.5" fill="#ef4444" style={{ animation: "pulseRed 1.5s infinite" }} />
                            <text x="20" y="74" fill="#ef4444" fontSize="5" fontFamily="monospace" fontWeight="700">3 DRIFT</text>

                            {/* ── Azure Node — name centered ── */}
                            <rect x="90" y="15" width="80" height="44" rx="6" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.4)" strokeWidth="1" />
                            <text x="130" y="35" textAnchor="middle" dominantBaseline="middle" fill="#60a5fa" fontSize="9" fontFamily="monospace" fontWeight="900">AZURE</text>
                            <text x="130" y="49" textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">142K resources</text>

                            {/* Azure status badge on line */}
                            <rect x="118" y="64" width="24" height="14" rx="3" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.35)" strokeWidth="0.7" />
                            <text x="130" y="74" textAnchor="middle" fill="#10b981" fontSize="5" fontFamily="monospace" fontWeight="700">OK</text>

                            {/* ── GCP Node — name centered ── */}
                            <rect x="174" y="15" width="80" height="44" rx="6" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
                            <text x="214" y="35" textAnchor="middle" dominantBaseline="middle" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="900">GCP</text>
                            <text x="214" y="49" textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace">204K resources</text>

                            {/* GCP status badge on line */}
                            <rect x="220" y="64" width="32" height="14" rx="3" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.35)" strokeWidth="0.7" />
                            <circle cx="226" cy="71" r="2.5" fill="#10b981" />
                            <text x="232" y="74" fill="#10b981" fontSize="5" fontFamily="monospace" fontWeight="700">IAM OK</text>

                            {/* ── Central Hub ── */}
                            <circle cx="130" cy="115" r="26" fill="url(#cloudHub)" />
                            <circle cx="130" cy="115" r="18" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.8"
                              style={{ filter: "drop-shadow(0 0 6px rgba(59,130,246,0.5))" }} />
                            <text x="130" y="112" textAnchor="middle" dominantBaseline="middle" fill="#3b82f6" fontSize="7" fontFamily="monospace" fontWeight="900">PP</text>
                            <text x="130" y="123" textAnchor="middle" dominantBaseline="middle" fill="#64748b" fontSize="5" fontFamily="monospace">HUB</text>

                            {/* ── Exposed Bucket Alert ── */}
                            <rect x="10" y="150" width="114" height="28" rx="5" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.5)" strokeWidth="1" />
                            <circle cx="24" cy="164" r="4" fill="#ef4444" style={{ animation: "pulseRed 1s infinite" }} />
                            <text x="32" y="160" fill="#ef4444" fontSize="6.5" fontFamily="monospace" fontWeight="700">S3_LOGS</text>
                            <text x="32" y="170" fill="#f87171" fontSize="5.5" fontFamily="monospace">PUBLIC EXPOSED</text>

                            {/* ── Quarantined Key badge ── */}
                            <rect x="136" y="150" width="114" height="28" rx="5" fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
                            <circle cx="150" cy="164" r="4" fill="#10b981" />
                            <text x="158" y="160" fill="#10b981" fontSize="6.5" fontFamily="monospace" fontWeight="700">IAM KEY</text>
                            <text x="158" y="170" fill="#6ee7b7" fontSize="5.5" fontFamily="monospace">AUTO-QUARANTINED</text>

                            {/* ── Live inventory strip ── */}
                            <line x1="10" y1="186" x2="250" y2="186" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                            <circle cx="22" cy="193" r="3" fill="#3b82f6" />
                            <text x="29" y="196" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">1.19M total assets</text>
                            <circle cx="140" cy="193" r="3" fill="#ef4444" />
                            <text x="147" y="196" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">810 keys revoked</text>
                          </svg>
                        </div>
                      )}


                      {/* Network Runway */}
                      {activeModuleId === "network" && (
                        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 -12 260 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                            <defs>
                              <linearGradient id="netFlow" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6"/>
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0.6"/>
                              </linearGradient>
                            </defs>

                            {/* ── Perimeter / Edge label ── */}
                            <text x="130" y="14" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">EDGE FIREWALL GATEWAY</text>

                            {/* ── Internet → Firewall pipe ── */}
                            <rect x="10" y="28" width="50" height="22" rx="4" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.4)" strokeWidth="1"/>
                            <text x="35" y="39" textAnchor="middle" fill="#60a5fa" fontSize="6" fontFamily="monospace" fontWeight="900">INTERNET</text>
                            <text x="35" y="46" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">142.6M pkts</text>

                            {/* Arrow → Firewall */}
                            <line x1="60" y1="39" x2="88" y2="39" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 3" style={{ animation: "dash 2s linear infinite" }}/>
                            <polygon points="88,36 94,39 88,42" fill="#3b82f6"/>

                            {/* ── Firewall node ── */}
                            <rect x="94" y="22" width="72" height="34" rx="6" fill="rgba(30,41,59,0.9)" stroke="#3b82f6" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 5px rgba(59,130,246,0.3))" }}/>
                            <text x="130" y="36" textAnchor="middle" fill="#3b82f6" fontSize="7" fontFamily="monospace" fontWeight="900">FIREWALL</text>
                            <text x="130" y="46" textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="monospace">IDS/IPS Active</text>

                            {/* Arrow → Internal */}
                            <line x1="166" y1="39" x2="194" y2="39" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" style={{ animation: "dash 3s linear infinite" }}/>
                            <polygon points="194,36 200,39 194,42" fill="#10b981"/>
                            <rect x="200" y="28" width="52" height="22" rx="4" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.4)" strokeWidth="1"/>
                            <text x="226" y="39" textAnchor="middle" fill="#10b981" fontSize="6" fontFamily="monospace" fontWeight="900">INTERNAL</text>
                            <text x="226" y="46" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">Clean traffic</text>

                            {/* ── Threat branch down ── */}
                            <line x1="130" y1="56" x2="130" y2="76" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" style={{ animation: "dash 1.5s linear infinite" }}/>
                            <rect x="80" y="76" width="100" height="22" rx="5" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.5)" strokeWidth="1"/>
                            <circle cx="94" cy="87" r="4" fill="#ef4444" style={{ animation: "pulseRed 1s infinite" }}/>
                            <text x="102" y="91" fill="#ef4444" fontSize="6.5" fontFamily="monospace" fontWeight="700">IDS TRIGGERED</text>

                            {/* ── Blocked IPs row ── */}
                            <text x="130" y="116" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace" fontWeight="800">BLOCKED SOURCE IPs</text>
                            {["103.21.4.x", "45.155.x.x", "91.234.x.x", "185.x.x.x"].map((ip, i) => (
                              <g key={i} transform={`translate(${18 + i * 60}, 122)`}>
                                <rect x="0" y="0" width="52" height="16" rx="3" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.25)" strokeWidth="0.8"/>
                                <text x="26" y="11" textAnchor="middle" fill="#f87171" fontSize="5" fontFamily="monospace">{ip}</text>
                              </g>
                            ))}

                            {/* ── VPN Tunnel status ── */}
                            <line x1="18" y1="152" x2="242" y2="152" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                            <circle cx="30" cy="162" r="3.5" fill="#10b981"/>
                            <text x="38" y="166" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">VPN: 48 tunnels active</text>
                            <circle cx="148" cy="162" r="3.5" fill="#f59e0b"/>
                            <text x="156" y="166" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">4,210 IPs geo-blocked</text>
                          </svg>
                        </div>
                      )}

                      {/* App Security Check */}
                      {activeModuleId === "appsec" && (
                        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 -3 260 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                            <defs>
                              <linearGradient id="pipeGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#475569" stopOpacity="0.9"/>
                                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9"/>
                              </linearGradient>
                            </defs>

                            {/* ── Pipeline title ── */}
                            <text x="130" y="14" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">CI/CD SECURITY PIPELINE</text>

                            {/* ── Stage nodes ── */}
                            {[
                              { x: 40, label: "GIT", sub: "Commit", color: "#ffffff" },
                              { x: 100, label: "SAST", sub: "Static", color: "#a78bfa" },
                              { x: 160, label: "SCA", sub: "Deps", color: "#f59e0b" },
                              { x: 220, label: "DAST", sub: "Dynamic", color: "#3b82f6" },
                            ].map((s, i) => (
                              <g key={i}>
                                <circle cx={s.x} cy="50" r="16" fill="#0f172a" stroke={s.color} strokeWidth="1.8" style={{ filter: `drop-shadow(0 0 4px ${s.color}66)` }}/>
                                <text x={s.x} y="48" textAnchor="middle" fill={s.color} fontSize="6" fontFamily="monospace" fontWeight="900">{s.label}</text>
                                <text x={s.x} y="57" textAnchor="middle" fill="#64748b" fontSize="5" fontFamily="monospace">{s.sub}</text>
                              </g>
                            ))}
                            {/* Connecting arrows */}
                            {[
                              { x: 56, color: "#a78bfa" },
                              { x: 116, color: "#f59e0b" },
                              { x: 176, color: "#3b82f6" }
                            ].map((arrow, i) => (
                              <line key={i} x1={arrow.x} y1="50" x2={arrow.x + 28} y2="50" stroke={arrow.color} strokeWidth="1.5" strokeDasharray="4 3" style={{ animation: "dash 3s linear infinite" }}/>
                            ))}

                            {/* ── Finding bars ── */}
                            <text x="130" y="90" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace" fontWeight="800">FINDINGS BY STAGE</text>
                            {[
                              { label: "120.4K imports", pct: 100, color: "#ffffff", y: 98 },
                              { label: "18.2K SAST alerts", pct: 72, color: "#a78bfa", y: 114 },
                              { label: "4.22K OWASP flaws", pct: 34, color: "#f59e0b", y: 130 },
                              { label: "128 builds BLOCKED", pct: 8, color: "#ef4444", y: 146 },
                            ].map((b, i) => (
                              <g key={i}>
                                <text x="18" y={b.y + 9} fill="#94a3b8" fontSize="5.5" fontFamily="monospace">{b.label}</text>
                                <rect x="80" y={b.y} width="140" height="10" rx="2" fill="rgba(255,255,255,0.04)"/>
                                <rect x="80" y={b.y} width={b.pct * 1.4} height="10" rx="2" fill={b.color} style={{ width: b.pct * 1.4, animation: "growBar 1.5s ease-out forwards" }}/>
                                <text x={80 + b.pct * 1.4 + 3} y={b.y + 8} fill={b.color} fontSize="5" fontFamily="monospace">{b.pct}%</text>
                              </g>
                            ))}

                            {/* ── Pipeline block alert ── */}
                            <rect x="18" y="162" width="224" height="24" rx="5" fill="rgba(239,68,68,0.07)" stroke="rgba(239,68,68,0.4)" strokeWidth="1"/>
                            <circle cx="32" cy="174" r="4" fill="#ef4444" style={{ animation: "pulseRed 1.2s infinite" }}/>
                            <text x="41" y="172" fill="#ef4444" fontSize="6.5" fontFamily="monospace" fontWeight="700">PIPELINE BLOCKED</text>
                            <text x="41" y="180" fill="#f87171" fontSize="5.5" fontFamily="monospace">CVE-2024-3094 — weaponised XZ lib detected in build #4821</text>
                          </svg>
                        </div>
                      )}

                      {/* AI Risk */}
                      {activeModuleId === "ai-risk" && (
                        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 -3 260 205" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                            <defs>
                              <radialGradient id="aiHub" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                              </radialGradient>
                              <linearGradient id="firewallGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#7c3aed" />
                                <stop offset="100%" stopColor="#4f46e5" />
                              </linearGradient>
                            </defs>

                            {/* ── Title ── */}
                            <text x="130" y="12" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">AI GOVERNANCE & PROMPT FIREWALL</text>

                            {/* ── LLM provider nodes (left column) ── */}
                            {[
                              { label: "GPT-4o", org: "OpenAI", color: "#10b981", y: 28 },
                              { label: "Claude 3", org: "Anthropic", color: "#a78bfa", y: 66 },
                              { label: "Gemini", org: "Google", color: "#3b82f6", y: 104 },
                            ].map((m, i) => (
                              <g key={i}>
                                <rect x="8" y={m.y} width="80" height="30" rx="5"
                                  fill={`rgba(${m.color === "#10b981" ? "16,185,129" : m.color === "#a78bfa" ? "167,139,250" : "59,130,246"},0.07)`}
                                  stroke={m.color} strokeWidth="0.8" strokeOpacity="0.5" />
                                <text x="48" y={m.y + 13} textAnchor="middle" dominantBaseline="middle" fill={m.color} fontSize="7" fontFamily="monospace" fontWeight="900">{m.label}</text>
                                <text x="48" y={m.y + 24} textAnchor="middle" fill="#64748b" fontSize="5" fontFamily="monospace">{m.org}</text>
                                {/* data flow line */}
                                <line x1="88" y1={m.y + 15} x2="110" y2="81" stroke={m.color} strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.6"
                                  style={{ animation: "dash 3s linear infinite" }} />
                              </g>
                            ))}

                            {/* ── Central AI Firewall Hub ── */}
                            <circle cx="130" cy="81" r="28" fill="url(#aiHub)" />
                            <circle cx="130" cy="81" r="20" fill="#0f172a" stroke="url(#firewallGrad)" strokeWidth="2"
                              style={{ filter: "drop-shadow(0 0 8px rgba(124,58,237,0.6))" }} />
                            <text x="130" y="76" textAnchor="middle" dominantBaseline="middle" fill="#a78bfa" fontSize="6" fontFamily="monospace" fontWeight="900">AI</text>
                            <text x="130" y="86" textAnchor="middle" dominantBaseline="middle" fill="#7c3aed" fontSize="5" fontFamily="monospace" fontWeight="800">FIREWALL</text>

                            {/* ── Intercept stream (right side) ── */}
                            <text x="212" y="22" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace" fontWeight="800">INTERCEPT LOG</text>

                            {[
                              { threat: "PII LEAK", prompt: "\"Send SSN to...\"", color: "#ef4444", y: 28, blocked: true },
                              { threat: "JAILBREAK", prompt: "\"Ignore prev...\"", color: "#f59e0b", y: 57, blocked: true },
                              { threat: "SHADOW IT", prompt: "\"Upload to...\"", color: "#f59e0b", y: 87, blocked: true },
                              { threat: "CLEAN", prompt: "\"Summarise Q3...\"", color: "#10b981", y: 116, blocked: false },
                            ].map((r, i) => (
                              <g key={i}>
                                <rect x="172" y={r.y} width="80" height="18" rx="3"
                                  fill={r.blocked ? `rgba(${r.color === "#ef4444" ? "239,68,68" : "245,158,11"},0.07)` : "rgba(16,185,129,0.07)"}
                                  stroke={r.color} strokeWidth="0.7" strokeOpacity="0.4" />
                                <circle cx="180" cy={r.y + 9} r="3"
                                  fill={r.color}
                                  style={r.blocked && r.color === "#ef4444" ? { animation: "pulseRed 1.2s infinite" } : {}} />
                                <text x="186" y={r.y + 7} fill={r.color} fontSize="5" fontFamily="monospace" fontWeight="800">{r.threat}</text>
                                <text x="186" y={r.y + 14} fill="#64748b" fontSize="4.5" fontFamily="monospace">{r.prompt}</text>
                                {r.blocked && (
                                  <text x="248" y={r.y + 11} textAnchor="end" fill={r.color} fontSize="5" fontFamily="monospace" fontWeight="900">⛔</text>
                                )}
                              </g>
                            ))}

                            {/* Arrow Hub → intercept stream */}
                            {[28, 57, 87, 116].map((y, i) => (
                              <line key={`hub-line-${i}`} x1="150" y1="81" x2="172" y2={y + 9} stroke="rgba(124,58,237,0.3)" strokeWidth="0.8" strokeDasharray="3 2"
                                style={{ animation: "dash 2s linear infinite" }} />
                            ))}

                            {/* ── AI Risk Score meter ── */}
                            <text x="130" y="146" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace" fontWeight="800">AI RISK SCORE</text>
                            {/* Score bar background */}
                            <rect x="18" y="152" width="224" height="10" rx="3" fill="rgba(255,255,255,0.04)" />
                            {/* Score gradient bar: green → amber → red */}
                            <rect x="18" y="152" width="80" height="10" rx="3" fill="#10b981" style={{ width: 80, animation: "growBar 2s ease-out forwards" }} />
                            <rect x="98" y="152" width="70" height="10" fill="#f59e0b" style={{ width: 70, animation: "growBar 2.2s ease-out forwards" }} />
                            <rect x="168" y="152" width="74" height="10" rx="3" fill="#ef4444" style={{ width: 74, animation: "growBar 2.4s ease-out forwards" }} />
                            {/* Score pointer at 62 */}
                            <line x1="157" y1="150" x2="157" y2="164" stroke="#ffffff" strokeWidth="1.2" />
                            <text x="157" y="170" textAnchor="middle" fill="#ffffff" fontSize="6" fontFamily="monospace" fontWeight="900">62</text>
                            <text x="157" y="177" textAnchor="middle" fill="#f59e0b" fontSize="5" fontFamily="monospace">ELEVATED</text>

                            {/* ── Bottom stats strip ── */}
                            <line x1="18" y1="174" x2="242" y2="174" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                            {[
                              { color: "#ef4444", label: "12.4K prompts blocked", x: 18 },
                              { color: "#a78bfa", label: "6 shadow AI tools", x: 140 },
                            ].map((s, i) => (
                              <g key={i}>
                                <circle cx={s.x + 4} cy="184" r="3" fill={s.color} />
                                <text x={s.x + 11} y="187" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">{s.label}</text>
                              </g>
                            ))}
                          </svg>
                        </div>
                      )}

                      {/* Risk Radar */}
                      {activeModuleId === "secure" && (
                        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 9 260 195" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                            {/* ── Radar scope left ── */}
                            <circle cx="90" cy="100" r="72" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="1"/>
                            <circle cx="90" cy="100" r="52" fill="none" stroke="rgba(139,92,246,0.08)" strokeWidth="1"/>
                            <circle cx="90" cy="100" r="32" fill="none" stroke="rgba(139,92,246,0.06)" strokeWidth="1"/>
                            <circle cx="90" cy="100" r="14" fill="none" stroke="rgba(139,92,246,0.12)" strokeWidth="1"/>
                            {/* Crosshairs */}
                            <line x1="18" y1="100" x2="162" y2="100" stroke="rgba(139,92,246,0.08)" strokeWidth="0.5"/>
                            <line x1="90" y1="28" x2="90" y2="172" stroke="rgba(139,92,246,0.08)" strokeWidth="0.5"/>
                            
                            {/* Sweep - Grouped with glowing leading edge for high visibility */}
                            <g style={{ transformOrigin: "90px 100px", animation: "radarSweep 4s linear infinite" }}>
                              <path d="M90 100 L90 28 A72 72 0 0 1 162 100 Z" fill="rgba(139,92,246,0.22)" />
                              <line x1="90" y1="100" x2="90" y2="28" stroke="#a78bfa" strokeWidth="0.75" style={{ filter: "drop-shadow(0 0 3px #a78bfa)" }} />
                            </g>

                            {/* CVE blips */}
                            <circle cx="128" cy="62" r="9.5" fill="#ef4444" style={{ animation: "pulseRed 1.2s infinite" }}/>
                            <text x="128" y="64.5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="monospace" fontWeight="800">.94</text>
                            <circle cx="54" cy="72" r="8.5" fill="#f59e0b" style={{ animation: "pulseRed 1.8s infinite" }}/>
                            <text x="54" y="74.5" textAnchor="middle" fill="#0f172a" fontSize="5.8" fontFamily="monospace" fontWeight="800">.61</text>
                            <circle cx="140" cy="120" r="3" fill="#f59e0b"/>
                            <circle cx="68" cy="135" r="2.5" fill="#10b981"/>
                            <circle cx="110" cy="148" r="2.5" fill="#10b981"/>
                            {/* Center dot */}
                            <circle cx="90" cy="100" r="5" fill="#8b5cf6" style={{ filter: "drop-shadow(0 0 4px rgba(139,92,246,0.8))" }}/>

                            {/* ── Right panel: triage stats ── */}
                            <text x="212" y="32" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace" fontWeight="800">CVE TRIAGE</text>
                            {[
                              { label: "3.84M total CVEs", dot: "#475569", y: 46 },
                              { label: "180K asset hits", dot: "#3b82f6", y: 62 },
                              { label: "8,510 exploitable", dot: "#f59e0b", y: 78 },
                              { label: "420 actionable", dot: "#ef4444", y: 94 },
                            ].map((r, i) => (
                              <g key={i}>
                                <circle cx="178" cy={r.y - 2} r="3.5" fill={r.dot}/>
                                <text x="186" y={r.y + 1} fill="#cbd5e1" fontSize="6" fontFamily="monospace">{r.label}</text>
                              </g>
                            ))}

                            {/* CISA KEV badge */}
                            <rect x="174" y="108" width="76" height="18" rx="4" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.4)" strokeWidth="0.8"/>
                            <text x="212" y="120" textAnchor="middle" fill="#ef4444" fontSize="5.5" fontFamily="monospace" fontWeight="800">CISA KEV MATCH</text>

                            {/* EPSS legend */}
                            <rect x="174" y="132" width="76" height="18" rx="4" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.35)" strokeWidth="0.8"/>
                            <text x="212" y="144" textAnchor="middle" fill="#f59e0b" fontSize="5.5" fontFamily="monospace" fontWeight="800">EPSS &gt; 0.60</text>

                            {/* Bottom strip */}
                            <line x1="18" y1="180" x2="242" y2="180" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                            <circle cx="28" cy="190" r="3" fill="#ef4444"/>
                            <text x="35" y="193" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">Noise suppressed: 95%</text>
                            <circle cx="148" cy="190" r="3" fill="#10b981"/>
                            <text x="155" y="193" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">420 targets queued</text>
                          </svg>
                        </div>
                      )}

                      {/* Identity PreCheck */}
                      {activeModuleId === "identity" && (
                        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 0 260 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                            {/* ── Title ── */}
                            <text x="130" y="14" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">SSO IDENTITY DIRECTORY</text>

                            {/* ── Central IdP hub ── */}
                            <circle cx="130" cy="85" r="20" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(59,130,246,0.4))" }}/>
                            <text x="130" y="82" textAnchor="middle" fill="#60a5fa" fontSize="6.5" fontFamily="monospace" fontWeight="900">OKTA</text>
                            <text x="130" y="92" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">15.4K IDs</text>

                            {/* ── User identity cards ── */}
                            {[
                              { x: 20, y: 30, label: "admin@corp", mfa: true, role: "SUPER ADMIN", drift: false },
                              { x: 20, y: 95, label: "svc-deploy", mfa: false, role: "ORPHAN ACCT", drift: true },
                              { x: 174, y: 30, label: "john@corp", mfa: true, role: "ENGINEER", drift: false },
                              { x: 174, y: 95, label: "old-api-key", mfa: false, role: "PRIV DRIFT", drift: true },
                            ].map((u, i) => {
                              const color = u.drift ? "#ef4444" : "#10b981";
                              const borderColor = u.drift ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.3)";
                              return (
                                <g key={i}>
                                  <rect x={u.x} y={u.y} width="66" height="38" rx="5" fill={u.drift ? "rgba(239,68,68,0.06)" : "rgba(16,185,129,0.05)"} stroke={borderColor} strokeWidth="0.8"/>
                                  <circle cx={u.x + 10} cy={u.y + 12} r="4" fill={color} style={u.drift ? { animation: "pulseRed 1.4s infinite" } : {}}/>
                                  <text x={u.x + 18} y={u.y + 15} fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">{u.label}</text>
                                  <text x={u.x + 6} y={u.y + 28} fill={color} fontSize="5" fontFamily="monospace" fontWeight="700">{u.role}</text>
                                  <text x={u.x + 6} y={u.y + 35} fill={u.mfa ? "#10b981" : "#ef4444"} fontSize="4.5" fontFamily="monospace">{u.mfa ? "MFA ✓" : "MFA MISSING"}</text>
                                </g>
                              );
                            })}
                            {/* Connection lines to hub */}
                            <line x1="86" y1="49" x2="114" y2="72" stroke="#64748b" strokeWidth="1.2" strokeDasharray="2 2" style={{ animation: "dash 4s linear infinite reverse" }}/>
                            <line x1="86" y1="114" x2="112" y2="92" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 2" style={{ animation: "dash 3s linear infinite" }}/>
                            <line x1="174" y1="49" x2="146" y2="72" stroke="#64748b" strokeWidth="1.2" strokeDasharray="2 2" style={{ animation: "dash 4s linear infinite reverse" }}/>
                            <line x1="174" y1="114" x2="148" y2="92" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 2" style={{ animation: "dash 3s linear infinite" }}/>

                            {/* ── MFA Gap summary ── */}
                            <rect x="60" y="146" width="140" height="20" rx="5" fill="rgba(239,68,68,0.07)" stroke="rgba(239,68,68,0.4)" strokeWidth="1"/>
                            <circle cx="74" cy="156" r="3.5" fill="#ef4444" style={{ animation: "pulseRed 1s infinite" }}/>
                            <text x="82" y="159" fill="#ef4444" fontSize="6.5" fontFamily="monospace" fontWeight="700">640 MFA POLICY GAPS</text>

                            {/* ── Bottom strip ── */}
                            <line x1="18" y1="172" x2="242" y2="172" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                            <circle cx="28" cy="183" r="3" fill="#3b82f6"/>
                            <text x="35" y="186" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">1.82K privilege drifts</text>
                            <circle cx="148" cy="183" r="3" fill="#10b981"/>
                            <text x="155" y="186" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">48 orphans disabled</text>
                          </svg>
                        </div>
                      )}

                      {/* Compliance Checkpoint */}
                      {activeModuleId === "infosec" && (
                        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 0 260 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                            {/* ── Title ── */}
                            <text x="130" y="14" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">CONTINUOUS AUDIT READINESS</text>

                            {/* ── Framework gauges ── */}
                            {[
                              { cx: 38, label: "SOC2", val: 99, color: "#10b981", r: 24 },
                              { cx: 100, label: "ISO27K", val: 100, color: "#10b981", r: 24 },
                              { cx: 162, label: "PCI-DSS", val: 92, color: "#3b82f6", r: 24 },
                              { cx: 224, label: "HIPAA", val: 88, color: "#a78bfa", r: 24 },
                            ].map((g, i) => {
                              const circ = 2 * Math.PI * g.r;
                              const filled = (g.val / 100) * circ;
                              return (
                                <g key={i}>
                                  <circle cx={g.cx} cy="62" r={g.r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4.5"/>
                                  <circle cx={g.cx} cy="62" r={g.r} fill="none" stroke={g.color} strokeWidth="4.5"
                                    strokeDasharray={circ} strokeDashoffset={circ} strokeLinecap="round"
                                    style={{ transform: "rotate(-90deg)", transformOrigin: `${g.cx}px 62px`, filter: `drop-shadow(0 0 3px ${g.color}88)` }}>
                                    <animate
                                      attributeName="stroke-dashoffset"
                                      from={circ}
                                      to={circ - filled}
                                      dur="1.5s"
                                      begin="0.2s"
                                      fill="freeze"
                                      calcMode="spline"
                                      keySplines="0.4 0 0.2 1"
                                      keyTimes="0;1"
                                    />
                                  </circle>
                                  <text x={g.cx} y="59" textAnchor="middle" fill="#fff" fontSize="7.5" fontFamily="monospace" fontWeight="900">{g.val}%</text>
                                  <text x={g.cx} y="68" textAnchor="middle" fill="#64748b" fontSize="5" fontFamily="monospace">{g.label}</text>
                                </g>
                              );
                            })}

                            {/* ── Evidence collection timeline ── */}
                            <text x="130" y="106" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace" fontWeight="800">EVIDENCE COLLECTED TODAY</text>
                            <rect x="18" y="112" width="224" height="10" rx="3" fill="rgba(255,255,255,0.04)"/>
                            <rect x="18" y="112" width="210" height="10" rx="3" fill="#10b981" style={{ width: 210, animation: "growBar 2s ease-out forwards", filter: "drop-shadow(0 0 3px rgba(16,185,129,0.4))" }}/>
                            <text x="232" y="120" fill="#10b981" fontSize="5" fontFamily="monospace">320</text>

                            {/* ── Policy violations row ── */}
                            {[
                              { label: "Config Deviations", val: "42", color: "#f59e0b", x: 18 },
                              { label: "Controls Gaps", val: "0 critical", color: "#10b981", x: 140 },
                            ].map((item, i) => (
                              <g key={i}>
                                <rect x={item.x} y="132" width="108" height="22" rx="4" fill={item.color === "#10b981" ? "rgba(16,185,129,0.06)" : "rgba(245,158,11,0.06)"} stroke={item.color === "#10b981" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"} strokeWidth="0.8"/>
                                <text x={item.x + 8} y="143" fill={item.color} fontSize="6" fontFamily="monospace" fontWeight="700">{item.val}</text>
                                <text x={item.x + 8} y="150" fill="#64748b" fontSize="5" fontFamily="monospace">{item.label}</text>
                              </g>
                            ))}

                            {/* ── Bottom strip ── */}
                            <line x1="18" y1="168" x2="242" y2="168" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                            <circle cx="28" cy="179" r="3" fill="#10b981"/>
                            <text x="35" y="182" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">1,200 controls mapped</text>
                            <circle cx="148" cy="179" r="3" fill="#3b82f6"/>
                            <text x="155" y="182" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">Audit readiness 99%+</text>
                          </svg>
                        </div>
                      )}

                      {/* Dispatch Center */}
                      {activeModuleId === "dispatch" && (
                        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 0 260 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                            {/* ── Title ── */}
                            <text x="130" y="14" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">SOAR INCIDENT ROUTING</text>

                            {/* ── Alert ingestion node ── */}
                            <rect x="88" y="22" width="84" height="28" rx="6" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.5)" strokeWidth="1.2"/>
                            <circle cx="102" cy="36" r="5" fill="#ef4444" style={{ animation: "pulseRed 1s infinite" }}/>
                            <text x="112" y="34" fill="#ef4444" fontSize="6.5" fontFamily="monospace" fontWeight="900">ALERT CORE</text>
                            <text x="112" y="43" fill="#94a3b8" fontSize="5" fontFamily="monospace">18.4K signals/day</text>

                            {/* ── SOAR runbook node ── */}
                            <line x1="130" y1="50" x2="130" y2="68" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 2" style={{ animation: "dash 1.5s linear infinite" }}/>
                            <rect x="84" y="68" width="92" height="28" rx="6" fill="rgba(124,58,237,0.08)" stroke="rgba(124,58,237,0.5)" strokeWidth="1.2"/>
                            <text x="130" y="80" textAnchor="middle" fill="#a78bfa" fontSize="6.5" fontFamily="monospace" fontWeight="900">SOAR RUNBOOK</text>
                            <text x="130" y="89" textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="monospace">Classify → Assign → Escalate</text>

                            {/* ── Fan-out to integrations ── */}
                            <line x1="100" y1="96" x2="50" y2="118" stroke="#a78bfa" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="3 2" style={{ animation: "dash 3s linear infinite" }}/>
                            <line x1="130" y1="96" x2="130" y2="118" stroke="#a78bfa" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="3 2" style={{ animation: "dash 2.5s linear infinite" }}/>
                            <line x1="160" y1="96" x2="210" y2="118" stroke="#a78bfa" strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="3 2" style={{ animation: "dash 2s linear infinite" }}/>

                            {/* Integration badges */}
                            {[
                              { x: 18, label: "JIRA", sub: "4.2K tickets", color: "#3b82f6" },
                              { x: 98, label: "SLACK", sub: "War rooms", color: "#a78bfa" },
                              { x: 178, label: "PagerDuty", sub: "On-call", color: "#f59e0b" },
                            ].map((b, i) => (
                              <g key={i}>
                                <rect x={b.x} y="118" width="62" height="28" rx="5" fill={`rgba(${b.color === "#3b82f6" ? "59,130,246" : b.color === "#a78bfa" ? "167,139,250" : "245,158,11"},0.08)`} stroke={b.color} strokeWidth="0.8" strokeOpacity="0.4"/>
                                <text x={b.x + 31} y="130" textAnchor="middle" fill={b.color} fontSize="6.5" fontFamily="monospace" fontWeight="900">{b.label}</text>
                                <text x={b.x + 31} y="139" textAnchor="middle" fill="#64748b" fontSize="5" fontFamily="monospace">{b.sub}</text>
                              </g>
                            ))}

                            {/* ── Resolution strip ── */}
                            <circle cx="28" cy="172" r="3" fill="#10b981"/>
                            <text x="35" y="175" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">1,120 auto-resolved</text>
                            <circle cx="148" cy="172" r="3" fill="#a78bfa"/>
                            <text x="155" y="175" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">AI post-mortems generated</text>
                          </svg>
                        </div>
                      )}

                      {/* Fleet Health */}
                      {activeModuleId === "server" && (
                        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 0 260 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                            {/* ── Title ── */}
                            <text x="130" y="14" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">ENDPOINT FLEET HEALTH</text>

                            {/* ── Server blade grid (5x3) ── */}
                            {[
                              { id: "SRV-01", edr: true, patch: true, cve: false },
                              { id: "SRV-02", edr: true, patch: true, cve: false },
                              { id: "SRV-03", edr: true, patch: false, cve: true },
                              { id: "SRV-04", edr: true, patch: true, cve: false },
                              { id: "SRV-05", edr: false, patch: false, cve: true },
                              { id: "SRV-06", edr: true, patch: true, cve: false },
                              { id: "SRV-07", edr: true, patch: true, cve: false },
                              { id: "SRV-08", edr: true, patch: true, cve: false },
                              { id: "SRV-09", edr: true, patch: true, cve: false },
                              { id: "WKS-01", edr: false, patch: false, cve: true },
                            ].map((s, i) => {
                              const col = i % 5;
                              const row = Math.floor(i / 5);
                              const x = 18 + col * 48;
                              const y = 24 + row * 52;
                              const bad = s.cve || !s.edr;
                              const borderColor = bad ? "#ef4444" : "#10b981";
                              return (
                                <g key={i}>
                                  <rect x={x} y={y} width="40" height="40" rx="4" fill={bad ? "rgba(239,68,68,0.07)" : "rgba(16,185,129,0.05)"} stroke={borderColor} strokeWidth={bad ? "1.2" : "0.8"} style={bad ? { animation: "pulseRed 2s infinite" } : {}}/>
                                  {/* LED strip */}
                                  <rect x={x + 4} y={y + 4} width="32" height="4" rx="2" fill={bad ? "#ef4444" : "#10b981"} opacity="0.7"/>
                                  <text x={x + 20} y={y + 22} textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="monospace">{s.id}</text>
                                  <text x={x + 20} y={y + 30} textAnchor="middle" fill={bad ? "#ef4444" : "#10b981"} fontSize="5" fontFamily="monospace" fontWeight="700">{bad ? (s.cve ? "CVE" : "NO EDR") : "OK"}</text>
                                  <text x={x + 20} y={y + 37} textAnchor="middle" fill={s.patch ? "#10b981" : "#f59e0b"} fontSize="4.5" fontFamily="monospace">{s.patch ? "PATCHED" : "OUTDATED"}</text>
                                </g>
                              );
                            })}

                            {/* ── Bottom strip ── */}
                            {[
                              { color: "#10b981", label: "EDR: 45.1K covered", x: 18 },
                              { color: "#f59e0b", label: "1.24K CVE hosts", x: 105 },
                              { color: "#3b82f6", label: "128 patches pushed", x: 178 },
                            ].map((s, i) => (
                              <g key={i}>
                                <circle cx={s.x + 4} cy="148" r="3" fill={s.color}/>
                                <text x={s.x + 11} y="151" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">{s.label}</text>
                              </g>
                            ))}

                            {/* ── Patch compliance bar ── */}
                            <text x="18" y="166" fill="#64748b" fontSize="6" fontFamily="monospace" fontWeight="800">PATCH COMPLIANCE</text>
                            <rect x="18" y="170" width="224" height="10" rx="3" fill="rgba(255,255,255,0.04)"/>
                            <rect x="18" y="170" width="190" height="10" rx="3" fill="#3b82f6" style={{ width: 190, animation: "growBar 2s ease-out forwards", filter: "drop-shadow(0 0 3px rgba(59,130,246,0.4))" }}/>
                            <text x="215" y="178" fill="#3b82f6" fontSize="5.5" fontFamily="monospace">85%</text>
                          </svg>
                        </div>
                      )}

                      {/* Traffic Control */}
                      {activeModuleId === "traffic" && (
                        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 0 260 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                            <defs>
                              <filter id="glow-traffic">
                                <feGaussianBlur stdDeviation="2.5" result="blur" />
                                <feMerge>
                                  <feMergeNode in="blur" />
                                  <feMergeNode in="SourceGraphic" />
                                </feMerge>
                              </filter>
                              <radialGradient id="gwGlow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                              </radialGradient>
                            </defs>

                            {/* ── Title ── */}
                            <text x="130" y="14" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">GLOBAL TRAFFIC NEXUS</text>

                            {/* Grid lines */}
                            <line x1="20" y1="100" x2="240" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="3 3" />
                            <line x1="130" y1="20" x2="130" y2="180" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="3 3" />

                            {/* Gateway Center Glow */}
                            <circle cx="130" cy="100" r="30" fill="url(#gwGlow)" />

                            {/* Node paths (Background lines) */}
                            <line x1="30" y1="50" x2="130" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" />
                            <line x1="30" y1="100" x2="130" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" />
                            <line x1="30" y1="150" x2="130" y2="100" stroke="rgba(239,68,68,0.15)" strokeWidth="1.2" />
                            
                            <line x1="130" y1="100" x2="230" y2="60" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" />
                            <line x1="130" y1="100" x2="230" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" />

                            {/* Node A (AWS Ingress) */}
                            <circle cx="30" cy="50" r="4.5" fill="#3b82f6" style={{ filter: "drop-shadow(0 0 3px #3b82f6)" }} />
                            <text x="24" y="42" fill="#cbd5e1" fontSize="5" fontFamily="monospace">AWS Ingress</text>

                            {/* Node B (SSO Ingress) */}
                            <circle cx="30" cy="100" r="4.5" fill="#10b981" style={{ filter: "drop-shadow(0 0 3px #10b981)" }} />
                            <text x="24" y="92" fill="#cbd5e1" fontSize="5" fontFamily="monospace">SSO Ingress</text>

                            {/* Node C (Suspicious Ingress) */}
                            <circle cx="30" cy="150" r="4.5" fill="#ef4444" style={{ filter: "drop-shadow(0 0 3px #ef4444)", animation: "pulseRed 1s infinite" }} />
                            <text x="24" y="142" fill="#ef4444" fontSize="5" fontFamily="monospace" fontWeight="700">Rogue Probe</text>

                            {/* Egress Node 1 (Production) */}
                            <circle cx="230" cy="60" r="4.5" fill="#10b981" style={{ filter: "drop-shadow(0 0 3px #10b981)" }} />
                            <text x="222" y="63" textAnchor="end" fill="#cbd5e1" fontSize="5" fontFamily="monospace">Prod Cluster</text>

                            {/* Egress Node 2 (Storage) */}
                            <circle cx="230" cy="140" r="4.5" fill="#3b82f6" style={{ filter: "drop-shadow(0 0 3px #3b82f6)" }} />
                            <text x="222" y="143" textAnchor="end" fill="#cbd5e1" fontSize="5" fontFamily="monospace">S3 Storage</text>

                            {/* Gateway (GW) */}
                            <circle cx="130" cy="100" r="10" fill="#0f172a" stroke="#7c3aed" strokeWidth="2.5" style={{ filter: "drop-shadow(0 0 5px #7c3aed)" }} />
                            <text x="130" y="97" textAnchor="middle" fill="#a78bfa" fontSize="5.5" fontFamily="monospace" fontWeight="900">GW</text>
                            <text x="130" y="105" textAnchor="middle" fill="#10b981" fontSize="4.5" fontFamily="monospace" fontWeight="800">ACTIVE</text>

                            {/* Allowed Flows (Ingress to Egress via GW) */}
                            <circle r="2.2" fill="#10b981" style={{ filter: "drop-shadow(0 0 2px #10b981)" }}>
                              <animateMotion path="M 30 50 L 130 100 L 230 60" dur="2.4s" repeatCount="indefinite" />
                            </circle>
                            <circle r="2.2" fill="#10b981" style={{ filter: "drop-shadow(0 0 2px #10b981)" }}>
                              <animateMotion path="M 30 100 L 130 100 L 230 140" dur="1.8s" repeatCount="indefinite" />
                            </circle>

                            {/* Blocked Flow (Terminates at GW with pulse) */}
                            <circle r="2.2" fill="#ef4444" style={{ filter: "drop-shadow(0 0 2px #ef4444)" }}>
                              <animateMotion path="M 30 150 L 130 100" dur="1.5s" repeatCount="indefinite" />
                            </circle>

                            {/* Blocked indicator at gateway */}
                            <circle cx="130" cy="100" r="13" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" style={{ transformOrigin: "130px 100px", animation: "spinSlow 6s linear infinite" }} />
                            
                            {/* Live Stats Overlay */}
                            <rect x="18" y="24" width="224" height="20" rx="4" fill="rgba(15, 23, 42, 0.75)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                            <text x="24" y="36" fill="#94a3b8" fontSize="5" fontFamily="monospace">BANDWIDTH: <tspan fill="#10b981" fontWeight="700">8.24 Gbps</tspan></text>
                            <text x="105" y="36" fill="#94a3b8" fontSize="5" fontFamily="monospace">ACTIVE FLOWS: <tspan fill="#3b82f6" fontWeight="700">14,210</tspan></text>
                            <text x="180" y="36" fill="#94a3b8" fontSize="5" fontFamily="monospace">DROPS: <tspan fill="#ef4444" fontWeight="700">0.04%</tspan></text>

                            {/* Bottom Legend */}
                            <line x1="18" y1="178" x2="242" y2="178" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                            <circle cx="28" cy="188" r="2.5" fill="#10b981" />
                            <text x="35" y="191" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">Allowed packets forward</text>
                            <circle cx="140" cy="188" r="2.5" fill="#ef4444" />
                            <text x="147" y="191" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">Malicious requests blocked</text>
                          </svg>
                        </div>
                      )}

                      {/* Flight Telemetry (KPIs) */}
                      {activeModuleId === "kpi" && (
                        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 0 280 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                            <defs>
                              <radialGradient id="hudGlowCyan" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                                <stop offset="70%" stopColor="#10b981" stopOpacity="0.06" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                              </radialGradient>
                              <filter id="neonGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                              </filter>
                            </defs>

                            {/* ── Title ── */}
                            <text x="130" y="14" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.06em">FLIGHT TELEMETRY HUD</text>

                            {/* Grid/Radar coordinates background */}
                            <g opacity="0.08">
                              <circle cx="130" cy="105" r="85" fill="none" stroke="#fff" strokeWidth="0.5" />
                              <circle cx="130" cy="105" r="65" fill="none" stroke="#fff" strokeWidth="0.5" />
                              <line x1="45" y1="105" x2="215" y2="105" stroke="#fff" strokeWidth="0.5" />
                              <line x1="130" y1="20" x2="130" y2="190" stroke="#fff" strokeWidth="0.5" />
                            </g>

                            {/* Central Dial Group */}
                            <g transform="translate(130, 105)">
                              {/* Central radial gradient */}
                              <circle cx="0" cy="0" r="65" fill="url(#hudGlowCyan)" />

                              {/* Ticks ring */}
                              <circle cx="0" cy="0" r="58" fill="none" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="3" strokeDasharray="1 5" style={{ animation: "rotateClockwise 40s linear infinite" }} />
                              
                              {/* Subtitle Ring */}
                              <circle cx="0" cy="0" r="50" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" strokeDasharray="8 4" style={{ animation: "rotateCounterClockwise 25s linear infinite" }} />

                              {/* Target Dial arcs */}
                              <circle cx="0" cy="0" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                              <path d="M 0 -44 A 44 44 0 1 1 -41.8 13.6" fill="none" stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" filter="url(#neonGlowCyan)" />

                              {/* Thin outer sweep line */}
                              <line x1="0" y1="0" x2="0" y2="-56" stroke="#06b6d4" strokeWidth="1.2" opacity="0.8" style={{ transformOrigin: "0 0", animation: "radarSweep 5s linear infinite" }} />

                              {/* Core Metrics Text */}
                              <text x="0" y="-8" textAnchor="middle" fill="#10b981" fontSize="19" fontWeight="950" fontFamily="monospace" filter="url(#neonGlowCyan)">1.8h</text>
                              <text x="0" y="6" textAnchor="middle" fill="#ffffff" fontSize="5.5" fontFamily="monospace" fontWeight="800" letterSpacing="0.12em">MTTR COCKPIT</text>
                              <text x="0" y="16" textAnchor="middle" fill="#06b6d4" fontSize="4.5" fontFamily="monospace" fontWeight="bold">▲ 98% AUTOPILOT</text>
                              <text x="0" y="24" textAnchor="middle" fill="#10b981" fontSize="4" fontFamily="monospace" fontWeight="800">STATUS: OPTIMAL</text>
                            </g>

                            {/* Left Side Telemetry Readings */}
                            <g transform="translate(20, 50)">
                              <rect x="0" y="0" width="60" height="25" rx="3" fill="rgba(15,23,42,0.6)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                              <text x="6" y="8" fill="#64748b" fontSize="4.5" fontFamily="monospace">SLA TARGET</text>
                              <text x="6" y="19" fill="#3b82f6" fontSize="9" fontWeight="900" fontFamily="monospace">4.0h</text>
                              
                              <rect x="0" y="32" width="60" height="25" rx="3" fill="rgba(15,23,42,0.6)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                              <text x="6" y="40" fill="#64748b" fontSize="4.5" fontFamily="monospace">LEGACY AVG</text>
                              <text x="6" y="51" fill="#ef4444" fontSize="9" fontWeight="900" fontFamily="monospace">48.2h</text>
                            </g>

                            {/* Right Side Telemetry Readings */}
                            <g transform="translate(200, 50)">
                              <rect x="0" y="0" width="60" height="25" rx="3" fill="rgba(15,23,42,0.6)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                              <text x="6" y="8" fill="#64748b" fontSize="4.5" fontFamily="monospace">MEAN MTTA</text>
                              <text x="6" y="19" fill="#10b981" fontSize="9" fontWeight="900" fontFamily="monospace">12.4m</text>
                              
                              <rect x="0" y="32" width="60" height="25" rx="3" fill="rgba(15,23,42,0.6)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
                              <text x="6" y="40" fill="#64748b" fontSize="4.5" fontFamily="monospace">SLA FAILURES</text>
                              <text x="6" y="51" fill="#10b981" fontSize="9" fontWeight="900" fontFamily="monospace">0.00%</text>
                            </g>

                            {/* Live graph trace at the bottom */}
                            <path d="M 25 175 L 50 170 L 75 178 L 100 165 L 125 172 L 150 155 L 175 168 L 200 160 L 225 174 L 255 170" fill="none" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="1.2" strokeDasharray="3 1" />
                            <circle cx="255" cy="170" r="2.5" fill="#10b981" style={{ filter: "drop-shadow(0 0 3px #10b981)" }} />
                            
                            {/* Legend Strip */}
                            <line x1="18" y1="182" x2="242" y2="182" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                            <circle cx="28" cy="191" r="2.5" fill="#10b981" />
                            <text x="35" y="194" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">SLA Compliant state</text>
                            <circle cx="140" cy="191" r="2.5" fill="#06b6d4" />
                            <text x="147" y="194" fill="#cbd5e1" fontSize="5.5" fontFamily="monospace">Autopilot remediation loops active</text>
                          </svg>
                        </div>
                      )}

                    </div>
                    
                    {/* Right Features List */}
                    <div className="mythos-split-right">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ fontSize: "0.66rem", fontWeight: 800, color: "#7c3aed", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                          CORE CAPABILITIES
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                        {activeModule.coreFeatures.map((feat, idx) => (
                          <div className="mythos-feature-item" key={idx}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <div>
                              <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#0f172a" }}>{feat.name}</div>
                              <div style={{ fontSize: "0.65rem", color: "#64748b", marginTop: "0.02rem", lineHeight: 1.2 }}>{feat.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              )}

              {/* SLIDE 2: Filter Prioritization Funnel */}
              {activeSlide === 1 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
                  <div style={{ textAlign: "left", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#2563eb", letterSpacing: "0.15em", textTransform: "uppercase" }}>EXPOSURE FILTRATION</div>
                    <h3 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#000000", margin: "0.15rem 0", letterSpacing: "-0.02em" }}>
                      Prioritization <span style={{ color: "#7c3aed" }}>Pipeline</span>
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "#1e293b", margin: 0, fontWeight: 600 }}>
                      How PosturePilot filters vulnerabilities down to remediation tasks.
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="mythos-metric-grid">
                    {activeModule.funnelMetrics.map((m, idx) => (
                      <div className="mythos-metric-col" key={idx}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <span style={{ 
                            fontSize: "2.4rem", 
                            fontWeight: 900, 
                            fontFamily: "Inter, system-ui, -apple-system, sans-serif", 
                            lineHeight: 1,
                            letterSpacing: "-0.03em",
                            color: ["#ef4444", "#f97316", "#f59e0b", "#10b981"][idx]
                          }}>
                            {m.val}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0f172a", margin: "0.2rem 0" }}>
                          {m.label}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                          {m.desc.map((d, dIdx) => (
                            <div key={dIdx} style={{ fontSize: "0.74rem", color: "#334155", lineHeight: 1.3, fontWeight: 500 }}>
                              ▪ {d}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom Graphic Area per Module on Slide 2 */}
                  <div className="mythos-funnel-container" style={{ position: "relative", overflow: "hidden" }}>
                    {/* Universal Pipeline Funnel Background */}
                    <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} viewBox="0 0 800 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="funnelBg" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f1f5f9" stopOpacity="1"/>
                          <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.4"/>
                          <stop offset="100%" stopColor="#ede9fe" stopOpacity="0.9"/>
                        </linearGradient>
                        <linearGradient id="funnelStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.85"/>
                          <stop offset="100%" stopColor="#7c3aed" stopOpacity="1"/>
                        </linearGradient>
                      </defs>
                      <path d="M -20 -20 L 820 70 L 820 130 L -20 220 Z" fill="url(#funnelBg)" />
                      <path d="M -20 -20 L 820 70" stroke="url(#funnelStroke)" strokeWidth="3" />
                      <path d="M -20 220 L 820 130" stroke="url(#funnelStroke)" strokeWidth="3" />
                      <circle r="2" fill="#7c3aed" opacity="0.5"><animateMotion path="M 0 20 L 800 80" dur="2.2s" repeatCount="indefinite" /></circle>
                      <circle r="3" fill="#3b82f6" opacity="0.3"><animateMotion path="M 0 180 L 800 120" dur="2.8s" repeatCount="indefinite" /></circle>
                      <circle r="1.5" fill="#10b981" opacity="0.6"><animateMotion path="M 0 60 L 800 95" dur="1.7s" repeatCount="indefinite" /></circle>
                      <circle r="4" fill="#64748b" opacity="0.15"><animateMotion path="M 0 140 L 800 105" dur="3.5s" repeatCount="indefinite" /></circle>
                      <circle r="2" fill="#ef4444" opacity="0.4"><animateMotion path="M 0 90 L 400 90" dur="1.5s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.4;0" dur="1.5s" repeatCount="indefinite" /></circle>
                    </svg>

                    <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {activeModuleId === "posture" && (
                        <svg viewBox="0 0 800 80" style={{ width: "100%", height: "auto", overflow: "visible" }}>
                          <defs>
                          <linearGradient id="glow-line-posture" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2"/>
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.9"/>
                          </linearGradient>
                        </defs>
                        <path d="M 50 40 L 750 40" stroke="url(#glow-line-posture)" strokeWidth="4" strokeDasharray="8 6" style={{ animation: "dash 20s linear infinite" }} />
                        <g transform="translate(100, 40)">
                          <circle r="13" fill="#7c3aed" />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">1</text>
                          <text y="28" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Raw Scan</text>
                        </g>
                        <g transform="translate(300, 40)">
                          <circle r="13" fill="#4f46e5" />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">2</text>
                          <text y="28" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Triage Gate</text>
                        </g>
                        <g transform="translate(500, 40)">
                          <circle r="13" fill="#0891b2" />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">3</text>
                          <text y="28" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">JPI Check</text>
                        </g>
                        <g transform="translate(700, 40)">
                          <circle r="13" fill="#10b981" style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.5))" }} />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">✓</text>
                          <text y="28" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Cleared</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "cloud" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "auto", overflow: "visible" }}>
                        <path d="M 100 20 L 300 40 M 100 40 L 300 40 M 100 60 L 300 40 M 300 40 L 520 40 M 520 40 L 700 40" stroke="#cbd5e1" strokeWidth="1.5" />
                        <path d="M 100 60 L 300 40 M 300 40 L 520 40" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" style={{ animation: "dash 3s linear infinite" }} />
                        <g transform="translate(100, 20)"><circle r="10" fill="#3b82f6"/><text y="3" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">AWS</text></g>
                        <g transform="translate(100, 40)"><circle r="10" fill="#0ea5e9"/><text y="3" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">GCP</text></g>
                        <g transform="translate(100, 60)"><circle r="10" fill="#2563eb"/><text y="3" text-anchor="middle" fill="#fff" fontSize="7" fontWeight="bold">AZR</text></g>
                        <g transform="translate(300, 40)">
                          <circle r="13" fill="#f59e0b" />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9">🛡️</text>
                          <text y="26" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">IAM Audit</text>
                        </g>
                        <g transform="translate(520, 40)">
                          <circle r="13" fill="#ef4444" style={{ filter: "drop-shadow(0 0 6px rgba(239,68,68,0.4))" }} />
                          <text y="3" textAnchor="middle" fill="#fff" fontSize="9">🚨</text>
                          <text y="26" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Exposed Bucket</text>
                        </g>
                        <g transform="translate(700, 40)">
                          <circle r="13" fill="#10b981" />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9">🔒</text>
                          <text y="26" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Quarantined</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "network" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "auto", overflow: "visible" }}>
                        <path d="M 50 40 L 750 40" stroke="#cbd5e1" strokeWidth="1.5" />
                        <path d="M 50 40 L 400 40" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" style={{ animation: "dash 2s linear infinite" }} />
                        <path d="M 400 40 L 400 70" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                        <g transform="translate(150, 40)">
                          <rect x="-40" y="-10" width="80" height="20" rx="5" fill="#475569" />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">Border Inbound</text>
                        </g>
                        <g transform="translate(400, 40)">
                          <circle r="13" fill="#ef4444" style={{ filter: "drop-shadow(0 0 5px #ef4444)" }} />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">🔥</text>
                          <text y="-20" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">IDS Trigger</text>
                        </g>
                        <g transform="translate(400, 70)">
                          <circle r="4" fill="#ef4444" />
                          <text y="14" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Null Routed</text>
                        </g>
                        <g transform="translate(650, 40)">
                          <rect x="-40" y="-10" width="80" height="20" rx="5" fill="#10b981" />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">Clean Traffic</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "appsec" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "auto", overflow: "visible" }}>
                        <path d="M 50 40 L 750 40" stroke="#cbd5e1" strokeWidth="1.5" />
                        <path d="M 50 40 L 500 40" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 5" style={{ strokeDashoffset: 5, animation: "dash 3s linear infinite" }} />
                        <g transform="translate(100, 40)">
                          <rect x="-35" y="-12" width="70" height="24" rx="5" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">Git Commit</text>
                        </g>
                        <g transform="translate(300, 40)">
                          <rect x="-35" y="-12" width="70" height="24" rx="5" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
                          <text y="3.5" textAnchor="middle" fill="#eab308" fontSize="9" fontWeight="bold">SAST Check</text>
                        </g>
                        <g transform="translate(500, 40)">
                          <rect x="-35" y="-12" width="70" height="24" rx="5" fill="#ef4444" style={{ filter: "drop-shadow(0 0 5px rgba(239,68,68,0.35))" }} />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">SCA Block</text>
                        </g>
                        <g transform="translate(700, 40)">
                          <circle r="13" fill="#94a3b8" />
                          <text y="3" textAnchor="middle" fill="#fff" fontSize="9">🛑</text>
                          <text y="26" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Deploy Halted</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "ai-risk" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "auto", overflow: "visible" }}>
                        <path d="M 50 40 L 750 40" stroke="#cbd5e1" strokeWidth="1.5" />
                        <path d="M 50 40 L 750 40" stroke="#3b82f6" strokeWidth="2" strokeDasharray="10 5" style={{ animation: "dash 4s linear infinite" }} />
                        <g transform="translate(120, 40)">
                          <rect x="-45" y="-10" width="90" height="20" rx="4" fill="#0f172a" stroke="#38bdf8" />
                          <text y="3" text-anchor="middle" fill="#38bdf8" fontSize="7" fontFamily="monospace">"API KEY: xoxb..."</text>
                        </g>
                        <g transform="translate(400, 40)">
                          <circle r="13" fill="#7c3aed" style={{ filter: "drop-shadow(0 0 8px rgba(124,58,237,0.4))" }} />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9">🛡️</text>
                          <text y="26" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">PII Redactor</text>
                        </g>
                        <g transform="translate(680, 40)">
                          <rect x="-45" y="-10" width="90" height="20" rx="4" fill="#0f172a" stroke="#10b981" />
                          <text y="3" text-anchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace">"API KEY: [REDACTED]"</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "secure" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "auto", overflow: "visible" }}>
                        <circle cx="400" cy="40" r="30" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                        <circle cx="400" cy="40" r="18" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                        <circle cx="400" cy="40" r="4" fill="#ef4444" style={{ animation: "pulseRed 1s infinite" }} />
                        <line x1="400" y1="5" x2="400" y2="75" stroke="#cbd5e1" strokeWidth="1" />
                        <line x1="365" y1="40" x2="435" y2="40" stroke="#cbd5e1" strokeWidth="1" />
                        <g transform="translate(150, 40)">
                          <text x="0" y="0" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="950">3.8M</text>
                          <text x="0" y="12" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Raw Findings</text>
                        </g>
                        <g transform="translate(650, 40)">
                          <text x="0" y="0" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="950">420</text>
                          <text x="0" y="12" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Actionable Risks</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "identity" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "auto", overflow: "visible" }}>
                        <path d="M 50 40 L 750 40" stroke="#cbd5e1" strokeWidth="1.5" />
                        <path d="M 50 40 L 750 40" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="6 4" style={{ animation: "dash 5s linear infinite" }} />
                        <g transform="translate(150, 40)">
                          <circle r="13" fill="#a855f7" />
                          <text y="2.5" textAnchor="middle" fill="#fff" fontSize="7.5" fontWeight="bold">Okta</text>
                        </g>
                        <g transform="translate(350, 40)">
                          <circle r="13" fill="#f59e0b" />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9">🔑</text>
                          <text y="26" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">MFA Check</text>
                        </g>
                        <g transform="translate(550, 40)">
                          <circle r="13" fill="#ef4444" />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9">⚠</text>
                          <text y="26" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Priv Drift</text>
                        </g>
                        <g transform="translate(700, 40)">
                          <circle r="12" fill="#10b981" />
                          <text y="3.5" text-anchor="middle" fill="#fff" fontSize="8">✓</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "infosec" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "auto", overflow: "visible" }}>
                        <path d="M 50 40 L 750 40" stroke="#cbd5e1" strokeWidth="1.5" />
                        <g transform="translate(100, 40)">
                          <rect x="-30" y="-10" width="60" height="20" rx="4" fill="#f1f5f9" stroke="#cbd5e1" />
                          <text y="2.5" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">CC5.1 Audit</text>
                        </g>
                        <g transform="translate(300, 40)">
                          <rect x="-30" y="-10" width="60" height="20" rx="4" fill="#ecfdf5" stroke="#a7f3d0" />
                          <text y="2.5" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Evidence</text>
                        </g>
                        <g transform="translate(500, 40)">
                          <rect x="-30" y="-10" width="60" height="20" rx="4" fill="#f5f3ff" stroke="#ddd6fe" />
                          <text y="2.5" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Controls</text>
                        </g>
                        <g transform="translate(700, 40)">
                          <circle r="14" fill="#10b981" style={{ filter: "drop-shadow(0 0 5px #10b981)" }} />
                          <text y="3.5" text-anchor="middle" fill="#fff" fontSize="8" fontWeight="bold">SOC2</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "dispatch" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "auto", overflow: "visible" }}>
                        <path d="M 100 40 H 400 M 400 40 L 600 20 M 400 40 L 600 60" stroke="#cbd5e1" strokeWidth="1.5" />
                        <path d="M 100 40 H 400 M 400 40 L 600 60" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" style={{ animation: "dash 3s linear infinite" }} />
                        <g transform="translate(100, 40)">
                          <circle r="13" fill="#e11d48" />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">EDR</text>
                        </g>
                        <g transform="translate(400, 40)">
                          <circle r="13" fill="#0f766e" />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">SOAR</text>
                        </g>
                        <g transform="translate(600, 20)">
                          <rect x="-25" y="-10" width="50" height="20" rx="3" fill="#3b82f6" />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">Slack</text>
                        </g>
                        <g transform="translate(600, 60)">
                          <rect x="-25" y="-10" width="50" height="20" rx="3" fill="#ef4444" />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">Jira</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "server" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "auto", overflow: "visible" }}>
                        <path d="M 50 40 L 750 40" stroke="#cbd5e1" strokeWidth="1.5" />
                        <g transform="translate(120, 40)">
                          <circle r="13" fill="#10b981" />
                          <text y="24" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">45K Fleet</text>
                        </g>
                        <g transform="translate(300, 40)">
                          <circle r="13" fill="#ef4444" style={{ animation: "pulseRed 1.5s infinite" }} />
                          <text y="24" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Drift Alert</text>
                        </g>
                        <g transform="translate(480, 40)">
                          <circle r="13" fill="#3b82f6" />
                          <text y="24" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">OS Patch</text>
                        </g>
                        <g transform="translate(660, 40)">
                          <circle r="13" fill="#10b981" />
                          <text y="24" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">EDR Active</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "traffic" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "auto", overflow: "visible" }}>
                        <path d="M 50 40 C 200 10, 250 70, 400 40 C 550 10, 600 70, 750 40" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="10 5" style={{ animation: "dash 8s linear infinite" }} />
                        <line x1="250" y1="10" x2="250" y2="70" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                        <line x1="550" y1="10" x2="550" y2="70" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />
                        <g transform="translate(250, 40)">
                          <circle r="11" fill="#ef4444" />
                          <text y="-16" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Peak Traffic</text>
                        </g>
                        <g transform="translate(550, 40)">
                          <circle r="11" fill="#10b981" />
                          <text y="-16" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Shaped</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "kpi" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "auto", overflow: "visible" }}>
                        {/* Horizontal Timeline Connector */}
                        <line x1="100" y1="40" x2="700" y2="40" stroke="rgba(124, 58, 237, 0.15)" strokeWidth="2" strokeDasharray="3 3" />
                        
                        {/* Phase 1: 48.2h Start (Red Alert Badge) */}
                        <g transform="translate(100, 40)">
                          <rect x="-35" y="-18" width="70" height="24" rx="6" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
                          <text y="-2" textAnchor="middle" fill="#b91c1c" fontSize="9" fontWeight="900" fontFamily="monospace">48.2h</text>
                          <text y="20" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Legacy MTTR</text>
                        </g>

                        {/* Connection line 1 */}
                        <path d="M 170 40 L 210 40" stroke="#ef4444" strokeWidth="1.5" />

                        {/* Phase 2: 12.4h MTTA (Orange Alert Badge) */}
                        <g transform="translate(260, 40)">
                          <rect x="-35" y="-18" width="70" height="24" rx="6" fill="#ffedd5" stroke="#f97316" strokeWidth="1" />
                          <text y="-2" textAnchor="middle" fill="#c2410c" fontSize="9" fontWeight="900" fontFamily="monospace">12.4h</text>
                          <text y="20" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Mean MTTA</text>
                        </g>

                        {/* Connection line 2 */}
                        <path d="M 330 40 L 370 40" stroke="#f97316" strokeWidth="1.5" />

                        {/* Phase 3: 3.5h MTTR (Blue Alert Badge) */}
                        <g transform="translate(420, 40)">
                          <rect x="-35" y="-18" width="70" height="24" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
                          <text y="-2" textAnchor="middle" fill="#1e40af" fontSize="9" fontWeight="900" fontFamily="monospace">3.5h</text>
                          <text y="20" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">Mean MTTR</text>
                        </g>

                        {/* Connection line 3 */}
                        <path d="M 490 40 L 530 40" stroke="#3b82f6" strokeWidth="1.5" />

                        {/* Phase 4: 91% SLA Goal (Teal Success Ring) */}
                        <g transform="translate(580, 40)">
                          <circle r="13" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
                          <text y="3" textAnchor="middle" fill="#047857" fontSize="9" fontWeight="bold" fontFamily="monospace">91%</text>
                          <text y="26" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="bold">SLA Met</text>
                        </g>

                        {/* Connection line 4 */}
                        <path d="M 620 40 L 660 40" stroke="#10b981" strokeWidth="1.5" />

                        {/* Phase 5: 1.8h Autopilot Goal (Glowing Green Badge) */}
                        <g transform="translate(700, 40)">
                          <rect x="-35" y="-18" width="70" height="24" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.4))" }} />
                          <text y="-2" textAnchor="middle" fill="#047857" fontSize="9" fontWeight="900" fontFamily="monospace">1.8h</text>
                          <text y="20" textAnchor="middle" fill="#047857" fontSize="9" fontWeight="bold">Autopilot Goal</text>
                        </g>
                      </svg>
                    )}
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 3: Enterprise Integration / Telemetry Checklist */}
              {activeSlide === 2 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ textAlign: "left", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#15803d", letterSpacing: "0.15em", textTransform: "uppercase" }}>INTEGRATIONS & WORKFLOWS</div>
                    <h3 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#0f172a", margin: "0.15rem 0", letterSpacing: "-0.02em" }}>
                      Enterprise <span style={{ color: "#10b981" }}>Automation</span>
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0 }}>
                      Connect endpoints directly to enterprise dashboards.
                    </p>
                  </div>

                  <div className="mythos-split-grid">
                    {/* Left Terminals Graphic */}
                    <div className="mythos-terminal" style={{ flexDirection: "column", justifyContent: "flex-start", padding: 0, height: "390px" }}>
                      {/* Terminal MacOS Header */}
                      <div style={{ width: "100%", height: "28px", background: "#1e293b", display: "flex", alignItems: "center", padding: "0 12px", gap: "6px", borderBottom: "1px solid #334155", flexShrink: 0 }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }}></div>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }}></div>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }}></div>
                        <div style={{ marginLeft: "auto", fontSize: "0.6rem", color: "#64748b", fontFamily: "monospace", letterSpacing: "0.05em" }}>posturepilot-agent</div>
                      </div>
                      {/* Terminal Body */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontFamily: "monospace", fontSize: "0.75rem", color: "#cbd5e1", width: "100%", padding: "1rem", overflow: "hidden", alignSelf: "flex-start" }}>
                        <div><span style={{ color: "#4ade80" }}>$</span> posturepilot verify --module={activeModule.id}</div>
                        <div><span style={{ color: "#8b5cf6" }}>[SYS]</span> Negotiating TLS handshake with master...</div>
                        <div><span style={{ color: "#a5b4fc" }}>[INFO]</span> Initializing baseline security tests...</div>
                        <div><span style={{ color: "#a5b4fc" }}>[INFO]</span> Correlating ticket state with asset owner...</div>
                        <div><span style={{ color: "#4ade80" }}>[OK]</span> Integration triggers validated successfully.</div>
                        <div><span style={{ color: "#8b5cf6" }}>[SYS]</span> Bootstrapping continuous telemetry layer...</div>
                        <div><span style={{ color: "#a5b4fc" }}>[INFO]</span> Syncing IAM boundary profiles...</div>
                        <div><span style={{ color: "#4ade80" }}>[OK]</span> Compliance matrix synchronized.</div>
                        <div style={{ color: "#facc15", animation: "pulseRed 1.5s infinite", marginTop: "0.5rem" }}>&gt; Awaiting active telemetry streams...</div>
                      </div>
                      
                      <div className="mythos-terminal-overlay" style={{ background: "linear-gradient(90deg, #1e293b, #0f172a)", borderLeft: "3px solid #10b981", color: "#10b981", display: "flex", alignItems: "center", gap: "0.5rem", width: "calc(100% - 1.5rem)", left: "0.75rem", bottom: "0.75rem", padding: "0.6rem 0.8rem", fontSize: "0.75rem" }}>
                        <span style={{ fontSize: "1rem" }}>⚡</span> Bi-sync streaming active
                      </div>
                    </div>

                    {/* Right Features Checklist */}
                    <div className="mythos-split-right">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ fontSize: "0.66rem", fontWeight: 800, color: "#10b981", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                          ENTERPRISE CAPABILITIES
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                        {activeModule.enterpriseFeatures.map((feat, idx) => (
                          <div className="mythos-feature-item" key={idx} style={{ 
                            background: "linear-gradient(135deg, #ecfdf5, #ffffff)", 
                            border: "1px solid #a7f3d0",
                            borderRadius: "10px",
                            padding: "0.8rem",
                            boxShadow: "0 4px 10px -2px rgba(16,185,129,0.1)",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.75rem"
                          }}>
                            <div style={{ background: "#10b981", borderRadius: "50%", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <div>
                              <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "#0f172a" }}>{feat.name}</div>
                              <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: "0.15rem", lineHeight: 1.4 }}>{feat.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                      {/* CTA Upgrade Banner */}
                      <div style={{ padding: "0.5rem 0.75rem", background: "rgba(124, 58, 237, 0.06)", border: "1px solid rgba(124, 58, 237, 0.15)", borderRadius: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                          <div>
                            <div style={{ fontSize: "0.58rem", fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.05em" }}>UPGRADE TO ACCESS</div>
                            <div style={{ fontSize: "0.65rem", color: "#475569", marginTop: "0.01rem" }}>Unlock complete ROC features.</div>
                          </div>
                          <button 
                            style={{ 
                              background: "linear-gradient(135deg, #7c3aed, #4f46e5)", 
                              border: "none", 
                              color: "#fff", 
                              padding: "0.25rem 0.5rem", 
                              borderRadius: "6px", 
                              fontSize: "0.65rem", 
                              fontWeight: 700, 
                              cursor: "pointer", 
                              boxShadow: "0 2px 6px rgba(124, 58, 237, 0.2)"
                            }} 
                            onClick={() => handleManualSlideSelect(3)}
                          >
                            Upgrade
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* SLIDE 4: Pricing Tier Plans */}
              {activeSlide === 3 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ textAlign: "center", marginBottom: "0.4rem" }}>
                    <div style={{ fontSize: "0.62rem", fontWeight: 800, color: "#7c3aed", letterSpacing: "0.15em", textTransform: "uppercase" }}>SUBSCRIPTION MODELS</div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: "0.1rem 0" }}>
                      Choose Your Activation Tier
                    </h3>
                    <p style={{ fontSize: "0.74rem", color: "#475569", margin: 0 }}>
                      Unlock complete automation gates, EDR validation, and multi-tenant reporting.
                    </p>
                  </div>

                  {/* Pricing Cards Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", width: "100%", marginTop: "0.2rem" }}>
                    {[
                      {
                        name: "Starter",
                        price: "149",
                        c: "#4f46e5",
                        features: ["1 user session", "Manual CSV Uploads", "500 vulnerability alerts", "All 12 ROC dashboards"],
                        badge: null
                      },
                      {
                        name: "Professional",
                        price: "399",
                        c: "#7c3aed",
                        features: ["5 users · 3 direct sources", "Qualys · Tenable · Nessus APIs", "10,000 findings pipeline", "Full API/Webhook access"],
                        badge: "MOST POPULAR"
                      },
                      {
                        name: "MSSP Enterprise",
                        price: "999",
                        c: "#0891b2",
                        features: ["Unlimited users", "Multi-tenant workspace", "White-label reports", "Dedicated security engineer"],
                        badge: null
                      }
                    ].map((plan, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          background: "#ffffff", 
                          border: plan.badge ? "2px solid #7c3aed" : "1px solid #cbd5e1", 
                          borderRadius: "12px", 
                          padding: "0.5rem 0.7rem", 
                          position: "relative",
                          boxShadow: plan.badge ? "0 4px 15px rgba(124, 58, 237, 0.08)" : "0 2px 5px rgba(0,0,0,0.02)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between"
                        }}
                      >
                        {plan.badge && (
                          <div style={{ position: "absolute", top: "-8px", right: "12px", background: "#7c3aed", color: "#fff", fontSize: "0.48rem", fontWeight: 900, padding: "2px 6px", borderRadius: "8px", letterSpacing: "0.05em" }}>
                            {plan.badge}
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>{plan.name}</div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: "2px", margin: "0.15rem 0" }}>
                            <span style={{ fontSize: "1.2rem", fontWeight: 950, color: "#0f172a" }}>${plan.price}</span>
                            <span style={{ fontSize: "0.58rem", color: "#64748b" }}>/mo</span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", margin: "0.3rem 0" }}>
                            {plan.features.map((feat, fIdx) => (
                              <div key={fIdx} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.62rem", color: "#475569" }}>
                                <span style={{ color: plan.c, fontWeight: "bold" }}>✓</span>
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button 
                          style={{
                            background: plan.badge ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "#f1f5f9",
                            color: plan.badge ? "#fff" : "#475569",
                            border: plan.badge ? "none" : "1px solid #cbd5e1",
                            padding: "0.35rem 0.5rem",
                            borderRadius: "6px",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            width: "100%",
                            marginTop: "0.3rem"
                          }}
                          onClick={() => {
                            alert(`Initiating trial registration for ${plan.name} plan. Redirecting to account portal...`);
                            window.location.href = `/login?plan=${plan.name.toLowerCase()}`;
                          }}
                        >
                          {plan.price === "999" ? "Contact Sales" : "Start 14-Day Trial"}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Back to Cockpit aligned bottom right */}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
                    <button
                      onClick={() => handleManualSlideSelect(0)}
                      style={{
                        background: "rgba(124, 58, 237, 0.08)",
                        border: "1px solid rgba(124, 58, 237, 0.2)",
                        color: "#7c3aed",
                        padding: "0.35rem 0.75rem",
                        borderRadius: "6px",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        transition: "all 0.15s ease"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(124, 58, 237, 0.15)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(124, 58, 237, 0.08)"}
                    >
                      ← Back to {activeModule.title} Cockpit
                    </button>
                  </div>
                </div>
              )}

              {/* Centered slide controls bar */}
              {activeSlide < 3 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "0.75rem", flexShrink: 0 }}>
                  {/* Blue solid play button */}
                  <button 
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    style={{ 
                      background: "none", 
                      border: "none", 
                      cursor: "pointer", 
                      fontSize: "0.95rem", 
                      color: "#2563eb", 
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "0.6rem",
                      padding: 0,
                      fontWeight: "bold",
                      transition: "transform 0.1s ease"
                    }}
                    onMouseDown={e => e.currentTarget.style.transform = "scale(0.9)"}
                    onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                    title={isAutoPlaying ? "Pause Loop" : "Play Loop"}
                  >
                    {isAutoPlaying ? "⏸" : "▶"}
                  </button>

                  {/* Horizontal navigation dashes */}
                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    {Array.from({ length: totalSlides }).map((_, idx) => (
                      <div 
                        key={idx}
                        className={`mythos-dash-indicator ${activeSlide === idx ? 'active' : ''}`}
                        onClick={() => handleManualSlideSelect(idx)}
                        title={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
