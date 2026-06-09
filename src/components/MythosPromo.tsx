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

export default function MythosPromo({ onClose }: { onClose: () => void }) {
  const [activeModuleId, setActiveModuleId] = useState<string>(MODULES_DATA[0].id);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
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
      <div 
        style={{
          background: "#f1f5f9",
          color: "#0f172a",
          width: "100vw",
          maxWidth: "none",
          height: "100vh",
          maxHeight: "none",
          borderRadius: "0",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          display: "flex",
          flexDirection: "column",
          padding: "1.2rem 1.8rem",
          boxSizing: "border-box",
          zIndex: 10
        }}
        id="mythos-promo"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: "1.2rem", right: "1.5rem", background: "#e2e8f0", border: "none", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", zIndex: 100, transition: "background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#cbd5e1"}
          onMouseLeave={e => e.currentTarget.style.background = "#e2e8f0"}
        >
          ✕
        </button>

        <style>{`
          .mythos-grid {
            display: grid;
            grid-template-columns: 290px 1fr;
            gap: 1.5rem;
            max-width: 1600px;
            margin: 0 auto;
            position: relative;
            z-index: 10;
            flex: 1;
            height: calc(100vh - 100px);
            width: 100%;
            min-height: 0;
          }
          .mythos-tab-list {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            height: 100%;
            justify-content: flex-start;
            overflow-y: auto;
            scrollbar-width: none;
            padding-right: 0.25rem;
          }
          .mythos-tab-list::-webkit-scrollbar {
            display: none;
          }
          .mythos-tab {
            padding: 0.5rem 0.75rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            border-left: 4px solid transparent;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            gap: 0.05rem;
            flex-shrink: 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          }
          .mythos-tab:hover {
            background: #f8fafc;
          }
          .mythos-tab.active {
            background: rgba(124, 58, 237, 0.05);
            border-left: 4px solid #7c3aed;
            box-shadow: 0 4px 12px rgba(124, 58, 237, 0.04);
          }
          .mythos-canvas {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            box-shadow: 0 15px 40px -10px rgba(0, 0, 0, 0.05);
            height: 100%;
            min-height: 0;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
          }
          .mythos-canvas-body {
            flex: 1;
            min-height: 0;
            padding: 2.2rem 2.5rem 1.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            animation: slideFadeIn 0.35s ease-out forwards;
          }
          
          /* Slide 1 Split Pane */
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
            height: 310px;
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
            padding: 0.75rem 1rem;
            margin-bottom: 0.6rem;
            display: flex;
            align-items: flex-start;
            gap: 0.6rem;
            transition: all 0.2s ease;
          }
          .mythos-feature-item:hover {
            border-color: #cbd5e1;
            background: #f1f5f9;
          }
          
          /* Slide 2 Funnel */
          .mythos-metric-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            width: 100%;
            margin-bottom: 1.5rem;
          }
          .mythos-metric-col {
            border-right: 1px dashed #cbd5e1;
            padding-right: 0.75rem;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          .mythos-metric-col:last-child {
            border-right: none;
            padding-right: 0;
          }
          .mythos-funnel-container {
            width: 100%;
            height: 110px;
            margin: 1rem 0;
            background: #f8fafc;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            padding: 0.5rem 2rem;
            display: flex;
            align-items: center;
            box-sizing: border-box;
          }
          
          /* Slide 3 SOAR */
          .mythos-terminal {
            background: #090d16;
            border: 1px solid #1e293b;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            height: 310px;
            box-shadow: inset 0 0 40px rgba(0,0,0,0.85);
          }
          .mythos-terminal-overlay {
            position: absolute;
            bottom: 1rem;
            left: 1rem;
            right: 1rem;
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 8px;
            padding: 0.5rem 0.8rem;
            font-family: monospace;
            font-size: 0.7rem;
            color: #a5b4fc;
            z-index: 10;
          }
          
          /* Navigation Arrows */
          .mythos-nav-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.85);
            border: 1px solid #e2e8f0;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
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
            left: 0.8rem;
          }
          .mythos-nav-arrow.right {
            right: 0.8rem;
          }
          
          /* Dash Pagination Indicator */
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
          @keyframes growBar {
            from { width: 0%; }
            to { width: 100%; }
          }
          
          @media(max-width: 980px) {
            .mythos-grid {
              grid-template-columns: 1fr;
              height: calc(100vh - 120px);
            }
            .mythos-tab-list {
              display: flex;
              flex-direction: row;
              overflow-x: auto;
              overflow-y: hidden;
              height: auto;
              padding-bottom: 0.5rem;
              scroll-snap-type: x mandatory;
            }
            .mythos-tab {
              min-width: 180px;
              scroll-snap-align: start;
              border-left: none;
              border-bottom: 3px solid transparent;
            }
            .mythos-tab.active {
              border-left: none;
              border-bottom: 3px solid #7c3aed;
            }
            .mythos-split-grid {
              grid-template-columns: 1fr;
              grid-template-rows: auto auto;
              gap: 1rem;
            }
            .mythos-split-left {
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
            .mythos-terminal {
              grid-template-columns: 1fr;
              grid-template-rows: 1fr auto;
              height: 200px;
            }
            .mythos-nav-arrow {
              display: none;
            }
          }
        `}</style>

        {/* Ambient Top Title */}
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginBottom: "0.6rem", flexShrink: 0 }}>
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.15rem", color: "#0f172a" }}>
            The <span style={{ background: "linear-gradient(90deg, #7c3aed, #4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Post-Mythos</span> Era Demands More.
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#64748b", maxWidth: "680px", margin: "0 auto", lineHeight: 1.35 }}>
            Machine-speed threat models require machine-speed remediation. Explore the 12 core cockpit pillars of the PosturePilot Risk Operations Center (ROC).
          </p>
        </div>

        {/* Main Grid Workspace */}
        <div className="mythos-grid">
          {/* Left Tabs */}
          <div className="mythos-tab-list">
            {MODULES_DATA.map((feat) => (
              <div 
                key={feat.id} 
                className={`mythos-tab ${activeModuleId === feat.id ? 'active' : ''}`}
                onClick={() => handleManualModuleSelect(feat.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.95rem" }}>{feat.icon}</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: activeModuleId === feat.id ? 800 : 600, color: activeModuleId === feat.id ? "#7c3aed" : "#475569" }}>{feat.title}</span>
                </div>
                <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "0.05rem", paddingLeft: "1.35rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {feat.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Right Slideshow Canvas */}
          <div className="mythos-canvas">
            
            {/* Left & Right Chevrons */}
            <button onClick={handlePrevSlide} className="mythos-nav-arrow left" aria-label="Previous Slide">‹</button>
            <button onClick={handleNextSlide} className="mythos-nav-arrow right" aria-label="Next Slide">›</button>
            
            {/* Slide Body */}
            <div className="mythos-canvas-body" key={`${activeModuleId}-${activeSlide}`}>
              
              {/* SLIDE 1: Core Capabilities & Graphic */}
              {activeSlide === 0 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "#2563eb", letterSpacing: "0.15em", textTransform: "uppercase" }}>COCKPIT PREVIEW</div>
                    <h3 style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.45rem)", fontWeight: 800, color: "#0f172a", margin: "0.2rem 0 0.15rem" }}>
                      {activeModule.title}
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "#475569", margin: 0 }}>
                      {activeModule.tagline}
                    </p>
                  </div>
                  
                  <div className="mythos-split-grid">
                    {/* Left Animated SVG */}
                    <div className="mythos-split-left">
                      
                      {/* Posture Clearance */}
                      {activeModuleId === "posture" && (
                        <div style={{ position: "relative", width: 170, height: 170, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 0 100 100" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(139, 92, 246, 0.08)" strokeWidth="1.5" strokeDasharray="3 3" style={{ animation: "rotateClockwise 30s linear infinite" }} />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="5" strokeDasharray="235 251" strokeLinecap="round" />
                          </svg>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 }}>
                            <span style={{ fontSize: "1.8rem", animation: "float 4s ease-in-out infinite" }}>🛡️</span>
                            <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff", marginTop: "0.1rem", fontFamily: "monospace" }}>94%</div>
                          </div>
                          <div style={{ position: "absolute", width: "100%", height: "2px", background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)", top: "50%", left: 0, animation: "scanline 3s linear infinite", pointerEvents: "none" }} />
                        </div>
                      )}

                      {/* Cloud Altitude */}
                      {activeModuleId === "cloud" && (
                        <div style={{ position: "relative", width: "100%", height: 160, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "0.2rem" }}>
                          <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                            <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                            <line x1="80%" y1="25%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                            <line x1="50%" y1="50%" x2="30%" y2="80%" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                          </svg>
                          <div style={{ display: "flex", justifyContent: "space-around" }}>
                            <div style={{ display: "flex", gap: "0.3rem", alignItems: "center", background: "rgba(30,41,59,0.9)", border: "1px solid rgba(255,255,255,0.08)", padding: "0.25rem 0.5rem", borderRadius: "8px", animation: "float 5s ease-in-out infinite" }}>
                              <span style={{ fontSize: "0.85rem" }}>☁️</span>
                              <span style={{ fontSize: "0.6rem", fontFamily: "monospace", color: "#cbd5e1" }}>AWS-PROD</span>
                            </div>
                            <div style={{ display: "flex", gap: "0.3rem", alignItems: "center", background: "rgba(30,41,59,0.9)", border: "1px solid rgba(255,255,255,0.08)", padding: "0.25rem 0.5rem", borderRadius: "8px", animation: "floatSlow 7s ease-in-out infinite" }}>
                              <span style={{ fontSize: "0.85rem" }}>☁️</span>
                              <span style={{ fontSize: "0.6rem", fontFamily: "monospace", color: "#cbd5e1" }}>GCP-DEV</span>
                            </div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1e293b", border: "2px solid #3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", animation: "pulseGlowBlue 2s infinite" }} />
                            </div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{ display: "flex", gap: "0.3rem", alignItems: "center", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.18)", padding: "0.2rem 0.5rem", borderRadius: "8px" }}>
                              <span style={{ fontSize: "0.7rem", animation: "pulseRed 1.5s infinite" }}>🚨</span>
                              <span style={{ fontSize: "0.58rem", fontFamily: "monospace", color: "#f87171" }}>S3_PUBLIC_EXPOSED</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Network Runway */}
                      {activeModuleId === "network" && (
                        <div style={{ position: "relative", width: 200, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 0 200 150" style={{ width: "100%", height: "100%" }}>
                            <path d="M 20 75 L 80 75 M 120 75 L 180 75" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                            <path d="M 20 110 L 80 90 L 100 75" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" style={{ strokeDashoffset: 4, animation: "dash 2s linear infinite" }} />
                            <g transform="translate(100, 75)">
                              <circle cx="0" cy="0" r="16" fill="#090d16" stroke="#3b82f6" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px rgba(59, 130, 246, 0.4))" }} />
                            </g>
                            <circle cx="20" cy="75" r="3" fill="#10b981" />
                            <circle cx="20" cy="110" r="4" fill="#ef4444" style={{ animation: "pulseRed 1s infinite" }} />
                            <circle cx="180" cy="75" r="3" fill="#10b981" />
                          </svg>
                        </div>
                      )}

                      {/* App Security Check */}
                      {activeModuleId === "appsec" && (
                        <div style={{ position: "relative", width: "100%", height: 160, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0.2rem" }}>
                          <div style={{ width: "85%", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            {[
                              { label: "Commits", count: "1,450 Scanned", w: "100%", c: "#334155" },
                              { label: "SAST Risks", count: "102 Triaged", w: "65%", c: "#eab308" },
                              { label: "SCA Blocks", count: "8 Fails", w: "25%", c: "#ef4444" }
                            ].map((bar, idx) => (
                              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", fontFamily: "monospace" }}>
                                  <span style={{ color: "#cbd5e1" }}>{bar.label}</span>
                                  <span style={{ color: bar.c === "#ef4444" ? "#ef4444" : "#94a3b8" }}>{bar.count}</span>
                                </div>
                                <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden" }}>
                                  <div style={{ width: bar.w, height: "100%", background: bar.c, borderRadius: "3px", animation: "growBar 1.5s ease-out forwards" }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Risk */}
                      {activeModuleId === "ai-risk" && (
                        <div style={{ position: "relative", width: 220, height: 160, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ background: "rgba(15, 23, 42, 0.85)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "6px", width: "95%", padding: "0.3rem 0.5rem", display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.55rem", color: "#64748b", fontFamily: "monospace" }}>
                              <span>PROMPT</span>
                              <span style={{ color: "#ef4444" }}>PII FOUND</span>
                            </div>
                            <div style={{ fontSize: "0.62rem", fontFamily: "monospace", color: "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              "Send audit logs to <span style={{ background: "rgba(239, 68, 68, 0.2)", color: "#ef4444" }}>john@bank.com</span>"
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "linear-gradient(90deg, #7c3aed, #4f46e5)", padding: "0.25rem 0.6rem", borderRadius: "12px", color: "#fff", fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.05em" }}>
                            🛡️ AI POLICY FIREWALL
                          </div>
                          <div style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.15)", borderRadius: "6px", width: "95%", padding: "0.3rem 0.5rem", display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.55rem", color: "#64748b", fontFamily: "monospace" }}>
                              <span>CLEAN PROMPT</span>
                              <span style={{ color: "#10b981" }}>REDACTED</span>
                            </div>
                            <div style={{ fontSize: "0.62rem", fontFamily: "monospace", color: "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              "Send audit logs to <span style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10b981" }}>[REDACTED]</span>"
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Risk Radar */}
                      {activeModuleId === "secure" && (
                        <div style={{ position: "relative", width: 140, height: 140, borderRadius: "50%", border: "2px solid rgba(139, 92, 246, 0.18)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          <div style={{ position: "absolute", width: "100%", height: "100%", border: "2px solid rgba(139, 92, 246, 0.08)", borderRadius: "50%", transform: "scale(0.66)" }} />
                          <div style={{ position: "absolute", width: "100%", height: "100%", border: "2px solid rgba(139, 92, 246, 0.04)", borderRadius: "50%", transform: "scale(0.33)" }} />
                          <div style={{ position: "absolute", top: "50%", left: "50%", width: "50%", height: "50%", background: "conic-gradient(from 0deg, transparent 70%, rgba(139, 92, 246, 0.55) 100%)", transformOrigin: "0 0", animation: "radarSweep 3s linear infinite" }} />
                          <div style={{ position: "absolute", top: "25%", left: "65%", width: 5, height: 5, background: "#ef4444", borderRadius: "50%" }} />
                          <div style={{ position: "relative", zIndex: 10, background: "#090d16", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #8b5cf6" }}>
                            <span style={{ fontSize: "0.95rem" }}>📡</span>
                          </div>
                        </div>
                      )}

                      {/* Identity PreCheck */}
                      {activeModuleId === "identity" && (
                        <div style={{ position: "relative", width: 220, height: 160, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "0.6rem" }}>
                          <div style={{ position: "relative", width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.01)", border: "2px solid rgba(59, 130, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: "1.8rem" }}>🔑</span>
                            <div style={{ position: "absolute", top: -3, left: -3, right: -3, bottom: -3, border: "2px solid transparent", borderTopColor: "#3b82f6", borderBottomColor: "#3b82f6", borderRadius: "50%", animation: "rotateClockwise 3s linear infinite" }} />
                          </div>
                        </div>
                      )}

                      {/* Compliance Checkpoint */}
                      {activeModuleId === "infosec" && (
                        <div style={{ position: "relative", width: 220, height: 160, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "0.6rem" }}>
                          <div style={{ display: "flex", gap: "0.6rem", width: "100%", justifyContent: "center" }}>
                            {[{ label: "SOC2", val: 99, c: "#10b981" }, { label: "ISO", val: 100, c: "#10b981" }].map((m, idx) => (
                              <div key={idx} style={{ position: "relative", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
                        <div style={{ position: "relative", width: 220, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 0 200 150" style={{ width: "100%", height: "100%" }}>
                            <path d="M 100 75 Q 70 45, 40 45" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" style={{ animation: "dash 2s linear infinite" }} />
                            <circle cx="100" cy="75" r="12" fill="#ef4444" stroke="#fff" strokeWidth="1" />
                            <g transform="translate(40, 45)">
                              <rect x="-12" y="-8" width="24" height="16" rx="3" fill="#ef4444" />
                              <text x="0" y="3" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="800" fontFamily="sans-serif">JIRA</text>
                            </g>
                          </svg>
                        </div>
                      )}

                      {/* Fleet Health */}
                      {activeModuleId === "server" && (
                        <div style={{ position: "relative", width: 220, height: 160, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "0.6rem" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.35rem", width: "90%" }}>
                            {Array.from({ length: 8 }).map((_, i) => (
                              <div key={i} style={{ background: "rgba(30, 41, 59, 0.7)", border: `1px solid ${i === 4 ? "#ef4444" : "#10b981"}`, borderRadius: "4px", padding: "0.2rem 0.1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontSize: "0.55rem" }}>🖥️</span>
                                <span style={{ fontSize: "0.4rem", fontFamily: "monospace", color: i === 4 ? "#ef4444" : "#10b981", fontWeight: 900 }}>{i === 4 ? "CVE" : "OK"}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Traffic Control */}
                      {activeModuleId === "traffic" && (
                        <div style={{ position: "relative", width: 200, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg viewBox="0 0 200 150" style={{ width: "100%", height: "100%" }}>
                            <path d="M 10 75 Q 40 85, 70 75 T 110 32 T 150 90 T 190 75" fill="none" stroke="#f59e0b" strokeWidth="2" style={{ filter: "drop-shadow(0 0 3px #f59e0b)" }} />
                            <circle cx="110" cy="32" r="3.5" fill="#f59e0b" style={{ animation: "pulseGlow 2s infinite" }} />
                          </svg>
                        </div>
                      )}

                      {/* Flight Telemetry (KPIs) */}
                      {activeModuleId === "kpi" && (
                        <div style={{ position: "relative", width: "90%", height: 140, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <div style={{ flex: 1, minHeight: 70 }}>
                            <svg viewBox="0 0 300 100" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                              <path d="M 0 20 L 50 25 L 100 45 L 150 78 L 200 84 L 250 88 L 300 90" fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
                              <circle cx="300" cy="90" r="3" fill="#10b981" />
                            </svg>
                          </div>
                        </div>
                      )}

                    </div>
                    
                    {/* Right Features List */}
                    <div className="mythos-split-right">
                      <div style={{ fontSize: "0.62rem", fontWeight: 800, color: "#7c3aed", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                        CORE CAPABILITIES
                      </div>
                      <div>
                        {activeModule.coreFeatures.map((feat, idx) => (
                          <div className="mythos-feature-item" key={idx}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <div>
                              <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#0f172a" }}>{feat.name}</div>
                              <div style={{ fontSize: "0.68rem", color: "#64748b", marginTop: "0.05rem", lineHeight: 1.3 }}>{feat.desc}</div>
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
                  <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
                    <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "#2563eb", letterSpacing: "0.15em", textTransform: "uppercase" }}>EXPOSURE FILTRATION</div>
                    <h3 style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.45rem)", fontWeight: 800, color: "#0f172a", margin: "0.2rem 0" }}>
                      Prioritization Pipeline
                    </h3>
                    <p style={{ fontSize: "0.8rem", color: "#475569", margin: 0 }}>
                      How PosturePilot filters vulnerabilities down to remediation tasks.
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="mythos-metric-grid">
                    {activeModule.funnelMetrics.map((m, idx) => (
                      <div className="mythos-metric-col" key={idx}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ fontSize: "1.8rem", fontWeight: 950, color: idx === 3 ? "#15803d" : "#991b1b", fontFamily: "monospace", lineHeight: 1 }}>
                            {m.val}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#1e293b", margin: "0.05rem 0" }}>
                          {m.label}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                          {m.desc.map((d, dIdx) => (
                            <div key={dIdx} style={{ fontSize: "0.72rem", color: "#64748b", lineHeight: 1.3 }}>
                              ▪ {d}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Horizontal SVG Funnel Graph */}
                  <div className="mythos-funnel-container">
                    <svg viewBox="0 0 800 90" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                      <defs>
                        <linearGradient id="seg1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                        <linearGradient id="seg2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                        <linearGradient id="seg3" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                        <linearGradient id="seg4" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                      
                      {/* Segment 1 */}
                      <polygon points="0,5 180,15 180,75 0,85" fill="url(#seg1)" />
                      <text x="90" y="50" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800" fontFamily="sans-serif">
                        {activeModule.funnelStages[0]}
                      </text>
                      
                      {/* Segment 2 */}
                      <polygon points="195,17 375,26 375,64 195,73" fill="url(#seg2)" />
                      <text x="285" y="50" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800" fontFamily="sans-serif">
                        {activeModule.funnelStages[1]}
                      </text>
                      
                      {/* Segment 3 */}
                      <polygon points="390,28 570,35 570,55 390,62" fill="url(#seg3)" />
                      <text x="480" y="50" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800" fontFamily="sans-serif">
                        {activeModule.funnelStages[2]}
                      </text>
                      
                      {/* Segment 4 */}
                      <polygon points="585,36 765,39 765,51 585,54" fill="url(#seg4)" />
                      <text x="675" y="50" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800" fontFamily="sans-serif">
                        {activeModule.funnelStages[3]}
                      </text>
                    </svg>
                  </div>
                </div>
              )}

              {/* SLIDE 3: Enterprise Integration / Telemetry Checklist */}
              {activeSlide === 2 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "#15803d", letterSpacing: "0.15em", textTransform: "uppercase" }}>INTEGRATIONS & WORKFLOWS</div>
                    <h3 style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.45rem)", fontWeight: 800, color: "#0f172a", margin: "0.2rem 0 0.15rem" }}>
                      Enterprise Automation
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "#475569", margin: 0 }}>
                      Connect endpoints directly to enterprise dashboards.
                    </p>
                  </div>

                  <div className="mythos-split-grid">
                    {/* Left Terminals Graphic */}
                    <div className="mythos-terminal">
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontFamily: "monospace", fontSize: "0.72rem", color: "#cbd5e1", width: "90%", padding: "1rem", overflow: "hidden" }}>
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
                      <div style={{ fontSize: "0.62rem", fontWeight: 800, color: "#10b981", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                        ENTERPRISE CAPABILITIES
                      </div>
                      
                      {activeModule.enterpriseFeatures.map((feat, idx) => (
                        <div className="mythos-feature-item" key={idx} style={{ background: "rgba(16, 185, 129, 0.02)", borderColor: "rgba(16, 185, 129, 0.15)" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <div>
                            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#0f172a" }}>{feat.name}</div>
                            <div style={{ fontSize: "0.68rem", color: "#64748b", marginTop: "0.05rem", lineHeight: 1.3 }}>{feat.desc}</div>
                          </div>
                        </div>
                      ))}

                      {/* CTA Upgrade Banner */}
                      <div style={{ marginTop: "0.4rem", padding: "0.6rem 0.8rem", background: "rgba(124, 58, 237, 0.06)", border: "1px solid rgba(124, 58, 237, 0.15)", borderRadius: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                          <div>
                            <div style={{ fontSize: "0.62rem", fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.05em" }}>UPGRADE TO ACCESS</div>
                            <div style={{ fontSize: "0.68rem", color: "#475569", marginTop: "0.02rem" }}>Unlock complete ROC features.</div>
                          </div>
                          <button 
                            style={{ 
                              background: "linear-gradient(135deg, #7c3aed, #4f46e5)", 
                              border: "none", 
                              color: "#fff", 
                              padding: "0.3rem 0.6rem", 
                              borderRadius: "6px", 
                              fontSize: "0.68rem", 
                              fontWeight: 700, 
                              cursor: "pointer", 
                              boxShadow: "0 2px 6px rgba(124, 58, 237, 0.2)"
                            }} 
                            onClick={() => alert("Upgrade request sent! Contact billing at billing@posturepilot.com to activate this pilot module.")}
                          >
                            Upgrade
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Centered slide controls bar matching the screenshots */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1.2rem", flexShrink: 0 }}>
                {/* Blue solid play button from screenshot */}
                <button 
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  style={{ 
                    background: "none", 
                    border: "none", 
                    cursor: "pointer", 
                    fontSize: "1rem", 
                    color: "#2563eb", // blue play button from screenshots
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

                {/* Horizontal navigation dashes from screenshot */}
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

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
