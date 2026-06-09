"use client";
import React, { useState, useEffect, useRef } from "react";

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

  const activeModule = MODULES_DATA.find((m) => m.id === activeModuleId) || MODULES_DATA[0];

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
            width: 92vw;
            max-width: 1100px;
            height: 550px;
            border-radius: 20px;
            position: relative;
            overflow: hidden;
            font-family: Inter, system-ui, -apple-system, sans-serif;
            display: grid;
            grid-template-columns: 280px 1fr;
            box-sizing: border-box;
            z-index: 10;
            box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.35);
            border: 1px solid #cbd5e1;
          }
          .mythos-sidebar {
            background: #f8fafc;
            border-right: 1px solid #e2e8f0;
            height: 100%;
            padding: 0.75rem 0.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
            overflow-y: auto;
            scrollbar-width: none;
            box-sizing: border-box;
          }
          .mythos-sidebar::-webkit-scrollbar {
            display: none;
          }
          .mythos-tab {
            padding: 0.28rem 0.5rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            border-left: 4px solid transparent;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            gap: 0.01rem;
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
            align-items: flex-start;
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
            padding: 0.2rem 1rem 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            animation: slideFadeIn 0.35s ease-out forwards;
          }
          .mythos-split-grid {
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            gap: 2rem;
            height: 100%;
            align-items: center;
          }
          .mythos-split-left {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 230px;
            background: #090d16;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            position: relative;
            overflow: hidden;
            box-shadow: inset 0 0 30px rgba(0,0,0,0.8);
          }
          .mythos-split-right {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .mythos-feature-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 0.45rem 0.75rem;
            margin-bottom: 0.4rem;
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
            transition: all 0.2s ease;
          }
          .mythos-feature-item:hover {
            border-color: #cbd5e1;
            background: #f1f5f9;
          }
          .mythos-metric-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
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
          }
          .mythos-metric-col:last-child {
            border-right: none;
            padding-right: 0;
          }
          .mythos-funnel-container {
            width: 100%;
            height: 90px;
            margin: 0.4rem 0;
            background: #f8fafc;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            padding: 0.35rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
          }
          .mythos-terminal {
            background: #090d16;
            border: 1px solid #1e293b;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            height: 230px;
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
            background: rgba(255, 255, 255, 0.85);
            border: 1px solid #e2e8f0;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            color: #475569;
            transition: all 0.2s ease;
            z-index: 50;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          }
          .mythos-nav-arrow:hover {
            background: #ffffff;
            color: #2563eb;
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
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
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
            from { width: 0%; }
            to { width: 100%; }
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
              flex-direction: row;
              overflow-x: auto;
              overflow-y: hidden;
              padding: 0.5rem;
              scroll-snap-type: x mandatory;
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
          {MODULES_DATA.map((feat) => (
            <div 
              key={feat.id} 
              className={`mythos-tab ${activeModuleId === feat.id ? 'active' : ''}`}
              onClick={() => handleManualModuleSelect(feat.id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "0.95rem" }}>{feat.icon}</span>
                <span style={{ fontSize: "0.76rem", fontWeight: activeModuleId === feat.id ? 800 : 600, color: activeModuleId === feat.id ? "#7c3aed" : "#475569" }}>{feat.title}</span>
              </div>
              <div style={{ fontSize: "0.64rem", color: "#64748b", marginTop: "0.02rem", paddingLeft: "1.35rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {feat.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Right Slideshow Canvas */}
        <div className="mythos-right-canvas">
          {/* Header block */}
          <div className="mythos-right-header">
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 900, letterSpacing: "-0.02em", color: "#0f172a", margin: 0 }}>
                The <span style={{ background: "linear-gradient(90deg, #7c3aed, #4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Post-Mythos</span> Era Demands More.
              </h2>
              <p style={{ fontSize: "0.72rem", color: "#64748b", margin: "0.1rem 0 0", lineHeight: 1.2 }}>
                Explore the 12 core cockpit pillars of the PosturePilot Risk Operations Center (ROC).
              </p>
            </div>
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="mythos-close-btn"
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
                <button onClick={handlePrevSlide} className="mythos-nav-arrow left" aria-label="Previous Slide">‹</button>
                <button onClick={handleNextSlide} className="mythos-nav-arrow right" aria-label="Next Slide">›</button>
              </>
            )}
            
            {/* Slide Body */}
            <div className="mythos-canvas-body" key={`${activeModuleId}-${activeSlide}`}>
              
              {/* SLIDE 1: Core Capabilities & Graphic */}
              {activeSlide === 0 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ textAlign: "center", marginBottom: "0.6rem" }}>
                    <div style={{ fontSize: "0.62rem", fontWeight: 800, color: "#2563eb", letterSpacing: "0.15em", textTransform: "uppercase" }}>COCKPIT PREVIEW</div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: "0.1rem 0" }}>
                      {activeModule.title}
                    </h3>
                    <p style={{ fontSize: "0.74rem", color: "#475569", margin: 0 }}>
                      {activeModule.tagline}
                    </p>
                  </div>
                  
                  <div className="mythos-split-grid">
                    {/* Left Animated SVG */}
                    <div className="mythos-split-left">
                      
                      {/* Posture Clearance */}
                      {activeModuleId === "posture" && (
                        <div style={{ position: "relative", width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 0 100 100" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(139, 92, 246, 0.08)" strokeWidth="1.5" strokeDasharray="3 3" style={{ animation: "rotateClockwise 30s linear infinite" }} />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="5" strokeDasharray="235 251" strokeLinecap="round" />
                          </svg>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 }}>
                            <span style={{ fontSize: "1.6rem", animation: "float 4s ease-in-out infinite" }}>🛡️</span>
                            <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fff", marginTop: "0.1rem", fontFamily: "monospace" }}>94%</div>
                          </div>
                          <div style={{ position: "absolute", width: "100%", height: "2px", background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)", top: "50%", left: 0, animation: "scanline 3s linear infinite", pointerEvents: "none" }} />
                        </div>
                      )}

                      {/* Cloud Altitude */}
                      {activeModuleId === "cloud" && (
                        <div style={{ position: "relative", width: "100%", height: 140, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "0.2rem" }}>
                          <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                            <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                            <line x1="80%" y1="25%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                            <line x1="50%" y1="50%" x2="30%" y2="80%" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                          </svg>
                          <div style={{ display: "flex", justifyContent: "space-around" }}>
                            <div style={{ display: "flex", gap: "0.3rem", alignItems: "center", background: "rgba(30,41,59,0.9)", border: "1px solid rgba(255,255,255,0.08)", padding: "0.2rem 0.4rem", borderRadius: "6px", animation: "float 5s ease-in-out infinite" }}>
                              <span style={{ fontSize: "0.75rem" }}>☁️</span>
                              <span style={{ fontSize: "0.55rem", fontFamily: "monospace", color: "#cbd5e1" }}>AWS-PROD</span>
                            </div>
                            <div style={{ display: "flex", gap: "0.3rem", alignItems: "center", background: "rgba(30,41,59,0.9)", border: "1px solid rgba(255,255,255,0.08)", padding: "0.2rem 0.4rem", borderRadius: "6px", animation: "floatSlow 7s ease-in-out infinite" }}>
                              <span style={{ fontSize: "0.75rem" }}>☁️</span>
                              <span style={{ fontSize: "0.55rem", fontFamily: "monospace", color: "#cbd5e1" }}>GCP-DEV</span>
                            </div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1e293b", border: "2px solid #3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", animation: "pulseGlowBlue 2s infinite" }} />
                            </div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{ display: "flex", gap: "0.3rem", alignItems: "center", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.18)", padding: "0.15rem 0.4rem", borderRadius: "6px" }}>
                              <span style={{ fontSize: "0.65rem", animation: "pulseRed 1.5s infinite" }}>🚨</span>
                              <span style={{ fontSize: "0.55rem", fontFamily: "monospace", color: "#f87171" }}>S3_PUBLIC_EXPOSED</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Network Runway */}
                      {activeModuleId === "network" && (
                        <div style={{ position: "relative", width: 180, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 0 200 150" style={{ width: "100%", height: "100%" }}>
                            <path d="M 20 75 L 80 75 M 120 75 L 180 75" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                            <path d="M 20 110 L 80 90 L 100 75" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" style={{ strokeDashoffset: 4, animation: "dash 2s linear infinite" }} />
                            <g transform="translate(100, 75)">
                              <circle cx="0" cy="0" r="14" fill="#090d16" stroke="#3b82f6" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(59, 130, 246, 0.4))" }} />
                            </g>
                            <circle cx="20" cy="75" r="3" fill="#10b981" />
                            <circle cx="20" cy="110" r="4" fill="#ef4444" style={{ animation: "pulseRed 1s infinite" }} />
                            <circle cx="180" cy="75" r="3" fill="#10b981" />
                          </svg>
                        </div>
                      )}

                      {/* App Security Check */}
                      {activeModuleId === "appsec" && (
                        <div style={{ position: "relative", width: "100%", height: 140, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0.2rem" }}>
                          <div style={{ width: "85%", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                            {[
                              { label: "Commits", count: "1,450 Scanned", w: "100%", c: "#334155" },
                              { label: "SAST Risks", count: "102 Triaged", w: "65%", c: "#eab308" },
                              { label: "SCA Blocks", count: "8 Fails", w: "25%", c: "#ef4444" }
                            ].map((bar, idx) => (
                              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.55rem", fontFamily: "monospace" }}>
                                  <span style={{ color: "#cbd5e1" }}>{bar.label}</span>
                                  <span style={{ color: bar.c === "#ef4444" ? "#ef4444" : "#94a3b8" }}>{bar.count}</span>
                                </div>
                                <div style={{ width: "100%", height: "5px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden" }}>
                                  <div style={{ width: bar.w, height: "100%", background: bar.c, borderRadius: "3px", animation: "growBar 1.5s ease-out forwards" }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Risk */}
                      {activeModuleId === "ai-risk" && (
                        <div style={{ position: "relative", width: 200, height: 140, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "0.4rem" }}>
                          <div style={{ background: "rgba(15, 23, 42, 0.85)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "6px", width: "95%", padding: "0.25rem 0.4rem", display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.5rem", color: "#64748b", fontFamily: "monospace" }}>
                              <span>PROMPT</span>
                              <span style={{ color: "#ef4444" }}>PII FOUND</span>
                            </div>
                            <div style={{ fontSize: "0.58rem", fontFamily: "monospace", color: "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              "Send audit logs to <span style={{ background: "rgba(239, 68, 68, 0.2)", color: "#ef4444" }}>john@bank.com</span>"
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "linear-gradient(90deg, #7c3aed, #4f46e5)", padding: "0.2rem 0.5rem", borderRadius: "10px", color: "#fff", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.05em" }}>
                            🛡️ AI POLICY FIREWALL
                          </div>
                          <div style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.15)", borderRadius: "6px", width: "95%", padding: "0.25rem 0.4rem", display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.5rem", color: "#64748b", fontFamily: "monospace" }}>
                              <span>CLEAN PROMPT</span>
                              <span style={{ color: "#10b981" }}>REDACTED</span>
                            </div>
                            <div style={{ fontSize: "0.58rem", fontFamily: "monospace", color: "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              "Send audit logs to <span style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10b981" }}>[REDACTED]</span>"
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Risk Radar */}
                      {activeModuleId === "secure" && (
                        <div style={{ position: "relative", width: 120, height: 120, borderRadius: "50%", border: "2px solid rgba(139, 92, 246, 0.18)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          <div style={{ position: "absolute", width: "100%", height: "100%", border: "2px solid rgba(139, 92, 246, 0.08)", borderRadius: "50%", transform: "scale(0.66)" }} />
                          <div style={{ position: "absolute", width: "100%", height: "100%", border: "2px solid rgba(139, 92, 246, 0.04)", borderRadius: "50%", transform: "scale(0.33)" }} />
                          <div style={{ position: "absolute", top: "50%", left: "50%", width: "50%", height: "50%", background: "conic-gradient(from 0deg, transparent 70%, rgba(139, 92, 246, 0.55) 100%)", transformOrigin: "0 0", animation: "radarSweep 3s linear infinite" }} />
                          <div style={{ position: "absolute", top: "25%", left: "65%", width: 4, height: 5, background: "#ef4444", borderRadius: "50%" }} />
                          <div style={{ position: "relative", zIndex: 10, background: "#090d16", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #8b5cf6" }}>
                            <span style={{ fontSize: "0.85rem" }}>📡</span>
                          </div>
                        </div>
                      )}

                      {/* Identity PreCheck */}
                      {activeModuleId === "identity" && (
                        <div style={{ position: "relative", width: 200, height: 140, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ position: "relative", width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.01)", border: "2px solid rgba(59, 130, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: "1.6rem" }}>🔑</span>
                            <div style={{ position: "absolute", top: -3, left: -3, right: -3, bottom: -3, border: "2px solid transparent", borderTopColor: "#3b82f6", borderBottomColor: "#3b82f6", borderRadius: "50%", animation: "rotateClockwise 3s linear infinite" }} />
                          </div>
                        </div>
                      )}

                      {/* Compliance Checkpoint */}
                      {activeModuleId === "infosec" && (
                        <div style={{ position: "relative", width: 200, height: 140, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ display: "flex", gap: "0.5rem", width: "100%", justifyContent: "center" }}>
                            {[{ label: "SOC2", val: 99, c: "#10b981" }, { label: "ISO", val: 100, c: "#10b981" }].map((m, idx) => (
                              <div key={idx} style={{ position: "relative", width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                                  <circle cx="18" cy="18" r="15" fill="none" stroke={m.c} strokeWidth="3" strokeDasharray={`${m.val} 100`} />
                                </svg>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dispatch Center */}
                      {activeModuleId === "dispatch" && (
                        <div style={{ position: "relative", width: 200, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 0 200 150" style={{ width: "100%", height: "100%" }}>
                            <path d="M 100 75 Q 70 45, 40 45" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" style={{ animation: "dash 2s linear infinite" }} />
                            <circle cx="100" cy="75" r="10" fill="#ef4444" stroke="#fff" strokeWidth="1" />
                            <g transform="translate(40, 45)">
                              <rect x="-12" y="-8" width="24" height="16" rx="3" fill="#ef4444" />
                              <text x="0" y="3" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="800" fontFamily="sans-serif">JIRA</text>
                            </g>
                          </svg>
                        </div>
                      )}

                      {/* Fleet Health */}
                      {activeModuleId === "server" && (
                        <div style={{ position: "relative", width: 200, height: 140, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.3rem", width: "90%" }}>
                            {Array.from({ length: 8 }).map((_, i) => (
                              <div key={i} style={{ background: "rgba(30, 41, 59, 0.7)", border: `1px solid ${i === 4 ? "#ef4444" : "#10b981"}`, borderRadius: "4px", padding: "0.15rem 0.1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontSize: "0.5rem" }}>🖥️</span>
                                <span style={{ fontSize: "0.38rem", fontFamily: "monospace", color: i === 4 ? "#ef4444" : "#10b981", fontWeight: 900 }}>{i === 4 ? "CVE" : "OK"}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Traffic Control */}
                      {activeModuleId === "traffic" && (
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "0.5rem",
                          width: "95%",
                          height: "92%",
                          padding: "0.2rem"
                        }}>
                          {/* Tile 1: Flow Anomaly Detection */}
                          <div style={{
                            background: "rgba(15, 23, 42, 0.6)",
                            border: "1px solid rgba(245, 158, 11, 0.2)",
                            borderRadius: "8px",
                            padding: "0.4rem",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "100%",
                            boxSizing: "border-box"
                          }}>
                            <div style={{ textAlign: "left" }}>
                              <div style={{ fontSize: "0.55rem", color: "#f59e0b", fontWeight: 800, fontFamily: "monospace", letterSpacing: "0.05em", textTransform: "uppercase" }}>FLOW ANOMALY</div>
                              <div style={{ fontSize: "0.45rem", color: "#64748b", marginTop: "2px" }}>Subnet exfiltration block</div>
                            </div>
                            
                            {/* SVG Graphic */}
                            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <svg viewBox="0 0 100 70" style={{ width: "100%", height: "100%" }}>
                                {/* Nodes */}
                                <circle cx="20" cy="45" r="5" fill="#10b981" />
                                <text x="20" y="56" textAnchor="middle" fill="#64748b" fontSize="5" fontFamily="monospace">Subnet A</text>
                                
                                <circle cx="50" cy="20" r="5" fill="#10b981" />
                                <text x="50" y="12" textAnchor="middle" fill="#64748b" fontSize="5" fontFamily="monospace">Subnet B</text>
                                
                                <circle cx="80" cy="45" r="5" fill="#ef4444" style={{ animation: "pulseRed 1.5s infinite" }} />
                                <text x="80" y="56" textAnchor="middle" fill="#ef4444" fontSize="5" fontFamily="monospace" fontWeight="bold">Unauth IP</text>
                                
                                {/* Links */}
                                <line x1="25" y1="41" x2="45" y2="24" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                                <line x1="25" y1="45" x2="75" y2="45" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 2" style={{ animation: "dash 4s linear infinite" }} />
                                
                                {/* Anomaly Label */}
                                <rect x="35" y="38" width="30" height="8" rx="2" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="0.3" />
                                <text x="50" y="44" textAnchor="middle" fill="#f87171" fontSize="4.5" fontWeight="bold" fontFamily="monospace">BLOCKED</text>
                              </svg>
                            </div>
                          </div>

                          {/* Tile 2: Bandwidth Peak Analyzer */}
                          <div style={{
                            background: "rgba(15, 23, 42, 0.6)",
                            border: "1px solid rgba(16, 185, 129, 0.2)",
                            borderRadius: "8px",
                            padding: "0.4rem",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "100%",
                            boxSizing: "border-box"
                          }}>
                            <div style={{ textAlign: "left" }}>
                              <div style={{ fontSize: "0.55rem", color: "#10b981", fontWeight: 800, fontFamily: "monospace", letterSpacing: "0.05em", textTransform: "uppercase" }}>BANDWIDTH PEAK</div>
                              <div style={{ fontSize: "0.45rem", color: "#64748b", marginTop: "2px" }}>Exfiltration spike check</div>
                            </div>
                            
                            {/* SVG Graphic */}
                            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <svg viewBox="0 0 100 70" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                                <defs>
                                  <linearGradient id="tile2Glow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                                  </linearGradient>
                                </defs>
                                {/* Grid lines */}
                                <line x1="5" y1="15" x2="95" y2="15" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                                <line x1="5" y1="35" x2="95" y2="35" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                                <line x1="5" y1="55" x2="95" y2="55" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                                
                                {/* Dotted Limit */}
                                <line x1="5" y1="30" x2="95" y2="30" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
                                <text x="8" y="27" fill="#3b82f6" fontSize="4.2" fontFamily="monospace">Limit (5.0G)</text>
                                
                                {/* Area Path with Anomaly Spike */}
                                <path d="M 5 55 Q 25 52, 40 45 T 60 12 T 75 50 T 95 55 L 95 55 L 5 55 Z" fill="url(#tile2Glow)" />
                                <path d="M 5 55 Q 25 52, 40 45 T 60 12 T 75 50 T 95 55" fill="none" stroke="#ef4444" strokeWidth="1" />
                                
                                {/* Indicator Dot */}
                                <circle cx="60" cy="12" r="1.5" fill="#ef4444" style={{ filter: "drop-shadow(0 0 2px #ef4444)" }} />
                                <text x="63" y="10" fill="#ef4444" fontSize="4.5" fontFamily="monospace" fontWeight="bold">8.24 Gbps</text>
                              </svg>
                            </div>
                          </div>

                          {/* Tile 3: Port Exposure Matrix */}
                          <div style={{
                            background: "rgba(15, 23, 42, 0.6)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            borderRadius: "8px",
                            padding: "0.4rem",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "100%",
                            boxSizing: "border-box"
                          }}>
                            <div style={{ textAlign: "left" }}>
                              <div style={{ fontSize: "0.55rem", color: "#ef4444", fontWeight: 800, fontFamily: "monospace", letterSpacing: "0.05em", textTransform: "uppercase" }}>PORT EXPOSURE</div>
                              <div style={{ fontSize: "0.45rem", color: "#64748b", marginTop: "2px" }}>Perimeter scanning</div>
                            </div>
                            
                            {/* Grid of ports */}
                            <div style={{
                              flex: 1,
                              display: "grid",
                              gridTemplateColumns: "repeat(3, 1fr)",
                              gap: "3px",
                              alignContent: "center",
                              padding: "0.1rem 0"
                            }}>
                              {[
                                { port: "80", status: "OK", color: "#10b981" },
                                { port: "443", status: "OK", color: "#10b981" },
                                { port: "22", status: "OK", color: "#10b981" },
                                { port: "8080", status: "OK", color: "#10b981" },
                                { port: "3389", status: "EXPOSED", color: "#ef4444", alert: true },
                                { port: "1433", status: "SECURE", color: "#10b981" },
                                { port: "3306", status: "SECURE", color: "#10b981" },
                                { port: "21", status: "SECURE", color: "#10b981" },
                                { port: "5432", status: "SECURE", color: "#10b981" }
                              ].map((p, pIdx) => (
                                <div
                                  key={pIdx}
                                  style={{
                                    background: "rgba(30, 41, 59, 0.4)",
                                    border: `1px solid ${p.color}44`,
                                    borderRadius: "4px",
                                    padding: "4px 2px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    animation: p.alert ? "pulseRed 1s infinite" : "none"
                                  }}
                                >
                                  <span style={{ fontSize: "0.45rem", fontWeight: 700, color: "#94a3b8", fontFamily: "monospace" }}>{p.port}</span>
                                  <span style={{ fontSize: "0.38rem", fontWeight: 900, color: p.color, fontFamily: "monospace", textTransform: "uppercase" }}>{p.status}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Flight Telemetry (KPIs) */}
                      {activeModuleId === "kpi" && (
                        <div style={{ position: "relative", width: "95%", height: 190, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "0.2rem" }}>
                          {/* Top Metric Strip */}
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                              <span style={{ fontSize: "0.55rem", color: "#64748b", fontFamily: "monospace" }}>MEAN TIME TO REMEDIATE</span>
                              <span style={{ fontSize: "0.85rem", fontWeight: 900, color: "#10b981", fontFamily: "monospace" }}>1.8h <span style={{ fontSize: "0.55rem", color: "#64748b" }}>vs 48.2h legacy</span></span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                              <span style={{ fontSize: "0.55rem", color: "#64748b", fontFamily: "monospace" }}>SLA COMPLIANCE</span>
                              <span style={{ fontSize: "0.85rem", fontWeight: 900, color: "#3b82f6", fontFamily: "monospace" }}>91.4% <span style={{ fontSize: "0.55rem", color: "#10b981" }}>▲ 12.8%</span></span>
                            </div>
                          </div>

                          {/* Graphical Dashboard Panel */}
                          <div style={{ flex: 1, minHeight: 120 }}>
                            <svg viewBox="0 0 320 120" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                              <defs>
                                <linearGradient id="kpiGlow" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="legacyGlow" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
                                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                                </linearGradient>
                              </defs>

                              {/* Grid Lines */}
                              <line x1="20" y1="10" x2="300" y2="10" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                              <line x1="20" y1="35" x2="300" y2="35" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                              <line x1="20" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                              <line x1="20" y1="85" x2="300" y2="85" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                              <line x1="20" y1="110" x2="300" y2="110" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                              {/* Y-Axis Labels */}
                              <text x="15" y="13" textAnchor="end" fill="#475569" fontSize="5" fontFamily="monospace">48h</text>
                              <text x="15" y="63" textAnchor="end" fill="#475569" fontSize="5" fontFamily="monospace">12h</text>
                              <text x="15" y="113" textAnchor="end" fill="#475569" fontSize="5" fontFamily="monospace">0h</text>

                              {/* X-Axis Labels */}
                              <text x="30" y="117" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">Wk 1</text>
                              <text x="110" y="117" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">Wk 2</text>
                              <text x="190" y="117" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">Wk 3</text>
                              <text x="270" y="117" textAnchor="middle" fill="#475569" fontSize="5" fontFamily="monospace">Wk 4</text>

                              {/* Area under curves */}
                              <path d="M 20 10 L 100 20 L 180 30 L 260 38 L 300 42 L 300 110 L 20 110 Z" fill="url(#legacyGlow)" />
                              <path d="M 20 10 L 100 70 L 180 95 L 260 105 L 300 106 L 300 110 L 20 110 Z" fill="url(#kpiGlow)" />

                              {/* Legacy Line (Red dashed) */}
                              <path d="M 20 10 L 100 20 L 180 30 L 260 38 L 300 42" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                              <circle cx="300" cy="42" r="2.5" fill="#ef4444" />
                              <text x="290" y="36" fill="#ef4444" fontSize="4.5" fontFamily="monospace" fontWeight="bold">Legacy MTTR (42h)</text>

                              {/* Autopilot Line (Green Glowing) */}
                              <path d="M 20 10 L 100 70 L 180 95 L 260 105 L 300 106" fill="none" stroke="#10b981" strokeWidth="2.5" />
                              <circle cx="300" cy="106" r="3" fill="#10b981" style={{ filter: "drop-shadow(0 0 4px #10b981)" }} />
                              <text x="290" y="99" fill="#10b981" fontSize="5.5" fontFamily="monospace" fontWeight="bold">Autopilot (1.8h)</text>

                              {/* Target SLA Threshold Indicator Line */}
                              <line x1="20" y1="102" x2="300" y2="102" stroke="#3b82f6" strokeWidth="1" strokeDasharray="1.5 1.5" />
                              <text x="25" y="100" fill="#3b82f6" fontSize="4.5" fontFamily="monospace">SLA Target (4.0h)</text>
                            </svg>
                          </div>
                        </div>
                      )}

                    </div>
                    
                    {/* Right Features List */}
                    <div className="mythos-split-right">
                      <div style={{ fontSize: "0.58rem", fontWeight: 800, color: "#7c3aed", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                        CORE CAPABILITIES
                      </div>
                      <div>
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
              )}

              {/* SLIDE 2: Filter Prioritization Funnel */}
              {activeSlide === 1 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ textAlign: "center", marginBottom: "0.6rem" }}>
                    <div style={{ fontSize: "0.62rem", fontWeight: 800, color: "#2563eb", letterSpacing: "0.15em", textTransform: "uppercase" }}>EXPOSURE FILTRATION</div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: "0.1rem 0" }}>
                      Prioritization Pipeline
                    </h3>
                    <p style={{ fontSize: "0.74rem", color: "#475569", margin: 0 }}>
                      How PosturePilot filters vulnerabilities down to remediation tasks.
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="mythos-metric-grid">
                    {activeModule.funnelMetrics.map((m, idx) => (
                      <div className="mythos-metric-col" key={idx}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <span style={{ fontSize: "1.5rem", fontWeight: 950, color: idx === 3 ? "#15803d" : "#991b1b", fontFamily: "monospace", lineHeight: 1 }}>
                            {m.val}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#1e293b", margin: "0.02rem 0" }}>
                          {m.label}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                          {m.desc.map((d, dIdx) => (
                            <div key={dIdx} style={{ fontSize: "0.65rem", color: "#64748b", lineHeight: 1.2 }}>
                              ▪ {d}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom Graphic Area per Module on Slide 2 */}
                  <div className="mythos-funnel-container">
                    {activeModuleId === "posture" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                        <defs>
                          <linearGradient id="glow-line-posture" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2"/>
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.9"/>
                          </linearGradient>
                        </defs>
                        <path d="M 50 40 L 750 40" stroke="url(#glow-line-posture)" strokeWidth="4" strokeDasharray="8 6" style={{ animation: "dash 20s linear infinite" }} />
                        <g transform="translate(100, 40)">
                          <circle r="13" fill="#7c3aed" />
                          <text y="3" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">1</text>
                          <text y="26" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">Raw Scan</text>
                        </g>
                        <g transform="translate(300, 40)">
                          <circle r="13" fill="#4f46e5" />
                          <text y="3" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">2</text>
                          <text y="26" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">Triage Gate</text>
                        </g>
                        <g transform="translate(500, 40)">
                          <circle r="13" fill="#0891b2" />
                          <text y="3" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">3</text>
                          <text y="26" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">JPI Check</text>
                        </g>
                        <g transform="translate(700, 40)">
                          <circle r="13" fill="#10b981" style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.5))" }} />
                          <text y="3.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">✓</text>
                          <text y="26" textAnchor="middle" fill="#16a34a" fontSize="8" fontWeight="bold">Cleared</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "cloud" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                        <path d="M 100 20 L 300 40 M 100 40 L 300 40 M 100 60 L 300 40 M 300 40 L 520 40 M 520 40 L 700 40" stroke="#cbd5e1" strokeWidth="1.5" />
                        <path d="M 100 60 L 300 40 M 300 40 L 520 40" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" style={{ animation: "dash 3s linear infinite" }} />
                        <g transform="translate(100, 20)"><circle r="10" fill="#3b82f6"/><text y="3" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">AWS</text></g>
                        <g transform="translate(100, 40)"><circle r="10" fill="#0ea5e9"/><text y="3" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">GCP</text></g>
                        <g transform="translate(100, 60)"><circle r="10" fill="#2563eb"/><text y="3" text-anchor="middle" fill="#fff" fontSize="7" fontWeight="bold">AZR</text></g>
                        <g transform="translate(300, 40)">
                          <circle r="14" fill="#f59e0b" />
                          <text y="3.5" text-anchor="middle" fill="#fff" fontSize="9">🛡️</text>
                          <text y="26" text-anchor="middle" fill="#475569" fontSize="8" fontWeight="bold">IAM Audit</text>
                        </g>
                        <g transform="translate(520, 40)">
                          <circle r="14" fill="#ef4444" style={{ filter: "drop-shadow(0 0 6px rgba(239,68,68,0.4))" }} />
                          <text y="3" text-anchor="middle" fill="#fff" fontSize="9">🚨</text>
                          <text y="26" text-anchor="middle" fill="#dc2626" fontSize="8" fontWeight="bold">Exposed Bucket</text>
                        </g>
                        <g transform="translate(700, 40)">
                          <circle r="14" fill="#10b981" />
                          <text y="3.5" text-anchor="middle" fill="#fff" fontSize="9">🔒</text>
                          <text y="26" text-anchor="middle" fill="#16a34a" fontSize="8" fontWeight="bold">Quarantined</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "network" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                        <path d="M 50 40 L 750 40" stroke="#cbd5e1" strokeWidth="1.5" />
                        <path d="M 50 40 L 400 40" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" style={{ animation: "dash 2s linear infinite" }} />
                        <path d="M 400 40 L 400 70" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                        <g transform="translate(150, 40)">
                          <rect x="-40" y="-10" width="80" height="20" rx="5" fill="#475569" />
                          <text y="3" text-anchor="middle" fill="#fff" fontSize="8" fontWeight="bold">Border Inbound</text>
                        </g>
                        <g transform="translate(400, 40)">
                          <circle r="13" fill="#ef4444" style={{ filter: "drop-shadow(0 0 5px #ef4444)" }} />
                          <text y="3" text-anchor="middle" fill="#fff" fontSize="8" fontWeight="bold">🔥</text>
                          <text y="-20" text-anchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">IDS Trigger</text>
                        </g>
                        <g transform="translate(400, 70)">
                          <circle r="4" fill="#ef4444" />
                          <text y="14" text-anchor="middle" fill="#dc2626" fontSize="8" fontWeight="bold">Null Routed</text>
                        </g>
                        <g transform="translate(650, 40)">
                          <rect x="-40" y="-10" width="80" height="20" rx="5" fill="#10b981" />
                          <text y="3" text-anchor="middle" fill="#fff" fontSize="8" fontWeight="bold">Clean Traffic</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "appsec" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                        <path d="M 50 40 L 750 40" stroke="#cbd5e1" strokeWidth="1.5" />
                        <path d="M 50 40 L 500 40" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 5" style={{ strokeDashoffset: 5, animation: "dash 3s linear infinite" }} />
                        <g transform="translate(100, 40)">
                          <rect x="-35" y="-12" width="70" height="24" rx="5" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
                          <text y="3" text-anchor="middle" fill="#fff" fontSize="8">Git Commit</text>
                        </g>
                        <g transform="translate(300, 40)">
                          <rect x="-35" y="-12" width="70" height="24" rx="5" fill="#1e293b" stroke="#cbd5e1" stroke-width="1" />
                          <text y="3" text-anchor="middle" fill="#eab308" fontSize="8">SAST Check</text>
                        </g>
                        <g transform="translate(500, 40)">
                          <rect x="-35" y="-12" width="70" height="24" rx="5" fill="#ef4444" style={{ filter: "drop-shadow(0 0 5px rgba(239,68,68,0.35))" }} />
                          <text y="3" text-anchor="middle" fill="#fff" fontSize="8" fontWeight="bold">SCA Block</text>
                        </g>
                        <g transform="translate(700, 40)">
                          <circle r="13" fill="#94a3b8" />
                          <text y="3" text-anchor="middle" fill="#fff" fontSize="9">🛑</text>
                          <text y="26" text-anchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">Deploy Halted</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "ai-risk" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                        <path d="M 50 40 L 750 40" stroke="#cbd5e1" strokeWidth="1.5" />
                        <path d="M 50 40 L 750 40" stroke="#3b82f6" strokeWidth="2" strokeDasharray="10 5" style={{ animation: "dash 4s linear infinite" }} />
                        <g transform="translate(120, 40)">
                          <rect x="-45" y="-10" width="90" height="20" rx="4" fill="#0f172a" stroke="#38bdf8" />
                          <text y="3" text-anchor="middle" fill="#38bdf8" fontSize="7" fontFamily="monospace">"API KEY: xoxb..."</text>
                        </g>
                        <g transform="translate(400, 40)">
                          <circle r="16" fill="#7c3aed" style={{ filter: "drop-shadow(0 0 8px rgba(124,58,237,0.4))" }} />
                          <text y="3.5" text-anchor="middle" fill="#fff" fontSize="10">🛡️</text>
                          <text y="26" text-anchor="middle" fill="#7c3aed" fontSize="8" fontWeight="bold">PII Redactor</text>
                        </g>
                        <g transform="translate(680, 40)">
                          <rect x="-45" y="-10" width="90" height="20" rx="4" fill="#0f172a" stroke="#10b981" />
                          <text y="3" text-anchor="middle" fill="#10b981" fontSize="7" fontFamily="monospace">"API KEY: [REDACTED]"</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "secure" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                        <circle cx="400" cy="40" r="30" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                        <circle cx="400" cy="40" r="18" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                        <circle cx="400" cy="40" r="4" fill="#ef4444" style={{ animation: "pulseRed 1s infinite" }} />
                        <line x1="400" y1="5" x2="400" y2="75" stroke="#cbd5e1" strokeWidth="1" />
                        <line x1="365" y1="40" x2="435" y2="40" stroke="#cbd5e1" strokeWidth="1" />
                        <g transform="translate(150, 40)">
                          <text x="0" y="0" text-anchor="middle" fill="#ef4444" fontSize="13" fontWeight="950">3.8M</text>
                          <text x="0" y="12" text-anchor="middle" fill="#64748b" fontSize="8">Raw Findings</text>
                        </g>
                        <g transform="translate(650, 40)">
                          <text x="0" y="0" text-anchor="middle" fill="#10b981" fontSize="13" fontWeight="950">420</text>
                          <text x="0" y="12" text-anchor="middle" fill="#16a34a" fontSize="8">Actionable Risks</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "identity" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                        <path d="M 50 40 L 750 40" stroke="#cbd5e1" strokeWidth="1.5" />
                        <path d="M 50 40 L 750 40" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="6 4" style={{ animation: "dash 5s linear infinite" }} />
                        <g transform="translate(150, 40)">
                          <circle r="12" fill="#a855f7" />
                          <text y="2.5" text-anchor="middle" fill="#fff" fontSize="6.5" fontWeight="bold">Okta</text>
                        </g>
                        <g transform="translate(350, 40)">
                          <circle r="12" fill="#f59e0b" />
                          <text y="3.5" text-anchor="middle" fill="#fff" fontSize="9">🔑</text>
                          <text y="26" text-anchor="middle" fill="#475569" fontSize="8">MFA Check</text>
                        </g>
                        <g transform="translate(550, 40)">
                          <circle r="12" fill="#ef4444" />
                          <text y="3" text-anchor="middle" fill="#fff" fontSize="8">⚠</text>
                          <text y="26" text-anchor="middle" fill="#ef4444" fontSize="8">Priv Drift</text>
                        </g>
                        <g transform="translate(700, 40)">
                          <circle r="12" fill="#10b981" />
                          <text y="3.5" text-anchor="middle" fill="#fff" fontSize="8">✓</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "infosec" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                        <path d="M 50 40 L 750 40" stroke="#cbd5e1" strokeWidth="1.5" />
                        <g transform="translate(100, 40)">
                          <rect x="-30" y="-10" width="60" height="20" rx="4" fill="#f1f5f9" stroke="#cbd5e1" />
                          <text y="2.5" text-anchor="middle" fill="#475569" fontSize="8" fontWeight="bold">CC5.1 Audit</text>
                        </g>
                        <g transform="translate(300, 40)">
                          <rect x="-30" y="-10" width="60" height="20" rx="4" fill="#ecfdf5" stroke="#a7f3d0" />
                          <text y="2.5" text-anchor="middle" fill="#047857" fontSize="8" fontWeight="bold">Evidence</text>
                        </g>
                        <g transform="translate(500, 40)">
                          <rect x="-30" y="-10" width="60" height="20" rx="4" fill="#f5f3ff" stroke="#ddd6fe" />
                          <text y="2.5" text-anchor="middle" fill="#6d28d9" fontSize="8" fontWeight="bold">Controls</text>
                        </g>
                        <g transform="translate(700, 40)">
                          <circle r="14" fill="#10b981" style={{ filter: "drop-shadow(0 0 5px #10b981)" }} />
                          <text y="3.5" text-anchor="middle" fill="#fff" fontSize="8" fontWeight="bold">SOC2</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "dispatch" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                        <path d="M 100 40 H 400 M 400 40 L 600 20 M 400 40 L 600 60" stroke="#cbd5e1" strokeWidth="1.5" />
                        <path d="M 100 40 H 400 M 400 40 L 600 60" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" style={{ animation: "dash 3s linear infinite" }} />
                        <g transform="translate(100, 40)">
                          <circle r="12" fill="#e11d48" />
                          <text y="3.5" text-anchor="middle" fill="#fff" fontSize="7">EDR</text>
                        </g>
                        <g transform="translate(400, 40)">
                          <circle r="14" fill="#0f766e" />
                          <text y="3.5" text-anchor="middle" fill="#fff" fontSize="8">SOAR</text>
                        </g>
                        <g transform="translate(600, 20)">
                          <rect x="-25" y="-10" width="50" height="20" rx="3" fill="#3b82f6" />
                          <text y="3.5" text-anchor="middle" fill="#fff" fontSize="8">Slack</text>
                        </g>
                        <g transform="translate(600, 60)">
                          <rect x="-25" y="-10" width="50" height="20" rx="3" fill="#ef4444" />
                          <text y="3.5" text-anchor="middle" fill="#fff" fontSize="8">Jira</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "server" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                        <path d="M 50 40 L 750 40" stroke="#cbd5e1" strokeWidth="1.5" />
                        <g transform="translate(120, 40)">
                          <circle r="11" fill="#10b981" />
                          <text y="24" text-anchor="middle" fill="#64748b" fontSize="8">45K Fleet</text>
                        </g>
                        <g transform="translate(300, 40)">
                          <circle r="11" fill="#ef4444" style={{ animation: "pulseRed 1.5s infinite" }} />
                          <text y="24" text-anchor="middle" fill="#ef4444" fontSize="8">Drift Alert</text>
                        </g>
                        <g transform="translate(480, 40)">
                          <circle r="11" fill="#3b82f6" />
                          <text y="24" text-anchor="middle" fill="#3b82f6" fontSize="8">OS Patch</text>
                        </g>
                        <g transform="translate(660, 40)">
                          <circle r="11" fill="#10b981" />
                          <text y="24" text-anchor="middle" fill="#10b981" fontSize="8">EDR Active</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "traffic" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                        <path d="M 50 40 C 200 10, 250 70, 400 40 C 550 10, 600 70, 750 40" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="10 5" style={{ animation: "dash 8s linear infinite" }} />
                        <line x1="250" y1="10" x2="250" y2="70" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                        <line x1="550" y1="10" x2="550" y2="70" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />
                        <g transform="translate(250, 40)">
                          <circle r="7" fill="#ef4444" />
                          <text y="-14" text-anchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">Peak Traffic</text>
                        </g>
                        <g transform="translate(550, 40)">
                          <circle r="7" fill="#10b981" />
                          <text y="-14" text-anchor="middle" fill="#10b981" fontSize="8" fontWeight="bold">Shaped</text>
                        </g>
                      </svg>
                    )}

                    {activeModuleId === "kpi" && (
                      <svg viewBox="0 0 800 80" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                        {/* Horizontal Timeline Connector */}
                        <line x1="100" y1="40" x2="700" y2="40" stroke="rgba(124, 58, 237, 0.15)" strokeWidth="2" strokeDasharray="3 3" />
                        
                        {/* Phase 1: 48.2h Start (Red Alert Badge) */}
                        <g transform="translate(100, 40)">
                          <rect x="-35" y="-18" width="70" height="24" rx="6" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
                          <text y="-2" textAnchor="middle" fill="#b91c1c" fontSize="8.5" fontWeight="900" fontFamily="monospace">48.2h</text>
                          <text y="20" textAnchor="middle" fill="#ef4444" fontSize="7.5" fontWeight="bold">Legacy MTTR</text>
                        </g>

                        {/* Connection line 1 */}
                        <path d="M 170 40 L 210 40" stroke="#ef4444" strokeWidth="1.5" />

                        {/* Phase 2: 12.4h MTTA (Orange Alert Badge) */}
                        <g transform="translate(260, 40)">
                          <rect x="-35" y="-18" width="70" height="24" rx="6" fill="#ffedd5" stroke="#f97316" strokeWidth="1" />
                          <text y="-2" textAnchor="middle" fill="#c2410c" fontSize="8.5" fontWeight="900" fontFamily="monospace">12.4h</text>
                          <text y="20" textAnchor="middle" fill="#f97316" fontSize="7.5" fontWeight="bold">Mean MTTA</text>
                        </g>

                        {/* Connection line 2 */}
                        <path d="M 330 40 L 370 40" stroke="#f97316" strokeWidth="1.5" />

                        {/* Phase 3: 3.5h MTTR (Blue Alert Badge) */}
                        <g transform="translate(420, 40)">
                          <rect x="-35" y="-18" width="70" height="24" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
                          <text y="-2" textAnchor="middle" fill="#1e40af" fontSize="8.5" fontWeight="900" fontFamily="monospace">3.5h</text>
                          <text y="20" textAnchor="middle" fill="#3b82f6" fontSize="7.5" fontWeight="bold">Mean MTTR</text>
                        </g>

                        {/* Connection line 3 */}
                        <path d="M 490 40 L 530 40" stroke="#3b82f6" strokeWidth="1.5" />

                        {/* Phase 4: 91% SLA Goal (Teal Success Ring) */}
                        <g transform="translate(580, 40)">
                          <circle r="16" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
                          <text y="3" textAnchor="middle" fill="#047857" fontSize="8.5" fontWeight="bold" fontFamily="monospace">91%</text>
                          <text y="26" textAnchor="middle" fill="#10b981" fontSize="7.5" fontWeight="bold">SLA Met</text>
                        </g>

                        {/* Connection line 4 */}
                        <path d="M 620 40 L 660 40" stroke="#10b981" strokeWidth="1.5" />

                        {/* Phase 5: 1.8h Autopilot Goal (Glowing Green Badge) */}
                        <g transform="translate(700, 40)">
                          <rect x="-35" y="-18" width="70" height="24" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.4))" }} />
                          <text y="-2" textAnchor="middle" fill="#047857" fontSize="8.5" fontWeight="900" fontFamily="monospace">1.8h</text>
                          <text y="20" textAnchor="middle" fill="#047857" fontSize="7.5" fontWeight="bold">Autopilot Goal</text>
                        </g>
                      </svg>
                    )}
                  </div>
                </div>
              )}

              {/* SLIDE 3: Enterprise Integration / Telemetry Checklist */}
              {activeSlide === 2 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ textAlign: "center", marginBottom: "0.6rem" }}>
                    <div style={{ fontSize: "0.62rem", fontWeight: 800, color: "#15803d", letterSpacing: "0.15em", textTransform: "uppercase" }}>INTEGRATIONS & WORKFLOWS</div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: "0.1rem 0" }}>
                      Enterprise Automation
                    </h3>
                    <p style={{ fontSize: "0.74rem", color: "#475569", margin: 0 }}>
                      Connect endpoints directly to enterprise dashboards.
                    </p>
                  </div>

                  <div className="mythos-split-grid">
                    {/* Left Terminals Graphic */}
                    <div className="mythos-terminal">
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", fontFamily: "monospace", fontSize: "0.68rem", color: "#cbd5e1", width: "90%", padding: "0.75rem", overflow: "hidden" }}>
                        <div><span style={{ color: "#4ade80" }}>$</span> posturepilot verify --module={activeModule.id}</div>
                        <div><span style={{ color: "#a5b4fc" }}>[INFO]</span> Initializing baseline security tests...</div>
                        <div><span style={{ color: "#a5b4fc" }}>[INFO]</span> Correlating ticket state with asset owner...</div>
                        <div><span style={{ color: "#4ade80" }}>[OK]</span> Integration triggers validated successfully.</div>
                        <div style={{ color: "#facc15", animation: "pulseRed 1.5s infinite" }}>&gt; Monitoring active clearance...</div>
                      </div>
                      <div className="mythos-terminal-overlay">
                        🔌 Bi-sync triggers connected
                      </div>
                    </div>

                    {/* Right Features Checklist */}
                    <div className="mythos-split-right">
                      <div style={{ fontSize: "0.58rem", fontWeight: 800, color: "#10b981", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                        ENTERPRISE CAPABILITIES
                      </div>
                      
                      {activeModule.enterpriseFeatures.map((feat, idx) => (
                        <div className="mythos-feature-item" key={idx} style={{ background: "rgba(16, 185, 129, 0.02)", borderColor: "rgba(16, 185, 129, 0.15)" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <div>
                            <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#0f172a" }}>{feat.name}</div>
                            <div style={{ fontSize: "0.65rem", color: "#64748b", marginTop: "0.02rem", lineHeight: 1.2 }}>{feat.desc}</div>
                          </div>
                        </div>
                      ))}

                      {/* CTA Upgrade Banner */}
                      <div style={{ marginTop: "0.3rem", padding: "0.5rem 0.75rem", background: "rgba(124, 58, 237, 0.06)", border: "1px solid rgba(124, 58, 237, 0.15)", borderRadius: "8px" }}>
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
