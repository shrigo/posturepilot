"use client";
import React, { useState, useEffect, useRef } from "react";

const FEATURES = [
  { id: "posture", title: "Cyber Posture", icon: "🛡️", desc: "Joint posture index & real-time clearance." },
  { id: "cloud", title: "Cloud Security", icon: "☁️", desc: "Multicloud asset altitude & exposed buckets." },
  { id: "network", title: "Network Security", icon: "🌐", desc: "Traffic routing & perimeter defense logs." },
  { id: "appsec", title: "App Security", icon: "🔐", desc: "Vulnerability funnel & CI/CD pipeline blocks." },
  { id: "ai-risk", title: "AI Risk", icon: "🤖", desc: "Shadow AI models & unvetted LLM usage." },
  { id: "secure", title: "Risk Radar", icon: "📡", desc: "Hyper-prioritization & noise reduction." },
  { id: "identity", title: "Identity PreCheck", icon: "🔑", desc: "MFA gaps & privileged access drift." },
  { id: "infosec", title: "Info Security", icon: "📋", desc: "Continuous SOC2 & ISO27001 compliance." },
  { id: "dispatch", title: "Dispatch Center", icon: "📨", desc: "Automated SOAR playbooks & ticketing." },
];

export default function MythosPromo({ onClose }: { onClose: () => void }) {
  const [activeFeature, setActiveFeature] = useState(FEATURES[0].id);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
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
      }, 5000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying]);

  const handleManualSelect = (id: string) => {
    setActiveFeature(id);
    setIsAutoPlaying(false);
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Backdrop */}
      <div 
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)" }} 
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
          padding: "1.5rem 2rem",
          boxSizing: "border-box"
        }}
        id="mythos-promo"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "#f1f5f9", border: "none", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", zIndex: 50, transition: "background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"}
          onMouseLeave={e => e.currentTarget.style.background = "#f1f5f9"}
        >
          ✕
        </button>
      <style>{`
        .mythos-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1.5rem;
          max-width: 1600px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
          flex: 1;
          height: calc(100vh - 140px);
          width: 100%;
        }
        .mythos-tab {
          padding: 0.6rem 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .mythos-tab:hover {
          background: #f8fafc;
        }
        .mythos-tab.active {
          background: rgba(124, 58, 237, 0.05);
          border: 1px solid rgba(124, 58, 237, 0.2);
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.05);
        }
        .mythos-screen-container {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.08);
          height: 100%;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }
        .mythos-screen-header {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mythos-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .mythos-screen-content {
          padding: 1.5rem;
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: mythosFadeIn 0.5s ease-out forwards;
          background: #0f172a;
        }
        @keyframes mythosFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.3); }
          70% { box-shadow: 0 0 0 15px rgba(124, 58, 237, 0); }
          100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
        }
        
        @media(max-width: 900px) {
          .mythos-grid {
            grid-template-columns: 1fr;
          }
          .mythos-tab-list {
            display: flex;
            overflow-x: auto;
            padding-bottom: 1rem;
            scroll-snap-type: x mandatory;
          }
          .mythos-tab {
            min-width: 280px;
            scroll-snap-align: start;
          }
        }
      `}</style>

      {/* Background ambient glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", width: "80vw", height: "80vw", background: "radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 60%)", pointerEvents: "none", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginBottom: "1rem", flexShrink: 0 }}>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.25rem", color: "#0f172a" }}>
          The <span style={{ background: "linear-gradient(90deg, #7c3aed, #4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Post-Mythos</span> Era Demands More.
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#64748b", maxWidth: "700px", margin: "0 auto", lineHeight: 1.4 }}>
          Machine-speed attacks require machine-speed defense. Experience the 9 core pillars of the Risk Operations Center (ROC) powered by PosturePilot.
        </p>
      </div>

      <div className="mythos-grid">
        {/* Left Tabs */}
        <div className="mythos-tab-list" style={{ display: "flex", flexDirection: "column", gap: "0.25rem", height: "100%", justifyContent: "space-between" }}>
          {FEATURES.map((feat) => (
            <div 
              key={feat.id} 
              className={`mythos-tab ${activeFeature === feat.id ? 'active' : ''}`}
              onClick={() => handleManualSelect(feat.id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.1rem", filter: activeFeature === feat.id ? "drop-shadow(0 0 6px rgba(124,58,237,0.4))" : "none" }}>{feat.icon}</span>
                <span style={{ fontSize: "0.95rem", fontWeight: activeFeature === feat.id ? 800 : 600, color: activeFeature === feat.id ? "#0f172a" : "#475569" }}>{feat.title}</span>
              </div>
              <div style={{ fontSize: "0.75rem", color: activeFeature === feat.id ? "#6d28d9" : "#64748b", marginTop: "0.1rem", paddingLeft: "1.6rem" }}>
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
            <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#64748b", marginLeft: "1rem" }}>
              ~/posturepilot/roc/{activeFeature}.sh
            </div>
            {isAutoPlaying && (
              <div style={{ marginLeft: "auto", fontSize: "0.7rem", color: "#818cf8", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span className="mythos-dot" style={{ background: "#818cf8", width: 6, height: 6, animation: "pulseGlow 2s infinite" }}/> AUTO PLAYING
              </div>
            )}
          </div>

          <div className="mythos-screen-content" key={activeFeature}>
            
            {activeFeature === "posture" && (
              <div style={{ textAlign: "center" }}>
                <div style={{ position: "relative", width: 250, height: 250, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 100 100" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="8" strokeDasharray="185 251" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px rgba(168,85,247,0.5))" }}/>
                  </svg>
                  <div>
                    <div style={{ fontSize: "4rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>74<span style={{fontSize:"2rem"}}>%</span></div>
                    <div style={{ fontSize: "0.85rem", color: "#4ade80", fontWeight: 800, letterSpacing: "0.2em", marginTop: "0.5rem" }}>CLEARANCE</div>
                  </div>
                </div>
              </div>
            )}

            {activeFeature === "cloud" && (
              <div style={{ width: "100%", height: "100%", padding: "1rem" }}>
                <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 800, marginBottom: "2rem" }}>Multicloud Altitude</h3>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", height: 200, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
                  {[40, 70, 45, 90, 60, 30, 85].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, background: h > 80 ? "linear-gradient(to top, rgba(239,68,68,0.2), #ef4444)" : "linear-gradient(to top, rgba(129,140,248,0.2), #818cf8)", borderRadius: "6px 6px 0 0", position: "relative" }}>
                      {h > 80 && <div style={{ position: "absolute", top: -25, left: "50%", transform: "translateX(-50%)", color: "#ef4444", fontSize: "1.2rem" }}>⚠️</div>}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", color: "#94a3b8", fontSize: "0.8rem", fontFamily: "monospace" }}>
                  <span>us-east-1</span><span>eu-west-2</span><span>ap-south-1</span>
                </div>
              </div>
            )}

            {activeFeature === "network" && (
              <div style={{ position: "relative", width: 300, height: 300 }}>
                {/* Abstract Node Network */}
                <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
                  <line x1="100" y1="100" x2="40" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <line x1="100" y1="100" x2="160" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <line x1="100" y1="100" x2="40" y2="160" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" style={{ animation: "pulseGlow 2s infinite" }} />
                  <line x1="100" y1="100" x2="160" y2="160" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  
                  <circle cx="100" cy="100" r="20" fill="#1e293b" stroke="#818cf8" strokeWidth="4" />
                  <circle cx="40" cy="40" r="10" fill="#334155" />
                  <circle cx="160" cy="40" r="10" fill="#334155" />
                  <circle cx="40" cy="160" r="15" fill="#ef4444" style={{ filter: "drop-shadow(0 0 10px #ef4444)" }} />
                  <circle cx="160" cy="160" r="10" fill="#334155" />
                </svg>
                <div style={{ position: "absolute", bottom: -40, left: 0, right: 0, textAlign: "center", color: "#ef4444", fontSize: "0.85rem", fontWeight: 700 }}>
                  Intrusion Attempt Blocked (IP: 192.168.*.*)
                </div>
              </div>
            )}

            {activeFeature === "appsec" && (
              <div style={{ width: "100%", padding: "2rem" }}>
                <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 800, marginBottom: "1.5rem" }}>Vulnerability Funnel</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { label: "Total Scanned", count: 14502, w: "100%", c: "#334155" },
                    { label: "Exploitable (EPSS > 0.5)", count: 3420, w: "70%", c: "#eab308" },
                    { label: "Internet Facing", count: 890, w: "45%", c: "#f97316" },
                    { label: "Critical Weaponized", count: 23, w: "15%", c: "#ef4444" },
                  ].map(lvl => (
                    <div key={lvl.label} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ width: 150, fontSize: "0.8rem", color: "#cbd5e1", textAlign: "right" }}>{lvl.label}</div>
                      <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", height: 24, borderRadius: 12, overflow: "hidden" }}>
                        <div style={{ width: lvl.w, height: "100%", background: lvl.c, display: "flex", alignItems: "center", paddingLeft: "0.5rem", fontSize: "0.7rem", fontWeight: 800, color: "#fff" }}>
                          {lvl.count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeFeature === "ai-risk" && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "5rem", filter: "drop-shadow(0 0 20px #f97316)", animation: "pulseGlow 2s infinite" }}>🤖</div>
                <h3 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 800, marginTop: "1rem" }}>3 Shadow Models Found</h3>
                <div style={{ background: "rgba(249, 115, 22, 0.1)", border: "1px solid rgba(249, 115, 22, 0.3)", padding: "1rem", borderRadius: "12px", marginTop: "1rem", color: "#f97316", fontFamily: "monospace", fontSize: "0.85rem" }}>
                  <div>&gt; GitHub Copilot (Unauthorized Org)</div>
                  <div>&gt; ChatGPT Web UI (Marketing Dept)</div>
                  <div>&gt; Local Llama3 Instance (Eng-MacBook-04)</div>
                </div>
              </div>
            )}

            {activeFeature === "secure" && (
              <div style={{ position: "relative", width: 250, height: 250, borderRadius: "50%", border: "2px solid rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <div style={{ position: "absolute", width: "100%", height: "100%", border: "2px solid rgba(168,85,247,0.1)", borderRadius: "50%", transform: "scale(0.66)" }} />
                <div style={{ position: "absolute", width: "100%", height: "100%", border: "2px solid rgba(168,85,247,0.05)", borderRadius: "50%", transform: "scale(0.33)" }} />
                {/* Radar sweep */}
                <div style={{ position: "absolute", top: "50%", left: "50%", width: "50%", height: "50%", background: "conic-gradient(from 0deg, transparent 70%, rgba(168,85,247,0.8) 100%)", transformOrigin: "0 0", animation: "radarSweep 3s linear infinite" }} />
                
                {/* Blips */}
                <div style={{ position: "absolute", top: "30%", left: "60%", width: 8, height: 8, background: "#ef4444", borderRadius: "50%", filter: "drop-shadow(0 0 6px #ef4444)" }} />
                <div style={{ position: "absolute", top: "70%", left: "40%", width: 6, height: 6, background: "#eab308", borderRadius: "50%" }} />
                
                <div style={{ position: "relative", zIndex: 10, background: "#0f172a", width: 60, height: 60, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #a855f7" }}>
                  📡
                </div>
              </div>
            )}

            {activeFeature === "identity" && (
              <div style={{ width: "100%", padding: "2rem" }}>
                <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 800, marginBottom: "1.5rem" }}>Identity Privilege Drift</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { user: "j.doe@acme.com", change: "+ Admin Access (AWS)", risk: "HIGH", c: "#ef4444" },
                    { user: "service_account_04", change: "MFA Disabled", risk: "CRITICAL", c: "#ef4444" },
                    { user: "a.smith@acme.com", change: "New IP (Russia)", risk: "HIGH", c: "#eab308" },
                  ].map((evt, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", padding: "1rem", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>{evt.user}</div>
                        <div style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "0.2rem" }}>{evt.change}</div>
                      </div>
                      <div style={{ background: evt.c === "#ef4444" ? "rgba(239,68,68,0.2)" : "rgba(234,179,8,0.2)", color: evt.c, padding: "0.25rem 0.75rem", borderRadius: "99px", fontSize: "0.7rem", fontWeight: 800 }}>
                        {evt.risk}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeFeature === "infosec" && (
              <div style={{ width: "100%", maxWidth: "400px" }}>
                <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "12px", padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 800 }}>SOC2 Type II</h3>
                    <span style={{ color: "#10b981", fontWeight: 800, fontSize: "1.2rem" }}>98%</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    {[
                      { l: "CC1.1 - Integrity & Ethics", s: true },
                      { l: "CC1.2 - Board Oversight", s: true },
                      { l: "CC6.1 - Logical Access", s: false },
                      { l: "CC6.8 - Unauthorized Software", s: true },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: item.s ? "#10b981" : "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.6rem", fontWeight: 900 }}>
                          {item.s ? "✓" : "!"}
                        </div>
                        <span style={{ color: "#cbd5e1", fontSize: "0.85rem", textDecoration: item.s ? "none" : "underline", textDecorationColor: "#ef4444" }}>{item.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeFeature === "dispatch" && (
              <div style={{ width: "100%", padding: "2rem" }}>
                <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 800, marginBottom: "1.5rem" }}>SOAR Playbook Execution</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontFamily: "monospace", fontSize: "0.8rem", color: "#a5b4fc", background: "#0f172a", padding: "1.5rem", borderRadius: "12px", border: "1px solid #1e293b" }}>
                  <div><span style={{color:"#4ade80"}}>[10:42:01]</span> ALERT: Ransomware behavior detected (Host: DB-04)</div>
                  <div><span style={{color:"#4ade80"}}>[10:42:02]</span> ACTION: Triggering Playbook "Ransomware-Containment"</div>
                  <div><span style={{color:"#facc15"}}>[10:42:04]</span> API: CrowdStrike network containment API called...</div>
                  <div><span style={{color:"#4ade80"}}>[10:42:05]</span> SUCCESS: Host DB-04 isolated from network.</div>
                  <div><span style={{color:"#facc15"}}>[10:42:06]</span> API: Creating Jira Ticket (Critical)...</div>
                  <div><span style={{color:"#4ade80"}}>[10:42:08]</span> COMPLETE: Incident SEC-9942 created.</div>
                  <div style={{ animation: "pulseGlow 1s infinite", color: "#fff", marginTop: "1rem" }}>&gt; Waiting for next event...</div>
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
