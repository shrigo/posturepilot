
"use client";
import Link from "next/link";
import Image from "next/image";
import ShieldViz from "@/components/ShieldViz";
import { useState } from "react";

const TABS = ["Configure","Monitor","Report","Secure"];
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
];
const PLANS = [
  {name:"Starter",price:"149",c:"#4f46e5",features:["1 user","CSV upload","500 findings","All 9 dashboards"],cta:"Start Free Trial"},
  {name:"Professional",price:"399",c:"#7c3aed",features:["5 users · 3 sources","Qualys · Tenable · Nessus","10K findings","API access"],cta:"Start Free Trial",pop:true},
  {name:"MSSP",price:"999",c:"#0891b2",features:["Unlimited users","Multi-tenant","White-label","Dedicated support"],cta:"Contact Sales"},
];

export default function Page() {
  const [tab,setTab]=useState("Monitor");
  return(
    <div style={{fontFamily:"Inter,sans-serif",background:"#fff",color:"#0f172a",minHeight:"100vh"}}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap");
        *{box-sizing:border-box;margin:0;padding:0} html{scroll-behavior:smooth}
        .hcard:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(79,70,229,0.15)!important}
        .hcard{transition:all 0.2s}
      `}</style>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(255,255,255,0.96)",backdropFilter:"blur(16px)",borderBottom:"1px solid #e0e7ff",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 2.5rem",height:64}}>
        <Image src="/navbarlogoh.jpg" alt="PosturePilot" width={260} height={60} style={{objectFit:"contain",objectPosition:"left"}} onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem",fontSize:"0.9rem",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase"}}>
          {(["Configure","Monitor","Report","Secure"] as const).map((t,i,a)=>(
            <span key={t} style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
              <a href={"#"+t.toLowerCase()} style={{color: i===0?"#1e2d6e": i===1?"#4f46e5": i===2?"#7c3aed":"#16a34a",textDecoration:"none"}}>{t}</a>
              {i<a.length-1 && <span style={{color:"#f97316",fontWeight:900}}>|</span>}
            </span>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
          {["Features","Pricing"].map(t=><a key={t} href={"#"+t.toLowerCase()} style={{color:"#64748b",fontSize:"0.875rem",fontWeight:600,textDecoration:"none",padding:"0.5rem 0.75rem"}}>{t}</a>)}
          <Link href="/login" style={{color:"#64748b",fontSize:"0.875rem",textDecoration:"none",padding:"0.5rem 1rem",fontWeight:600}}>Sign in</Link>
          <Link href="/login" style={{background:"linear-gradient(135deg,#4f46e5,#7c3aed)",color:"#fff",fontSize:"0.875rem",fontWeight:700,padding:"0.5rem 1.25rem",borderRadius:8,textDecoration:"none",boxShadow:"0 4px 16px rgba(79,70,229,0.35)"}}>Try Free →</Link>
        </div>
      </nav>

      {/* Trusted by banner */}
      <div style={{background:"#fff",borderBottom:"1px solid #e0e7ff",padding:"0.6rem 2rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"2.5rem",flexWrap:"wrap"}}>
        <span style={{fontSize:"0.65rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",whiteSpace:"nowrap"}}>Trusted by Security Teams Using</span>
        {["Qualys VMDR","Tenable.io","Nessus Pro","OpenVAS","CrowdStrike","AWS Security Hub"].map(c=>(
          <span key={c} style={{fontSize:"0.82rem",fontWeight:700,color:"#334155",whiteSpace:"nowrap"}}>{c}</span>
        ))}
      </div>

      {/* HERO — white bg so logo sits naturally */}
      <section style={{background:"linear-gradient(135deg,#f5f3ff 0%,#eff6ff 50%,#f0fdf4 100%)",minHeight:"92vh",display:"flex",alignItems:"flex-start",padding:"3rem 3rem 1rem",position:"relative",overflow:"hidden"}}>
        {/* Subtle radial glow */}
        <div style={{position:"absolute",top:"-10%",right:"5%",width:600,height:600,background:"radial-gradient(circle,rgba(79,70,229,0.08) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"-10%",left:"5%",width:400,height:400,background:"radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 70%)",pointerEvents:"none"}}/>

        <div style={{maxWidth:1300,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2rem",alignItems:"center",width:"100%",position:"relative",zIndex:1}}>

          {/* LEFT */}
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"#ede9fe",border:"1px solid #c4b5fd",borderRadius:20,padding:"0.375rem 1rem",fontSize:"0.85rem",fontWeight:700,color:"#4f46e5",marginBottom:"1.5rem",marginLeft:"-10px",letterSpacing:"0.08em",textTransform:"uppercase"}}>
              <span style={{width:10,height:10,borderRadius:"50%",background:"#22c55e",display:"inline-block",boxShadow:"0 0 10px #22c55e"}}/> Live · 9 Security Dashboards
            </div>

            <h1 style={{fontSize:"clamp(2.4rem,4vw,4rem)",fontWeight:900,letterSpacing:"-0.04em",lineHeight:1.06,color:"#0f172a",marginBottom:"1.25rem"}}>
              <span style={{color:"#1e2d6e"}}>Your Security</span><br/>
              <span style={{background:"linear-gradient(90deg,#6d28d9,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Command Center</span>
            </h1>

            <p style={{fontSize:"1.05rem",color:"#475569",lineHeight:1.8,marginBottom:"2rem",maxWidth:440}}>
              Upload Qualys · Tenable · Nessus scans. Get a board-ready security posture dashboard in 5 minutes — with Triple-Filter Triage built in.
            </p>

            <div style={{display:"flex",gap:"1rem",marginBottom:"2.5rem",flexWrap:"wrap"}}>
              <Link href="/login" style={{background:"linear-gradient(135deg,#4f46e5,#7c3aed)",color:"#fff",fontWeight:700,fontSize:"1rem",padding:"0.875rem 1.875rem",borderRadius:10,textDecoration:"none",boxShadow:"0 4px 20px rgba(79,70,229,0.35)"}}>Start Free Trial →</Link>
              <Link href="/dashboard" style={{background:"#fff",color:"#4f46e5",fontWeight:600,fontSize:"1rem",padding:"0.875rem 1.5rem",borderRadius:10,textDecoration:"none",border:"1px solid #c4b5fd"}}>View Demo</Link>
            </div>

            <div style={{display:"flex",gap:"2.5rem",marginBottom:"2rem"}}>
              {[["9","Dashboards"],["5 min","First Report"],["80%","Less Reporting"]].map(([v,l])=>(
                <div key={l}>
                  <div style={{fontSize:"2.25rem",fontWeight:900,background:"linear-gradient(135deg,#4f46e5,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{v}</div>
                  <div style={{fontSize:"0.68rem",color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{borderTop:"1px solid #e0e7ff",paddingTop:"1.25rem"}}>
              <p style={{fontSize:"0.65rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.75rem"}}>Ingests from your existing scanners</p>
              <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap"}}>
                {["Qualys","Tenable","Nessus","OpenVAS","AWS Security Hub"].map(s=>(
                  <span key={s} style={{fontSize:"0.75rem",fontWeight:700,color:"#4f46e5",background:"#ede9fe",padding:"0.25rem 0.75rem",borderRadius:20,border:"1px solid #c4b5fd"}}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — GIF + animated SVG overlay on 6 panel positions */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            <ShieldViz/>
          </div>
        </div>
      </section>

      {/* Securing Teams At banner */}
      <div style={{background:"#fff",borderTop:"1px solid #e0e7ff",borderBottom:"1px solid #e0e7ff",padding:"0.6rem 2rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"2.5rem",flexWrap:"wrap"}}>
        <span style={{fontSize:"0.65rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",whiteSpace:"nowrap"}}>Securing Teams At</span>
        {["Goldman Sachs","JPMorgan","Deloitte","KPMG","Accenture","Raytheon","Lockheed Martin","CrowdStrike"].map(c=>(
          <span key={c} style={{fontSize:"0.82rem",fontWeight:700,color:"#334155",whiteSpace:"nowrap"}}>{c}</span>
        ))}
      </div>


      {/* ── CONFIGURE ── */}
      <section id="configure" style={{scrollMarginTop:64,padding:"5rem 2rem",background:"#fff",minHeight:"100vh",display:"flex",alignItems:"center"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#1e2d6e",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>🔧 Configure</div>
            <h2 style={{fontSize:"clamp(1.75rem,3vw,2.25rem)",fontWeight:800,color:"#0f172a",letterSpacing:"-0.03em"}}>Works with your existing scanner stack</h2>
            <p style={{color:"#64748b",marginTop:"0.5rem",fontSize:"0.9rem"}}>No rip-and-replace. Connect in minutes via upload, API, or webhook.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.25rem",width:"100%"}}>
            {[
              {name:"Qualys VMDR",    c:"#dc2626", initials:"Q",   logoUrl:"https://ik.imagekit.io/qualys/image/logo/qualys.svg",  methods:["Upload","API"]},
              {name:"Tenable.io",     c:"#0054A6", initials:"Te",  logoUrl:"/logos/tenable.svg",                                  methods:["Upload","API"]},
              {name:"Nessus Pro",     c:"#1a0050", initials:"Ne",  logoUrl:"/logos/nessus.svg",                                   methods:["Upload"]},
              {name:"OpenVAS",        c:"#9AC320", initials:"OV",  logoUrl:"/logos/openvas.svg",                                  methods:["Upload","API"]},
              {name:"CrowdStrike",    c:"#E00400", initials:"CS",  logoUrl:"/logos/crowdstrike.svg",                              methods:["Webhook","API"]},
              {name:"AWS Sec Hub",    c:"#FF9900", initials:"AWS", logoUrl:"/logos/aws.svg",                                      methods:["Webhook"]},
              {name:"MS Defender",    c:"#0078D4", initials:"MSD", logoUrl:"/logos/msdefender.svg",                               methods:["Webhook","API"]},
              {name:"Rapid7",         c:"#E6242A", initials:"R7",  logoUrl:"/logos/rapid7.svg",                                   methods:["Upload","API"]},
              {name:"Wiz",            c:"#7c3aed", initials:"Wiz", logoUrl:"/logos/wiz.svg",                                      methods:["Upload","API"]},
              {name:"Prisma Cloud",   c:"#FA582D", initials:"PC",  logoUrl:"/logos/prisma.svg",                                   methods:["Webhook"]},
            ].map(tool=>(
              <div key={tool.name} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,padding:"1.25rem 1.75rem 2rem",borderTop:`4px solid ${tool.c}`,boxShadow:"0 2px 12px rgba(0,0,0,0.05)",transition:"all 0.2s",cursor:"default",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}
                onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform="translateY(-4px)";(e.currentTarget as HTMLDivElement).style.boxShadow=`0 12px 32px ${tool.c}25`;}}
                onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform="none";(e.currentTarget as HTMLDivElement).style.boxShadow="0 2px 12px rgba(0,0,0,0.05)";}}>
                {/* Logo area */}
                <div style={{width:88,height:88,borderRadius:16,background:"#f8fafc",border:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1.25rem",overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
                  <img
                    src={tool.logoUrl}
                    alt={tool.name}
                    width={64} height={64}
                    style={{objectFit:"contain"}}
                    onError={e=>{
                      const img = e.currentTarget;
                      img.style.display="none";
                      const fallback = img.nextElementSibling as HTMLElement;
                      if(fallback) fallback.style.display="flex";
                    }}
                  />
                  {/* Fallback initials */}
                  <div style={{display:"none",width:64,height:64,borderRadius:12,background:`linear-gradient(135deg,${tool.c},${tool.c}cc)`,alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:tool.initials.length>2?"1rem":"1.25rem",letterSpacing:"-0.02em"}}>
                    {tool.initials}
                  </div>
                </div>
                <div style={{fontWeight:800,fontSize:"1.05rem",color:"#0f172a",marginBottom:"0.75rem",letterSpacing:"-0.01em"}}>{tool.name}</div>
                <div style={{display:"flex",gap:"0.375rem",flexWrap:"wrap"}}>
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
      <section id="monitor" style={{scrollMarginTop:64,padding:"5rem 2rem",background:"linear-gradient(135deg,#1e2d6e 0%,#2d1b69 50%,#3b0764 100%)",color:"#fff",minHeight:"100vh",display:"flex",alignItems:"center"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#a5b4fc",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>📡 Monitor</div>
            <h2 style={{fontSize:"clamp(1.75rem,3vw,2.25rem)",fontWeight:800,letterSpacing:"-0.03em"}}>9 live dashboards. Everything in one place.</h2>
            <p style={{color:"#a5b4fc",marginTop:"0.5rem",fontSize:"0.9rem"}}>Real-time security posture across cloud, network, apps, and endpoints.</p>
          </div>
          {/* Mini dashboard mockup */}
          <div style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:16,padding:"1.5rem",backdropFilter:"blur(8px)"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"0.875rem",marginBottom:"1.25rem"}}>
              {[
                {label:"Risk Score",val:"74",unit:"/100",c:"#818cf8"},
                {label:"Open Criticals",val:"23",unit:"findings",c:"#f87171"},
                {label:"SLA Compliance",val:"91%",unit:"on-track",c:"#34d399"},
                {label:"Avg CVSS",val:"7.4",unit:"score",c:"#fb923c"},
              ].map(s=>(
                <div key={s.label} style={{background:"rgba(255,255,255,0.06)",borderRadius:10,padding:"1rem",borderTop:`2px solid ${s.c}`}}>
                  <div style={{fontSize:"0.65rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase",marginBottom:"0.25rem"}}>{s.label}</div>
                  <div style={{fontSize:"1.75rem",fontWeight:900,color:s.c,lineHeight:1}}>{s.val}<span style={{fontSize:"0.75rem",fontWeight:500,color:"#64748b",marginLeft:4}}>{s.unit}</span></div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"0.875rem"}}>
              <div style={{background:"rgba(255,255,255,0.06)",borderRadius:10,padding:"1rem"}}>
                <div style={{fontSize:"0.72rem",fontWeight:700,color:"#a5b4fc",marginBottom:"0.875rem"}}>📊 Findings by Severity</div>
                {[["Critical",14,"#f87171"],["High",67,"#fb923c"],["Medium",148,"#fbbf24"],["Low",83,"#34d399"]].map(([s,n,c])=>(
                  <div key={String(s)} style={{marginBottom:"0.625rem"}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.72rem",marginBottom:"3px"}}><span style={{color:"#cbd5e1"}}>{s}</span><span style={{color:String(c),fontWeight:700}}>{n}</span></div>
                    <div style={{height:6,background:"rgba(255,255,255,0.08)",borderRadius:99}}><div style={{height:"100%",width:`${Math.round(Number(n)/148*100)}%`,background:String(c),borderRadius:99}}/></div>
                  </div>
                ))}
              </div>
              <div style={{background:"rgba(255,255,255,0.06)",borderRadius:10,padding:"1rem"}}>
                <div style={{fontSize:"0.72rem",fontWeight:700,color:"#a5b4fc",marginBottom:"0.875rem"}}>🔧 Connected Tools</div>
                {["Qualys VMDR","Nessus Pro","AWS Sec Hub"].map(t=>(
                  <div key={t} style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.5rem"}}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:"#34d399",display:"inline-block",boxShadow:"0 0 6px #34d399"}}/>
                    <span style={{fontSize:"0.78rem",color:"#cbd5e1"}}>{t}</span>
                  </div>
                ))}
                <div style={{marginTop:"0.75rem",paddingTop:"0.75rem",borderTop:"1px solid rgba(255,255,255,0.08)",fontSize:"0.68rem",color:"#64748b"}}>Last sync: 2 min ago</div>
              </div>
            </div>
          </div>
          <div style={{textAlign:"center",marginTop:"1.5rem"}}>
            <Link href="/dashboard" style={{display:"inline-block",background:"linear-gradient(135deg,#4f46e5,#7c3aed)",color:"#fff",padding:"0.75rem 2rem",borderRadius:10,textDecoration:"none",fontWeight:700,fontSize:"0.9rem"}}>View Live Demo →</Link>
          </div>
        </div>
      </section>

      {/* ── REPORT ── */}
      <section id="report" style={{scrollMarginTop:64,padding:"5rem 2rem",background:"#f8fafc",minHeight:"100vh",display:"flex",alignItems:"center"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#7c3aed",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>📄 Report</div>
            <h2 style={{fontSize:"clamp(1.75rem,3vw,2.25rem)",fontWeight:800,color:"#0f172a",letterSpacing:"-0.03em"}}>Board-ready reports in one click</h2>
            <p style={{color:"#64748b",marginTop:"0.5rem",fontSize:"0.9rem"}}>From executive PDF to compliance mapping — white-labeled with your brand.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:"1rem"}}>
            {[
              {icon:"📊",title:"Executive Summary",desc:"CISO & board-level posture overview with risk trend",formats:["PDF","PPT"],c:"#4f46e5"},
              {icon:"🔍",title:"Technical Detail",desc:"Full CVE list with CVSS, EPSS, asset mapping",formats:["PDF","CSV"],c:"#0891b2"},
              {icon:"⏰",title:"SLA Breach Report",desc:"Overdue findings with owner, deadline, and escalation",formats:["PDF","Email"],c:"#dc2626"},
              {icon:"✅",title:"Compliance Mapping",desc:"SOC2 · ISO 27001 · NIST CSF control coverage",formats:["PDF"],c:"#16a34a"},
            ].map(r=>(
              <div key={r.title} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"1.5rem",borderLeft:`4px solid ${r.c}`,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                <div style={{fontSize:"2rem",marginBottom:"0.75rem"}}>{r.icon}</div>
                <div style={{fontWeight:800,color:"#0f172a",marginBottom:"0.375rem",fontSize:"0.95rem"}}>{r.title}</div>
                <div style={{fontSize:"0.8rem",color:"#64748b",marginBottom:"1rem",lineHeight:1.5}}>{r.desc}</div>
                <div style={{display:"flex",gap:"0.375rem"}}>
                  {r.formats.map(f=>(<span key={f} style={{fontSize:"0.65rem",fontWeight:700,padding:"2px 8px",borderRadius:20,background:`${r.c}15`,color:r.c,border:`1px solid ${r.c}33`}}>{f}</span>))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURE ── */}
      <section id="secure" style={{scrollMarginTop:64,padding:"5rem 2rem",background:"#fff",minHeight:"100vh",display:"flex",alignItems:"center"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#16a34a",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>🔒 Secure</div>
            <h2 style={{fontSize:"clamp(1.75rem,3vw,2.25rem)",fontWeight:800,color:"#0f172a",letterSpacing:"-0.03em"}}>Triple-Filter Triage — fix what actually matters</h2>
            <p style={{color:"#64748b",marginTop:"0.5rem",fontSize:"0.9rem"}}>Stop drowning in 10,000 findings. Our 3-layer engine surfaces only the ones that need action today.</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"1rem",marginBottom:"2rem"}}>
            {[
              {step:"Filter 1",title:"Severity Gate",rule:"CVSS ≥ 7.0",desc:"Eliminates informational and low-noise findings immediately",c:"#4f46e5",icon:"🎯"},
              {step:"Filter 2",title:"Exploitability Check",rule:"EPSS > 10% OR in CISA KEV",desc:"Only surfaces findings with real-world exploit evidence",c:"#ea580c",icon:"⚡"},
              {step:"Filter 3",title:"Asset Criticality",rule:"Tier-1 · Production · External-facing",desc:"Prioritizes findings on your most valuable assets",c:"#dc2626",icon:"🏢"},
            ].map((f,i)=>(
              <div key={f.step} style={{display:"grid",gridTemplateColumns:"auto 1fr auto",alignItems:"center",gap:"1.25rem",background:"#f8fafc",border:`1px solid ${f.c}30`,borderLeft:`4px solid ${f.c}`,borderRadius:12,padding:"1.25rem 1.5rem"}}>
                <div style={{width:48,height:48,borderRadius:"50%",background:`${f.c}15`,border:`2px solid ${f.c}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.25rem",flexShrink:0}}>{f.icon}</div>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.25rem"}}>
                    <span style={{fontSize:"0.62rem",fontWeight:700,color:f.c,textTransform:"uppercase",letterSpacing:"0.08em"}}>{f.step}</span>
                    <span style={{fontWeight:800,fontSize:"0.9rem",color:"#0f172a"}}>{f.title}</span>
                  </div>
                  <code style={{fontSize:"0.78rem",color:f.c,background:`${f.c}10`,padding:"2px 8px",borderRadius:6,fontWeight:700}}>{f.rule}</code>
                  <div style={{fontSize:"0.78rem",color:"#64748b",marginTop:"0.25rem"}}>{f.desc}</div>
                </div>
                <div style={{fontSize:"1.5rem",color:`${f.c}60`}}>{i<2?"↓":""}</div>
              </div>
            ))}
          </div>
          <div style={{background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",border:"1px solid #86efac",borderRadius:14,padding:"1.25rem 1.75rem",textAlign:"center"}}>
            <div style={{fontSize:"1.25rem",marginBottom:"0.375rem"}}>✅</div>
            <div style={{fontWeight:800,color:"#15803d",fontSize:"1rem"}}>Result: Prioritized Action List</div>
            <div style={{fontSize:"0.82rem",color:"#16a34a",marginTop:"0.25rem"}}>Typically reduces 10,000 raw findings → 20-50 actionable items that need immediate attention</div>
          </div>
        </div>
      </section>

      {/* DASHBOARDS */}
      <section id="features" style={{padding:"4rem 2rem",maxWidth:1200,margin:"0 auto",scrollMarginTop:64}}>
        <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
          <div style={{fontSize:"0.68rem",fontWeight:700,color:"#4f46e5",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>9 Modules · One Command Center</div>
          <h2 style={{fontSize:"clamp(1.75rem,3vw,2.25rem)",fontWeight:800,letterSpacing:"-0.03em",color:"#0f172a"}}>Everything your team needs to see</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"1rem"}}>
          {BOARDS.map(d=>(
            <Link key={d.id} href={"/dashboard/"+d.id} className="hcard" style={{display:"block",textDecoration:"none",background:"#fff",border:"1px solid #e0e7ff",borderRadius:14,padding:"1.25rem 1.5rem",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",position:"relative"}}>
              {d.isNew&&<div style={{position:"absolute",top:10,right:10,background:"linear-gradient(135deg,#ea580c,#7c3aed)",color:"#fff",fontSize:"0.55rem",fontWeight:800,padding:"2px 8px",borderRadius:8}}>NEW</div>}
              <div style={{width:42,height:42,borderRadius:10,background:d.c+"15",border:"1px solid "+d.c+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.25rem",marginBottom:"0.875rem"}}>{d.icon}</div>
              <div style={{fontWeight:700,fontSize:"0.9rem",color:"#0f172a",marginBottom:"0.5rem"}}>{d.label}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:"0.375rem"}}>
                <span style={{fontSize:"1.5rem",fontWeight:900,color:d.c,fontFamily:"monospace",letterSpacing:"-0.03em"}}>{d.val}</span>
                <span style={{fontSize:"0.7rem",color:"#94a3b8",fontWeight:600}}>{d.unit}</span>
              </div>
              <div style={{marginTop:"0.625rem",height:4,background:"#f1f5f9",borderRadius:4}}>
                <div style={{height:"100%",width:"70%",background:"linear-gradient(90deg,"+d.c+","+d.c+"88)",borderRadius:4}}/>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{padding:"4rem 2rem",background:"linear-gradient(135deg,#f5f3ff,#eff6ff)"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#4f46e5",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>Transparent Pricing</div>
            <h2 style={{fontSize:"2rem",fontWeight:800,letterSpacing:"-0.03em",color:"#0f172a"}}>No six-figure contracts</h2>
            <p style={{color:"#64748b",marginTop:"0.5rem",fontSize:"0.875rem"}}>14-day free trial · No credit card required</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.25rem"}}>
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
        <span style={{fontWeight:800,color:"#f1f5f9"}}>Posture<span style={{color:"#a5b4fc"}}>Pilot</span><span style={{color:"#334155",fontWeight:400,fontSize:"0.75rem"}}> · Configure · Monitor · Report · Secure</span></span>
        <span style={{fontSize:"0.7rem",color:"#334155"}}>© 2026 PosturePilot · posturepilot.io</span>
      </footer>
    </div>
  );
}
