
"use client";
import Link from "next/link";
import Image from "next/image";
import ShieldViz from "@/components/ShieldViz";
import MythosPromo from "@/components/MythosPromo";
import { useState, useEffect } from "react";
import { useClient } from "@/context/ClientContext";

const TABS = ["Configure","Monitor","Secure","Report"];
const BOARDS = [
  {id:"posture",icon:"🛡️",label:"Cyber Posture",val:"74",unit:"Risk Score",c:"#4f46e5"},
  {id:"cloud",icon:"☁️",label:"Cloud Security",val:"12",unit:"Open Issues",c:"#7c3aed"},
  {id:"network",icon:"🌐",label:"Network Security",val:"847",unit:"Events",c:"#0891b2"},
  {id:"infosec",icon:"📋",label:"Info Security",val:"SOC2",unit:"Compliant",c:"#059669"},
  {id:"kpi",icon:"📊",label:"Security KPIs",val:"91%",unit:"SLA",c:"#d97706"},
  {id:"appsec",icon:"🔐",label:"App Security",val:"23",unit:"Critical",c:"#dc2626"},
  {id:"traffic",icon:"📡",label:"Traffic Monitor",val:"2.4TB",unit:"Today",c:"#0891b2"},
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
  const { isEnterpriseMode } = useClient();
  const [tab,setTab]=useState("Monitor");
  const [menuOpen,setMenuOpen]=useState(false);
  const [showTop,setShowTop]=useState(false);
  const [activeMockupTab, setActiveMockupTab] = useState("Main Terminal");
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
        top: elementPosition - navHeight + 1,
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
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        const navElement = document.querySelector("nav");
        if (element) {
          const navHeight = navElement ? navElement.offsetHeight : 64;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - navHeight + 1,
            behavior: "auto"
          });
        }
      }, 150);
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
        #configure, #monitor, #secure, #report, #features { scroll-margin-top: 64px; }
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
        .nav-monitor:hover{background:#5722e1;color:#fff!important;}
        .nav-secure:hover{background:#3f7000;color:#fff!important;}
        .nav-report:hover{background:#fd590b;color:#fff!important;}
        .hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:6px;background:none;border:none;}
        .hamburger span{display:block;width:22px;height:2px;background:#0f172a;border-radius:2px;transition:all 0.2s;}
        .mobile-menu{display:none;position:absolute;top:64px;left:0;right:0;background:#fff;border-bottom:1px solid #e0e7ff;padding:1rem 1.5rem;flex-direction:column;gap:0.5rem;z-index:99;box-shadow:0 8px 24px rgba(0,0,0,0.08);}
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
      `}</style>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"#fff",backdropFilter:"blur(16px)",borderBottom:"1px solid #e0e7ff",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 1.5rem",height:64}}>
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
            href="#features" 
            className="nav-ciso-btn"
            onClick={(e) => {
              scrollToSection(e, "features");
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
          <Link href="/login" className="nav-signin" style={{color:"#64748b",fontSize:"0.875rem",textDecoration:"none",padding:"0.5rem 1rem",fontWeight:600}}>Sign in</Link>
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
      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen?" open":""}`}>
        <a href="#features" onClick={(e)=>scrollToSection(e,"features")} style={{color:"#7c3aed", fontWeight:800, borderBottom:"2px solid #e0e7ff", paddingBottom:"0.8rem", marginBottom:"0.25rem"}}>👨‍✈️ CISO Cockpit</a>
        {(["Configure","Monitor","Secure","Report"] as const).map((t,i)=>(
          <a key={t} href={"#"+t.toLowerCase()} onClick={(e)=>scrollToSection(e,t.toLowerCase())}
            style={{color:i===0?"#1e2d6e":i===1?"#4f46e5":i===2?"#16a34a":"#7c3aed"}}>{t}</a>
        ))}
        <Link href="/login" onClick={()=>setMenuOpen(false)} style={{color:"#64748b"}}>Sign in</Link>
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
            <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"#ede9fe",border:"1px solid #c4b5fd",borderRadius:20,padding:"0.375rem 1rem",fontSize:"0.85rem",fontWeight:700,color:"#4f46e5",marginBottom:"1.5rem",marginLeft:"-10px",letterSpacing:"0.08em",textTransform:"uppercase"}}>
              <span style={{width:10,height:10,borderRadius:"50%",background:"#22c55e",display:"inline-block",boxShadow:"0 0 10px #22c55e"}}/> Active AI-ASPM · 12 Security Posture Cockpits
            </div>

            <h1 style={{fontSize:"clamp(2.2rem,3.6vw,3.2rem)",fontWeight:900,letterSpacing:"-0.04em",lineHeight:1.1,color:"#0f172a",marginBottom:"1.25rem"}}>
              <span style={{color:"#010859"}}>Command Your Security</span><br/>
              <span style={{color:"#4103d9"}}>with Next-Gen AI-ASPM</span>
            </h1>

            <p style={{fontSize:"1.05rem",color:"#475569",lineHeight:1.8,marginBottom:"2rem",maxWidth:570}}>
              Stop auditing the past. Ingest live code, cloud, and host<span className="desktop-br"><br/></span>
              telemetry to orchestrate real-time clearance gates and<span className="desktop-br"><br/></span>
              auto-dispatch playbooks. Manage active threat waves,<span className="desktop-br"><br/></span>
              verify compliance guardrails, and transform fragmented<span className="desktop-br"><br/></span>
              vulnerability noise into a unified Posture Flight Deck.
            </p>

            <div className="hero-btns" style={{display:"flex",gap:"1rem",marginBottom:"2.5rem",flexWrap:"wrap"}}>
              <Link href="/login" style={{background:"linear-gradient(135deg,#4f46e5,#7c3aed)",color:"#fff",fontWeight:700,fontSize:"1rem",padding:"0.875rem 1.875rem",borderRadius:10,textDecoration:"none",boxShadow:"0 4px 20px rgba(79,70,229,0.35)"}}>Start Free Trial →</Link>
              <Link href="/dashboard?demo=true" onClick={() => sessionStorage.setItem("posturepilot_demo_mode", "true")} style={{background:"#fff",color:"#4f46e5",fontWeight:600,fontSize:"1rem",padding:"0.875rem 1.5rem",borderRadius:10,textDecoration:"none",border:"1px solid #c4b5fd"}}>View Demo</Link>
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
      <section id="configure" style={{scrollMarginTop:"64px",padding:"25px 2rem 4rem",background:"#fff",minHeight:"100vh",display:"flex",alignItems:"flex-start"}}>
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

      {/* ── MONITOR ── */}
      <section id="monitor" style={{scrollMarginTop:"64px",padding:"25px 2rem 14rem",background:"linear-gradient(135deg,#1e2d6e 0%,#2d1b69 50%,#3b0764 100%)",color:"#fff",minHeight:"100vh",display:"flex",alignItems:"flex-start"}}>
        <div style={{maxWidth:1100,margin:"0 auto",width:"100%"}}>
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

            <div className="monitor-inner" style={{display:"grid",gridTemplateColumns:"200px 1fr",minHeight:580}}>
              <div className="monitor-sidebar" style={{background:"#f1f5f9",padding:"1rem 0.5rem",borderRight:"1px solid #e2e8f0"}}>
                {[
                  {icon:"🏢",label:"Main Terminal"},
                  {icon:"🛡️",label:"Posture Clearance",badge:"3"},
                  {icon:"☁️",label:"Cloud Altitude"},
                  {icon:"📋",label:"Compliance Checkpoint"},
                  {icon:"🚨",label:"Dispatch Center",badge:"SOAR"},
                ].map(item=>(
                  <div key={item.label} onClick={() => setActiveMockupTab(item.label)}
                    style={{
                      display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.5rem 0.875rem",
                      background:item.label === activeMockupTab ? "rgba(124,58,237,0.08)" : "transparent",
                      borderLeft:item.label === activeMockupTab ? "3px solid #7c3aed" : "3px solid transparent",
                      color:item.label === activeMockupTab ? "#7c3aed" : "#64748b",
                      marginBottom:4,cursor:"pointer",borderRadius:6,
                      transition:"all 0.15s ease",
                      fontWeight:item.label === activeMockupTab ? 700 : 500
                    }}
                    onMouseEnter={e => { if (item.label !== activeMockupTab) { e.currentTarget.style.background = "rgba(0,0,0,0.03)"; e.currentTarget.style.color = "#0f172a"; } }}
                    onMouseLeave={e => { if (item.label !== activeMockupTab) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; } }}>
                    <span style={{fontSize:"0.8rem"}}>{item.icon}</span>
                    <span style={{fontSize:"0.72rem",flex:1}}>{item.label}</span>
                    {item.badge && <span style={{fontSize:"0.55rem",fontWeight:800,padding:"1px 6px",borderRadius:99,
                      background:item.badge==="NEW"?"#7c3aed":item.badge==="SOAR"?"#16a34a":"rgba(220,38,38,0.1)",
                      color:item.badge==="NEW"?"#fff":item.badge==="SOAR"?"#16a34a":"#dc2626",
                      border: item.badge!=="NEW"&&item.badge!=="SOAR"? "1px solid rgba(220,38,38,0.2)":"none"
                    }}>{item.badge}</span>}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div style={{padding:"1.25rem",display:"flex",flexDirection:"column",gap:"1.1rem",overflow:"hidden",background:"#f8fafc"}}>

                {activeMockupTab === "Main Terminal" && (
                  <>
                    {/* KPI row */}
                    <div className="monitor-kpi" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.875rem"}}>
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

                    {/* Middle row */}
                    <div className="monitor-mid" style={{display:"grid",gridTemplateColumns:"1fr 1.1fr",gap:"0.875rem"}}>
                      {/* Findings breakdown */}
                      <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem"}}>
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

                      {/* Active Threat Stream */}
                      <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem"}}>
                        <div style={{fontSize:"0.72rem",fontWeight:800,color:"#0f172a",marginBottom:"0.75rem",display:"flex",alignItems:"center",gap:"0.4rem"}}>🚨 Real-Time Security Alarms</div>
                        <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                          {[
                            {sev:"CRIT",cve:"CVE-2024-3400",host:"edge-ingress-fw01",c:"#dc2626",bg:"#fef2f2",border:"#fecaca"},
                            {sev:"HIGH",cve:"CVE-2024-21762",host:"financial-db-02",c:"#ea580c",bg:"#fff7ed",border:"#ffedd5"},
                            {sev:"HIGH",cve:"CVE-2023-44487",host:"public-lb-01",c:"#ea580c",bg:"#fff7ed",border:"#ffedd5"},
                            {sev:"MED",cve:"CVE-2024-1086",host:"corp-auth-app-03",c:"#d97706",bg:"#fefbeb",border:"#fef3c7"},
                          ].map((a,i)=>(
                            <div key={i} style={{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.45rem 0.6rem",borderRadius:8,background:a.bg,border:`1px solid ${a.border}`}}>
                              <span style={{fontSize:"0.58rem",fontWeight:900,padding:"2px 6px",borderRadius:4,background:a.c,color:"#fff",minWidth:34,textAlign:"center"}}>{a.sev}</span>
                              <span style={{fontSize:"0.68rem",color:"#0f172a",fontFamily:"monospace",flex:1,fontWeight:600}}>{a.cve}</span>
                              <span style={{fontSize:"0.65rem",color:"#64748b",fontFamily:"monospace"}}>{a.host}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom row */}
                    <div className="monitor-bot" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.875rem"}}>
                      {[
                        {icon:"☁️",label:"Cloud Security",val:"47 findings",sub:"3 exposed S3 buckets",c:"#2563eb"},
                        {icon:"🌐",label:"Network Runway",val:"34 open ports",sub:"2 SLA breach metrics",c:"#dc2626"},
                        {icon:"🔐",label:"App Security Check",val:"14 active vulns",sub:"OWASP Top 10 vectors",c:"#7c3aed"},
                      ].map(d=>(
                        <div key={d.label} style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"0.875rem",borderLeft:`4px solid ${d.c}`,boxShadow:"0 1px 3px rgba(0,0,0,0.02)"}}>
                          <div style={{fontSize:"1rem",marginBottom:"0.3rem"}}>{d.icon}</div>
                          <div style={{fontSize:"0.68rem",fontWeight:800,color:"#0f172a",marginBottom:"0.2rem"}}>{d.label}</div>
                          <div style={{fontSize:"0.9rem",fontWeight:900,color:d.c}}>{d.val}</div>
                          <div style={{fontSize:"0.6rem",color:"#64748b",marginTop:4}}>{d.sub}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}



                {activeMockupTab === "Posture Clearance" && (
                  <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                    <div style={{borderBottom:"1px solid #e2e8f0",paddingBottom:"0.75rem"}}>
                      <div style={{fontSize:"1.1rem",fontWeight:800,color:"#0f172a",display:"flex",alignItems:"center",gap:"0.4rem"}}>🛡️ Cyber Posture Clearance</div>
                      <div style={{fontSize:"0.75rem",color:"#64748b",marginTop:"0.25rem"}}>Clearance rated over the past 90 days. Joint posture trends are compiled in real-time.</div>
                    </div>

                    <div style={{display:"grid",gridTemplateColumns:"1fr 1.3fr",gap:"0.875rem"}}>
                      {/* Left: Giant Dial */}
                      <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1.25rem",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
                        <div style={{position:"relative",width:130,height:130,display:"flex",alignItems:"center",justifyContent:"center"}}>
                          {/* Radial indicator SVG */}
                          <svg viewBox="0 0 100 100" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",transform:"rotate(-90deg)"}}>
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#7c3aed" strokeWidth="8" strokeDasharray="185 251" strokeLinecap="round" style={{filter:"drop-shadow(0 2px 4px rgba(124,58,237,0.2))"}}/>
                          </svg>
                          <div>
                            <div style={{fontSize:"2rem",fontWeight:900,color:"#0f172a",lineHeight:1}}>74%</div>
                            <div style={{fontSize:"0.55rem",color:"#16a34a",fontWeight:800,marginTop:2,letterSpacing:"0.05em"}}>APPROVED</div>
                          </div>
                        </div>
                        <div style={{fontSize:"0.75rem",fontWeight:700,color:"#0f172a",marginTop:"1rem"}}>Joint Posture Index Score</div>
                        <div style={{fontSize:"0.58rem",color:"#64748b",marginTop:"0.25rem"}}>Acme Corp Business Ledger Gatekeeper</div>
                      </div>

                      {/* Right: Gorgeous Trend Line */}
                      <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                        <div style={{fontSize:"0.68rem",fontWeight:800,color:"#0f172a",marginBottom:"0.5rem"}}>📈 Historical Posture Trend — 90 Days</div>
                        
                        <div style={{height:100,width:"100%",position:"relative",marginTop:"0.5rem"}}>
                          {/* Glowing linechart using SVGs */}
                          <svg viewBox="0 0 200 100" style={{width:"100%",height:"100%",overflow:"visible"}}>
                            <defs>
                              <linearGradient id="chartGlowLight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15"/>
                                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
                              </linearGradient>
                            </defs>
                            {/* Grid lines */}
                            <line x1="0" y1="20" x2="200" y2="20" stroke="#f1f5f9" strokeWidth="1"/>
                            <line x1="0" y1="50" x2="200" y2="50" stroke="#f1f5f9" strokeWidth="1"/>
                            <line x1="0" y1="80" x2="200" y2="80" stroke="#f1f5f9" strokeWidth="1"/>
                            
                            {/* Area fill */}
                            <path d="M 0,82 C 30,79 60,85 90,71 C 120,62 150,45 200,34 L 200,100 L 0,100 Z" fill="url(#chartGlowLight)"/>
                            {/* Stroke line */}
                            <path d="M 0,82 C 30,79 60,85 90,71 C 120,62 150,45 200,34" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" style={{filter:"drop-shadow(0 2px 4px rgba(124,58,237,0.15))"}}/>
                            
                            {/* Highlight dot */}
                            <circle cx="200" cy="34" r="4.5" fill="#fff" stroke="#7c3aed" strokeWidth="2" style={{filter:"drop-shadow(0 2px 4px rgba(124,58,237,0.2))"}}/>
                          </svg>
                        </div>

                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.58rem",color:"#64748b",marginTop:"0.5rem"}}>
                          <span>Feb 2026 (82%)</span>
                          <span>Mar 2026</span>
                          <span>Apr 2026</span>
                          <span style={{fontWeight:800,color:"#16a34a"}}>May 2026 (74% Clear)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeMockupTab === "Cloud Altitude" && (
                  <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                    <div style={{borderBottom:"1px solid #e2e8f0",paddingBottom:"0.75rem"}}>
                      <div style={{fontSize:"1.1rem",fontWeight:800,color:"#0f172a",display:"flex",alignItems:"center",gap:"0.4rem"}}>☁️ Multicloud Asset Altitude Tracker</div>
                      <div style={{fontSize:"0.75rem",color:"#64748b",marginTop:"0.25rem"}}>Unified cloud security posture (CSPM) mapping active VM assets, clusters, and database endpoints.</div>
                    </div>

                    <div style={{display:"grid",gridTemplateColumns:"1fr 1.3fr",gap:"0.875rem"}}>
                      {/* Exposed Buckets Hot-patch Panel */}
                      <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                        <div>
                          <div style={{fontSize:"0.68rem",fontWeight:800,color:"#dc2626",marginBottom:"0.5rem"}}>⚠️ 3 EXPOSED STORAGE OBJECTS FOUND</div>
                          <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
                            {["acme-financial-audit-logs","hr-employee-passports","retail-pos-backups"].map((bucket)=>(
                              <div key={bucket} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fef2f2",border:"1px solid #fecaca",padding:"0.35rem 0.5rem",borderRadius:6}}>
                                <span style={{fontSize:"0.65rem",fontFamily:"monospace",color:"#0f172a"}}>{bucket}</span>
                                <span style={{fontSize:"0.55rem",fontWeight:800,color:"#dc2626"}}>PUBLIC READ</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button style={{marginTop:"1rem",background:"linear-gradient(135deg,#dc2626,#b91c1c)",color:"#fff",border:"none",borderRadius:8,padding:"0.5rem",fontWeight:800,fontSize:"0.72rem",cursor:"pointer",boxShadow:"0 4px 12px rgba(220,38,38,0.2)"}}>⚡ Lock Bucket Access Now</button>
                      </div>

                      {/* Active Integrations Inventory */}
                      <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem"}}>
                        <div style={{fontSize:"0.68rem",fontWeight:800,color:"#0f172a",marginBottom:"0.75rem"}}>☁️ Ingested Multicloud Environments</div>
                        <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
                          {[
                            {cloud:"AWS Amazon Web Services",assets:"104 active VMs, 4 RDS instances",pct:96,c:"#ff9900",img:"/logos/aws.svg"},
                            {cloud:"Microsoft Azure Cloud",assets:"67 active VMs, 2 SQL containers",pct:99,c:"#0078d4",img:"/logos/azure.png"},
                            {cloud:"Google Cloud Platform (GCP)",assets:"24 Container nodes, 1 registry",pct:88,c:"#34a853",img:"/logos/google.png"},
                          ].map((item,i)=>(
                            <div key={i} style={{display:"flex",alignItems:"center",gap:"0.75rem",background:"#f8fafc",padding:"0.5rem",borderRadius:8,border:"1px solid #e2e8f0"}}>
                              <div style={{width:24,height:24,borderRadius:4,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",padding:2,border:"1px solid #e2e8f0"}}>
                                <img src={item.img} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}} onError={e=>{(e.currentTarget).style.display="none";}}/>
                              </div>
                              <div style={{flex:1}}>
                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.68rem",fontWeight:700,color:"#0f172a"}}>
                                  <span>{item.cloud}</span>
                                  <span style={{color:item.pct>95?"#16a34a":"#d97706"}}>{item.pct}% Secure</span>
                                </div>
                                <div style={{fontSize:"0.58rem",color:"#64748b",marginTop:2}}>{item.assets}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeMockupTab === "Compliance Checkpoint" && (
                  <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                    <div style={{borderBottom:"1px solid #e2e8f0",paddingBottom:"0.75rem"}}>
                      <div style={{fontSize:"1.1rem",fontWeight:800,color:"#0f172a",display:"flex",alignItems:"center",gap:"0.4rem"}}>📋 Regulatory Compliance & Auditing Registry</div>
                      <div style={{fontSize:"0.75rem",color:"#64748b",marginTop:"0.25rem"}}>Maps active scan vulnerabilities and system misconfigurations to GRC controls automatically.</div>
                    </div>

                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.875rem"}}>
                      {[
                        {title:"SOC2 Type II",cov:"87%",c:"#7c3aed",
                          checks:[{l:"IAM Access Rules",v:true},{l:"MFA Enforced",v:true},{l:"Database Backup Key",v:true},{l:"Exploit SLA Window",v:false}]},
                        {title:"ISO 27001",cov:"79%",c:"#4f46e5",
                          checks:[{l:"Risk Registry Pass",v:true},{l:"Business Continuity",v:true},{l:"Audit Log Retention",v:false},{l:"Edge Encryption",v:false}]},
                        {title:"NIST CSF v2.0",cov:"92%",c:"#059669",
                          checks:[{l:"Vulnerability Triage",v:true},{l:"Incident Plan Pass",v:true},{l:"Fleet Patch Rate",v:true},{l:"Shadow AI Blocks",v:true}]},
                      ].map((fw,i)=>(
                        <div key={i} style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem",borderTop:`3px solid ${fw.c}`,boxShadow:"0 1px 3px rgba(0,0,0,0.02)"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"}}>
                            <span style={{fontSize:"0.8rem",fontWeight:800,color:"#0f172a"}}>{fw.title}</span>
                            <span style={{fontSize:"0.62rem",fontWeight:800,color:fw.c}}>{fw.cov} Coverage</span>
                          </div>
                          {/* Compliance Bar */}
                          <div style={{height:4,background:"#f1f5f9",borderRadius:99,overflow:"hidden",marginBottom:"0.75rem"}}>
                            <div style={{height:"100%",width:fw.cov,background:fw.c,borderRadius:99}}/>
                          </div>
                          {/* Checklist */}
                          <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
                            {fw.checks.map((ch,idx)=>(
                              <div key={idx} style={{display:"flex",alignItems:"center",gap:"0.4rem",fontSize:"0.62rem",color:ch.v?"#0f172a":"#64748b"}}>
                                <span style={{fontWeight:800,color:ch.v?"#16a34a":"#dc2626"}}>{ch.v?"✓":"✗"}</span>
                                <span>{ch.l}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeMockupTab === "Dispatch Center" && (
                  <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                    <div style={{borderBottom:"1px solid #e2e8f0",paddingBottom:"0.75rem"}}>
                      <div style={{fontSize:"1.1rem",fontWeight:800,color:"#0f172a",display:"flex",alignItems:"center",gap:"0.4rem"}}>🚨 Automated SOAR Dispatch Center</div>
                      <div style={{fontSize:"0.75rem",color:"#64748b",marginTop:"0.25rem"}}>Real-time automated incident tickets mapping assignees, endpoints, and active SLA altimeters.</div>
                    </div>

                    <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:"0.875rem"}}>
                      {/* Active Tickets Ledger */}
                      <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem"}}>
                        <div style={{fontSize:"0.68rem",fontWeight:800,color:"#0f172a",marginBottom:"0.6rem"}}>🎟️ Active Ticket Queue</div>
                        <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                          {[
                            {id:"PP-104",title:"Critical CVE-2024-3400 Inbound",owner:"Sarah Connor",sla:"3.2 hrs",c:"#dc2626"},
                            {id:"PP-102",title:"High CVE-2024-21762 SQL Bypass",owner:"Devon Vance",sla:"2.4 days",c:"#ea580c"},
                            {id:"PP-098",title:"High Outbound Port Sweep Sweep",owner:"Marcus Brody",sla:"4.8 days",c:"#ea580c"}
                          ].map((t)=>(
                            <div key={t.id} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:"0.5rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                              <div>
                                <div style={{fontSize:"0.68rem",fontWeight:800,color:"#0f172a",display:"flex",alignItems:"center",gap:"0.3rem"}}>
                                  <span style={{color:t.c}}>{t.id}</span> | <span>{t.title}</span>
                                </div>
                                <div style={{fontSize:"0.58rem",color:"#64748b",marginTop:2}}>Lead Assignee: {t.owner}</div>
                              </div>
                              <div style={{textAlign:"right"}}>
                                <div style={{fontSize:"0.65rem",fontWeight:800,color:t.c}}>⚡ {t.sla}</div>
                                <div style={{fontSize:"0.55rem",color:"#64748b",marginTop:2}}>SLA REMAINING</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Scrolling Console log mockup (STAYS DARK FOR CONTRAST) */}
                      <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:"1rem",fontFamily:"monospace",display:"flex",flexDirection:"column",justifyContent:"space-between",height:170}}>
                        <div style={{fontSize:"0.58rem",color:"#818cf8",textTransform:"uppercase",letterSpacing:"0.08em",borderBottom:"1px solid rgba(255,255,255,0.08)",paddingBottom:"0.3rem",marginBottom:"0.5rem"}}>📟 Live Orchestration Engine Logs</div>
                        <div style={{fontSize:"0.58rem",color:"#22c55e",lineHeight:1.45,display:"flex",flexDirection:"column",gap:"0.25rem",overflow:"hidden",flex:1}}>
                          <div>[12:04:10] Ingesting Qualys VMDR scan telemetry...</div>
                          <div>[12:04:12] Found 3 exposed bucket objects in AWS S3.</div>
                          <div style={{color:"#eab308"}}>[12:04:15 WARNING] Overdue SLA detected on asset "db-02".</div>
                          <div>[12:04:18] Auto-dispatched incident PP-104 to Sarah Connor.</div>
                          <div>[12:04:21] Slack alerts webhook pipeline routed successfully.</div>
                        </div>
                        <div style={{fontSize:"0.58rem",color:"#64748b",borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:"0.3rem",marginTop:"0.3rem"}}>console: soar_engine.sh --active</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeMockupTab !== "Main Terminal" && activeMockupTab !== "CISO Cockpit" && activeMockupTab !== "Posture Clearance" && activeMockupTab !== "Cloud Altitude" && activeMockupTab !== "Compliance Checkpoint" && activeMockupTab !== "Dispatch Center" && (
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"4rem 2rem",gap:"1rem"}}>
                    <div style={{fontSize:"2.5rem"}}>📡</div>
                    <div style={{fontSize:"1.1rem",fontWeight:800,color:"#0f172a"}}>{activeMockupTab} View</div>
                    <div style={{fontSize:"0.75rem",color:"#64748b",maxWidth:340,lineHeight:1.6}}>Integrating real-time security telemetry from this layer... Click "View Demo" or explore other command sidebar tabs.</div>
                  </div>
                )}

              </div>
            </div>

            {/* Status bar */}
            <div style={{background:"#f8fafc",padding:"0.625rem 1.25rem",borderTop:"1px solid #e2e8f0",display:"flex",gap:"1.5rem",alignItems:"center"}}>
              {[
                {label:"3 Scanners Active",c:"#16a34a"},
                {label:"12 Assets Monitored",c:"#2563eb"},
                {label:"2 SLA Breaches",c:"#dc2626"},
                {label:"Last Scan: 4 min ago",c:"#64748b"},
              ].map(s=>(
                <span key={s.label} style={{fontSize:"0.62rem",color:s.c,fontWeight:600}}>{s.label}</span>
              ))}
              <span style={{marginLeft:"auto",fontSize:"0.62rem",color:"#64748b"}}>PosturePilot v2.0 · posturepilot.io</span>
            </div>
          </div>


          <div style={{textAlign:"center",marginTop:"1.25rem"}}>
            <Link href="/dashboard" style={{display:"inline-block",background:"#fff",color:"#1e2d6e",padding:"0.75rem 2rem",borderRadius: 10, textDecoration: "none", border: "1px solid #cbd5e1", fontWeight: 700, fontSize: "0.88rem"}}>
              View Full Dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECURE ── */}
      <section id="secure" style={{scrollMarginTop:"64px",padding:"25px 2rem 4rem",background:"linear-gradient(135deg,#14532d 0%,#15803d 50%,#16a34a 100%)",minHeight:"100vh",display:"flex",alignItems:"flex-start"}}>
        <div style={{maxWidth:1200,margin:"0 auto",width:"100%"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#bbf7d0",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>🔒 Secure</div>
            <h2 style={{fontSize:"clamp(1.75rem,3vw,2.25rem)",fontWeight:800,color:"#fff",letterSpacing:"-0.03em"}}>Triple-Filter Triage Sandbox</h2>
            <p style={{color:"#bbf7d0",marginTop:"0.5rem",fontSize:"0.9rem"}}>Adjust the risk criteria to test our 3-layer noise reduction engine in real-time.</p>
          </div>

          {/* Dynamic Simulator Controls */}
          <div style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: 16,
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
            color: "#fff",
            boxShadow: "0 8px 32px rgba(20, 83, 45, 0.15)"
          }}>
            <div style={{ flex: "1 1 300px" }}>
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

            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700 }}>
                <input 
                  type="checkbox" 
                  checked={cisaKevOnly} 
                  onChange={e => setCisaKevOnly(e.target.checked)} 
                  style={{ width: 16, height: 16, accentColor: "#bbf7d0", cursor: "pointer" }}
                />
                ⚡ CISA KEV Listed Only
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700 }}>
                <input 
                  type="checkbox" 
                  checked={tier1Only} 
                  onChange={e => setTier1Only(e.target.checked)} 
                  style={{ width: 16, height: 16, accentColor: "#bbf7d0", cursor: "pointer" }}
                />
                🏢 Tier-1 Prod Assets Only
              </label>
            </div>
          </div>

          <div className="secure-main" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem",marginBottom:"1.5rem"}}>

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
      <section id="report" style={{scrollMarginTop:"64px",padding:"25px 2rem 4rem",background:"#f8fafc",minHeight:"100vh",display:"flex",alignItems:"flex-start"}}>
        <div style={{maxWidth:1200,margin:"0 auto",width:"100%"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#7c3aed",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>📄 Report</div>
            <h2 style={{fontSize:"clamp(1.75rem,3vw,2.25rem)",fontWeight:800,color:"#0f172a",letterSpacing:"-0.03em"}}>Board-ready reports in one click</h2>
            <p style={{color:"#64748b",marginTop:"0.5rem",fontSize:"0.9rem"}}>From executive PDF to compliance mapping — auto-generated, white-labeled, delivered to your stakeholders.</p>
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
              {/* Horizontal Tabs Above Card */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '0.75rem', overflowX: 'auto', paddingBottom: '4px' }}>
                {[
                  { key: "Briefing", label: "Briefing", c: "#7c3aed" },
                  { key: "Summary", label: "Summary", c: "#4f46e5" },
                  { key: "Technical", label: "Technical", c: "#0891b2" },
                  { key: "SLA", label: "SLA", c: "#dc2626" },
                  { key: "Compliance", label: "Compliance", c: "#16a34a" }
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => {
                      setActiveReportTab(t.key);
                      setReportCompileFinished(false);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 8,
                      border: 'none',
                      background: activeReportTab === t.key ? t.c : 'rgba(124, 58, 237, 0.08)',
                      color: activeReportTab === t.key ? '#fff' : '#475569',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", position: "sticky", top: 80, minHeight: "360px", display: "flex", flexDirection: "column" }}>
                
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
      <section id="features" style={{padding:"25px 2rem 14rem",maxWidth:1200,margin:"0 auto",scrollMarginTop:"64px"}}>
        <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
          <div style={{fontSize:"0.68rem",fontWeight:700,color:"#4f46e5",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>12 Modules · One Command Center</div>
          <h2 style={{fontSize:"clamp(1.75rem,3vw,2.25rem)",fontWeight:800,letterSpacing:"-0.03em",color:"#0f172a"}}>Everything your CISO needs to see</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"1rem"}}>
          {BOARDS.map(d=>(
            <Link key={d.id} href={d.id === 'ai-risk' ? '/ai-risk' : "/dashboard/"+d.id} className="hcard" style={{display:"block",textDecoration:"none",background:"#fff",border:"1px solid #e0e7ff",borderRadius:14,padding:"1.25rem 1.5rem",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",position:"relative"}}>
              {d.isNew&&<div style={{position:"absolute",top:10,right:10,background:"linear-gradient(135deg,#ea580c,#7c3aed)",color:"#fff",fontSize:"0.55rem",fontWeight:800,padding:"2px 8px",borderRadius:8}}>NEW</div>}
              <div style={{width:42,height:42,borderRadius:10,background:d.c+"15",border:"1px solid "+d.c+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.25rem",marginBottom:"0.875rem"}}>{d.icon}</div>
              <div style={{fontWeight:700,fontSize:"0.9rem",color:"#0f172a",marginBottom:"0.5rem"}}>{d.label}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:"0.375rem"}}>
                <span style={{fontSize:"1.5rem",fontWeight:900,color:d.c,fontFamily:"monospace",letterSpacing:"-0.03em"}}>{d.val}</span>
                <span style={{fontSize:"0.72rem",color:"#94a3b8",fontWeight:600}}>{d.unit}</span>
              </div>
              <div style={{marginTop:"0.625rem",height:4,background:"#f1f5f9",borderRadius:4}}>
                <div style={{height:"100%",width:"70%",background:"linear-gradient(90deg,"+d.c+","+d.c+"88)",borderRadius:4}}/>
              </div>
            </Link>
          ))}
        </div>

        {/* CISO Cockpit Aggregate Score HUD Section Under 12 Tiles */}
        <div style={{marginTop: "3rem", width: "100%"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e0e7ff", paddingBottom: "0.875rem", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem"}}>
            <div>
              <div style={{fontSize: "0.68rem", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.12em"}}>👨‍✈️ CISO Cockpit Feature Preview</div>
              <h3 style={{fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem"}}>Aggregated Multi-Tenant Score HUD</h3>
            </div>
            <span style={{fontSize: "0.68rem", fontWeight: 800, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", padding: "4px 10px", borderRadius: 8, color: "#7c3aed"}}>
              🔒 ENTERPRISE PREVIEW
            </span>
          </div>

          {/* Live Simulator Control Bar */}
          <div style={{
            background: cisoThreatActive ? "rgba(220, 38, 38, 0.05)" : "rgba(255, 255, 255, 0.6)",
            border: cisoThreatActive ? "1px solid rgba(220, 38, 38, 0.25)" : "1px solid #e0e7ff",
            borderRadius: 16,
            padding: "1.25rem 1.5rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
            boxShadow: cisoThreatActive ? "0 8px 30px rgba(220, 38, 38, 0.1)" : "0 4px 15px rgba(0,0,0,0.02)",
            transition: "all 0.3s ease"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: cisoThreatActive ? "#dc2626" : "#10b981",
                boxShadow: cisoThreatActive ? "0 0 10px #dc2626" : "0 0 10px #10b981",
                animation: cisoThreatActive ? "twinkle-star-glow 1s infinite" : "none"
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

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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

          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1rem", marginBottom: "2rem"}}>
            
            {/* Card 1: Assets */}
            <div 
              className={cisoThreatActive ? "ciso-flash-active" : ""}
              style={{background: "#fff", border: "1px solid #e0e7ff", borderRadius: 16, padding: "1.25rem", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", transition: "all 0.3s ease"}}
            >
              <div>
                <div style={{position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: "#7c3aed", borderRadius: "16px 0 0 16px"}}/>
                <div style={{fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em"}}>Combined Assets Count</div>
                <div style={{fontSize: "2rem", fontWeight: 900, color: "#7c3aed", marginTop: "0.5rem", fontFamily: "monospace"}}>69,860</div>
              </div>
              <div style={{display: "flex", flexWrap: "wrap", gap: "4px", fontSize: "0.58rem", fontWeight: 800, color: "#94a3b8", borderTop: "1px solid #f1f5f9", paddingTop: "0.5rem", marginTop: "0.75rem"}}>
                {["WF: 14.2K", "TY: 9.4K", "UR: 5.1K", "CS: 28.4K", "WD: 12.6K"].map((t, idx) => {
                  const colors = ["#dc2626", "#ea580c", "#10b981", "#06b6d4", "#a855f7"];
                  return (
                    <span 
                      key={idx} 
                      className="tenant-pill-wrap" 
                      onClick={() => setShowCisoLockModal(true)}
                      style={{background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, color: colors[idx], position: "relative", cursor: "pointer"}}
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
              style={{background: "#fff", border: "1px solid #e0e7ff", borderRadius: 16, padding: "1.25rem", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", transition: "all 0.3s ease"}}
            >
              <div>
                <div style={{position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: cisoThreatActive ? "#dc2626" : "#10b981", borderRadius: "16px 0 0 16px", transition: "background 0.3s"}}/>
                <div style={{fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em"}}>Unified Compliance Score</div>
                <div style={{fontSize: "2rem", fontWeight: 900, color: cisoThreatActive ? "#dc2626" : "#10b981", marginTop: "0.5rem", fontFamily: "monospace", transition: "color 0.3s"}}>
                  {cisoThreatActive ? "42.6%" : "85.8%"}
                </div>
              </div>
              <div style={{fontSize: "0.68rem", fontWeight: 700, color: cisoThreatActive ? "#dc2626" : "#10b981", marginTop: "0.75rem", borderTop: "1px solid #f1f5f9", paddingTop: "0.5rem", transition: "color 0.3s"}}>
                {cisoThreatActive ? "🔴 CRITICAL SLA BREACH" : "🟢 Meets target SLA threshold"}
              </div>
            </div>

            {/* Card 3: Risks */}
            <div 
              className={cisoThreatActive ? "ciso-flash-active" : ""}
              style={{background: "#fff", border: "1px solid #e0e7ff", borderRadius: 16, padding: "1.25rem", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", transition: "all 0.3s ease"}}
            >
              <div>
                <div style={{position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: "#dc2626", borderRadius: "16px 0 0 16px"}}/>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                  <div style={{fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em"}}>Total Open Critical Risks</div>
                  {cisoThreatActive && (
                    <span style={{background: "#fee2e2", color: "#ef4444", fontSize: "0.55rem", fontWeight: 900, padding: "2px 6px", borderRadius: 6, animation: "twinkle-star-glow 1s infinite"}}>
                      ▲ +148 SPIKE
                    </span>
                  )}
                </div>
                <div style={{fontSize: "2rem", fontWeight: 900, color: "#dc2626", marginTop: "0.5rem", fontFamily: "monospace"}}>
                  {cisoThreatActive ? "178" : "30"}
                </div>
              </div>
              <div style={{display: "flex", flexWrap: "wrap", gap: "4px", fontSize: "0.58rem", fontWeight: 800, color: "#94a3b8", borderTop: "1px solid #f1f5f9", paddingTop: "0.5rem", marginTop: "0.75rem"}}>
                {(cisoThreatActive 
                  ? ["WF: 68", "TY: 42", "UR: 25", "CS: 18", "WD: 25"] 
                  : ["WF: 12", "TY: 6", "UR: 3", "CS: 1", "WD: 8"]
                ).map((t, idx) => {
                  const colors = ["#dc2626", "#ea580c", "#10b981", "#06b6d4", "#a855f7"];
                  return (
                    <span 
                      key={idx} 
                      className="tenant-pill-wrap" 
                      onClick={() => setShowCisoLockModal(true)}
                      style={{background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, color: colors[idx], position: "relative", cursor: "pointer"}}
                    >
                      {t} {cisoThreatActive ? "Critical" : "Critical"}
                      <span className="tenant-lock-overlay">🔒 Locked</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Card 4: SLA status */}
            <div 
              className={cisoThreatActive ? "ciso-flash-active" : ""}
              style={{background: "#fff", border: "1px solid #e0e7ff", borderRadius: 16, padding: "1.25rem", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", transition: "all 0.3s ease"}}
            >
              <div>
                <div style={{position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: cisoThreatActive ? "#dc2626" : "#ea580c", borderRadius: "16px 0 0 16px", transition: "background 0.3s"}}/>
                <div style={{fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em"}}>SLA Conformance Status</div>
                <div style={{fontSize: "1.35rem", fontWeight: 900, color: cisoThreatActive ? "#dc2626" : "#ea580c", marginTop: "0.75rem", textTransform: "uppercase", transition: "color 0.3s"}}>
                  {cisoThreatActive ? "CRITICAL BREACH" : "CONFORMANCE"}
                </div>
              </div>
              <div style={{fontSize: "0.68rem", fontWeight: 600, color: "#475569", marginTop: "0.75rem", borderTop: "1px solid #f1f5f9", paddingTop: "0.5rem"}}>
                {cisoThreatActive ? "1,248 total issues in queue" : "434 total issues in queue"}
              </div>
            </div>

          </div>

          {/* Informative Marketing Pill */}
          <div style={{display: "flex", justifyContent: "center", borderTop: "1px solid #e0e7ff", paddingTop: "1.25rem"}}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1.25rem",
              borderRadius: 99,
              background: "rgba(124,58,237,0.06)",
              border: "1px solid rgba(124,58,237,0.2)",
              boxShadow: "0 2px 10px rgba(124,58,237,0.04)"
            }}>
              <span style={{width: 6,height: 6,borderRadius: "50%",background: "#7c3aed",display: "inline-block",boxShadow: "0 0 8px rgba(124,58,237,0.5)",animation: "twinkle-star-glow 1s infinite"}} />
              <span style={{fontSize: "0.75rem",fontWeight: 700,color: "#7c3aed",letterSpacing: "0.01em"}}>
                📡 Real-time multi-tenant posture intelligence — built for the CISO chair
              </span>
            </div>
          </div>

        </div>
      </section>

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
                <Link href="/login" style={{display:"block",textAlign:"center",padding:"0.7rem",background:p.pop?"linear-gradient(135deg,#4f46e5,#7c3aed)":p.c+"12",border:p.pop?"none":"1px solid "+p.c+"30",borderRadius:10,color:p.pop?"#fff":p.c,fontWeight:700,fontSize:"0.82rem",textDecoration:"none"}}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{background:"linear-gradient(135deg,#1e1b4b,#4f46e5)",padding:"5rem 2rem",textAlign:"center"}}>
        <h2 style={{fontSize:"2.25rem",fontWeight:800,color:"#fff",marginBottom:"1rem",letterSpacing:"-0.03em"}}>Ready to pilot your security posture?</h2>
        <p style={{color:"rgba(255,255,255,0.7)",marginBottom:"2rem"}}>Upload your first scan in minutes. No credit card required.</p>
        <Link href="/login" style={{display:"inline-block",background:"#fff",color:"#4f46e5",fontWeight:700,fontSize:"1rem",padding:"1rem 2.5rem",borderRadius:10,textDecoration:"none",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>Start Your Free Trial →</Link>
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
