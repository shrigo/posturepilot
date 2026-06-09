"use client";
import React, { useState, useEffect, useRef } from "react";

interface FeatureModule {
  id: string;
  title: string;
  icon: string;
  desc: string;
  features: string[];
}

const FEATURES: FeatureModule[] = [
  {
    id: "posture",
    title: "Posture Clearance",
    icon: "🛡️",
    desc: "Joint posture index & real-time clearance gates.",
    features: [
      "Joint Posture Index (JPI) Scoring",
      "Real-time Clearance Gate Validation",
      "Dynamic Threat Intelligence Sync",
      "Systemic Vulnerability Remediation",
      "Executive Flight Deck Summary"
    ]
  },
  {
    id: "cloud",
    title: "Cloud Altitude",
    icon: "☁️",
    desc: "Multicloud asset drift, buckets & exposed credentials.",
    features: [
      "Unified Multi-Cloud Inventory (AWS, Azure, GCP)",
      "IAM Privilege Drift & Over-permissions Detection",
      "Public S3/Storage Bucket Scanner",
      "Automated Leakage Alerts (API Keys, Secrets)",
      "Continuous CSPM Baseline Drift Auditing"
    ]
  },
  {
    id: "network",
    title: "Network Runway",
    icon: "🌐",
    desc: "Perimeter log analysis, intrusion feeds & VPN health.",
    features: [
      "Perimeter Traffic & Firewall Log Ingestion",
      "IDS/IPS Real-time Threat Signatures",
      "IP Reputation & Banned Range Geo-blocking",
      "VPN Gateway Session & Tunnel Health Monitor",
      "Autonomous Network Segregation Triggers"
    ]
  },
  {
    id: "appsec",
    title: "App Security Check",
    icon: "🔐",
    desc: "Vulnerability funnel, OWASP scan & pipeline block.",
    features: [
      "SAST/DAST Tool Orchestration & Consolidation",
      "Software Bill of Materials (SBOM) Generation",
      "Outdated Package & Vulnerable Library Auditing",
      "CI/CD Pipeline Quality Gates & Fail-Safe Blocks",
      "OWASP Top 10 Web Application Remediation Plans"
    ]
  },
  {
    id: "ai-risk",
    title: "AI Risk",
    icon: "🤖",
    desc: "Shadow AI models & unvetted LLM usage monitoring.",
    features: [
      "Shadow AI Usage & Unvetted API Discovery",
      "LLM Security & Model Vulnerability Scans",
      "Active AI Policy Firewall (Data Guard)",
      "Prompt Leakage & PII Redaction Engine",
      "AI Agent Permission & Run-time Sandboxing"
    ]
  },
  {
    id: "secure",
    title: "Risk Radar",
    icon: "📡",
    desc: "EPSS prioritization, noise reduction & triage engine.",
    features: [
      "EPSS & CISA KEV Exploitation Predictor",
      "Asset-Context Severity Scoring Offset",
      "Vulnerability Noise Filtering (95% Suppression)",
      "Automated Triage Routing & Priority Queues",
      "Historical Remediation Velocity Predictor"
    ]
  },
  {
    id: "identity",
    title: "Identity PreCheck",
    icon: "🔑",
    desc: "MFA coverage, SSO auditing & privilege escalation.",
    features: [
      "SSO Directory Auditing (Okta, Entra ID)",
      "Zero-Trust MFA Gaps & Enforcement Checker",
      "Orphaned Account & Dormant Key Deprovisioner",
      "Privilege Escalation & Excess Admin Detection",
      "Session Hijacking & Impersonation Alerting"
    ]
  },
  {
    id: "infosec",
    title: "Compliance Checkpoint",
    icon: "📋",
    desc: "Continuous SOC2/ISO27001 readiness & policies.",
    features: [
      "SOC 2 Type II / ISO 27001 Controls Mapping",
      "PCI-DSS / HIPAA Audit Evidence Collector",
      "Automated Policy Violation Notifications",
      "Access Control Audits & Access Reviews",
      "Real-time Readiness Score & Gap Analysis"
    ]
  },
  {
    id: "dispatch",
    title: "Dispatch Center",
    icon: "🚨",
    desc: "SOAR execution, Jira & ServiceNow bi-sync.",
    features: [
      "SOAR Automated Incident Runbook Execution",
      "Bidirectional Jira & ServiceNow Ticketing Sync",
      "Incident Room Creation & Auto-responder Assignments",
      "Slack/Teams Real-time Interactive Slack-Bots",
      "Post-Incident Root Cause Report Automation"
    ]
  },
  {
    id: "server",
    title: "Fleet Health",
    icon: "🖥️",
    desc: "Host patching status, EDR agents & vulnerabilities.",
    features: [
      "Endpoint EDR Coverage Verification (CS/S1)",
      "Host Operating System Patch Level Auditing",
      "Unpatched CVE Discovery on Critical Infrastructure",
      "Idle virtual machine (Zombie server) scanner",
      "System configuration baseline compliance monitoring"
    ]
  },
  {
    id: "traffic",
    title: "Traffic Control",
    icon: "🎛️",
    desc: "Flow anomaly, bandwidth usage & geo-fencing.",
    features: [
      "Network Flow Traffic & Anomaly Detection",
      "Payload Bandwidth Peak & Volume Analyzer",
      "Inbound/Outbound Port Risk Matrix Validation",
      "Geo-location Packet Risk Profiling",
      "Deep Packet Inspection & Protocol Classification"
    ]
  },
  {
    id: "kpi",
    title: "Flight Telemetry (KPIs)",
    icon: "📊",
    desc: "MTTA/MTTR tracking, patch SLA & team velocity.",
    features: [
      "Mean Time to Acknowledge (MTTA) Tracking",
      "Mean Time to Remediate (MTTR) Tracking",
      "Patch SLA Compliance & Grace Period Monitoring",
      "Team Risk Reduction Velocity Analytics",
      "Executive Dashboard Reporting & Trend Analysis"
    ]
  }
];

