
"use client";
import Link from "next/link";
import Image from "next/image";
import ShieldViz from "@/components/ShieldViz";
import MythosPromo from "@/components/MythosPromo";
import { useState, useEffect } from "react";
import { useClient } from "@/context/ClientContext";
import { useSession, signOut } from "next-auth/react";

const TABS = ["Configure","Monitor","Secure","Report"];
const BOARDS = [
  {id:"posture",icon:"🛡️",label:"Cyber Posture",val:"74",unit:"Risk Score",c:"#4f46e5"},
  {id:"cloud",icon:"☁️",label:"Cloud Security",val:"12",unit:"Open Issues",c:"#7c3aed"},
  {id:"network",icon:"🌐",label:"Network Security",val:"847",unit:"Events",c:"#0891b2"},
  {id:"infosec",icon:"📋",label:"Info Security",val:"SOC2",unit:"Compliant",c:"#059669"},
  {id:"kpi",icon:"📊",label:"Security KPIs",val:"91%",unit:"SLA",c:"#d97706"},
  {id:"appsec",icon:"🔐",label:"App Security",val:"23",unit:"Critical",c:"#dc2626"},
  {id:"traffic",icon:"🎛️",label:"Traffic Monitor",val:"12.4 Gbps",unit:"Peak Rate",c:"#0891b2"},
  {id:"server",icon:"🖥️",label:"Server Health",val:"98%",unit:"Uptime",c:"#7c3aed"},
  {id:"ai-risk",icon:"🤖",label:"AI Risk",val:"3",unit:"Shadow AI",c:"#ea580c",isNew:true},
  {id:"secure",icon:"📡",label:"Risk Radar",val:"99.6%",unit:"Noise Cut",c:"#16a34a",isNew:true},
  {id:"identity",icon:"🔑",label:"Identity PreCheck",val:"98%",unit:"MFA Active",c:"#a855f7",isNew:true},
  {id:"dispatch",icon:"📨",label:"Dispatch Center",val:"4",unit:"Open SOAR",c:"#0f766e",isNew:true},
];
const PLANS = [
  {name:"Starter",price:"149",c:"#4f46e5",features:["1 user","CSV upload","500 findings","All 12 dashboards & CISO Cockpit"],cta:"Start Free Trial"},
  {name:"Professional",price:"399",c:"#7c3aed",features:["5 users · 3 sources","Qualys · Tenable · Nessus","10K findings","API access"],cta:"Start Free Trial",pop:true},
  {name:"MSSP",price:"999",c:"#0891b2",features:["Unlimited users","Multi-tenant","White-label","Dedicated support"],cta:"Contact Sales"},
];

export default function Page() {
  const { data: session, status } = useSession();
  const { isEnterpriseMode } = useClient();
  const [tab,setTab]=useState("Configure");
  const [menuOpen,setMenuOpen]=useState(false);
  const [showTop,setShowTop]=useState(false);
  const [activeMockupTab, setActiveMockupTab] = useState("Security KPIs");
  const [monitorCategory, setMonitorCategory] = useState("KPIs");
  const [isPromoOpen, setIsPromoOpen] = useState(false);

  // Secure Section Sandbox States
  const [cvssThreshold, setCvssThreshold] = useState<number>(7.0);
  const [cisaKevOnly, setCisaKevOnly] = useState<boolean>(false);
  const [tier1Only, setTier1Only] = useState<boolean>(false);
  const [showSecureLockModal, setShowSecureLockModal] = useState<boolean>(false);

  // Report Section Interactive Preview States
  const [activeReportTab, setActiveReportTab] = useState<string>("Briefing");
  const [reportCompileProgress, setReportCompileProgress] = useState<number>(0);
  const [isReportCompiling, setIsReportCompiling] = useState<boolean>(false);
  const [reportCompileLogs, setReportCompileLogs] = useState<string[]>([]);
  const [reportCompileFinished, setReportCompileFinished] = useState<boolean>(false);
  const [showReportLockModal, setShowReportLockModal] = useState<boolean>(false);

  // Dynamic Report Card Content Helper
  const getReportContent = () => {
    switch (activeReportTab) {
      case "Summary":
        return {
          title: "Executive Summary Report",
          score: "82",
          subtitle: "Acme Financial Corp · Leadership Summary",
          scoreLabel: "Unified Rating",
          scoreTrend: "🟢 Conformance Target Met",
          kpiColor: "#4f46e5",
          kpis: [
            { l: "SLA Compliance", v: "95%", c: "#34d399", sub: "target 90%" },
            { l: "Mean MTTR", v: "3.4d", c: "#60a5fa", sub: "improved 12%" },
            { l: "Open Threats", v: "4", c: "#fbbf24", sub: "0 critical" }
          ],
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div>
                <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>📊 Subsidiary Posture Ratings</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[{ n: "Wells Fargo", v: 76, c: "#dc2626" }, { n: "Toyota", v: 85, c: "#ea580c" }, { n: "United Rentals", v: 91, c: "#10b981" }, { n: "Cisco BU", v: 96, c: "#06b6d4" }].map(b => (
                    <div key={b.n} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.55rem', color: '#64748b', width: 64, flexShrink: 0 }}>{b.n}</span>
                      <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 99 }}>
                        <div style={{ height: '100%', width: `${b.v}%`, background: b.c, borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: '0.55rem', fontWeight: 700, color: b.c }}>{b.v}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "#ede9fe", borderRadius: 8, padding: "0.5rem 0.625rem", border: "1px solid #c4b5fd" }}>
                <div style={{ fontSize: "0.58rem", fontWeight: 800, color: "#4f46e5", marginBottom: "0.25rem" }}>💡 Key Recommendation</div>
                <div style={{ fontSize: "0.54rem", color: "#6d28d9", lineHeight: 1.3 }}>
                  Upgrade Entra ID directory MFA policies to resolve 640 legacy auth policy gaps across United Rentals endpoints.
                </div>
              </div>
            </div>
          )
        };
      case "Technical":
        return {
          title: "Technical Findings Inventory",
          score: "334",
          subtitle: "Full Scan CVE & Tool Inventory",
          scoreLabel: "Open Vulnerabilities",
          scoreTrend: "↓ 12 patched today",
          kpiColor: "#0891b2",
          kpis: [
            { l: "Critical CVSS", v: "23", c: "#f87171", sub: "8 CISA KEV" },
            { l: "High Severity", v: "67", c: "#fb923c", sub: "14 SLA breach" },
            { l: "Medium/Low", v: "244", c: "#a78bfa", sub: "auto-triaged" }
          ],
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#475569", marginBottom: 2 }}>🚨 Ingested Threat Vectors</div>
              {[{ c: "CVE-2024-3400", s: "Critical", score: "10.0", t: "PaloAlto RCE" }, { c: "CVE-2024-21762", s: "Critical", score: "9.8", t: "Fortinet SSL VPN" }, { c: "CVE-2023-44487", s: "High", score: "7.5", t: "HTTP/2 Rapid Reset" }].map(v => (
                <div key={v.c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0.5rem', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  <div>
                    <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', fontWeight: 800, color: '#0f172a' }}>{v.c}</span>
                    <span style={{ fontSize: '0.5rem', color: '#64748b', display: 'block' }}>{v.t}</span>
                  </div>
                  <span style={{ fontSize: '0.58rem', fontWeight: 900, color: v.s === 'Critical' ? '#dc2626' : '#ea580c', background: v.s === 'Critical' ? '#fef2f2' : '#fff7ed', padding: '2px 6px', borderRadius: 4 }}>
                    {v.score}
                  </span>
                </div>
              ))}
            </div>
          )
        };
      case "SLA":
        return {
          title: "SLA Breach & Escalation Report",
          score: "14",
          subtitle: "Overdue Risk Resolution Tracker",
          scoreLabel: "SLA Breached Issues",
          scoreTrend: "⚠️ 3 Critical Overdue",
          kpiColor: "#dc2626",
          kpis: [
            { l: "Avg Overdue", v: "18 days", c: "#f87171", sub: "limit 24h" },
            { l: "High Overdue", v: "11", c: "#fb923c", sub: "limit 7d" },
            { l: "Active Escalations", v: "Tier-2", c: "#a78bfa", sub: "owner notified" }
          ],
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#475569", marginBottom: 2 }}>⚠️ Overdue Resolution Queues</div>
              {[{ cve: "CVE-2024-3400", owner: "Sarah Connor", days: "8d overdue" }, { cve: "CVE-2026-9800", owner: "Devon Vance", days: "10d overdue" }, { cve: "CVE-2026-1124", owner: "Marcus Brody", days: "12d overdue" }].map(t => (
                <div key={t.cve} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0.5rem', background: '#fff1f2', borderRadius: 6, border: '1px solid #fecaca' }}>
                  <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', fontWeight: 800, color: '#9f1239' }}>{t.cve}</span>
                  <span style={{ fontSize: '0.52rem', color: '#be123c', fontWeight: 600 }}>{t.owner}</span>
                  <span style={{ fontSize: '0.52rem', fontWeight: 700, color: '#ef4444' }}>{t.days}</span>
                </div>
              ))}
            </div>
          )
        };
      case "Compliance":
        return {
          title: "GRC Control Compliance Map",
          score: "92%",
          subtitle: "Regulatory Framework Coverages",
          scoreLabel: "Aggregate Coverage",
          scoreTrend: "🛡️ Audit Readiness Target Met",
          kpiColor: "#16a34a",
          kpis: [
            { l: "SOC2", v: "87%", c: "#34d399", sub: "target 85%" },
            { l: "ISO 27001", v: "79%", c: "#60a5fa", sub: "target 80%" },
            { l: "NIST CSF", v: "92%", c: "#fb923c", sub: "target 90%" }
          ],
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#475569", marginBottom: 2 }}>⚖️ Framework Conformances</div>
              {[{ f: "SOC2 Type II", v: 87, c: "#10b981" }, { f: "ISO 27001:2022", v: 79, c: "#3b82f6" }, { f: "NIST CSF v2.0", v: 92, c: "#ea580c" }, { f: "PCI-DSS v4.0", v: 68, c: "#ef4444" }, { f: "HIPAA Security", v: 74, c: "#a855f7" }].map(fw => (
                <div key={fw.f} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.54rem', color: '#64748b', width: 80, flexShrink: 0 }}>{fw.f}</span>
                  <div style={{ flex: 1, height: 5, background: '#f1f5f9', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${fw.v}%`, background: fw.c, borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: '0.54rem', fontWeight: 700, color: fw.c, width: 24, textAlign: 'right' }}>{fw.v}%</span>
                </div>
              ))}
            </div>
          )
        };
      case "Briefing":
      default:
        return {
          title: "Executive Security Brief",
          score: "74",
          subtitle: "May 2026 · Consolidated CISO View",
          scoreLabel: "Risk Score /100",
          scoreTrend: "▲ +4 from last month",
          kpiColor: "#7c3aed",
          kpis: [
            { l: "Critical", v: "23", c: "#f87171", sub: "↓5 this week" },
            { l: "SLA Compliance", v: "91%", c: "#34d399", sub: "↑3% MoM" },
            { l: "Avg CVSS", v: "7.4", c: "#fb923c", sub: "stable" }
          ],
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", fontWeight: 700, color: "#475569", marginBottom: 4 }}>
                  <span>📈 CISO Joint Posture Trend — 90 Days</span>
                  <span style={{ color: "#16a34a" }}>Improving</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: 40, borderBottom: "1px solid #e2e8f0", paddingBottom: 2 }}>
                  {[82, 79, 77, 80, 76, 74, 71, 74, 72, 70, 74, 72].map((v, i) => (
                    <div key={i} style={{ flex: 1, borderRadius: "2px 2px 0 0", background: i === 11 ? "#7c3aed" : "#e2e8f0", height: `${(v / 82) * 100}%`, minHeight: 3 }} />
                  ))}
                </div>
              </div>
              <div style={{ background: "#f8fafc", borderRadius: 8, padding: "0.5rem 0.625rem", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "0.58rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem" }}>🏢 Subsidiary BU Risk Ledger Matrix</div>
                {[{ n: "Wells Fargo", s: "76", c: "#dc2626" }, { n: "Toyota", s: "85", c: "#ea580c" }, { n: "United Rentals", s: "91", c: "#10b981" }].map(r => (
                  <div key={r.n} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.58rem", padding: "2px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ color: "#64748b" }}>{r.n}</span>
                    <span style={{ fontWeight: 700, color: r.c }}>{r.s}/100</span>
                  </div>
                ))}
              </div>
            </div>
          )
        };
    }
  };

  const reportData = getReportContent();

  // CISO Cockpit Preview States
  const [cisoThreatActive, setCisoThreatActive] = useState<boolean>(false);
  const [cisoMitigating, setCisoMitigating] = useState<boolean>(false);
  const [cisoMitigationProgress, setCisoMitigationProgress] = useState<number>(0);
  const [showCisoLockModal, setShowCisoLockModal] = useState<boolean>(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    const navElement = document.querySelector("nav");
    if (element) {
      const navHeight = navElement ? navElement.offsetHeight : 64;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: "auto"
      });
    }
    setMenuOpen(false);
  };

  useEffect(()=>{
    const onScroll=()=>setShowTop(window.scrollY>300);
    window.addEventListener("scroll",onScroll,{passive:true});
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        const navElement = document.querySelector("nav");
        if (element) {
          const navHeight = navElement ? navElement.offsetHeight : 64;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - navHeight,
            behavior: "auto"
          });
        }
      }, 150);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  // --- Secure Section Dynamic Triage Logic ---
  let f1Count = 10000;
  if (cvssThreshold >= 9.5) f1Count = 50;
  else if (cvssThreshold >= 9.0) f1Count = 230;
  else if (cvssThreshold >= 8.5) f1Count = 680;
  else if (cvssThreshold >= 8.0) f1Count = 1200;
  else if (cvssThreshold >= 7.5) f1Count = 1900;
  else if (cvssThreshold >= 7.0) f1Count = 2500;
  else if (cvssThreshold >= 6.0) f1Count = 5400;
  else f1Count = 7800;

  // Compute breakdown for Filter 1 Severity Gate
  const critF1 = cvssThreshold <= 9.0 ? (cvssThreshold <= 9.5 ? 230 : 50) : 0;
  const highF1 = cvssThreshold <= 8.5 ? (cvssThreshold <= 8.0 ? (cvssThreshold <= 7.5 ? (cvssThreshold <= 7.0 ? 2270 : 1670) : 970) : 450) : 0;
  const medF1 = cvssThreshold <= 6.0 ? (cvssThreshold <= 5.0 ? 2900 : 2400) : 0;
  const lowF1 = cvssThreshold <= 5.0 ? 2400 : 0;

  let f2Count = f1Count;
  if (cisaKevOnly) {
    f2Count = Math.max(8, Math.round(f1Count * 0.08));
  } else {
    f2Count = Math.max(800, Math.round(f1Count * 0.32));
    if (f2Count > f1Count) f2Count = f1Count;
  }

  let f3Count = tier1Only
    ? Math.max(20, Math.round(f2Count * 0.15))
    : Math.max(50, Math.round(f2Count * 0.7));
  if (f3Count > f2Count) f3Count = f2Count;

  // --- Report Section simulated compile handler ---
  const startReportCompilation = () => {
    setIsReportCompiling(true);
    setReportCompileProgress(0);
    setReportCompileFinished(false);
    setReportCompileLogs([]);

    const logsList = [
      "🔄 Initializing board-ready report compilation pipeline...",
      "🔒 Securing transmission channel via TLS 1.3...",
      "💼 Ingesting multi-tenant telemetry ledger...",
      "📈 Compiling 12 Cockpit risk factors and MTTR records...",
      "📋 Mapping active vulnerabilities to SOC 2, ISO 27001, and NIST CSF controls...",
      "📊 Generating executive summary charts (Risk Trend, SLA compliance)...",
      "📝 Drafting CISO mitigation directives & future roadmaps...",
      "🔑 Applying corporate briefing signatures and digital seal...",
      "✅ Briefing ready! Document successfully compiled."
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      setReportCompileProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsReportCompiling(false);
          setReportCompileFinished(true);
          return 100;
        }
        const nextProg = p + 12.5;
        if (logIndex < logsList.length) {
          setReportCompileLogs(logs => [...logs, `[${new Date().toLocaleTimeString()}] ${logsList[logIndex]}`]);
          logIndex++;
        }
        return nextProg;
      });
    }, 250);
  };

  // --- CISO HUD Threat Mitigation Handler ---
  const startCisoMitigation = () => {
    setCisoMitigating(true);
    setCisoMitigationProgress(0);
    const interval = setInterval(() => {
      setCisoMitigationProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setCisoMitigating(false);
          setCisoThreatActive(false);
          return 100;
        }
        return p + 10;
      });
    }, 150);
  };

  return(
    <div id="top" style={{fontFamily:"Inter,sans-serif",background:"#fff",color:"#0f172a",minHeight:"100vh",maxWidth:"100%"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        #configure, #ciso, #monitor, #secure, #report, #features { scroll-margin-top: 64px !important; }
        html,body{max-width:100%;overflow-x:hidden;width:100%;position:relative;}
        .hcard:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(79,70,229,0.15)!important}
        .hcard{transition:all 0.2s}
        .back-to-top-btn:hover{transform:scale(1.12)!important;box-shadow:0 8px 28px rgba(79,70,229,0.55)!important;}
        .tenant-pill-wrap {
          position: relative;
          cursor: pointer;
        }
        .tenant-lock-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(2px);
          color: #facc15;
          font-size: 0.52rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.2s ease;
          pointer-events: none;
          white-space: nowrap;
          border: 1px solid rgba(124, 58, 237, 0.3);
        }
        .tenant-pill-wrap:hover .tenant-lock-overlay {
          opacity: 1;
        }
        .ciso-flash-active {
          animation: ciso-alert-flash 1.5s infinite;
          border-color: rgba(220, 38, 38, 0.5) !important;
        }
        @keyframes ciso-alert-flash {
          0%, 100% { border-color: rgba(220, 38, 38, 0.2); box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
          50% { border-color: rgba(220, 38, 38, 0.6); box-shadow: 0 0 15px rgba(220, 38, 38, 0.25); }
        }
        .nav-link{transition:all 0.18s ease;border-radius:8px;padding:0.35rem 0.75rem;}
        .nav-configure:hover{background:#000d55;color:#fff!important;}
        .nav-ciso:hover{background:#7c3aed;color:#fff!important;}
        .nav-monitor:hover{background:#5722e1;color:#fff!important;}
        .nav-secure:hover{background:#3f7000;color:#fff!important;}
        .nav-report:hover{background:#fd590b;color:#fff!important;}
        .hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:6px;background:none;border:none;}
        .hamburger span{display:block;width:22px;height:2px;background:#0f172a;border-radius:2px;transition:all 0.2s;}
        .mobile-menu{display:none;position:fixed;top:64px;left:0;right:0;background:#fff;border-bottom:1px solid #e0e7ff;padding:1rem 1.5rem;flex-direction:column;gap:0.5rem;z-index:999;box-shadow:0 8px 24px rgba(0,0,0,0.08);}
        .mobile-menu.open{display:flex;}
        .mobile-menu a{font-size:1rem;font-weight:700;padding:0.6rem 0;border-bottom:1px solid #f1f5f9;text-decoration:none;}
        .nav-ciso-btn { display: inline-flex; }
        .nav-try-free { white-space: nowrap; }
        @media(max-width:768px){
          .nav-links{display:none!important;}
          .nav-signin{display:none!important;}
          .nav-ciso-btn{display:none!important;}
          .logo-container img { max-width: 140px!important; height: auto!important; }
          .nav-try-free { font-size: 0.72rem!important; padding: 0.4rem 0.8rem!important; }
          .hamburger{display:flex!important;}
          .mobile-banner{display:none!important;}
          .hero-grid{grid-template-columns:1fr!important;text-align:center;}
          .hero-grid p{margin-left:auto!important;margin-right:auto!important;font-size:0.9rem!important;line-height:1.5!important;padding:0 0.5rem;}
          .shield-wrap{justify-content:center!important;order:1!important;}
          .shield-wrap svg{width:100%!important;max-width:400px!important;height:auto!important;margin:0 auto;}
          .hero-left{order:2!important;}
          .hero-btns{flex-direction:column!important;align-items:center!important;}
          .hero-btns a{text-align:center!important;width:100%!important;}
          .hero-stats{justify-content:center!important;gap:2rem!important;}
          .hero-section{padding-top:1rem!important;}
          /* Sections */
          section{padding-left:0.875rem!important;padding-right:0.875rem!important;}
          .config-grid{grid-template-columns:repeat(2,1fr)!important;gap:0.5rem!important;}
          .config-grid>div{padding:0.875rem 0.625rem 1rem!important;}
          .config-grid>div>div:first-child{width:72px!important;height:72px!important;margin-bottom:0.625rem!important;}
          .config-grid img{width:56px!important;height:56px!important;}
          .monitor-inner{grid-template-columns:1fr!important;}
          .monitor-sidebar{display:none!important;}
          .monitor-kpi{grid-template-columns:repeat(2,1fr)!important;}
          .monitor-mid{grid-template-columns:1fr!important;}
          .monitor-bot{grid-template-columns:1fr!important;}
          .report-grid{grid-template-columns:1fr!important;}
          .report-pdf{display:none!important;}
          .report-stats{grid-template-columns:repeat(2,1fr)!important;}
          .report-delivery{grid-template-columns:repeat(3,1fr)!important;}
          .secure-main{grid-template-columns:1fr!important;}
          .secure-tiles{grid-template-columns:1fr!important;}
          .pricing-grid{grid-template-columns:1fr!important;}
          .pricing-grid>div{transform:none!important;}
          .trusted-banner{gap:0.75rem!important;padding:0.875rem 1rem!important;justify-content:center!important;}
          .funnel-result{gap:0.5rem!important;}
        }
        @media(max-width:400px){
          .nav-try-free{display:none!important;}
        }
        @media(max-width:768px){
          .desktop-br { display: none !important; }
          .hero-badge { display: none !important; }
          .desktop-only-text { display: none !important; }
          .hero-section { padding-top: 0.25rem !important; min-height: auto !important; }
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; gap: 0.5rem !important; }
          .hero-h1 { font-size: 1.65rem !important; margin-bottom: 0.4rem !important; line-height: 1.15 !important; }
          .hero-desc { font-size: 0.8rem !important; line-height: 1.35 !important; margin-bottom: 0.5rem !important; }
          .hero-btns { margin-bottom: 0.75rem !important; gap: 0.5rem !important; }
          .hero-btns a { padding: 0.65rem 1.1rem !important; font-size: 0.88rem !important; }
        }
        
        /* Twinkling Star AI sparkle animation (No rotation, flashes scale/brightness) */
        .sparkle-ai-icon {
          display: inline-block;
          font-size: 1.25rem;
          margin-right: 4px;
          animation: twinkle-star-glow 0.9s infinite ease-in-out;
        }

        @keyframes twinkle-star-glow {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.75);
            filter: drop-shadow(0 0 1px rgba(253, 224, 71, 0.2));
          }
          35%, 65% {
            opacity: 0.7;
            transform: scale(1.0);
            filter: drop-shadow(0 0 4px rgba(253, 224, 71, 0.6));
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
            color: #fff;
            text-shadow: 0 0 8px #facc15, 0 0 16px #eab308;
            filter: drop-shadow(0 0 10px #facc15) drop-shadow(0 0 20px #eab308) drop-shadow(0 0 30px #f59e0b);
          }
        }

        /* Pulsing button shadow for Mythos Engine */
        .nav-try-free-pulse {
          animation: button-sparkle-glow 2.5s infinite ease-in-out;
        }

        @keyframes button-sparkle-glow {
          0%, 100% {
            box-shadow: 0 4px 16px rgba(79, 70, 229, 0.35);
          }
          50% {
            box-shadow: 0 4px 25px rgba(124, 58, 237, 0.65), 0 0 12px rgba(124, 58, 237, 0.3);
          }
        }
        .monitor-grid-3col {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          padding: 1.25rem;
        }
        @media (max-width: 1024px) {
          .monitor-grid-3col {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .monitor-grid-3col {
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1rem;
          }
        }
      `}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:"#fff",backdropFilter:"blur(16px)",borderBottom:"1px solid #e0e7ff",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 1.5rem",height:64}}>
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="logo-container" style={{display:"flex",alignItems:"center",textDecoration:"none"}}>
          <Image src="/hlogotag_v2.jpg" alt="PosturePilot" width={270} height={62} style={{objectFit:"contain",objectPosition:"left"}} onError={e=>{e.currentTarget.style.display="none";}}/>
        </a>
        <div className="nav-links" style={{display:"flex",alignItems:"center",gap:"0rem",fontSize:"0.9rem",fontFamily:'"Adobe Clean UX", sans-serif',fontWeight:900,letterSpacing:"0.06em",textTransform:"uppercase"}}>
          {(["Configure","Monitor","Secure","Report"] as const).map((t,i,a)=>(
            <span key={t} style={{display:"flex",alignItems:"center"}}>
              <a href={"#"+t.toLowerCase()} onClick={(e)=>scrollToSection(e,t.toLowerCase())} className={`nav-link nav-${t.toLowerCase()}`} style={{color: i===0?"#000d55": i===1?"#5722e1": i===2?"#3f7000":"#fd590b",textDecoration:"none"}}>{t}</a>
              {i<a.length-1 && <span style={{display:"inline-block",width:2,height:18,background:"#f97316",borderRadius:1,margin:"0 0.35rem",flexShrink:0}}/>}
            </span>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
          {/* Standout CISO Cockpit Link */}
          <a 
            href="#ciso" 
            className="nav-ciso-btn"
            onClick={(e) => {
              scrollToSection(e, "ciso");
            }}
            style={{
              color:"#7c3aed",
              textDecoration:"none",
              background:"rgba(124,58,237,0.08)",
              border:"1px solid rgba(124,58,237,0.25)",
              padding:"0.45rem 1rem",
              borderRadius:"10px",
              fontSize:"0.8rem",
              fontWeight:800,
              letterSpacing:"0.02em",
              display:"flex",
              alignItems:"center",
              gap:"0.3rem",
              boxShadow:"0 2px 10px rgba(124,58,237,0.08)",
              marginRight:"0.5rem",
              transition:"all 0.22s ease-in-out"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed, #6d28d9)";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.3)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(124,58,237,0.08)";
              e.currentTarget.style.color = "#7c3aed";
              e.currentTarget.style.boxShadow = "0 2px 10px rgba(124,58,237,0.08)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            👨‍✈️ CISO Cockpit
          </a>
          {status === 'loading' ? (
            <span style={{color:"transparent",fontSize:"0.875rem",padding:"0.5rem 1rem"}}>Loading</span>
          ) : status === 'authenticated' ? (
            <div className="nav-signin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link href="/dashboard" style={{color:"#4f46e5",fontSize:"0.875rem",textDecoration:"none",padding:"0.5rem",fontWeight:700}}>Dashboard</Link>
              <a href="#" onClick={(e) => { e.preventDefault(); signOut({ callbackUrl: '/' }); }} style={{color:"#ef4444",fontSize:"0.875rem",textDecoration:"none",padding:"0.5rem",fontWeight:600}}>Sign out</a>
            </div>
          ) : (
            <Link href="/login" className="nav-signin" style={{color:"#64748b",fontSize:"0.875rem",textDecoration:"none",padding:"0.5rem 1rem",fontWeight:600}}>Sign in</Link>
          )}
          <button 
            onClick={() => setIsPromoOpen(true)} 
            className="nav-try-free nav-try-free-pulse" 
            style={{
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              color: "#fff",
              border: "1px solid transparent",
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "0.5rem 1.25rem",
              borderRadius: 8,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(79,70,229,0.35)",
              marginLeft: "0.25rem",
              transition: "all 0.22s ease-in-out"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(79,70,229,0.08)";
              e.currentTarget.style.color = "#4f46e5";
              e.currentTarget.style.borderColor = "rgba(79,70,229,0.25)";
              e.currentTarget.style.boxShadow = "0 2px 10px rgba(79,70,229,0.08)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "linear-gradient(135deg,#4f46e5,#7c3aed)";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,70,229,0.35)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span className="sparkle-ai-icon">✨</span> Mythos Engine
          </button>
          <button className="hamburger" onClick={()=>setMenuOpen(o=>!o)} aria-label="Menu">
            <span style={{transform:menuOpen?"rotate(45deg) translate(5px,5px)":"none"}}/>
            <span style={{opacity:menuOpen?0:1}}/>
            <span style={{transform:menuOpen?"rotate(-45deg) translate(5px,-5px)":"none"}}/>
          </button>
        </div>
      </nav>
      <div style={{height:64}}/>
      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen?" open":""}`}>
        <a href="#ciso" onClick={(e)=>scrollToSection(e,"ciso")} style={{color:"#7c3aed", fontWeight:800, borderBottom:"2px solid #e0e7ff", paddingBottom:"0.8rem", marginBottom:"0.25rem"}}>👨‍✈️ CISO Cockpit</a>
        {(["Configure","Monitor","Secure","Report"] as const).map((t,i)=>(
          <a key={t} href={"#"+t.toLowerCase()} onClick={(e)=>scrollToSection(e,t.toLowerCase())}
            style={{color:i===0?"#1e2d6e":i===1?"#4f46e5":i===2?"#16a34a":"#7c3aed"}}>{t}</a>
        ))}
        {status === 'loading' ? (
          <span style={{color:"transparent", padding:"0.5rem 0"}}>Loading</span>
        ) : status === 'authenticated' ? (
          <>
            <Link href="/dashboard" onClick={()=>setMenuOpen(false)} style={{color:"#4f46e5", fontWeight:700}}>Dashboard</Link>
            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); setMenuOpen(false); signOut({ callbackUrl: '/' }); }}
              style={{color: "#ef4444", fontWeight: 700}}
            >
              Sign out
            </a>
          </>
        ) : (
          <Link href="/login" onClick={()=>setMenuOpen(false)} style={{color:"#64748b"}}>Sign in</Link>
        )}
        <button 
          onClick={() => { setIsPromoOpen(true); setMenuOpen(false); }} 
          className="nav-try-free-pulse"
          style={{
            background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
            color: "#fff",
            border: "1px solid transparent",
            padding: "0.6rem 1rem",
            borderRadius: 8,
            textAlign: "center",
            fontWeight: 700,
            cursor: "pointer",
            marginTop: "0.25rem",
            transition: "all 0.22s ease-in-out"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(79,70,229,0.08)";
            e.currentTarget.style.color = "#4f46e5";
            e.currentTarget.style.borderColor = "rgba(79,70,229,0.2)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "linear-gradient(135deg,#4f46e5,#7c3aed)";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          <span className="sparkle-ai-icon">✨</span> Mythos Engine
        </button>
      </div>


      {/* Top Banner (Existing Color: Dark Navy Blue) */}
      <div className="trusted-banner mobile-banner" style={{background:"linear-gradient(90deg,#1e2d6e,#1e3a8a,#1e2d6e)",padding:"1.1rem 2rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"2.5rem",flexWrap:"wrap"}}>
        <span style={{fontSize:"0.72rem",color:"#fff",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",whiteSpace:"nowrap"}}>Trusted by Security Teams Using</span>
        {["Qualys VMDR","CrowdStrike","Wiz","Okta","Splunk","Tenable.io","ServiceNow","Rapid7","Snyk"].map(c=>(
          <span key={c} style={{fontSize:"0.88rem",fontWeight:700,color:"#e2e8f0",whiteSpace:"nowrap",letterSpacing:"0.01em"}}>{c}</span>
        ))}
      </div>

      {/* HERO — white bg so logo sits naturally */}
      <section className="hero-section" style={{background:"linear-gradient(135deg,#f5f3ff 0%,#eff6ff 50%,#f0fdf4 100%)",minHeight:"82vh",display:"flex",alignItems:"flex-start",padding:"4rem 3rem 5px",position:"relative",overflow:"hidden"}}>
        {/* Subtle radial glow */}
        <div style={{position:"absolute",top:"-10%",right:"5%",width:600,height:600,background:"radial-gradient(circle,rgba(79,70,229,0.08) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"-10%",left:"5%",width:400,height:400,background:"radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 70%)",pointerEvents:"none"}}/>

        <div className="hero-grid" style={{maxWidth:1300,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2rem",alignItems:"center",width:"100%",position:"relative",zIndex:1}}>

          {/* LEFT */}
          <div className="hero-left">
            <div className="hero-badge" style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"#ede9fe",border:"1px solid #c4b5fd",borderRadius:20,padding:"0.375rem 1rem",fontSize:"0.85rem",fontWeight:700,color:"#4f46e5",marginBottom:"1.5rem",marginLeft:"-10px",letterSpacing:"0.08em",textTransform:"uppercase"}}>
              <span style={{width:10,height:10,borderRadius:"50%",background:"#22c55e",display:"inline-block",boxShadow:"0 0 10px #22c55e"}}/> Active AI-ASPM · 12 Security Posture Cockpits
            </div>

            <h1 className="hero-h1" style={{fontSize:"clamp(2.2rem,3.6vw,3.2rem)",fontWeight:900,letterSpacing:"-0.04em",lineHeight:1.1,color:"#0f172a",marginBottom:"1.25rem"}}>
              <span style={{color:"#010859"}}>Command Your Security</span><br/>
              <span style={{color:"#4103d9"}}>with Next-Gen AI-ASPM</span>
            </h1>

            <p className="hero-desc" style={{fontSize:"1.05rem",color:"#475569",lineHeight:1.8,marginBottom:"2rem",maxWidth:570}}>
              <span className="desktop-only-text">Stop auditing the past. </span>Ingest live code, cloud, and host <span className="desktop-br"><br/></span>
              telemetry to orchestrate real-time clearance gates and <span className="desktop-br"><br/></span>
              auto-dispatch playbooks. Manage active threat waves, <span className="desktop-br"><br/></span>
              verify compliance guardrails, and transform fragmented <span className="desktop-br"><br/></span>
              vulnerability noise into a unified Posture Command Center.
            </p>

            <div className="hero-btns" style={{display:"flex",gap:"1rem",marginBottom:"2.5rem",flexWrap:"wrap"}}>
              {status === 'authenticated' ? (
                <Link href="/dashboard" style={{background:"linear-gradient(135deg,#4f46e5,#7c3aed)",color:"#fff",fontWeight:700,fontSize:"1rem",padding:"0.875rem 1.875rem",borderRadius:10,textDecoration:"none",boxShadow:"0 4px 20px rgba(79,70,229,0.35)",display:"inline-block",minWidth:"220px",textAlign:"center"}}>Go to Command Center →</Link>
              ) : (
                <Link href="/login" style={{background:"linear-gradient(135deg,#4f46e5,#7c3aed)",color:"#fff",fontWeight:700,fontSize:"1rem",padding:"0.875rem 1.875rem",borderRadius:10,textDecoration:"none",boxShadow:"0 4px 20px rgba(79,70,229,0.35)",display:"inline-block",minWidth:"220px",textAlign:"center"}}>Start Free Trial →</Link>
              )}
              <Link href="/dashboard?demo=true" onClick={() => sessionStorage.setItem("posturepilot_demo_mode", "true")} style={{background:"linear-gradient(135deg,#1e40af,#010859)",color:"#fff",fontWeight:700,fontSize:"1rem",padding:"0.875rem 1.875rem",borderRadius:10,textDecoration:"none",boxShadow:"0 4px 20px rgba(30,64,175,0.25)",display:"inline-block",minWidth:"220px",textAlign:"center"}}>View Demo</Link>
            </div>

            <div className="hero-stats" style={{display:"flex",gap:"2.5rem",marginBottom:"2rem"}}>
              {[["12","Dashboards"],["5 min","First Report"],["80%","Less Reporting"]].map(([v,l])=>(
                <div key={l}>
                  <div style={{fontSize:"2.25rem",fontWeight:900,background:"linear-gradient(135deg,#4f46e5,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{v}</div>
                  <div style={{fontSize:"0.68rem",color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{borderTop:"1px solid #e0e7ff",paddingTop:"1.25rem"}}>
              <p style={{fontSize:"0.65rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.75rem"}}>
                Ingests from scanners, cloud, identity & endpoints
              </p>
              <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap"}}>
                {["Qualys","Tenable","CrowdStrike","Wiz","AWS","Okta","ServiceNow"].map(s=>(
                  <span key={s} style={{fontSize:"0.75rem",fontWeight:700,color:"#4f46e5",background:"#ede9fe",padding:"0.25rem 0.75rem",borderRadius:20,border:"1px solid #c4b5fd"}}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — GIF + animated SVG overlay on 6 panel positions */}
          <div 
            className="shield-wrap" 
            title="Interactive Security Shield — Click to explore 12 Modules Command Center"
            onClick={(e) => {
              const element = document.getElementById("features");
              if (element) {
                const navElement = document.querySelector("nav");
                const navHeight = navElement ? navElement.offsetHeight : 64;
                window.scrollTo({
                  top: element.getBoundingClientRect().top + window.scrollY - navHeight + 1,
                  behavior: "smooth"
                });
              }
            }}
            style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              cursor:"pointer",
              transition:"transform 0.3s ease"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.02) translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1) translateY(0)";
            }}
          >
            <ShieldViz/>
          </div>
        </div>
      </section>

      {/* 🟣 Purple — Works Across row with mixed top names */}
      <div className="mobile-banner" style={{background:"linear-gradient(90deg,#6d28d9,#7c3aed,#6d28d9)",padding:"1rem 2rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"2rem",flexWrap:"wrap"}}>
        <span style={{fontSize:"0.68rem",color:"#ddd6fe",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",whiteSpace:"nowrap"}}>Works Across</span>
        {["Nessus Pro","OpenVAS","AWS Security Hub","SentinelOne","Google Cloud","Prisma Cloud","Orca Security","Lacework","Palo Alto Networks","Microsoft Defender","Microsoft Azure"].map(c=>(
          <span key={c} style={{fontSize:"0.85rem",fontWeight:700,color:"#fff",whiteSpace:"nowrap"}}>{c}</span>
        ))}
      </div>

      {/* MYTHOS PROMO MODAL */}
      {isPromoOpen && <MythosPromo onClose={() => setIsPromoOpen(false)} />}

      {/* ── CONFIGURE ── */}
      <section id="configure" style={{scrollMarginTop:"120px",padding:"25px 2rem 4rem",background:"#fff",minHeight:"100vh",display:"flex",alignItems:"flex-start"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#1e2d6e",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>🔧 Configure</div>
            <h2 style={{fontSize:"clamp(1.75rem,3vw,2.25rem)",fontWeight:800,color:"#0f172a",letterSpacing:"-0.03em"}}>Your entire security stack. One command center.</h2>
            <p style={{color:"#64748b",marginTop:"0.5rem",fontSize:"0.9rem"}}>Scanners · Cloud · EDR · Identity · SOAR — connect in minutes via upload, API, or webhook. No rip-and-replace.</p>
          </div>
          <div className="config-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.25rem",width:"100%"}}>
            {[
              {name:"Qualys VMDR",    c:"#dc2626", initials:"Q",   logoUrl:"https://ik.imagekit.io/qualys/image/logo/qualys.svg",  logoSize:108, methods:["Upload","API"],   cat:"Scanner"},
              {name:"CrowdStrike",    c:"#E00400", initials:"CS",  logoUrl:"/logos/crowdstrike.png",                              logoSize:108, methods:["Webhook","API"], cat:"EDR"},
              {name:"Wiz",            c:"#2F6FED", initials:"Wiz", logoUrl:"/logos/wiz.png",                                      logoSize:108, methods:["Upload","API"],   cat:"Cloud"},
              {name:"Splunk",         c:"#000000", initials:"Sp",  logoUrl:"/logos/splunk.svg",                                   logoSize:130, methods:["Webhook","API"], cat:"SIEM/SOAR"},
              {name:"Tenable.io",     c:"#1e2a38", initials:"Te",  logoUrl:"/logos/tenable.png",                                  logoSize:108, methods:["Upload","API"],   cat:"Scanner"},
              {name:"SentinelOne",    c:"#6B2BD6", initials:"S1",  logoUrl:"/logos/sentinelone.svg",                              logoSize:108, methods:["Webhook","API"], cat:"EDR"},
              {name:"AWS Sec Hub",    c:"#FF9900", initials:"AWS", logoUrl:"/logos/aws.svg",                                      logoSize:100, methods:["Webhook","API"], cat:"Cloud"},
              {name:"ServiceNow",     c:"#62D84E", initials:"SN",  logoUrl:"/logos/servicenow.png",                               logoSize:108, methods:["Webhook","API"], cat:"SOAR"},
              {name:"Nessus Pro",     c:"#3eae2e", initials:"Ne",  logoUrl:"/logos/nessus.png",                                   logoSize:108, methods:["Upload"],        cat:"Scanner"},
              {name:"MS Defender",    c:"#0078D4", initials:"MSD", logoUrl:"/logos/msdefender.png",                               logoSize:130, methods:["Webhook","API"], cat:"EDR"},
              {name:"Microsoft Azure",c:"#0089D6", initials:"Az",  logoUrl:"/logos/azure.png",                                    logoSize:108, methods:["Webhook","API"], cat:"Cloud"},
              {name:"Snyk",           c:"#4C5BA5", initials:"Sn",  logoUrl:"/logos/snyk.svg",                                    logoSize:120, methods:["API"],           cat:"AppSec"},
              {name:"Rapid7",         c:"#E6242A", initials:"R7",  logoUrl:"/logos/rapid7.png",                                   logoSize:108, methods:["Upload","API"],   cat:"Scanner"},
              {name:"Okta",           c:"#007DC1", initials:"Ok",  logoUrl:"/logos/okta.svg",                                     logoSize:108, methods:["Webhook","API"], cat:"Identity"},
              {name:"Prisma Cloud",   c:"#00C0E8", initials:"PC",  logoUrl:"/logos/prisma.png",                                   logoSize:108, methods:["Webhook"],        cat:"Cloud"},
              {name:"OpenVAS",        c:"#2d2d2d", initials:"OV",  logoUrl:"/logos/openvas.png",                                  logoSize:100, methods:["Upload","API"],   cat:"Scanner"},
            ].map(tool=>(
              <div key={tool.name} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:18,padding:"2rem 2rem 2.5rem",borderTop:`4px solid ${tool.c}`,boxShadow:"0 2px 12px rgba(0,0,0,0.05)",transition:"all 0.2s",cursor:"default",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 32px ${tool.c}25`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.05)";}}>
                {/* Logo area */}
                <div style={{width:140,height:140,borderRadius:18,background:"#ffffff",border:"1px solid #f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1.5rem",overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                  <img
                    src={tool.logoUrl}
                    alt={tool.name}
                    width={tool.logoSize} height={tool.logoSize}
                    style={{objectFit:"contain"}}
                    onError={e=>{
                      const img = e.currentTarget;
                      img.style.display="none";
                      const fallback = img.nextElementSibling as HTMLElement;
                      if(fallback) fallback.style.display="flex";
                    }}
                  />
                  {/* Fallback initials */}
                  <div style={{display:"none",width:108,height:108,borderRadius:16,background:`linear-gradient(135deg,${tool.c},${tool.c}cc)`,alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:tool.initials.length>2?"1.1rem":"1.5rem",letterSpacing:"-0.02em"}}>
                    {tool.initials}
                  </div>
                </div>
                <div style={{fontWeight:800,fontSize:"1.15rem",color:"#0f172a",marginBottom:"0.5rem",letterSpacing:"-0.02em"}}>{tool.name}</div>
                <div style={{fontSize:"0.6rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:tool.c,marginBottom:"0.75rem",opacity:0.85}}>{tool.cat}</div>
                <div style={{display:"flex",gap:"0.375rem",flexWrap:"wrap",justifyContent:"center"}}>
                  {tool.methods.map(m=>(
                    <span key={m} style={{fontSize:"0.62rem",fontWeight:700,padding:"2px 7px",borderRadius:20,background:m==="Webhook"?"#fef3c7":m==="API"?"#ede9fe":"#f0fdf4",color:m==="Webhook"?"#b45309":m==="API"?"#6d28d9":"#15803d",border:`1px solid ${m==="Webhook"?"#fcd34d":m==="API"?"#c4b5fd":"#86efac"}`}}>{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARDS / FEATURES SPLIT MODEL */}
      <section id="ciso" style={{padding:"25px 2rem 14rem",maxWidth:1200,margin:"0 auto",scrollMarginTop:"120px"}}>
        
        {/* CSS rules for responsive grid */}
        <style>{`
          .features-split-grid {
            display: grid;
            grid-template-columns: 1.15fr 1fr;
            gap: 2.5rem;
            align-items: start;
          }
          @media (max-width: 1024px) {
            .features-split-grid {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
            }
          }
        `}</style>

        <div className="features-split-grid">
          
          {/* Left Column: 12 Modules */}
          <div>
            <div style={{marginBottom:"1.5rem"}}>
              <div style={{fontSize:"0.68rem",fontWeight:700,color:"#4f46e5",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>12 Modules · One Command Center</div>
              <h2 style={{fontSize:"clamp(1.5rem,2.5vw,1.85rem)",fontWeight:800,letterSpacing:"-0.02em",color:"#0f172a"}}>Enterprise Security Dashboards</h2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0.75rem"}}>
              {BOARDS.map(d=>(
                <Link key={d.id} href={d.id === 'ai-risk' ? '/ai-risk' : "/dashboard/"+d.id} className="hcard" style={{display:"block",textDecoration:"none",background:"#fff",border:"1px solid #e0e7ff",borderRadius:12,padding:"1rem 1.25rem",boxShadow:"0 2px 6px rgba(0,0,0,0.03)",position:"relative"}}>
                  {d.isNew&&<div style={{position:"absolute",top:8,right:8,background:"linear-gradient(135deg,#ea580c,#7c3aed)",color:"#fff",fontSize:"0.5rem",fontWeight:800,padding:"1px 6px",borderRadius:6}}>NEW</div>}
                  <div style={{width:36,height:36,borderRadius:8,background:d.c+"15",border:"1px solid "+d.c+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",marginBottom:"0.75rem"}}>{d.icon}</div>
                  <div style={{fontWeight:700,fontSize:"0.85rem",color:"#0f172a",marginBottom:"0.35rem"}}>{d.label}</div>
                  <div style={{display:"flex",alignItems:"baseline",gap:"0.3rem"}}>
                    <span style={{fontSize:"1.25rem",fontWeight:900,color:d.c,fontFamily:"monospace",letterSpacing:"-0.02em"}}>{d.val}</span>
                    <span style={{fontSize:"0.68rem",color:"#94a3b8",fontWeight:600}}>{d.unit}</span>
                  </div>
                  <div style={{marginTop:"0.5rem",height:3,background:"#f1f5f9",borderRadius:4}}>
                    <div style={{height:"100%",width:"70%",background:"linear-gradient(90deg,"+d.c+","+d.c+"88)",borderRadius:4}}/>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: CISO Cockpit */}
          <div>
            <div style={{marginBottom:"1.5rem"}}>
              <div style={{fontSize: "0.68rem", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom:"0.5rem"}}>👨‍✈️ CISO Cockpit Preview</div>
              <h2 style={{fontSize: "clamp(1.5rem,2.5vw,1.85rem)", fontWeight: 800, color: "#0f172a", letterSpacing:"-0.02em"}}>Aggregated Multi-Tenant HUD</h2>
            </div>

            {/* Live Simulator Control Bar */}
            <div style={{
              background: cisoThreatActive ? "rgba(220, 38, 38, 0.05)" : "rgba(255, 255, 255, 0.6)",
              border: cisoThreatActive ? "1px solid rgba(220, 38, 38, 0.25)" : "1px solid #e0e7ff",
              borderRadius: 16,
              padding: "1.25rem",
              marginBottom: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              boxShadow: cisoThreatActive ? "0 8px 30px rgba(220, 38, 38, 0.1)" : "0 4px 15px rgba(0,0,0,0.02)",
              transition: "all 0.3s ease"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: cisoThreatActive ? "#dc2626" : "#10b981",
                  boxShadow: cisoThreatActive ? "0 0 10px #dc2626" : "0 0 10px #10b981",
                  animation: cisoThreatActive ? "twinkle-star-glow 1s infinite" : "none",
                  flexShrink: 0
                }}/>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0f172a" }}>
                    {cisoThreatActive ? "🔥 Active Group Attack Wave Simulation" : "🟢 All Systems Nominal"}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: 2 }}>
                    {cisoThreatActive ? "Multi-tenant ledger is registering widespread CVSS spikes." : "No active tenant compromises detected."}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                {/* Threat Wave Toggle */}
                <button
                  onClick={() => {
                    if (cisoMitigating) return;
                    setCisoThreatActive(!cisoThreatActive);
                  }}
                  disabled={cisoMitigating}
                  style={{
                    background: cisoThreatActive ? "#4b5563" : "#dc2626",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "0.55rem 1.25rem",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    cursor: cisoMitigating ? "not-allowed" : "pointer",
                    boxShadow: cisoThreatActive ? "none" : "0 4px 12px rgba(220, 38, 38, 0.25)",
                    transition: "all 0.2s"
                  }}
                >
                  {cisoThreatActive ? "🛑 Stop Threat Wave" : "🔥 Simulate Threat Wave"}
                </button>

                {/* Deploy Playbook Mitigation Button */}
                {cisoThreatActive && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {cisoMitigating ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 140 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", fontWeight: 700, color: "#7c3aed" }}>
                          <span>⚡ Mitigating...</span>
                          <span>{cisoMitigationProgress}%</span>
                        </div>
                        <div style={{ height: 6, background: "#e2e8f0", borderRadius: 99, overflow: "hidden", width: "100%" }}>
                          <div style={{ height: "100%", width: `${cisoMitigationProgress}%`, background: "#7c3aed", borderRadius: 99, transition: "width 0.15s ease" }} />
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={startCisoMitigation}
                        style={{
                          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 10,
                          padding: "0.55rem 1.25rem",
                          fontSize: "0.78rem",
                          fontWeight: 800,
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)",
                          transition: "all 0.2s"
                        }}
                      >
                        ⚡ Deploy Playbook Mitigation
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem"}}>
              {/* Card 1: Assets */}
              <div 
                className={cisoThreatActive ? "ciso-flash-active" : ""}
                style={{background: "#fff", border: "1px solid #e0e7ff", borderRadius: 12, padding: "1rem", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", transition: "all 0.3s ease"}}
              >
                <div>
                  <div style={{position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: "#7c3aed", borderRadius: "12px 0 0 12px"}}/>
                  <div style={{fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em"}}>Combined Assets</div>
                  <div style={{fontSize: "1.5rem", fontWeight: 900, color: "#7c3aed", marginTop: "0.35rem", fontFamily: "monospace"}}>69.8K</div>
                </div>
                <div style={{display: "flex", flexWrap: "wrap", gap: "3px", fontSize: "0.52rem", fontWeight: 800, color: "#94a3b8", borderTop: "1px solid #f1f5f9", paddingTop: "0.4rem", marginTop: "0.5rem"}}>
                  {["WF: 14.2K", "TY: 9.4K", "UR: 5.1K"].map((t, idx) => {
                    const colors = ["#dc2626", "#ea580c", "#10b981"];
                    return (
                      <span 
                        key={idx} 
                        className="tenant-pill-wrap" 
                        onClick={() => setShowCisoLockModal(true)}
                        style={{background: "#f1f5f9", padding: "2px 5px", borderRadius: 4, color: colors[idx], position: "relative", cursor: "pointer"}}
                      >
                        {t}
                        <span className="tenant-lock-overlay">🔒 Locked</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Card 2: Compliance */}
              <div 
                className={cisoThreatActive ? "ciso-flash-active" : ""}
                style={{background: "#fff", border: "1px solid #e0e7ff", borderRadius: 12, padding: "1rem", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", transition: "all 0.3s ease"}}
              >
                <div>
                  <div style={{position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: cisoThreatActive ? "#dc2626" : "#10b981", borderRadius: "12px 0 0 12px", transition: "background 0.3s"}}/>
                  <div style={{fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em"}}>Compliance Score</div>
                  <div style={{fontSize: "1.5rem", fontWeight: 900, color: cisoThreatActive ? "#dc2626" : "#10b981", marginTop: "0.35rem", fontFamily: "monospace", transition: "color 0.3s"}}>
                    {cisoThreatActive ? "42.6%" : "85.8%"}
                  </div>
                </div>
                <div style={{fontSize: "0.58rem", fontWeight: 700, color: cisoThreatActive ? "#dc2626" : "#10b981", marginTop: "0.5rem", borderTop: "1px solid #f1f5f9", paddingTop: "0.4rem", transition: "color 0.3s"}}>
                  {cisoThreatActive ? "🔴 SLA BREACH" : "🟢 SLA OK"}
                </div>
              </div>

              {/* Card 3: Risks */}
              <div 
                className={cisoThreatActive ? "ciso-flash-active" : ""}
                style={{background: "#fff", border: "1px solid #e0e7ff", borderRadius: 12, padding: "1rem", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", transition: "all 0.3s ease"}}
              >
                <div>
                  <div style={{position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: "#dc2626", borderRadius: "12px 0 0 12px"}}/>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div style={{fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em"}}>Critical Risks</div>
                  </div>
                  <div style={{fontSize: "1.5rem", fontWeight: 900, color: "#dc2626", marginTop: "0.35rem", fontFamily: "monospace"}}>
                    {cisoThreatActive ? "178" : "30"}
                  </div>
                </div>
                <div style={{display: "flex", flexWrap: "wrap", gap: "3px", fontSize: "0.52rem", fontWeight: 800, color: "#94a3b8", borderTop: "1px solid #f1f5f9", paddingTop: "0.4rem", marginTop: "0.5rem"}}>
                  {(cisoThreatActive 
                    ? ["WF: 68", "TY: 42", "UR: 25"] 
                    : ["WF: 12", "TY: 6", "UR: 3"]
                  ).map((t, idx) => {
                    const colors = ["#dc2626", "#ea580c", "#10b981"];
                    return (
                      <span 
                        key={idx} 
                        className="tenant-pill-wrap" 
                        onClick={() => setShowCisoLockModal(true)}
                        style={{background: "#f1f5f9", padding: "2px 5px", borderRadius: 4, color: colors[idx], position: "relative", cursor: "pointer"}}
                      >
                        {t}
                        <span className="tenant-lock-overlay">🔒 Locked</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Card 4: SLA status */}
              <div 
                className={cisoThreatActive ? "ciso-flash-active" : ""}
                style={{background: "#fff", border: "1px solid #e0e7ff", borderRadius: 12, padding: "1rem", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", transition: "all 0.3s ease"}}
              >
                <div>
                  <div style={{position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: cisoThreatActive ? "#dc2626" : "#ea580c", borderRadius: "12px 0 0 12px", transition: "background 0.3s"}}/>
                  <div style={{fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em"}}>SLA Status</div>
                  <div style={{fontSize: "1.1rem", fontWeight: 900, color: cisoThreatActive ? "#dc2626" : "#ea580c", marginTop: "0.5rem", textTransform: "uppercase", transition: "color 0.3s"}}>
                    {cisoThreatActive ? "BREACH" : "NOMINAL"}
                  </div>
                </div>
                <div style={{fontSize: "0.58rem", fontWeight: 600, color: "#475569", marginTop: "0.5rem", borderTop: "1px solid #f1f5f9", paddingTop: "0.4rem"}}>
                  {cisoThreatActive ? "1,248 in queue" : "434 in queue"}
                </div>
              </div>
            </div>

            {/* Informative Marketing Pill */}
            <div style={{display: "flex", justifyContent: "center", borderTop: "1px solid #e0e7ff", paddingTop: "1rem"}}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.45rem 1rem",
                borderRadius: 99,
                background: "rgba(124,58,237,0.06)",
                border: "1px solid rgba(124,58,237,0.2)",
                boxShadow: "0 2px 10px rgba(124,58,237,0.04)"
              }}>
                <span style={{width: 6,height: 6,borderRadius: "50%",background: "#7c3aed",display: "inline-block",boxShadow: "0 0 8px rgba(124,58,237,0.5)",animation: "twinkle-star-glow 1s infinite"}} />
                <span style={{fontSize: "0.68rem",fontWeight: 700,color: "#7c3aed",letterSpacing: "0.01em"}}>
                  📡 Real-time multi-tenant posture intelligence
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── MONITOR ── */}
      <section id="monitor" style={{scrollMarginTop:"64px",padding:"25px 2rem 14rem",background:"linear-gradient(135deg,#1e2d6e 0%,#2d1b69 50%,#3b0764 100%)",color:"#fff",minHeight:"100vh",display:"flex",alignItems:"flex-start"}}>
        <div style={{maxWidth:1200,margin:"0 auto",width:"100%"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#a5b4fc",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>📡 Monitor</div>
            <h2 style={{fontSize:"clamp(1.75rem,3vw,2.25rem)",fontWeight:800,letterSpacing:"-0.03em"}}>12 live dashboards. Everything in one place.</h2>
            <p style={{color:"#a5b4fc",marginTop:"0.5rem",fontSize:"0.9rem"}}>Real-time security posture across cloud, network, apps, and endpoints.</p>
          </div>

          {/* SOC Dashboard Mockup (Premium Light Theme Dashboard) */}
          <div style={{
            background:"#ffffff",
            border:"1px solid #e2e8f0",
            borderRadius:20,
            overflow:"hidden",
            boxShadow:"0 20px 50px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
            color:"#0f172a"
          }}>

            {/* Topbar */}
            <div style={{background:"#f8fafc",padding:"0.75rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #e2e8f0"}}>
              <div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:"#ef4444"}}/>
                <div style={{width:10,height:10,borderRadius:"50%",background:"#eab308"}}/>
                <div style={{width:10,height:10,borderRadius:"50%",background:"#22c55e"}}/>
                <span style={{fontSize:"0.75rem",color:"#64748b",fontWeight:700,marginLeft:"0.5rem",letterSpacing:"0.04em"}}>PosturePilot Command Console</span>
              </div>
              <div style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#16a34a",display:"inline-block",boxShadow:"0 0 8px rgba(22,163,74,0.4)"}}/>
                <span style={{fontSize:"0.65rem",color:"#16a34a",fontWeight:900,letterSpacing:"0.05em"}}>SYS ACTIVE</span>
                <span style={{fontSize:"0.65rem",color:"#64748b",marginLeft:"0.5rem"}}>Sync: just now</span>
              </div>
            </div>

            {/* Premium Categories Tabs Segmented Control */}
            <div className="monitor-tabs-bar" style={{display:"flex", background:"#f8fafc", padding:"0.6rem 1rem", borderBottom:"1px solid #e2e8f0", gap:"0.5rem", overflowX:"auto", scrollbarWidth:"none"}}>
              {[
                { key: "KPIs", label: "Core Governance", icon: "🛡️", c: "#7c3aed" },
                { key: "Infra", label: "Infrastructure", icon: "☁️", c: "#0891b2" },
                { key: "Apps", label: "App & Host Security", icon: "🔐", c: "#dc2626" },
                { key: "SecOps", label: "SecOps & Identity", icon: "🚨", c: "#0f766e" }
              ].map(cat => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setMonitorCategory(cat.key)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: monitorCategory === cat.key ? "rgba(15, 23, 42, 0.05)" : "transparent",
                    color: monitorCategory === cat.key ? cat.c : "#64748b",
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    if (monitorCategory !== cat.key) {
                      e.currentTarget.style.background = "rgba(0,0,0,0.02)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (monitorCategory !== cat.key) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="monitor-inner" style={{background:"#f8fafc"}}>
              {monitorCategory === "KPIs" && (
                <div className="monitor-grid-3col">
                  {/* Column 1: Core Telemetry (KPIs & Findings) */}
                  <div style={{display:"flex", flexDirection:"column", gap:"1.1rem"}}>
                    {/* KPI row */}
                    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0.875rem"}}>
                      {[
                        {label:"Risk Score",val:"74",unit:"/100",c:"#7c3aed",trend:"↑2",tColor:"#dc2626"},
                        {label:"Open Criticals",val:"23",unit:"CVEs",c:"#dc2626",trend:"↓5",tColor:"#16a34a"},
                        {label:"SLA Compliance",val:"91%",unit:"on-track",c:"#16a34a",trend:"↑3%",tColor:"#16a34a"},
                        {label:"Avg CVSS",val:"7.4",unit:"score",c:"#ea580c",trend:"stable",tColor:"#64748b"},
                      ].map(s=>(
                        <div key={s.label} style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"0.875rem",borderTop:`3px solid ${s.c}`,boxShadow:"0 1px 3px rgba(0,0,0,0.02)"}}>
                          <div style={{fontSize:"0.58rem",color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.3rem"}}>{s.label}</div>
                          <div style={{fontSize:"1.75rem",fontWeight:900,color:"#0f172a",lineHeight:1}}>{s.val}<span style={{fontSize:"0.65rem",fontWeight:500,color:"#64748b",marginLeft:4}}>{s.unit}</span></div>
                          <div style={{fontSize:"0.62rem",color:s.tColor,marginTop:"0.4rem",fontWeight:600}}>{s.trend} this week</div>
                        </div>
                      ))}
                    </div>

                    {/* Findings breakdown */}
                    <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem",flex:1}}>
                      <div style={{fontSize:"0.72rem",fontWeight:800,color:"#0f172a",marginBottom:"0.75rem",display:"flex",alignItems:"center",gap:"0.4rem"}}>📊 Findings by Severity</div>
                      {[["Critical",14,"#dc2626",312],["High",67,"#ea580c",312],["Medium",148,"#d97706",312],["Low",83,"#16a34a",312],["Info",22,"#2563eb",312]].map(([s,n,c,max])=>(
                        <div key={String(s)} style={{marginBottom:"0.55rem"}}>
                          <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.65rem",marginBottom:3}}>
                            <span style={{color:"#64748b",fontWeight:600}}>{s}</span>
                            <span style={{color:String(c),fontWeight:800}}>{n}</span>
                          </div>
                          <div style={{height:6,background:"#f1f5f9",borderRadius:99,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${Math.round(Number(n)/Number(max)*100)}%`,background:String(c),borderRadius:99}}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Posture & Trend Line */}
                  <div style={{display:"flex", flexDirection:"column", gap:"1.1rem"}}>
                    <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem",display:"flex",flexDirection:"column",height:"100%",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:"0.72rem",fontWeight:800,color:"#0f172a",marginBottom:"1rem"}}>🛡️ Cyber Posture Clearance</div>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"1rem 0"}}>
                          <div style={{position:"relative",width:110,height:110,display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <svg viewBox="0 0 100 100" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",transform:"rotate(-90deg)"}}>
                              <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
                              <circle cx="50" cy="50" r="40" fill="none" stroke="#7c3aed" strokeWidth="8" strokeDasharray="185 251" strokeLinecap="round"/>
                            </svg>
                            <div>
                              <div style={{fontSize:"1.6rem",fontWeight:900,color:"#0f172a",lineHeight:1}}>74%</div>
                              <div style={{fontSize:"0.52rem",color:"#16a34a",fontWeight:800,marginTop:3}}>APPROVED</div>
                            </div>
                          </div>
                          <div style={{fontSize:"0.65rem",color:"#64748b",marginTop:8}}>Posture Index Score</div>
                        </div>
                      </div>

                      <div style={{borderTop:"1px solid #f1f5f9",paddingTop:"1rem"}}>
                        <div style={{fontSize:"0.62rem",color:"#64748b",marginBottom:"0.5rem"}}>📈 Historical Trend</div>
                        <div style={{height:80,width:"100%"}}>
                          <svg viewBox="0 0 200 100" style={{width:"100%",height:"100%",overflow:"visible"}}>
                            <path d="M 0,82 C 30,79 60,85 90,71 C 120,62 150,45 200,34 L 200,100 L 0,100 Z" fill="rgba(124,58,237,0.1)"/>
                            <path d="M 0,82 C 30,79 60,85 90,71 C 120,62 150,45 200,34" fill="none" stroke="#7c3aed" strokeWidth="3"/>
                            <circle cx="200" cy="34" r="4" fill="#fff" stroke="#7c3aed" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.55rem",color:"#64748b",marginTop:4}}>
                          <span>Feb</span>
                          <span>Mar</span>
                          <span>Apr</span>
                          <span style={{fontWeight:700,color:"#16a34a"}}>May</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Compliance Checklist */}
                  <div style={{display:"flex", flexDirection:"column", gap:"1.1rem"}}>
                    <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem",height:"100%",display:"flex",flexDirection:"column"}}>
                      <div style={{fontSize:"0.72rem",fontWeight:800,color:"#0f172a",marginBottom:"0.75rem"}}>📋 Regulatory Compliance Registry</div>
                      <div style={{display:"flex",flexDirection:"column",gap:"0.75rem",flex:1,justifyContent:"center"}}>
                        {[
                          {title:"SOC2 Type II",cov:"87%",c:"#7c3aed",checks:[{l:"IAM Rules",v:true},{l:"MFA Enforce",v:true}]},
                          {title:"ISO 27001",cov:"79%",c:"#4f46e5",checks:[{l:"Risk Pass",v:true},{l:"Audit Log",v:false}]},
                          {title:"NIST CSF",cov:"92%",c:"#059669",checks:[{l:"Triage Pass",v:true},{l:"Fleet Patch",v:true}]},
                        ].map((fw,i)=>(
                          <div key={i} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.65rem",borderTop:`3px solid ${fw.c}`}}>
                            <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.6rem",fontWeight:800,marginBottom:3}}>
                              <span style={{color:"#0f172a"}}>{fw.title}</span>
                              <span style={{color:fw.c}}>{fw.cov}</span>
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:"0.3rem",marginTop:6}}>
                              {fw.checks.map((ch,idx)=>(
                                <div key={idx} style={{display:"flex",alignItems:"center",gap:"0.3rem",fontSize:"0.55rem",whiteSpace:"nowrap",overflow:"hidden"}}>
                                  <span style={{color:ch.v?"#16a34a":"#dc2626"}}>{ch.v?"✓":"✗"}</span>
                                  <span style={{color:"#475569"}}>{ch.l}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {monitorCategory === "Infra" && (
                <div className="monitor-grid-3col">
                  {/* Column 1: Cloud Security environments */}
                  <div style={{display:"flex", flexDirection:"column", gap:"1.1rem"}}>
                    <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:"0.72rem",fontWeight:800,color:"#0f172a",marginBottom:"0.75rem"}}>☁️ Ingested Multicloud Environments</div>
                        <p style={{fontSize:"0.65rem",color:"#64748b",marginBottom:"1rem"}}>Continuous compliance monitoring of active cloud instances.</p>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:"0.75rem",flex:1,justifyContent:"center"}}>
                        {[
                          {cloud:"AWS Amazon Web Services",assets:"104 active VMs, 4 RDS instances",pct:96,c:"#ff9900"},
                          {cloud:"Microsoft Azure Cloud",assets:"67 active VMs, 2 SQL containers",pct:99,c:"#0078d4"},
                          {cloud:"GCP Google Cloud Platform",assets:"12 active projects, 3 GKE clusters",pct:94,c:"#ea4335"},
                        ].map((item,i)=>(
                          <div key={i} style={{background:"#f8fafc",padding:"0.65rem",borderRadius:8,border:"1px solid #e2e8f0",borderLeft:`3px solid ${item.c}`}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.68rem",fontWeight:700,color:"#0f172a"}}>
                              <span>{item.cloud}</span>
                              <span style={{color:item.pct>95?"#16a34a":"#d97706"}}>{item.pct}% Secure</span>
                            </div>
                            <div style={{fontSize:"0.58rem",color:"#64748b",marginTop:4}}>{item.assets}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Exposed Assets */}
                  <div style={{display:"flex", flexDirection:"column", gap:"1.1rem"}}>
                    <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:"0.72rem",fontWeight:800,color:"#0f172a",marginBottom:"0.5rem"}}>☁️ Cloud Storage Security</div>
                        <div style={{fontSize:"0.62rem",fontWeight:800,color:"#dc2626",marginBottom:"0.75rem",display:"flex",alignItems:"center",gap:"3px"}}>
                          <span style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:"#dc2626",animation:"twinkle-star-glow 1s infinite"}}/>
                          ⚠️ 3 EXPOSED STORAGE OBJECTS FOUND
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",flex:1,justifyContent:"center"}}>
                        {["acme-financial-audit-logs","hr-employee-passports","retail-pos-backups"].map((bucket)=>(
                          <div key={bucket} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fef2f2",border:"1px solid #fecaca",padding:"0.45rem 0.6rem",borderRadius:6}}>
                            <span style={{fontSize:"0.58rem",fontFamily:"monospace",color:"#9f1239",fontWeight:700}}>{bucket}</span>
                            <span style={{fontSize:"0.52rem",fontWeight:800,color:"#dc2626",background:"#fee2e2",padding:"1px 4px",borderRadius:3}}>PUBLIC</span>
                          </div>
                        ))}
                      </div>
                      <div style={{borderTop:"1px solid #f1f5f9",paddingTop:"0.75rem",marginTop:"0.5rem"}}>
                        <div style={{fontSize:"0.62rem",color:"#64748b",marginBottom:"0.35rem"}}>🛡️ Active Remediation Logs</div>
                        <div style={{fontSize:"0.55rem",fontFamily:"monospace",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:6,padding:"0.4rem",color:"#1e293b"}}>
                          <div style={{color:"#16a34a"}}>✓ lambda-encrypt-bucket: SUCCESS</div>
                          <div style={{color:"#16a34a"}}>✓ policy-s3-public-block: APPLIED</div>
                          <div style={{color:"#ea580c"}}>! bucket-quarantine: WAITING_AUTH</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Network & Traffic */}
                  <div style={{display:"flex", flexDirection:"column", gap:"1.1rem"}}>
                    <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                      {/* Network Ports */}
                      <div>
                        <div style={{fontSize:"0.72rem",fontWeight:800,color:"#0f172a",marginBottom:"0.5rem"}}>🌐 Open Port Telemetry</div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0.5rem"}}>
                          {[["Port 22 (SSH)","Blocked","#16a34a"],["Port 80 (HTTP)","Redirected","#2563eb"],["Port 443 (HTTPS)","Active","#16a34a"],["Port 3389 (RDP)","Alert Triggered","#dc2626"]].map(([p,s,c])=>(
                            <div key={p} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.45rem",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                              <span style={{fontSize:"0.55rem",fontWeight:700,color:"#0f172a"}}>{p}</span>
                              <span style={{color:c,fontWeight:800,fontSize:"0.52rem",marginTop:4}}>{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Traffic Monitor */}
                      <div style={{borderTop:"1px solid #f1f5f9",paddingTop:"0.75rem",marginTop:"0.5rem"}}>
                        <div style={{fontSize:"0.72rem",fontWeight:800,color:"#0f172a",marginBottom:"0.35rem"}}>🎛️ Traffic Monitor</div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.58rem",marginBottom:4}}>
                          <span style={{color:"#64748b"}}>Peak: 2.4 Gbps</span>
                          <span style={{fontWeight:700,color:"#0f172a"}}>1.8 TB Today</span>
                        </div>
                        <div style={{height:45,width:"100%"}}>
                          <svg viewBox="0 0 200 60" style={{width:"100%",height:"100%"}}>
                            <path d="M 0,50 Q 50,20 100,45 T 200,15 L 200,60 L 0,60 Z" fill="rgba(8, 145, 178, 0.1)"/>
                            <path d="M 0,50 Q 50,20 100,45 T 200,15" fill="none" stroke="#0891b2" strokeWidth="2.5"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {monitorCategory === "Apps" && (
                <div className="monitor-grid-3col">
                  {/* Column 1: Application Security Cockpit */}
                  <div style={{display:"flex", flexDirection:"column", gap:"1.1rem"}}>
                    <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:"0.72rem",fontWeight:800,color:"#0f172a",marginBottom:"0.5rem"}}>🔐 App Security Cockpit</div>
                        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",background:"#fef2f2",padding:"0.65rem",borderRadius:8,border:"1px solid #fecaca",marginBottom:"0.75rem"}}>
                          <div style={{fontSize:"1.5rem",fontWeight:900,color:"#dc2626"}}>23</div>
                          <div style={{fontSize:"0.58rem",color:"#64748b"}}>
                            Critical Code Flaws Detected 
                            <div style={{color:"#16a34a",fontWeight:700,marginTop:2}}>22 Auto-Resolved</div>
                          </div>
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
                        <div style={{fontSize:"0.62rem",fontWeight:800,color:"#0f172a"}}>🚀 Live Scan Ticker</div>
                        {[["api-gateway-router","SAST: Passed","#16a34a"],["auth-service-v3","DAST: 1 High Dev","#ea580c"],["payment-processor","SCA: Outdated Lib","#dc2626"]].map(([repo,status,c])=>(
                          <div key={repo} style={{display:"flex",justifyContent:"space-between",fontSize:"0.58rem",padding:"0.3rem 0.5rem",background:"#fafafa",borderRadius:6,border:"1px solid #f1f5f9"}}>
                            <span style={{fontWeight:700,color:"#0f172a"}}>{repo}</span>
                            <span style={{color:c,fontWeight:600}}>{status}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{borderTop:"1px solid #f1f5f9",paddingTop:"0.75rem",marginTop:"0.5rem"}}>
                        <div style={{fontSize:"0.62rem",color:"#64748b",marginBottom:"0.35rem"}}>📦 Dependency Health (SCA)</div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.55rem"}}>
                          <span style={{color:"#475569"}}>Packages scanned</span>
                          <span style={{fontWeight:700,color:"#0f172a"}}>412 libs</span>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.55rem",marginTop:2}}>
                          <span style={{color:"#475569"}}>Vulnerable packages</span>
                          <span style={{fontWeight:700,color:"#dc2626"}}>12 auto-patched</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Shadow AI Risks */}
                  <div style={{display:"flex", flexDirection:"column", gap:"1.1rem"}}>
                    <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:"0.72rem",fontWeight:800,color:"#0f172a",marginBottom:"0.5rem"}}>🤖 Shadow AI Risk Radar</div>
                        <p style={{fontSize:"0.62rem",color:"#64748b",marginBottom:"0.75rem"}}>Intercepting unauthorized enterprise AI queries.</p>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",flex:1,justifyContent:"center"}}>
                        {[["ChatGPT Prompt","SSN Data Blocked","#dc2626"],["Claude Upload","Proprietary Code Warning","#ea580c"]].map(([lbl,status,c])=>(
                          <div key={lbl} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.58rem",padding:"0.45rem 0.6rem",background:"#fff7ed",border:"1px solid #ffedd5",borderRadius:6}}>
                            <div>
                              <span style={{fontWeight:700,color:"#0f172a",display:"block"}}>{lbl}</span>
                              <span style={{fontSize:"0.52rem",color:"#9a3412"}}>{status}</span>
                            </div>
                            <span style={{fontSize:"0.52rem",fontWeight:800,color:c,background:c === "#dc2626" ? "#fef2f2" : "#fff7ed",padding:"2px 6px",borderRadius:4}}>BLOCKED</span>
                          </div>
                        ))}
                      </div>
                      <div style={{borderTop:"1px solid #f1f5f9",paddingTop:"0.75rem",marginTop:"0.5rem"}}>
                        <div style={{fontSize:"0.62rem",color:"#64748b",marginBottom:"0.35rem"}}>🤖 OpenAI Gateway Logs</div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.55rem"}}>
                          <span style={{color:"#475569"}}>Tokens scanned</span>
                          <span style={{fontWeight:700,color:"#2563eb"}}>1.2M Today</span>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.55rem",marginTop:2}}>
                          <span style={{color:"#475569"}}>Sensitive leaks blocked</span>
                          <span style={{fontWeight:700,color:"#16a34a"}}>4 block events</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Host Infrastructure */}
                  <div style={{display:"flex", flexDirection:"column", gap:"1.1rem"}}>
                    <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:"0.72rem",fontWeight:800,color:"#0f172a",marginBottom:"0.75rem"}}>🖥️ Host Server Health</div>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem",marginBottom:"0.5rem"}}>
                          <div style={{display:"flex",flexDirection:"column",gap:"0.3rem"}}>
                            {[["CPU Load","44%","#10b981"],["Memory","68%","#eab308"]].map(([lbl,val,c])=>(
                              <div key={lbl} style={{fontSize:"0.62rem"}}>
                                <span style={{color:"#64748b"}}>{lbl}: </span>
                                <span style={{fontWeight:800,color:c}}>{val}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{textAlign:"center",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"0.6rem 1rem"}}>
                            <div style={{fontSize:"1.3rem",fontWeight:900,color:"#16a34a",lineHeight:1}}>98.9%</div>
                            <div style={{fontSize:"0.55rem",color:"#15803d",fontWeight:700,marginTop:4}}>Uptime</div>
                          </div>
                        </div>
                      </div>
                      <div style={{borderTop:"1px solid #f1f5f9",paddingTop:"0.5rem",marginTop:"0.5rem"}}>
                        <div style={{fontSize:"0.62rem",color:"#64748b",marginBottom:"0.35rem"}}>🛡️ EDR Agent Health</div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.55rem"}}>
                          <span style={{color:"#475569"}}>Active agents</span>
                          <span style={{fontWeight:700,color:"#16a34a"}}>124 online</span>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.55rem",marginTop:2}}>
                          <span style={{color:"#475569"}}>OS patches pending</span>
                          <span style={{fontWeight:700,color:"#ea580c"}}>2 servers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {monitorCategory === "SecOps" && (
                <div className="monitor-grid-3col">
                  {/* Column 1: Incident Queue */}
                  <div style={{display:"flex", flexDirection:"column", gap:"1.1rem"}}>
                    <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:"0.72rem",fontWeight:800,color:"#0f172a",marginBottom:"0.5rem"}}>🎟️ Active Incident Queue</div>
                        <p style={{fontSize:"0.62rem",color:"#64748b",marginBottom:"0.75rem"}}>Real-time SOAR playbook response state.</p>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",flex:1,justifyContent:"center"}}>
                        {[
                          {id:"PP-104",title:"Critical CVE-2024-3400 Inbound",owner:"Sarah Connor",sla:"3.2h",c:"#dc2626"},
                          {id:"PP-102",title:"High CVE-2024-21762 Bypass",owner:"Devon Vance",sla:"2.4d",c:"#ea580c"},
                          {id:"PP-101",title:"MFA brute-force alert user",owner:"IAM Bot",sla:"4m",c:"#2563eb"},
                        ].map((t)=>(
                          <div key={t.id} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.5rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <div>
                              <div style={{fontSize:"0.62rem",fontWeight:800,color:"#0f172a"}}><span style={{color:t.c}}>{t.id}</span> | {t.title}</div>
                              <div style={{fontSize:"0.52rem",color:"#64748b",marginTop:2}}>Assignee: {t.owner}</div>
                            </div>
                            <div style={{fontSize:"0.58rem",fontWeight:800,color:t.c,whiteSpace:"nowrap"}}>⚡ {t.sla}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Orchestration logs terminal */}
                  <div style={{display:"flex", flexDirection:"column", gap:"1.1rem"}}>
                    <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:"1rem",height:"100%",fontFamily:"monospace",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                      <div style={{fontSize:"0.55rem",color:"#818cf8",textTransform:"uppercase",letterSpacing:"0.08em",borderBottom:"1px solid rgba(255,255,255,0.08)",paddingBottom:"0.4rem",marginBottom:"0.5rem"}}>📟 Orchestration Logs</div>
                      <div style={{fontSize:"0.58rem",color:"#22c55e",lineHeight:1.5,display:"flex",flexDirection:"column",gap:"0.3rem",flex:1,justifyContent:"center"}}>
                        <div>[12:04:10] Ingesting scan telemetry...</div>
                        <div style={{color:"#eab308"}}>[12:04:15 WARN] Overdue SLA on asset "db-02".</div>
                        <div>[12:04:18] Dispatched PP-104 to Sarah C.</div>
                        <div style={{color:"#e2e8f0"}}>[12:04:22] Auto-triaged 14 false positives.</div>
                        <div style={{color:"#ef4444"}}>[12:04:25] Blocked IP 185.220.101.4 at firewall.</div>
                        <div style={{color:"#eab308"}}>[12:04:30] Revoked user session (anomalous loc).</div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Identity & Access / Radar */}
                  <div style={{display:"flex", flexDirection:"column", gap:"1.1rem"}}>
                    <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                      {/* Identity */}
                      <div>
                        <div style={{fontSize:"0.72rem",fontWeight:800,color:"#0f172a",marginBottom:"0.5rem"}}>🔑 Identity & Access PreCheck</div>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.5rem"}}>
                          <div style={{display:"flex",flexDirection:"column",gap:"0.3rem",flex:1}}>
                            {[["MFA Enforced","100%","#16a34a"],["Inactive Keys","4 Dead","#ea580c"]].map(([lbl,desc,c])=>(
                              <div key={lbl} style={{display:"flex",justifyContent:"space-between",fontSize:"0.58rem"}}>
                                <span style={{color:"#64748b"}}>{lbl}</span>
                                <span style={{color:c,fontWeight:800}}>{desc}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{textAlign:"center",background:"#faf5ff",border:"1px solid #e9d5ff",borderRadius:8,padding:"0.4rem 0.6rem"}}>
                            <div style={{fontSize:"1.1rem",fontWeight:900,color:"#a855f7",lineHeight:1}}>98%</div>
                            <div style={{fontSize:"0.52rem",color:"#7e22ce",marginTop:2}}>SSO</div>
                          </div>
                        </div>
                      </div>

                      {/* Risk Radar */}
                      <div style={{borderTop:"1px solid #f1f5f9",paddingTop:"0.5rem",marginTop:"0.5rem"}}>
                        <div style={{fontSize:"0.72rem",fontWeight:800,color:"#0f172a",marginBottom:"0.35rem"}}>🎯 Severity Risk Radar</div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{fontSize:"0.55rem",color:"#64748b"}}>
                            <div>Critical focus lists</div>
                            <div style={{color:"#dc2626",fontWeight:700,marginTop:1}}>CVE-2024-3400</div>
                          </div>
                          <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"0.4rem 0.6rem",textAlign:"center"}}>
                            <div style={{fontSize:"1.1rem",fontWeight:900,color:"#16a34a",lineHeight:1}}>99.6%</div>
                            <div style={{fontSize:"0.52rem",color:"#15803d",marginTop:2}}>Noise Cut</div>
                          </div>
                        </div>
                      </div>

                      {/* Privileged Access */}
                      <div style={{borderTop:"1px solid #f1f5f9",paddingTop:"0.5rem",marginTop:"0.5rem"}}>
                        <div style={{fontSize:"0.62rem",color:"#64748b",marginBottom:"0.35rem"}}>🔑 Privileged Access (PAM)</div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.55rem"}}>
                          <span style={{color:"#475569"}}>Active admin sessions</span>
                          <span style={{fontWeight:700,color:"#0f172a"}}>0 sessions</span>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.55rem",marginTop:2}}>
                          <span style={{color:"#475569"}}>JIT access requests</span>
                          <span style={{fontWeight:700,color:"#16a34a"}}>2 approved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="secure" style={{scrollMarginTop:"64px",padding:"25px 2rem 4rem",background:"linear-gradient(135deg,#14532d 0%,#15803d 50%,#16a34a 100%)",minHeight:"100vh",display:"flex",alignItems:"flex-start"}}>
        <div style={{maxWidth:1200,margin:"0 auto",width:"100%"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#bbf7d0",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>🔒 Secure</div>
            <h2 style={{fontSize:"clamp(1.75rem,3vw,2.25rem)",fontWeight:800,color:"#fff",letterSpacing:"-0.03em"}}>Interactive Severity Gate Sandbox</h2>
            <p style={{color:"#bbf7d0",marginTop:"0.5rem",fontSize:"0.9rem"}}>Adjust the CVSS risk threshold to test our noise reduction engine in real-time.</p>
          </div>

          {/* Dynamic Simulator Controls */}
          <div style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: 16,
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            color: "#fff",
            boxShadow: "0 8px 32px rgba(20, 83, 45, 0.15)"
          }}>
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.82rem", fontWeight: 700 }}>
                <span>🎯 Severity Gate (CVSS Threshold)</span>
                <span style={{ color: "#bbf7d0", fontWeight: 800 }}>CVSS ≥ {cvssThreshold.toFixed(1)}</span>
              </div>
              <input 
                type="range" 
                min="5.0" 
                max="9.5" 
                step="0.5" 
                value={cvssThreshold} 
                onChange={e => setCvssThreshold(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "#bbf7d0", cursor: "pointer" }}
              />
            </div>
          </div>

          <div className="secure-main" style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:"1.5rem",marginBottom:"1.5rem"}}>

            {/* Left: Filter funnel */}
            <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              {[
                {step:"Filter 1",title:"Severity Gate",rule:`CVSS >= ${cvssThreshold.toFixed(1)}`,desc:"Eliminates informational and low-noise findings immediately",c:"#4f46e5",icon:"🎯",
                  bars:[{l:"Critical 9-10",v:critF1 > 0 ? Math.round(critF1 / 230 * 100) : 0,n:critF1},
                        {l:"High 7-8.9",v:highF1 > 0 ? Math.round(highF1 / 2270 * 100) : 0,n:highF1},
                        {l:"Medium 4-6.9",v:medF1 > 0 ? Math.round(medF1 / 2900 * 100) : 0,n:medF1},
                        {l:"Low/Info 0-3.9",v:lowF1 > 0 ? Math.round(lowF1 / 2400 * 100) : 0,n:lowF1}]},
                {step:"Filter 2",title:"Exploitability Check",rule:cisaKevOnly ? "CISA KEV Listed" : "EPSS > 10% OR CISA KEV",desc:"Only surfaces findings with active, weaponized exploit evidence",c:"#ea580c",icon:"⚡",
                  bars:[{l:"CISA KEV Match",v:100,n:cisaKevOnly ? f2Count : Math.min(8, Math.round(f2Count * 0.05))},
                        {l:"EPSS > 50%",v:cisaKevOnly ? 0 : 85,n:cisaKevOnly ? 0 : Math.round(f2Count * 0.35)},
                        {l:"EPSS 10-50%",v:cisaKevOnly ? 0 : 60,n:cisaKevOnly ? 0 : Math.round(f2Count * 0.6)},
                        {l:"No Known Exploit",v:cisaKevOnly ? 0 : 5,n:0}]},
                {step:"Filter 3",title:"Asset Criticality",rule:tier1Only ? "Tier-1 Production Assets" : "All Ingested Assets",desc:"Prioritizes findings affecting your business-critical perimeters",c:"#dc2626",icon:"🏢",
                  bars:[{l:"External-facing",v:100,n:Math.round(f3Count * 0.3)},
                        {l:"Production Hub",v:80,n:tier1Only ? Math.round(f3Count * 0.7) : Math.round(f3Count * 0.5)},
                        {l:"Internal LAN",v:tier1Only ? 0 : 30,n:tier1Only ? 0 : Math.round(f3Count * 0.2)},
                        {l:"Dev/Test Labs",v:0,n:0}]},
              ].map((f,i)=>(
                <div key={f.step} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderLeft:`4px solid ${f.c}`,borderRadius:14,padding:"1.1rem 1.25rem"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.625rem"}}>
                    <div style={{width:40,height:40,borderRadius:"50%",background:`${f.c}12`,border:`2px solid ${f.c}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0}}>{f.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:2}}>
                        <span style={{fontSize:"0.6rem",fontWeight:700,color:f.c,textTransform:"uppercase",letterSpacing:"0.08em"}}>{f.step}</span>
                        <span style={{fontWeight:800,fontSize:"0.88rem",color:"#0f172a"}}>{f.title}</span>
                      </div>
                      <code style={{fontSize:"0.68rem",color:f.c,background:`${f.c}10`,padding:"1px 7px",borderRadius:5,fontWeight:700}}>{f.rule}</code>
                    </div>
                    {i < 2 && <span style={{fontSize:"1.25rem",color:"#cbd5e1"}}>↓</span>}
                  </div>
                  <div style={{fontSize:"0.72rem",color:"#64748b",marginBottom:"0.625rem"}}>{f.desc}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:"0.3rem"}}>
                    {f.bars.map((b:{l:string,v:number,n:number})=>(
                      <div key={b.l} style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                        <span style={{fontSize:"0.58rem",color:"#64748b",width:90,flexShrink:0}}>{b.l}</span>
                        <div style={{flex:1,height:6,background:"#e2e8f0",borderRadius:99}}>
                          <div style={{height:"100%",width:`${b.v}%`,background:b.n>0?f.c:"#e2e8f0",borderRadius:99,opacity:b.n>0?1:0.25}}/>
                        </div>
                        <span style={{fontSize:"0.58rem",fontWeight:700,color:b.n>0?f.c:"#cbd5e1",width:22,textAlign:"right"}}>{b.n>0?b.n:"—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: 6 mini dashboard tiles with bar graphs */}
            <div className="secure-tiles" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.875rem",alignContent:"start"}}>
              {[
                {title:"Runway Reduction Gates",icon:"📉",c:"#16a34a",note:`${(100 - (f3Count / 10000 * 100)).toFixed(1)}% noise cut`,
                  bars:[{l:"Raw (10K)",v:100,n:"10K"},{l:"After F1",v:Math.max(5, Math.round(f1Count / 100)),n:f1Count.toLocaleString()},{l:"After F2",v:Math.max(2, Math.round(f2Count / 100)),n:f2Count.toLocaleString()},{l:"Actionable",v:0.5,n:f3Count.toLocaleString()}]},
                {title:"CVSS Airspeed Ranges",icon:"📊",c:"#4f46e5",note:`CVSS ≥ ${cvssThreshold.toFixed(1)} Gate`,
                  bars:[{l:"Critical 9-10",v:cvssThreshold <= 9.0 ? 95 : 0,n:critF1 > 0 ? critF1 : "—"},{l:"High 7-8.9",v:cvssThreshold <= 7.0 ? 72 : 0,n:highF1 > 0 ? highF1 : "—"},{l:"Medium",v:cvssThreshold <= 5.0 ? 40 : 0,n:medF1 > 0 ? medF1 : "—"},{l:"Low/Info",v:cvssThreshold <= 5.0 ? 20 : 0,n:lowF1 > 0 ? lowF1 : "—"}]},
                {title:"EPSS Storm Likelihood",icon:"⚡",c:"#ea580c",note:cisaKevOnly ? "Kev Exclusive" : "Active Threat Focus",
                  bars:[{l:"EPSS >50%",v:cisaKevOnly ? 0 : 100,n:cisaKevOnly ? "—" : Math.round(f2Count * 0.35)},{l:"EPSS 10-50%",v:cisaKevOnly ? 0 : 60,n:cisaKevOnly ? "—" : Math.round(f2Count * 0.6)},{l:"EPSS 1-10%",v:0,n:"—"},{l:"No Exploit",v:0,n:"—"}]},
                {title:"Hangar Asset Tiers",icon:"🏢",c:"#dc2626",note:tier1Only ? "Tier-1 Locked" : "Ledger Scope",
                  bars:[{l:"Tier-1 Prod",v:100,n:f3Count},{l:"Tier-2 Internal",v:tier1Only ? 0 : 75,n:tier1Only ? "—" : Math.round(f2Count * 0.2)},{l:"Dev Labs",v:0,n:"—"},{l:"Test Beds",v:0,n:"—"}]},
                {title:"KEV Turbulence Rates",icon:"🔐",c:"#7c3aed",note:`${cisaKevOnly ? f2Count : Math.min(8, Math.round(f2Count * 0.05))} active KEV vectors`,
                  bars:[{l:"KEV Match",v:100,n:cisaKevOnly ? f2Count : Math.min(8, Math.round(f2Count * 0.05))},{l:"Weaponized",v:75,n:cisaKevOnly ? Math.round(f2Count * 0.75) : Math.min(6, Math.round(f2Count * 0.04))},{l:"PoC Public",v:55,n:cisaKevOnly ? f2Count : Math.min(12, Math.round(f2Count * 0.06))},{l:"No Exploit",v:0,n:"—"}]},
                {title:"SLA Altimeter Deadlines",icon:"⏰",c:"#d97706",note:"Auto-escalations active",
                  bars:[{l:"Critical 24h",v:100,n:Math.round(f3Count * 0.4)},{l:"High 7d",v:55,n:Math.round(f3Count * 0.6)},{l:"Medium 30d",v:0,n:"—"},{l:"Low 90d",v:0,n:"—"}]},
              ].map((tile:{title:string,icon:string,c:string,note:string,bars:{l:string,v:number,n:string|number}[]})=>(
                <div key={tile.title} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"0.875rem",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"0.375rem",marginBottom:"0.625rem"}}>
                    <span style={{fontSize:"0.875rem"}}>{tile.icon}</span>
                    <span style={{fontSize:"0.72rem",fontWeight:800,color:"#0f172a"}}>{tile.title}</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:"0.3rem",marginBottom:"0.5rem"}}>
                    {tile.bars.map((b:{l:string,v:number,n:string|number})=>{
                      const isValActive = b.n !== 0 && b.n !== '0' && b.n !== '' && b.n !== '—';
                      return (
                        <div key={b.l} style={{display:"flex",alignItems:"center",gap:"0.375rem"}}>
                          <span style={{fontSize:"0.55rem",color:"#94a3b8",width:72,flexShrink:0}}>{b.l}</span>
                          <div style={{flex:1,height:5,background:"#f1f5f9",borderRadius:99}}>
                            <div style={{height:"100%",width:`${b.v}%`,background:isValActive?tile.c:"#e2e8f0",borderRadius:99,opacity:isValActive?1:0.2}}/>
                          </div>
                          <span style={{fontSize:"0.55rem",fontWeight:700,color:isValActive?tile.c:"#cbd5e1",width:26,textAlign:"right",flexShrink:0}}>{isValActive?b.n:"—"}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{fontSize:"0.58rem",color:tile.c,fontWeight:700,background:`${tile.c}10`,borderRadius:6,padding:"2px 6px",display:"inline-block"}}>{tile.note}</div>
                </div>
              ))}
            </div>

          </div>

          {/* Before → After funnel result */}
          <div style={{
            background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
            border: "1px solid #86efac",
            borderRadius: 16,
            padding: "1.25rem 1.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.25rem",
            textAlign: "left"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
              {[{n:"10,000",l:"Raw Findings",c:"#dc2626",arrow:false},{n:"→",l:"",c:"#86efac",arrow:true},{n:f1Count.toLocaleString(),l:"After Severity",c:"#ea580c",arrow:false},{n:"→",l:"",c:"#86efac",arrow:true},{n:f2Count.toLocaleString(),l:"Exploitable Only",c:"#d97706",arrow:false},{n:"→",l:"",c:"#86efac",arrow:true},{n:f3Count.toString(),l:"Action Items",c:"#16a34a",arrow:false}].map((item,i)=>
                item.arrow ? (
                  <span key={i} style={{fontSize:"1.5rem",color:"#86efac",fontWeight:700}}>→</span>
                ) : (
                  <div key={i}>
                    <div style={{fontSize:"1.5rem",fontWeight:900,color:item.c,fontFamily:"monospace"}}>{item.n}</div>
                    <div style={{fontSize:"0.65rem",color:"#475569",fontWeight:600}}>{item.l}</div>
                  </div>
                )
              )}
            </div>

            <button 
              onClick={() => setShowSecureLockModal(true)}
              style={{
                background: "linear-gradient(135deg,#16a34a,#15803d)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "0.625rem 1.25rem",
                fontSize: "0.8rem",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(22,163,74,0.25)",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <span>🔬 Inspect Actionable Findings ({f3Count})</span>
              <span style={{ fontSize: "0.75rem" }}>🔒</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── REPORT ── */}
      <section id="report" style={{scrollMarginTop:"96px",padding:"25px 2rem 4rem",background:"#f8fafc",minHeight:"100vh",display:"flex",alignItems:"flex-start"}}>
        <div style={{maxWidth:1200,margin:"0 auto",width:"100%"}}>
          <div style={{textAlign:"center",marginBottom:"2rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#7c3aed",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>📄 Report</div>
            <h2 style={{fontSize:"clamp(1.75rem,3vw,2.25rem)",fontWeight:800,color:"#0f172a",letterSpacing:"-0.03em"}}>Board-ready reports in one click</h2>
            <p style={{color:"#64748b",marginTop:"0.5rem",fontSize:"0.9rem",marginBottom:"1.5rem"}}>From executive PDF to compliance mapping — auto-generated, white-labeled, delivered to your stakeholders.</p>
          </div>

          {/* Premium Centered Tabs Selector */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {[
              { key: "Briefing", label: "CISO Executive Briefing", icon: "💼", c: "#7c3aed" },
              { key: "Summary", label: "Executive Summary", icon: "📝", c: "#4f46e5" },
              { key: "Technical", label: "Technical Findings", icon: "🔧", c: "#0891b2" },
              { key: "SLA", label: "SLA Breach Report", icon: "📈", c: "#dc2626" },
              { key: "Compliance", label: "Compliance Mapping", icon: "🛡️", c: "#16a34a" }
            ].map(t => (
              <button
                key={t.key}
                onClick={() => {
                  setActiveReportTab(t.key);
                  setReportCompileFinished(false);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: activeReportTab === t.key ? `2px solid ${t.c}` : '1px solid #cbd5e1',
                  background: activeReportTab === t.key ? t.c : '#fff',
                  color: activeReportTab === t.key ? '#fff' : '#0f172a',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: activeReportTab === t.key ? `0 4px 12px ${t.c}20` : '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <div className="report-grid" style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:"1.5rem",marginBottom:"1.25rem"}}>
            <div style={{display:"flex",flexDirection:"column",gap:"0.875rem"}}>
              {[
                {icon:"👨‍✈️",title:"CISO Executive Briefing",c:"#7c3aed",audience:"Board · CEO · Investors",time:"~3 sec",
                  desc:"High-fidelity multi-tenant risk briefs compiled in real-time, featuring consolidated asset SLA ratings, joint posture trends, and corporate remediation directives.",
                  includes:["Aggregate CISO Posture Trends","Consolidated Asset SLA ratings","Regulatory framework conformances","Subsidiary BU ledger matrix","CISO action directives"],
                  formats:["PDF","Print-Ready"]},
                {icon:"📊",title:"Executive Summary",c:"#4f46e5",audience:"CISO · Board · CXO",time:"~8 sec",
                  desc:"High-level posture snapshot for non-technical leadership. Risk trends, SLA compliance, top findings — no jargon.",
                  includes:["Risk Score trend (30/60/90 day)","Critical & High count by BU","SLA compliance rate","Top 5 CVEs with business impact","Remediation velocity chart"],
                  formats:["PDF","PPT","Email"]},
                {icon:"🔍",title:"Technical Findings",c:"#0891b2",audience:"Security Engineers · SOC",time:"~12 sec",
                  desc:"Full CVE inventory with CVSS scores, EPSS probabilities, CISA KEV flags, affected assets and remediation steps.",
                  includes:["Full CVE list with CVSS v3 + EPSS","Asset-level mapping (host, IP, port)","CISA KEV flag & exploit availability","Patch & remediation guidance","Tool-by-tool breakdown"],
                  formats:["PDF","CSV","JSON"]},
                {icon:"⏰",title:"SLA Breach Report",c:"#dc2626",audience:"Risk Managers · Compliance",time:"~5 sec",
                  desc:"All overdue findings beyond their SLA window — with owner, deadline, days overdue, and escalation status.",
                  includes:["Findings past SLA deadline","Owner & assignee details","Days overdue + escalation tier","Business impact classification","Auto-generated action items"],
                  formats:["PDF","Email","Slack"]},
                {icon:"✅",title:"Compliance Mapping",c:"#16a34a",audience:"Auditors · GRC · Legal",time:"~15 sec",
                  desc:"Maps every finding to SOC2, ISO 27001, NIST CSF, PCI-DSS and HIPAA framework controls with gap analysis.",
                  includes:["Control coverage % per framework","Gap analysis with evidence","Failed controls linked to CVEs","Remediation roadmap","Audit-ready evidence trail"],
                  formats:["PDF","XLSX"]},
              ].map(r=>{
                const getTabKey = (t: string) => {
                  if (t.includes("Briefing")) return "Briefing";
                  if (t.includes("Summary")) return "Summary";
                  if (t.includes("Technical")) return "Technical";
                  if (t.includes("SLA")) return "SLA";
                  if (t.includes("Compliance")) return "Compliance";
                  return "Briefing";
                };
                const tabKey = getTabKey(r.title);
                const isSelected = activeReportTab === tabKey;
                return (
                  <div 
                    key={r.title} 
                    onClick={() => {
                      setActiveReportTab(tabKey);
                      setReportCompileFinished(false);
                    }}
                    style={{
                      background: isSelected ? "#f8fafc" : "#fff",
                      border: isSelected ? `2px solid ${r.c}` : "1px solid #e2e8f0",
                      borderLeft: `6px solid ${r.c}`,
                      borderRadius: 14,
                      padding: "1.1rem 1.25rem",
                      boxShadow: isSelected ? `0 4px 20px ${r.c}15` : "0 2px 8px rgba(0,0,0,0.04)",
                      display: "grid",
                      gridTemplateColumns: "44px 1fr",
                      gap: "1rem",
                      alignItems: "start",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{width:44,height:44,borderRadius:12,background:`${r.c}12`,border:`1px solid ${r.c}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.35rem",flexShrink:0}}>{r.icon}</div>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:"0.5rem",flexWrap:"wrap",marginBottom:"0.25rem"}}>
                        <span style={{fontWeight:800,color:"#0f172a",fontSize:"0.92rem"}}>{r.title}</span>
                        <span style={{fontSize:"0.6rem",fontWeight:600,color:"#64748b",background:"#f1f5f9",padding:"1px 7px",borderRadius:20}}>{r.audience}</span>
                        <span style={{fontSize:"0.6rem",fontWeight:700,color:"#16a34a",marginLeft:"auto"}}>⚡ {r.time}</span>
                      </div>
                      <div style={{fontSize:"0.75rem",color:"#64748b",marginBottom:"0.625rem",lineHeight:1.55}}>{r.desc}</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.175rem 0.875rem",marginBottom:"0.625rem"}}>
                        {r.includes.map(item=>(
                          <div key={item} style={{display:"flex",alignItems:"flex-start",gap:"0.3rem",fontSize:"0.7rem",color:"#475569"}}>
                            <span style={{color:r.c,fontWeight:700,flexShrink:0}}>✓</span>{item}
                          </div>
                        ))}
                      </div>
                      <div style={{display:"flex",gap:"0.35rem"}}>
                        {r.formats.map(f=><span key={f} style={{fontSize:"0.62rem",fontWeight:700,padding:"2px 7px",borderRadius:20,background:`${r.c}12`,color:r.c,border:`1px solid ${r.c}30`}}>{f}</span>)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="report-pdf">
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", position: "sticky", top: 120, minHeight: "360px", display: "flex", flexDirection: "column" }}>
                
                {isReportCompiling ? (
                  /* 1. Compiling Terminal Screen */
                  <div style={{ flex: 1, background: "#090d16", padding: "1.5rem", display: "flex", flexDirection: "column", color: reportData.kpiColor, fontFamily: "monospace", minHeight: "360px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.5rem" }}>
                      <span style={{ fontSize: "1.25rem", animation: "twinkle-star-glow 1.5s infinite" }}>⚙️</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#fff" }}>POSTURE COMPILER DAEMON</span>
                      <span style={{ fontSize: "0.68rem", marginLeft: "auto", color: "#64748b" }}>{Math.round(reportCompileProgress)}%</span>
                    </div>
                    {/* Compiling progress bar */}
                    <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 99, marginBottom: "1rem", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${reportCompileProgress}%`, background: reportData.kpiColor, transition: "width 0.2s" }} />
                    </div>
                    <div style={{ flex: 1, background: "#020617", border: "1px solid #1e293b", borderRadius: 10, padding: "0.75rem", overflowY: "auto", fontSize: "0.62rem", color: "#34d399", display: "flex", flexDirection: "column", gap: 4, maxHeight: "200px" }}>
                      {reportCompileLogs.map((log, idx) => (
                        <div key={idx} style={{ opacity: idx === reportCompileLogs.length - 1 ? 1 : 0.4 }}>{log}</div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* 2. PDF Preview Layout */
                  <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
                    
                    {/* Uncompiled Blurred Mask Gating Overlay */}
                    {!reportCompileFinished && (
                      <div style={{
                        position: "absolute", inset: 0, background: "rgba(255, 255, 255, 0.45)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, padding: "1.5rem", textAlign: "center"
                      }}>
                        <div style={{ fontSize: "2.25rem", marginBottom: "0.75rem" }}>⚙️</div>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.4rem" }}>Report Not Compiled</h4>
                        <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "1.25rem" }}>Stage the live telemetry mapping sequence to generate this report page.</p>
                        <button
                          onClick={startReportCompilation}
                          style={{
                            background: `linear-gradient(135deg, ${reportData.kpiColor}, #4f46e5)`,
                            color: "#fff", border: "none", borderRadius: 10, padding: "0.55rem 1.25rem", fontSize: "0.76rem", fontWeight: 800,
                            cursor: "pointer", boxShadow: `0 4px 12px ${reportData.kpiColor}35`, transition: "transform 0.15s"
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                        >
                          ⚡ Compile & Stage PDF
                        </button>
                      </div>
                    )}

                    {/* PDF Header */}
                    <div style={{ background: `linear-gradient(135deg, #0f172a, ${reportData.kpiColor})`, padding: "1rem 1.125rem", color: "#fff" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                        <div>
                          <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.15em" }}>PosturePilot · Confidential · CISO Brief</div>
                          <div style={{ fontSize: "0.92rem", fontWeight: 900, marginTop: 2 }}>{reportData.title}</div>
                          <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.45)", marginTop: 1 }}>{reportData.subtitle}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "2.1rem", fontWeight: 900, lineHeight: 1 }}>{reportData.score}</div>
                          <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>{reportData.scoreLabel}</div>
                          <div style={{ fontSize: "0.52rem", color: "#6ee7b7", fontWeight: 800, marginTop: 2 }}>{reportData.scoreTrend}</div>
                        </div>
                      </div>

                      {/* 3-KPI strip */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.35rem" }}>
                        {reportData.kpis.map(k => (
                          <div key={k.l} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "0.35rem 0.5rem" }}>
                            <div style={{ fontSize: "0.45rem", color: "rgba(255,255,255,0.45)", marginBottom: 1, textTransform: "uppercase", fontWeight: 700 }}>{k.l}</div>
                            <div style={{ fontSize: "0.92rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{k.v}</div>
                            <div style={{ fontSize: "0.42rem", color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{k.sub}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PDF Body */}
                    <div style={{ padding: "0.85rem 1rem", flex: 1 }}>
                      {reportData.body}
                    </div>

                    {/* PDF Footer / Locked CTA */}
                    <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "0.6rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.52rem", color: "#94a3b8" }}>Generated: May 2026</span>
                      {reportCompileFinished ? (
                        <button
                          onClick={() => setShowReportLockModal(true)}
                          style={{
                            background: "none", border: "none", color: reportData.kpiColor, fontWeight: 900, fontSize: "0.68rem",
                            cursor: "pointer", display: "flex", alignItems: "center", gap: 3
                          }}
                        >
                          <span>🔒 Download PDF</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.52rem", color: "#cbd5e1" }}>Pending staging</span>
                      )}
                    </div>

                  </div>
                )}

              </div>
            </div>
          </div>
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"1.1rem 1.5rem",marginBottom:"1rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#475569",marginBottom:"0.875rem",textTransform:"uppercase",letterSpacing:"0.08em"}}>📬 Delivery Methods</div>
            <div className="report-delivery" style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"0.875rem"}}>
              {[{icon:"📧",l:"Email",d:"Stakeholder list"},{icon:"💬",l:"Slack",d:"#security channel"},{icon:"⏰",l:"Scheduled",d:"Daily/Weekly/Monthly"},{icon:"📱",l:"Webhook",d:"JIRA · ServiceNow"},{icon:"🌐",l:"Portal",d:"Shareable link"},{icon:"🖨️",l:"Print-Ready",d:"A4/Letter PDF"}].map(d=>(
                <div key={d.l} style={{textAlign:"center"}}>
                  <div style={{fontSize:"1.5rem",marginBottom:"0.25rem"}}>{d.icon}</div>
                  <div style={{fontSize:"0.72rem",fontWeight:700,color:"#0f172a"}}>{d.l}</div>
                  <div style={{fontSize:"0.62rem",color:"#94a3b8"}}>{d.d}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="report-stats" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.875rem"}}>
            {[{v:"8 sec",l:"Avg generation time"},{v:"5+",l:"Compliance frameworks"},{v:"4 types",l:"Report formats"},{v:"6",l:"Delivery channels"}].map(s=>(
              <div key={s.l} style={{textAlign:"center",background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem"}}>
                <div style={{fontSize:"1.5rem",fontWeight:900,color:"#7c3aed"}}>{s.v}</div>
                <div style={{fontSize:"0.7rem",color:"#64748b",marginTop:"0.25rem"}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARDS */}

      {/* PRICING */}
      <section id="pricing" style={{padding:"25px 2rem 4rem",background:"linear-gradient(135deg,#f5f3ff,#eff6ff)"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#4f46e5",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>Transparent Pricing</div>
            <h2 style={{fontSize:"2rem",fontWeight:800,letterSpacing:"-0.03em",color:"#0f172a"}}>No six-figure contracts</h2>
            <p style={{color:"#64748b",marginTop:"0.5rem",fontSize:"0.875rem"}}>14-day free trial · No credit card required</p>
          </div>
          <div className="pricing-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.25rem"}}>
            {PLANS.map(p=>(
              <div key={p.name} style={{background:"#fff",border:"1px solid "+(p.pop?p.c+"60":"#e0e7ff"),borderRadius:16,padding:"1.75rem",position:"relative",transform:p.pop?"scale(1.03)":"none",boxShadow:p.pop?"0 8px 40px rgba(79,70,229,0.15)":"0 2px 8px rgba(0,0,0,0.04)"}}>
                {p.pop&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#4f46e5,#7c3aed)",color:"#fff",fontSize:"0.6rem",fontWeight:800,padding:"3px 14px",borderRadius:20,whiteSpace:"nowrap"}}>MOST POPULAR</div>}
                <div style={{fontWeight:800,color:"#0f172a",marginBottom:"0.25rem"}}>{p.name}</div>
                <div style={{marginBottom:"1.25rem"}}><span style={{fontSize:"2rem",fontWeight:900,color:p.c,fontFamily:"monospace"}}>${p.price}</span><span style={{fontSize:"0.75rem",color:"#94a3b8"}}>/mo</span></div>
                <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"1.5rem"}}>
                  {p.features.map(f=><li key={f} style={{fontSize:"0.8rem",color:"#475569",display:"flex",gap:"0.4rem"}}><span style={{color:p.c,fontWeight:700}}>✓</span>{f}</li>)}
                </ul>
                <Link href={status === 'authenticated' ? "/dashboard" : "/login"} style={{display:"block",textAlign:"center",padding:"0.7rem",background:p.pop?"linear-gradient(135deg,#4f46e5,#7c3aed)":p.c+"12",border:p.pop?"none":"1px solid "+p.c+"30",borderRadius:10,color:p.pop?"#fff":p.c,fontWeight:700,fontSize:"0.82rem",textDecoration:"none"}}>{status === 'authenticated' ? "Go to Dashboard" : p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{background:"linear-gradient(135deg,#1e1b4b,#4f46e5)",padding:"5rem 2rem",textAlign:"center"}}>
        <h2 style={{fontSize:"2.25rem",fontWeight:800,color:"#fff",marginBottom:"1rem",letterSpacing:"-0.03em"}}>Ready to pilot your security posture?</h2>
        <p style={{color:"rgba(255,255,255,0.7)",marginBottom:"2rem"}}>Upload your first scan in minutes. No credit card required.</p>
        {status === 'authenticated' ? (
          <Link href="/dashboard" style={{display:"inline-block",background:"#fff",color:"#4f46e5",fontWeight:700,fontSize:"1rem",padding:"1rem 2.5rem",borderRadius:10,textDecoration:"none",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>Go to Command Center →</Link>
        ) : (
          <Link href="/login" style={{display:"inline-block",background:"#fff",color:"#4f46e5",fontWeight:700,fontSize:"1rem",padding:"1rem 2.5rem",borderRadius:10,textDecoration:"none",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>Start Your Free Trial →</Link>
        )}
      </section>

      <footer style={{background:"#0f172a",padding:"2rem 2.5rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
        <div style={{display:"flex",flexDirection:"column",gap:"0.25rem"}}>
          <Image src="/hlogotag_v2.jpg" alt="PosturePilot" width={180} height={44} style={{objectFit:"contain",objectPosition:"left",mixBlendMode:"screen"} } onError={e=>{e.currentTarget.style.display="none";}}/>
          <span style={{color:"#94a3b8",fontWeight:400,fontSize:"0.72rem"}}>Configure · Monitor · Report · Secure</span>
        </div>
        <span style={{fontSize:"0.7rem",color:"#f1f5f9"}}>© 2026 PosturePilot · posturepilot.io</span>
      </footer>
      <button
        onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
        aria-label="Back to top"
        className="back-to-top-btn"
        style={{
          position:"fixed",bottom:"2rem",right:"2rem",zIndex:200,
          width:44,height:44,borderRadius:"50%",border:"none",cursor:"pointer",
          background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
          color:"#fff",fontSize:"1.25rem",fontWeight:700,
          boxShadow:"0 4px 20px rgba(79,70,229,0.45)",
          display:"flex",alignItems:"center",justifyContent:"center",
          opacity:showTop?1:0,
          pointerEvents:showTop?"auto":"none",
          transform:showTop?"translateY(0)":"translateY(12px)",
          transition:"opacity 0.3s ease,transform 0.3s ease,box-shadow 0.2s",
        }}
      >
        ↑
      </button>

      {/* Sign-Up / Gating CTA Modal */}
      {(showSecureLockModal || showReportLockModal || showCisoLockModal) && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {/* Glass backdrop */}
          <div 
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(6px)" }} 
            onClick={() => {
              setShowSecureLockModal(false);
              setShowReportLockModal(false);
              setShowCisoLockModal(false);
            }}
          />
          {/* Modal box */}
          <div style={{
            background: "#ffffff",
            color: "#0f172a",
            width: "95%",
            maxWidth: "460px",
            borderRadius: "20px",
            padding: "2rem",
            position: "relative",
            zIndex: 10010,
            boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.35)",
            border: "1px solid #cbd5e1",
            textAlign: "center",
            fontFamily: "Inter, sans-serif"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.75rem 0", letterSpacing: "-0.02em" }}>
              {showSecureLockModal && "Access Risk Radar Details"}
              {showReportLockModal && "Download Full PDF Briefs"}
              {showCisoLockModal && "Configure Tenant Gates"}
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.5, margin: "0 0 2rem 0" }}>
              {showSecureLockModal && "Deep Triage Explorer is restricted to authenticated users. Create a free account to search and inspect specific CVEs on your assets."}
              {showReportLockModal && "Board-ready PDF briefing downloads are encrypted. Sign up to unlock white-labeled compliance and risk reports for your stakeholders."}
              {showCisoLockModal && "Multi-tenant ledger settings and live control gates are restricted. Authenticate to manage cross-tenant client security policies."}
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link 
                href="/login"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  color: "#fff",
                  border: "none",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)",
                  transition: "transform 0.15s ease",
                  display: "block"
                }}
              >
                ✨ Create Free Account
              </Link>
              <Link 
                href="/login"
                style={{
                  background: "#f1f5f9",
                  color: "#475569",
                  border: "1px solid #cbd5e1",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "background 0.2s",
                  display: "block"
                }}
              >
                Sign In to Existing Account
              </Link>
              <button 
                onClick={() => {
                  setShowSecureLockModal(false);
                  setShowReportLockModal(false);
                  setShowCisoLockModal(false);
                }}
                style={{
                  background: "transparent",
                  color: "#94a3b8",
                  border: "none",
                  padding: "0.5rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit"
                }}
              >
                Back to Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