export default function MythosPromo({ onClose }: { onClose: () => void }) {
  const [activeFeature, setActiveFeature] = useState<string>(FEATURES[0].id);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play logic
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setActiveFeature((current) => {
          const currentIndex = FEATURES.findIndex((f) => f.id === current);
          const nextIndex = (currentIndex + 1) % FEATURES.length;
          return FEATURES[nextIndex].id;
        });
      }, 6000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying]);

  const handleManualSelect = (id: string) => {
    setActiveFeature(id);
    setIsAutoPlaying(false);
  };

  const activeModule = FEATURES.find((f) => f.id === activeFeature) || FEATURES[0];

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Backdrop */}
      <div 
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(8px)" }} 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        style={{
          background: "#ffffff",
          color: "#0f172a",
          width: "100vw",
          maxWidth: "none",
          height: "100vh",
          maxHeight: "none",
          borderRadius: "0",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Inter, sans-serif",
          display: "flex",
          flexDirection: "column",
          padding: "1.2rem 1.8rem",
          boxSizing: "border-box"
        }}
        id="mythos-promo"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: "1.2rem", right: "1.5rem", background: "#f1f5f9", border: "none", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", zIndex: 50, transition: "background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"}
          onMouseLeave={e => e.currentTarget.style.background = "#f1f5f9"}
        >
          ✕
        </button>

        <style>{`
          .mythos-grid {
            display: grid;
            grid-template-columns: 310px 1fr;
            gap: 1.5rem;
            max-width: 1600px;
            margin: 0 auto;
            position: relative;
            z-index: 10;
            flex: 1;
            height: calc(100vh - 120px);
            width: 100%;
            min-height: 0;
          }
          .mythos-tab-list {
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
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
            padding: 0.4rem 0.6rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid transparent;
            display: flex;
            flex-direction: column;
            gap: 0.05rem;
            flex-shrink: 0;
          }
          .mythos-tab:hover {
            background: #f8fafc;
          }
          .mythos-tab.active {
            background: rgba(124, 58, 237, 0.05);
            border: 1px solid rgba(124, 58, 237, 0.2);
            box-shadow: 0 4px 12px rgba(124, 58, 237, 0.04);
          }
          .mythos-screen-container {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
            height: 100%;
            min-height: 0;
            display: flex;
            flex-direction: column;
          }
          .mythos-screen-header {
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            padding: 0.8rem 1.2rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex-shrink: 0;
          }
          .mythos-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
          }
          .mythos-screen-content {
            flex: 1;
            min-height: 0;
            position: relative;
            display: flex;
            background: #0f172a;
            animation: mythosFadeIn 0.3s ease-out forwards;
          }
          .mythos-screen-split {
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            width: 100%;
            height: 100%;
          }
          .mythos-graphic-pane {
            background: #090d16;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            border-right: 1px solid #1e293b;
            padding: 1.5rem;
          }
          .mythos-features-pane {
            background: #0f172a;
            padding: 1.8rem 2.2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: #f8fafc;
          }

          @keyframes mythosFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes radarSweep {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.45); }
            70% { box-shadow: 0 0 0 12px rgba(124, 58, 237, 0); }
            100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
          }
          @keyframes pulseGlowBlue {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.45); }
            70% { box-shadow: 0 0 0 12px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          }
          @keyframes scanline {
            0% { transform: translateY(-130px); }
            50% { transform: translateY(130px); }
            100% { transform: translateY(-130px); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes rotateClockwise {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes rotateCounterClockwise {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
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
              height: calc(100vh - 160px);
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
              min-width: 200px;
              scroll-snap-align: start;
            }
            .mythos-screen-split {
              grid-template-columns: 1fr;
              grid-template-rows: 1fr auto;
            }
            .mythos-features-pane {
              padding: 1.2rem;
            }
          }
        `}</style>

        {/* Background ambient glow */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", width: "80vw", height: "80vw", background: "radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 60%)", pointerEvents: "none", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginBottom: "0.8rem", flexShrink: 0 }}>
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.2rem", color: "#0f172a" }}>
            The <span style={{ background: "linear-gradient(90deg, #7c3aed, #4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Post-Mythos</span> Era Demands More.
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#64748b", maxWidth: "680px", margin: "0 auto", lineHeight: 1.35 }}>
            Machine-speed threats require autopilot defense. Explore the 12 core cockpit pillars of the PosturePilot Risk Operations Center (ROC).
          </p>
        </div>

        <div className="mythos-grid">
          {/* Left Tabs */}
          <div className="mythos-tab-list">
            {FEATURES.map((feat) => (
              <div 
                key={feat.id} 
                className={`mythos-tab ${activeFeature === feat.id ? 'active' : ''}`}
                onClick={() => handleManualSelect(feat.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "1rem", filter: activeFeature === feat.id ? "drop-shadow(0 0 4px rgba(124,58,237,0.4))" : "none" }}>{feat.icon}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: activeFeature === feat.id ? 800 : 600, color: activeFeature === feat.id ? "#0f172a" : "#475569" }}>{feat.title}</span>
                </div>
                <div style={{ fontSize: "0.72rem", color: activeFeature === feat.id ? "#6d28d9" : "#64748b", marginTop: "0.05rem", paddingLeft: "1.4rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {feat.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Right Screen Display */}
          <div className="mythos-screen-container">
            <div className="mythos-screen-header">
              <div className="mythos-dot" style={{ background: "#ef4444" }} />
              <div className="mythos-dot" style={{ background: "#eab308" }} />
              <div className="mythos-dot" style={{ background: "#22c55e" }} />
              <div style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "#64748b", marginLeft: "0.5rem" }}>
                ~/posturepilot/roc/{activeFeature}.sh
              </div>
              {isAutoPlaying && (
                <div style={{ marginLeft: "auto", fontSize: "0.65rem", color: "#818cf8", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span className="mythos-dot" style={{ background: "#818cf8", width: 6, height: 6, animation: "pulseGlow 2s infinite" }}/> AUTO PLAYING
                </div>
              )}
            </div>

            <div className="mythos-screen-content" key={activeFeature}>
              <div className="mythos-screen-split">
                
                {/* Visual Pane (Left) */}
                <div className="mythos-graphic-pane">
                  
                  {/* 1. Posture Clearance */}
                  {activeFeature === "posture" && (
                    <div style={{ position: "relative", width: 230, height: 230, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg viewBox="0 0 100 100" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                        <defs>
                          <linearGradient id="postureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(139, 92, 246, 0.08)" strokeWidth="1" strokeDasharray="3 3" style={{ animation: "rotateClockwise 30s linear infinite" }} />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#postureGrad)" strokeWidth="5" strokeDasharray="230 251" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="33" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="1 4" style={{ animation: "rotateCounterClockwise 15s linear infinite" }} />
                      </svg>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5, textAlign: "center" }}>
                        <span style={{ fontSize: "2.4rem", filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))", animation: "float 4s ease-in-out infinite" }}>🛡️</span>
                        <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", marginTop: "0.15rem", fontFamily: "monospace" }}>94<span style={{ fontSize: "0.9rem", color: "#10b981" }}>%</span></div>
                        <div style={{ fontSize: "0.6rem", color: "#10b981", fontWeight: 800, letterSpacing: "0.12em", background: "rgba(16,185,129,0.1)", padding: "0.1rem 0.4rem", borderRadius: "4px", border: "1px solid rgba(16,185,129,0.2)", marginTop: "0.15rem" }}>PASSING</div>
                      </div>
                      <div style={{ position: "absolute", width: "100%", height: "2px", background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)", top: "50%", left: 0, animation: "scanline 4s linear infinite", pointerEvents: "none" }} />
                    </div>
                  )}

                  {/* 2. Cloud Altitude */}
                  {activeFeature === "cloud" && (
                    <div style={{ position: "relative", width: "100%", height: 210, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "0.5rem" }}>
                      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                        <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        <line x1="80%" y1="25%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        <line x1="50%" y1="50%" x2="30%" y2="80%" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="50%" y1="50%" x2="70%" y2="80%" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                      </svg>
                      
                      <div style={{ display: "flex", justifyContent: "space-around", zIndex: 2 }}>
                        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", background: "rgba(30,41,59,0.9)", border: "1px solid rgba(255,255,255,0.08)", padding: "0.3rem 0.6rem", borderRadius: "10px", animation: "float 6s ease-in-out infinite" }}>
                          <span style={{ fontSize: "1rem" }}>☁️</span>
                          <span style={{ fontSize: "0.68rem", fontWeight: 700, fontFamily: "monospace", color: "#cbd5e1" }}>AWS-PROD</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", background: "rgba(30,41,59,0.9)", border: "1px solid rgba(255,255,255,0.08)", padding: "0.3rem 0.6rem", borderRadius: "10px", animation: "floatSlow 8s ease-in-out infinite" }}>
                          <span style={{ fontSize: "1rem" }}>☁️</span>
                          <span style={{ fontSize: "0.68rem", fontWeight: 700, fontFamily: "monospace", color: "#cbd5e1" }}>GCP-DEV</span>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "center", zIndex: 2 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#1e293b", border: "2px solid #3b82f6", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(59, 130, 246, 0.25)" }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3b82f6", animation: "pulseGlowBlue 2s infinite" }} />
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-around", zIndex: 2 }}>
                        <div style={{ display: "flex", gap: "0.3rem", alignItems: "center", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.18)", padding: "0.3rem 0.6rem", borderRadius: "10px" }}>
                          <span style={{ fontSize: "0.75rem", animation: "pulseRed 1.5s infinite" }}>🚨</span>
                          <span style={{ fontSize: "0.62rem", fontWeight: 700, fontFamily: "monospace", color: "#f87171" }}>S3_PUBLIC_EXPOSED</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.3rem", alignItems: "center", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.18)", padding: "0.3rem 0.6rem", borderRadius: "10px" }}>
                          <span style={{ fontSize: "0.75rem" }}>🔒</span>
                          <span style={{ fontSize: "0.62rem", fontWeight: 700, fontFamily: "monospace", color: "#34d399" }}>RDS_ENCRYPTED</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Network Runway */}
                  {activeFeature === "network" && (
                    <div style={{ position: "relative", width: 250, height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg viewBox="0 0 200 150" style={{ width: "100%", height: "100%" }}>
                        <defs>
                          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                          </linearGradient>
                        </defs>
                        <path d="M 20 75 L 80 75 M 120 75 L 180 75" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                        <path d="M 20 30 L 60 50 L 100 75 L 140 100 L 180 120" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                        <path d="M 20 120 L 60 100 L 100 75 L 140 50 L 180 30" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                        
                        <path d="M 20 110 L 80 90 L 100 75" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" style={{ strokeDashoffset: 4, animation: "dash 2s linear infinite" }} />
                        
                        <g transform="translate(100, 75)">
                          <circle cx="0" cy="0" r="18" fill="#090d16" stroke="#3b82f6" strokeWidth="2" style={{ filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))" }} />
                          <path d="M -6 -6 L 6 -6 L 6 -3 C 6 3 0 7 0 7 C 0 7 -6 3 -6 -3 Z" fill="url(#shieldGrad)" />
                        </g>
                        
                        <circle cx="20" cy="30" r="3.5" fill="#3b82f6" />
                        <circle cx="20" cy="75" r="3.5" fill="#10b981" />
                        <circle cx="20" cy="110" r="4.5" fill="#ef4444" style={{ animation: "pulseRed 1s infinite" }} />
                        
                        <circle cx="180" cy="30" r="3.5" fill="#10b981" />
                        <circle cx="180" cy="75" r="3.5" fill="#10b981" />
                        <circle cx="180" cy="120" r="3.5" fill="#10b981" />
                      </svg>
                      <div style={{ position: "absolute", bottom: "0px", fontSize: "0.62rem", fontFamily: "monospace", color: "#f87171", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.15)", padding: "0.2rem 0.4rem", borderRadius: "4px" }}>
                        SHIELD: 194.26.84.* BLOCKED
                      </div>
                    </div>
                  )}

                  {/* 4. App Security Check */}
                  {activeFeature === "appsec" && (
                    <div style={{ position: "relative", width: "100%", height: 210, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0.5rem" }}>
                      <div style={{ width: "90%", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {[
                          { label: "Code Commits", count: "1,450 Scanned", w: "100%", c: "#334155" },
                          { label: "SAST Vulnerabilities", count: "102 Triaged", w: "65%", c: "#eab308" },
                          { label: "SCA Blocks", count: "8 Pipeline Fails", w: "25%", c: "#ef4444" }
                        ].map((bar, idx) => (
                          <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", fontFamily: "monospace" }}>
                              <span style={{ color: "#cbd5e1", fontWeight: 700 }}>{bar.label}</span>
                              <span style={{ color: bar.c === "#ef4444" ? "#ef4444" : "#94a3b8" }}>{bar.count}</span>
                            </div>
                            <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
                              <div style={{ width: bar.w, height: "100%", background: bar.c, borderRadius: "4px", animation: "growBar 1.5s ease-out forwards" }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.18)", borderRadius: "6px", padding: "0.3rem 0.5rem" }}>
                        <span style={{ fontSize: "0.7rem", animation: "pulseRed 1s infinite" }}>🛑</span>
                        <span style={{ fontSize: "0.6rem", fontFamily: "monospace", color: "#f87171" }}>PIPELINE LOCKED: CVE-2026-4437 Blocked</span>
                      </div>
                    </div>
                  )}

                  {/* 5. AI Risk */}
                  {activeFeature === "ai-risk" && (
                    <div style={{ position: "relative", width: 260, height: 210, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "0.6rem" }}>
                      <div style={{ background: "rgba(15, 23, 42, 0.85)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "8px", width: "95%", padding: "0.4rem 0.6rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", color: "#64748b", fontFamily: "monospace" }}>
                          <span>PROMPT INBOUND</span>
                          <span style={{ color: "#ef4444", fontWeight: 700 }}>PII SHIELD ACTIVE</span>
                        </div>
                        <div style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          "Analyze file with email <span style={{ background: "rgba(239, 68, 68, 0.2)", border: "1px dashed #ef4444", color: "#ef4444", padding: "0 2px" }}>john@bank.com</span>..."
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "linear-gradient(90deg, #7c3aed, #4f46e5)", padding: "0.3rem 0.8rem", borderRadius: "16px", color: "#fff", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.05em", boxShadow: "0 3px 8px rgba(124, 58, 237, 0.35)", animation: "float 4s ease-in-out infinite" }}>
                        🤖 AI POLICY FIREWALL
                      </div>
                      
                      <div style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.18)", borderRadius: "8px", width: "95%", padding: "0.4rem 0.6rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", color: "#64748b", fontFamily: "monospace" }}>
                          <span>CLEAN PROMPT TO LLM</span>
                          <span style={{ color: "#10b981", fontWeight: 700 }}>REDACTED</span>
                        </div>
                        <div style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          "Analyze file with email <span style={{ background: "rgba(16, 185, 129, 0.2)", border: "1px solid #10b981", color: "#10b981", padding: "0 2px" }}>[REDACTED_EMAIL]</span>..."
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 6. Risk Radar */}
                  {activeFeature === "secure" && (
                    <div style={{ position: "relative", width: 190, height: 190, borderRadius: "50%", border: "2px solid rgba(139, 92, 246, 0.18)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      <div style={{ position: "absolute", width: "100%", height: "100%", border: "2px solid rgba(139, 92, 246, 0.08)", borderRadius: "50%", transform: "scale(0.66)" }} />
                      <div style={{ position: "absolute", width: "100%", height: "100%", border: "2px solid rgba(139, 92, 246, 0.04)", borderRadius: "50%", transform: "scale(0.33)" }} />
                      <div style={{ position: "absolute", top: "50%", left: "50%", width: "50%", height: "50%", background: "conic-gradient(from 0deg, transparent 70%, rgba(139, 92, 246, 0.55) 100%)", transformOrigin: "0 0", animation: "radarSweep 3s linear infinite" }} />
                      
                      <div style={{ position: "absolute", top: "25%", left: "65%", width: 6, height: 6, background: "#ef4444", borderRadius: "50%", filter: "drop-shadow(0 0 5px #ef4444)", animation: "pulseRed 1s infinite" }} />
                      <div style={{ position: "absolute", top: "65%", left: "30%", width: 5, height: 5, background: "#f59e0b", borderRadius: "50%" }} />
                      <div style={{ position: "absolute", top: "80%", left: "60%", width: 4, height: 4, background: "#10b981", borderRadius: "50%" }} />
                      
                      <div style={{ position: "relative", zIndex: 10, background: "#090d16", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #8b5cf6" }}>
                        <span style={{ fontSize: "1.1rem" }}>📡</span>
                      </div>
                    </div>
                  )}

                  {/* 7. Identity PreCheck */}
                  {activeFeature === "identity" && (
                    <div style={{ position: "relative", width: 250, height: 200, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "0.8rem" }}>
                      <div style={{ position: "relative", width: 68, height: 68, borderRadius: "50%", background: "rgba(255,255,255,0.01)", border: "2px solid rgba(59, 130, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "2.2rem", filter: "drop-shadow(0 0 6px rgba(59,130,246,0.4))" }}>🔑</span>
                        <div style={{ position: "absolute", top: -3, left: -3, right: -3, bottom: -3, border: "2px solid transparent", borderTopColor: "#3b82f6", borderBottomColor: "#3b82f6", borderRadius: "50%", animation: "rotateClockwise 3s linear infinite" }} />
                      </div>
                      
                      <div style={{ width: "90%", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        {[
                          { l: "Okta Identity Sync", s: "CONNECTED", c: "#10b981" },
                          { l: "Privileged Access Drift", s: "2 DRIFTING", c: "#f59e0b" },
                          { l: "Zero-Trust MFA Gaps", s: "SECURED", c: "#10b981" }
                        ].map((item, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)", padding: "0.3rem 0.5rem", borderRadius: "6px" }}>
                            <span style={{ fontSize: "0.68rem", color: "#cbd5e1" }}>{item.l}</span>
                            <span style={{ fontSize: "0.58rem", fontFamily: "monospace", color: item.c, fontWeight: 800, background: `${item.c}1A`, padding: "0.08rem 0.35rem", borderRadius: "4px" }}>{item.s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 8. Compliance Checkpoint */}
                  {activeFeature === "infosec" && (
                    <div style={{ position: "relative", width: 250, height: 200, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "0.8rem" }}>
                      <div style={{ display: "flex", gap: "0.8rem", width: "100%", justifyContent: "center" }}>
                        {[
                          { label: "SOC2", val: 99, c: "#10b981" },
                          { label: "ISO", val: 100, c: "#10b981" },
                          { label: "PCI", val: 95, c: "#3b82f6" }
                        ].map((m, idx) => (
                          <div key={idx} style={{ position: "relative", width: 62, height: 62, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                              <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
                              <circle cx="18" cy="18" r="15" fill="none" stroke={m.c} strokeWidth="2.5" strokeDasharray={`${m.val} 100`} strokeLinecap="round" />
                            </svg>
                            <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
                              <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#fff", fontFamily: "monospace" }}>{m.val}%</span>
                              <span style={{ fontSize: "0.5rem", color: "#94a3b8", fontWeight: 700 }}>{m.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.15)", borderRadius: "6px", padding: "0.4rem 0.6rem", width: "90%", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontSize: "0.8rem", color: "#10b981" }}>✓</span>
                        <span style={{ fontSize: "0.62rem", fontFamily: "monospace", color: "#cbd5e1" }}>Evidence collector verified SOC2 ready</span>
                      </div>
                    </div>
                  )}

                  {/* 9. Dispatch Center */}
                  {activeFeature === "dispatch" && (
                    <div style={{ position: "relative", width: 250, height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg viewBox="0 0 200 150" style={{ width: "100%", height: "100%" }}>
                        <defs>
                          <linearGradient id="centralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                        <path d="M 100 75 Q 70 45, 40 45" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" style={{ animation: "dash 2s linear infinite" }} />
                        <path d="M 100 75 Q 70 105, 40 105" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        <path d="M 100 75 L 160 45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        <path d="M 100 75 L 160 105" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        
                        <circle cx="100" cy="75" r="14" fill="url(#centralGrad)" stroke="#fff" strokeWidth="1" style={{ filter: "drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))" }} />
                        
                        <g transform="translate(40, 45)">
                          <rect x="-14" y="-9" width="28" height="18" rx="3" fill="#ef4444" />
                          <text x="0" y="3" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="800" fontFamily="sans-serif">JIRA</text>
                        </g>
                        <g transform="translate(40, 105)">
                          <rect x="-14" y="-9" width="28" height="18" rx="3" fill="#334155" />
                          <text x="0" y="3" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="800" fontFamily="sans-serif">SLACK</text>
                        </g>
                        <g transform="translate(160, 45)">
                          <rect x="-14" y="-9" width="28" height="18" rx="3" fill="#334155" />
                          <text x="0" y="3" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="800" fontFamily="sans-serif">TEAMS</text>
                        </g>
                        <g transform="translate(160, 105)">
                          <rect x="-14" y="-9" width="28" height="18" rx="3" fill="#334155" />
                          <text x="0" y="3" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="800" fontFamily="sans-serif">PAGER</text>
                        </g>
                      </svg>
                      <div style={{ position: "absolute", bottom: "0px", fontSize: "0.6rem", fontFamily: "monospace", color: "#cbd5e1", background: "rgba(255,255,255,0.04)", padding: "0.15rem 0.35rem", borderRadius: "3px" }}>
                        Incident SOAR Auto-dispatch Active
                      </div>
                    </div>
                  )}

                  {/* 10. Fleet Health */}
                  {activeFeature === "server" && (
                    <div style={{ position: "relative", width: 250, height: 200, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "0.8rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.45rem", width: "90%" }}>
                        {Array.from({ length: 12 }).map((_, i) => {
                          let color = "#10b981";
                          let text = "OK";
                          let pulse = false;
                          if (i === 4) {
                            color = "#ef4444";
                            text = "CVE";
                            pulse = true;
                          } else if (i === 9) {
                            color = "#f59e0b";
                            text = "UPDT";
                            pulse = true;
                          }
                          return (
                            <div key={i} style={{ 
                              background: "rgba(30, 41, 59, 0.7)", 
                              border: `1px solid ${color}`, 
                              borderRadius: "5px", 
                              padding: "0.3rem 0.15rem", 
                              display: "flex", 
                              flexDirection: "column", 
                              alignItems: "center", 
                              justifyContent: "center",
                              boxShadow: pulse ? `0 0 6px ${color}` : "none",
                              animation: pulse ? "pulseRed 1.5s infinite" : "none"
                            }}>
                              <span style={{ fontSize: "0.65rem" }}>🖥️</span>
                              <span style={{ fontSize: "0.45rem", fontFamily: "monospace", color: "#cbd5e1", marginTop: "0.08rem" }}>N-{i+1}</span>
                              <span style={{ fontSize: "0.4rem", fontFamily: "monospace", color, fontWeight: 900 }}>{text}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div style={{ width: "90%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ flex: 1, height: "5px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden", marginRight: "0.75rem" }}>
                          <div style={{ width: "91.6%", height: "100%", background: "#10b981", borderRadius: "3px" }} />
                        </div>
                        <span style={{ fontSize: "0.6rem", fontFamily: "monospace", color: "#cbd5e1", fontWeight: 700, whiteSpace: "nowrap" }}>11/12 Compliant</span>
                      </div>
                    </div>
                  )}

                  {/* 11. Traffic Control */}
                  {activeFeature === "traffic" && (
                    <div style={{ position: "relative", width: 250, height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg viewBox="0 0 200 150" style={{ width: "100%", height: "100%" }}>
                        <defs>
                          <pattern id="gridSub" width="15" height="15" patternUnits="userSpaceOnUse">
                            <path d="M 15 0 L 0 0 0 15" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.8"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#gridSub)" />
                        
                        <path d="M 10 75 Q 50 20, 100 75 T 190 75" fill="none" stroke="rgba(59, 130, 246, 0.12)" strokeWidth="2" />
                        <path d="M 10 75 Q 50 115, 100 75 T 190 75" fill="none" stroke="rgba(139, 92, 246, 0.12)" strokeWidth="2" strokeDasharray="3" />
                        
                        <path d="M 10 75 Q 40 85, 70 75 T 110 32 T 150 90 T 190 75" fill="none" stroke="#f59e0b" strokeWidth="2" style={{ filter: "drop-shadow(0 0 3px #f59e0b)" }} />
                        
                        <circle cx="110" cy="32" r="4.5" fill="#f59e0b" style={{ animation: "pulseGlow 2s infinite" }} />
                        <line x1="110" y1="0" x2="110" y2="150" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="0.5" strokeDasharray="2 2" />
                        <line x1="0" y1="32" x2="200" y2="32" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="0.5" strokeDasharray="2 2" />
                      </svg>
                      <div style={{ position: "absolute", top: "5px", right: "5px", fontSize: "0.55rem", fontFamily: "monospace", color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.18)", padding: "0.15rem 0.3rem", borderRadius: "3px" }}>
                        TRAFFIC SPIKE: 4.8 GB/s
                      </div>
                    </div>
                  )}

                  {/* 12. Flight Telemetry (KPIs) */}
                  {activeFeature === "kpi" && (
                    <div style={{ position: "relative", width: "100%", height: 210, padding: "0.5rem 1rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#94a3b8", fontFamily: "monospace" }}>METRIC: MTTR TARGET SLA</span>
                        <span style={{ fontSize: "0.62rem", color: "#10b981", background: "rgba(16,185,129,0.08)", padding: "0.1rem 0.35rem", borderRadius: "4px", border: "1px solid rgba(16,185,129,0.15)" }}>-96.2% MTTR</span>
                      </div>
                      
                      <div style={{ flex: 1, position: "relative", marginTop: "0.5rem", minHeight: 90 }}>
                        <svg viewBox="0 0 300 100" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                          <defs>
                            <linearGradient id="chartGlowSub" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.35)" />
                              <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                            </linearGradient>
                          </defs>
                          <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="2 2" />
                          <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="2 2" />
                          <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="2 2" />
                          
                          <path d="M 0 20 L 50 25 L 100 45 L 150 78 L 200 84 L 250 88 L 300 90 L 300 100 L 0 100 Z" fill="url(#chartGlowSub)" />
                          <path d="M 0 20 L 50 25 L 100 45 L 150 78 L 200 84 L 250 88 L 300 90" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 4px rgba(139, 92, 246, 0.6))" }} />
                          
                          <circle cx="0" cy="20" r="2.5" fill="#8b5cf6" />
                          <circle cx="150" cy="78" r="2.5" fill="#8b5cf6" />
                          <circle cx="300" cy="90" r="3.5" fill="#10b981" style={{ filter: "drop-shadow(0 0 5px #10b981)" }} />
                        </svg>
                      </div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", fontFamily: "monospace", color: "#64748b", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "0.4rem" }}>
                        <span>Wk 1 (48h)</span>
                        <span>Wk 4 (12h)</span>
                        <span>CURRENT (1.8h)</span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Features Pane (Right) */}
                <div className="mythos-features-pane">
                  <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "#818cf8", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                    MODULE SPECIFICATIONS
                  </div>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", margin: 0 }}>
                    {activeModule.title}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.35, marginTop: "0.25rem", marginBottom: "1rem" }}>
                    {activeModule.desc}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", margin: "0.25rem 0" }}>
                    {activeModule.features.map((feature, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px", filter: "drop-shadow(0 0 3px rgba(16,185,129,0.3))" }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.35 }}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing/Access tier info */}
                  <div style={{ marginTop: "1rem", padding: "0.75rem 0.9rem", background: "rgba(124, 58, 237, 0.08)", border: "1px solid rgba(124, 58, 237, 0.18)", borderRadius: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                      <div>
                        <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "#a78bfa", textTransform: "uppercase", letterSpacing: "0.05em" }}>PILOT MODULE ACCESS</div>
                        <div style={{ fontSize: "0.72rem", color: "#e2e8f0", marginTop: "0.05rem" }}>Requires Pilot/Captain workspace tier.</div>
                      </div>
                      <button 
                        style={{ 
                          background: "linear-gradient(135deg, #7c3aed, #4f46e5)", 
                          border: "none", 
                          color: "#fff", 
                          padding: "0.35rem 0.7rem", 
                          borderRadius: "6px", 
                          fontSize: "0.7rem", 
                          fontWeight: 700, 
                          cursor: "pointer", 
                          boxShadow: "0 3px 8px rgba(124, 58, 237, 0.25)",
                          whiteSpace: "nowrap"
                        }} 
                        onClick={() => alert("Upgrade request sent! Contact workspace billing at billing@posturepilot.com to activate this pilot module.")}
                      >
                        Upgrade
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
