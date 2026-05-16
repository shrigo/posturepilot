
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
      <section id="configure" style={{scrollMarginTop:64,padding:"2.5rem 2rem 4rem",background:"#fff",minHeight:"100vh",display:"flex",alignItems:"center"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#1e2d6e",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>🔧 Configure</div>
            <h2 style={{fontSize:"clamp(1.75rem,3vw,2.25rem)",fontWeight:800,color:"#0f172a",letterSpacing:"-0.03em"}}>Works with your existing scanner stack</h2>
            <p style={{color:"#64748b",marginTop:"0.5rem",fontSize:"0.9rem"}}>No rip-and-replace. Connect in minutes via upload, API, or webhook.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.25rem",width:"100%"}}>
            {[
              {name:"Qualys VMDR",    c:"#dc2626", initials:"Q",   logoUrl:"https://ik.imagekit.io/qualys/image/logo/qualys.svg",  logoSize:108, methods:["Upload","API"]},
              {name:"Tenable.io",     c:"#1e2a38", initials:"Te",  logoUrl:"/logos/tenable.png",                                  logoSize:108, methods:["Upload","API"]},
              {name:"Nessus Pro",     c:"#3eae2e", initials:"Ne",  logoUrl:"/logos/nessus.png",                                   logoSize:108, methods:["Upload"]},
              {name:"OpenVAS",        c:"#2d2d2d", initials:"OV",  logoUrl:"/logos/openvas.png",                                  logoSize:100, methods:["Upload","API"]},
              {name:"CrowdStrike",    c:"#E00400", initials:"CS",  logoUrl:"/logos/crowdstrike.png",                              logoSize:108, methods:["Webhook","API"]},
              {name:"AWS Sec Hub",    c:"#FF9900", initials:"AWS", logoUrl:"/logos/aws.svg",                                      logoSize:100, methods:["Webhook"]},
              {name:"MS Defender",    c:"#0078D4", initials:"MSD", logoUrl:"/logos/msdefender.png",                               logoSize:130, methods:["Webhook","API"]},
              {name:"Rapid7",         c:"#E6242A", initials:"R7",  logoUrl:"/logos/rapid7.png",                                   logoSize:108, methods:["Upload","API"]},
              {name:"Wiz",            c:"#2F6FED", initials:"Wiz", logoUrl:"/logos/wiz.png",                                      logoSize:108, methods:["Upload","API"]},
              {name:"Prisma Cloud",   c:"#00C0E8", initials:"PC",  logoUrl:"/logos/prisma.png",                                   logoSize:108, methods:["Webhook"]},
            ].map(tool=>(
              <div key={tool.name} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:18,padding:"2rem 2rem 2.5rem",borderTop:`4px solid ${tool.c}`,boxShadow:"0 2px 12px rgba(0,0,0,0.05)",transition:"all 0.2s",cursor:"default",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}
                onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform="translateY(-4px)";(e.currentTarget as HTMLDivElement).style.boxShadow=`0 12px 32px ${tool.c}25`;}}
                onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform="none";(e.currentTarget as HTMLDivElement).style.boxShadow="0 2px 12px rgba(0,0,0,0.05)";}}>
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
                <div style={{fontWeight:800,fontSize:"1.15rem",color:"#0f172a",marginBottom:"0.875rem",letterSpacing:"-0.02em"}}>{tool.name}</div>
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
      <section id="monitor" style={{scrollMarginTop:64,padding:"2rem 2rem 4rem",background:"linear-gradient(135deg,#1e2d6e 0%,#2d1b69 50%,#3b0764 100%)",color:"#fff",minHeight:"100vh",display:"flex",alignItems:"center"}}>
        <div style={{maxWidth:1100,margin:"0 auto",width:"100%"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#a5b4fc",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>📡 Monitor</div>
            <h2 style={{fontSize:"clamp(1.75rem,3vw,2.25rem)",fontWeight:800,letterSpacing:"-0.03em"}}>9 live dashboards. Everything in one place.</h2>
            <p style={{color:"#a5b4fc",marginTop:"0.5rem",fontSize:"0.9rem"}}>Real-time security posture across cloud, network, apps, and endpoints.</p>
          </div>

          {/* SOC Dashboard Mockup */}
          <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:18,overflow:"hidden",boxShadow:"0 24px 64px rgba(0,0,0,0.3)"}}>

            {/* Topbar */}
            <div style={{background:"#f1f5f9",padding:"0.625rem 1.25rem",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #e2e8f0"}}>
              <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#f87171"}}/>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#fbbf24"}}/>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#34d399"}}/>
                <span style={{fontSize:"0.72rem",color:"#475569",fontWeight:600,marginLeft:"0.5rem"}}>PosturePilot Security Command Center</span>
              </div>
              <div style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#34d399",display:"inline-block",boxShadow:"0 0 8px #34d399"}}/>
                <span style={{fontSize:"0.65rem",color:"#34d399",fontWeight:700}}>LIVE</span>
                <span style={{fontSize:"0.65rem",color:"#475569",marginLeft:"0.5rem"}}>Last updated: just now</span>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"180px 1fr",minHeight:560}}>
              {/* Mini sidebar */}
              <div style={{background:"#f8fafc",padding:"0.875rem 0",borderRight:"1px solid #e2e8f0"}}>
                {[
                  {icon:"🏠",label:"Overview",active:false},
                  {icon:"🛡️",label:"Cyber Posture",active:true,badge:"3"},
                  {icon:"☁️",label:"Cloud",active:false},
                  {icon:"🌐",label:"Network",active:false,badge:"34"},
                  {icon:"📊",label:"KPIs",active:false},
                  {icon:"🔐",label:"App Security",active:false,badge:"14"},
                  {icon:"📡",label:"Traffic",active:false},
                  {icon:"🖥️",label:"Servers",active:false,badge:"3"},
                  {icon:"🤖",label:"AI Risk",active:false,badge:"NEW"},
                ].map(item=>(
                  <div key={item.label} style={{display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.45rem 0.875rem",
                    background:item.active?"#eff6ff":"transparent",
                    borderLeft:item.active?"2px solid #b91c1c":"2px solid transparent",marginBottom:2,cursor:"default"}}>
                    <span style={{fontSize:"0.75rem"}}>{item.icon}</span>
                    <span style={{fontSize:"0.68rem",color:item.active?"#b91c1c":"#64748b",fontWeight:item.active?700:400,flex:1}}>{item.label}</span>
                    {item.badge && <span style={{fontSize:"0.55rem",fontWeight:800,padding:"1px 5px",borderRadius:99,
                      background:item.badge==="NEW"?"#7c3aed":"#fee2e2",
                      color:item.badge==="NEW"?"#fff":"#dc2626"}}>{item.badge}</span>}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div style={{padding:"1rem",display:"flex",flexDirection:"column",gap:"0.875rem",overflow:"hidden"}}>

                {/* KPI row */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.625rem"}}>
                  {[
                    {label:"Risk Score",val:"74",unit:"/100",c:"#818cf8",trend:"↑2"},
                    {label:"Open Criticals",val:"23",unit:"CVEs",c:"#f87171",trend:"↓5"},
                    {label:"SLA Compliance",val:"91%",unit:"on-track",c:"#34d399",trend:"↑3%"},
                    {label:"Avg CVSS",val:"7.4",unit:"score",c:"#fb923c",trend:"stable"},
                  ].map(s=>(
                    <div key={s.label} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"0.75rem",borderTop:`3px solid ${s.c}`}}>
                      <div style={{fontSize:"0.58rem",color:"#94a3b8",fontWeight:700,textTransform:"uppercase",marginBottom:"0.2rem"}}>{s.label}</div>
                      <div style={{fontSize:"1.5rem",fontWeight:900,color:s.c,lineHeight:1}}>{s.val}<span style={{fontSize:"0.62rem",fontWeight:400,color:"#94a3b8",marginLeft:3}}>{s.unit}</span></div>
                      <div style={{fontSize:"0.58rem",color:"#94a3b8",marginTop:"0.25rem"}}>{s.trend} this week</div>
                    </div>
                  ))}
                </div>

                {/* Middle row: severity bars + live alerts */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.625rem"}}>
                  {/* Severity breakdown */}
                  <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"0.875rem"}}>
                    <div style={{fontSize:"0.65rem",fontWeight:700,color:"#475569",marginBottom:"0.625rem"}}>📊 Findings by Severity</div>
                    {[["Critical",14,"#dc2626",312],["High",67,"#ea580c",312],["Medium",148,"#d97706",312],["Low",83,"#16a34a",312],["Info",22,"#3b82f6",312]].map(([s,n,c,max])=>(
                      <div key={String(s)} style={{marginBottom:"0.45rem"}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.65rem",marginBottom:2}}>
                          <span style={{color:"#475569"}}>{s}</span>
                          <span style={{color:String(c),fontWeight:700}}>{n}</span>
                        </div>
                        <div style={{height:5,background:"#e2e8f0",borderRadius:99}}>
                          <div style={{height:"100%",width:`${Math.round(Number(n)/Number(max)*100)}%`,background:String(c),borderRadius:99}}/>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Live alerts */}
                  <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"0.875rem"}}>
                    <div style={{fontSize:"0.65rem",fontWeight:700,color:"#475569",marginBottom:"0.625rem"}}>🚨 Active Alerts</div>
                    {[
                      {sev:"CRIT",cve:"CVE-2024-3400",host:"web-01",c:"#dc2626",bg:"#fef2f2"},
                      {sev:"HIGH",cve:"CVE-2024-21762",host:"db-02",c:"#ea580c",bg:"#fff7ed"},
                      {sev:"HIGH",cve:"CVE-2023-44487",host:"lb-01",c:"#ea580c",bg:"#fff7ed"},
                      {sev:"MED",cve:"CVE-2024-1086",host:"app-03",c:"#d97706",bg:"#fffbeb"},
                    ].map((a,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.35rem 0.5rem",borderRadius:6,marginBottom:4,background:a.bg}}>
                        <span style={{fontSize:"0.55rem",fontWeight:800,padding:"1px 5px",borderRadius:4,background:a.c,color:"#fff",minWidth:28,textAlign:"center"}}>{a.sev}</span>
                        <span style={{fontSize:"0.65rem",color:"#1e293b",fontFamily:"monospace",flex:1}}>{a.cve}</span>
                        <span style={{fontSize:"0.6rem",color:"#64748b"}}>{a.host}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom row: dashboard tiles + tools */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.625rem"}}>
                  {/* Dashboard mini tiles */}
                  {[
                    {icon:"☁️",label:"Cloud Security",val:"47 findings",sub:"3 misconfigs",c:"#60a5fa"},
                    {icon:"🌐",label:"Network",val:"34 open ports",sub:"2 SLA breach",c:"#f87171"},
                    {icon:"🔐",label:"App Security",val:"14 vulns",sub:"OWASP Top 10",c:"#a78bfa"},
                  ].map(d=>(
                    <div key={d.label} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"0.75rem",borderLeft:`3px solid ${d.c}`}}>
                      <div style={{fontSize:"0.78rem",marginBottom:"0.25rem"}}>{d.icon}</div>
                      <div style={{fontSize:"0.65rem",fontWeight:700,color:"#0f172a",marginBottom:"0.2rem"}}>{d.label}</div>
                      <div style={{fontSize:"0.78rem",fontWeight:900,color:d.c}}>{d.val}</div>
                      <div style={{fontSize:"0.6rem",color:"#94a3b8",marginTop:2}}>{d.sub}</div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Status bar */}
            <div style={{background:"#f1f5f9",padding:"0.5rem 1.25rem",borderTop:"1px solid #e2e8f0",display:"flex",gap:"1.5rem",alignItems:"center"}}>
              {[
                {label:"3 Scanners Active",c:"#16a34a"},
                {label:"12 Assets Monitored",c:"#2563eb"},
                {label:"2 SLA Breaches",c:"#dc2626"},
                {label:"Last Scan: 4 min ago",c:"#64748b"},
              ].map(s=>(
                <span key={s.label} style={{fontSize:"0.62rem",color:s.c,fontWeight:600}}>{s.label}</span>
              ))}
              <span style={{marginLeft:"auto",fontSize:"0.62rem",color:"#94a3b8"}}>PosturePilot v2.0 · posturepilot.io</span>
            </div>
          </div>

          <div style={{textAlign:"center",marginTop:"1.5rem"}}>
            <Link href="/dashboard" style={{display:"inline-block",background:"#fff",color:"#1e2d6e",padding:"0.75rem 2rem",borderRadius:10,textDecoration:"none",fontWeight:800,fontSize:"0.9rem",border:"2px solid rgba(255,255,255,0.4)",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>View Live Dashboard →</Link>
          </div>
        </div>
      </section>

      {/* ── REPORT ── */}
      <section id="report" style={{scrollMarginTop:64,padding:"2rem 2rem 4rem",background:"#f8fafc",minHeight:"100vh",display:"flex",alignItems:"center"}}>
        <div style={{maxWidth:1200,margin:"0 auto",width:"100%"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#7c3aed",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>📄 Report</div>
            <h2 style={{fontSize:"clamp(1.75rem,3vw,2.25rem)",fontWeight:800,color:"#0f172a",letterSpacing:"-0.03em"}}>Board-ready reports in one click</h2>
            <p style={{color:"#64748b",marginTop:"0.5rem",fontSize:"0.9rem"}}>From executive PDF to compliance mapping — auto-generated, white-labeled, delivered to your stakeholders.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:"1.5rem",marginBottom:"1.25rem"}}>
            <div style={{display:"flex",flexDirection:"column",gap:"0.875rem"}}>
              {[
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
              ].map(r=>(
                <div key={r.title} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"1.1rem 1.25rem",borderLeft:`4px solid ${r.c}`,boxShadow:"0 2px 8px rgba(0,0,0,0.04)",display:"grid",gridTemplateColumns:"44px 1fr",gap:"1rem",alignItems:"start"}}>
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
              ))}
            </div>
            <div>
              <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:16,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.1)",position:"sticky",top:80}}>
                {/* PDF Header */}
                <div style={{background:"linear-gradient(135deg,#1e2d6e,#4f46e5)",padding:"1rem 1.125rem"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.75rem"}}>
                    <div>
                      <div style={{fontSize:"0.5rem",color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.1em"}}>PosturePilot · Confidential · CISO Brief</div>
                      <div style={{fontSize:"0.88rem",fontWeight:800,color:"#fff",marginTop:2}}>Executive Security Report</div>
                      <div style={{fontSize:"0.55rem",color:"rgba(255,255,255,0.5)",marginTop:1}}>May 2026 · Acme Corp · Generated 2 min ago</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:"2.25rem",fontWeight:900,color:"#fff",lineHeight:1}}>74</div>
                      <div style={{fontSize:"0.5rem",color:"rgba(255,255,255,0.5)"}}>Risk Score /100</div>
                      <div style={{fontSize:"0.5rem",color:"rgba(255,255,255,0.65)",fontWeight:700}}>▲ +4 from last month</div>
                    </div>
                  </div>
                  {/* 6-KPI strip */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.3rem"}}>
                    {[{l:"Critical",v:"23",c:"#f87171",sub:"↓5 this week"},{l:"SLA Compliance",v:"91%",c:"#34d399",sub:"↑3% MoM"},{l:"Avg CVSS",v:"7.4",c:"#fb923c",sub:"stable"},
                      {l:"MTTR",v:"18d",c:"#a78bfa",sub:"target: 14d"},{l:"Patched",v:"68%",c:"#60a5fa",sub:"of total 334"},{l:"Open High",v:"67",c:"#fbbf24",sub:"14 SLA breach"}
                    ].map(k=>(
                      <div key={k.l} style={{background:"rgba(255,255,255,0.1)",borderRadius:7,padding:"0.35rem 0.5rem"}}>
                        <div style={{fontSize:"0.48rem",color:"rgba(255,255,255,0.45)",marginBottom:1}}>{k.l}</div>
                        <div style={{fontSize:"0.92rem",fontWeight:900,color:"#fff",lineHeight:1}}>{k.v}</div>
                        <div style={{fontSize:"0.45rem",color:"rgba(255,255,255,0.4)",marginTop:1}}>{k.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PDF Body */}
                <div style={{padding:"0.75rem 1rem"}}>
                  {/* Risk trend */}
                  <div style={{marginBottom:"0.75rem"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.4rem"}}>
                      <span style={{fontSize:"0.6rem",fontWeight:700,color:"#475569"}}>📈 Risk Trend — 90 Days</span>
                      <span style={{fontSize:"0.52rem",color:"#16a34a",fontWeight:700}}>↓ Improving</span>
                    </div>
                    <div style={{display:"flex",alignItems:"flex-end",gap:"2px",height:40}}>
                      {[82,79,77,80,76,74,71,74,72,70,74,72].map((v,i)=>(
                        <div key={i} style={{flex:1,borderRadius:"2px 2px 0 0",background:i===11?"#4f46e5":i>=9?"#818cf8":"#e2e8f0",height:`${(v/82)*100}%`,minHeight:3}}/>
                      ))}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.45rem",color:"#94a3b8",marginTop:2}}>
                      <span>Feb</span><span>Mar</span><span>Apr</span><span>May ▲</span>
                    </div>
                  </div>

                  {/* Vuln + Patch summary */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"0.75rem"}}>
                    <div style={{background:"#f8fafc",borderRadius:8,padding:"0.5rem 0.625rem",border:"1px solid #e2e8f0"}}>
                      <div style={{fontSize:"0.58rem",fontWeight:700,color:"#475569",marginBottom:"0.35rem"}}>🔢 Vulnerability Summary</div>
                      {[{l:"Total Found",v:"334",c:"#475569"},{l:"Critical",v:"23",c:"#dc2626"},{l:"High",v:"67",c:"#ea580c"},{l:"Medium",v:"148",c:"#d97706"},{l:"Low / Info",v:"96",c:"#16a34a"}].map(r=>(
                        <div key={r.l} style={{display:"flex",justifyContent:"space-between",fontSize:"0.58rem",padding:"1px 0",borderBottom:"1px solid #f1f5f9"}}>
                          <span style={{color:"#64748b"}}>{r.l}</span><span style={{fontWeight:700,color:r.c}}>{r.v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{background:"#f8fafc",borderRadius:8,padding:"0.5rem 0.625rem",border:"1px solid #e2e8f0"}}>
                      <div style={{fontSize:"0.58rem",fontWeight:700,color:"#475569",marginBottom:"0.35rem"}}>🩹 Patch Coverage</div>
                      {[{l:"Patched",v:"227",c:"#16a34a"},{l:"In Progress",v:"61",c:"#d97706"},{l:"Pending",v:"46",c:"#dc2626"},{l:"MTTR (avg)",v:"18 days",c:"#a78bfa"},{l:"SLA Breached",v:"14",c:"#dc2626"}].map(r=>(
                        <div key={r.l} style={{display:"flex",justifyContent:"space-between",fontSize:"0.58rem",padding:"1px 0",borderBottom:"1px solid #f1f5f9"}}>
                          <span style={{color:"#64748b"}}>{r.l}</span><span style={{fontWeight:700,color:r.c}}>{r.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top CVEs */}
                  <div style={{marginBottom:"0.75rem"}}>
                    <div style={{fontSize:"0.6rem",fontWeight:700,color:"#475569",marginBottom:"0.4rem"}}>🎯 Top Critical CVEs</div>
                    {[{cve:"CVE-2024-3400",cvss:"10.0",s:"CRIT",asset:"fw-01"},{cve:"CVE-2024-21762",cvss:"9.8",s:"CRIT",asset:"vpn-gw"},{cve:"CVE-2023-44487",cvss:"7.5",s:"HIGH",asset:"lb-01"}].map(c=>(
                      <div key={c.cve} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.2rem 0.375rem",borderRadius:5,marginBottom:3,background:"#f8fafc"}}>
                        <span style={{fontSize:"0.56rem",fontFamily:"monospace",color:"#1e2d6e",fontWeight:700}}>{c.cve}</span>
                        <span style={{fontSize:"0.52rem",color:"#64748b"}}>{c.asset}</span>
                        <div style={{display:"flex",gap:"0.3rem",alignItems:"center"}}>
                          <span style={{fontSize:"0.54rem",fontWeight:700,color:c.s==="CRIT"?"#dc2626":"#ea580c"}}>{c.cvss}</span>
                          <span style={{fontSize:"0.48rem",fontWeight:800,padding:"1px 4px",borderRadius:3,background:c.s==="CRIT"?"#fef2f2":"#fff7ed",color:c.s==="CRIT"?"#dc2626":"#ea580c"}}>{c.s}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Framework coverage */}
                  <div>
                    <div style={{fontSize:"0.6rem",fontWeight:700,color:"#475569",marginBottom:"0.4rem"}}>⚖️ Compliance Coverage</div>
                    {[{f:"SOC2",v:87},{f:"ISO 27001",v:79},{f:"NIST CSF",v:92},{f:"PCI-DSS",v:68},{f:"HIPAA",v:74}].map(fw=>(
                      <div key={fw.f} style={{display:"flex",alignItems:"center",gap:"0.4rem",marginBottom:"0.28rem"}}>
                        <span style={{fontSize:"0.54rem",color:"#64748b",width:44,flexShrink:0}}>{fw.f}</span>
                        <div style={{flex:1,height:4,background:"#f1f5f9",borderRadius:99}}>
                          <div style={{height:"100%",width:`${fw.v}%`,background:fw.v>=85?"#16a34a":fw.v>=70?"#d97706":"#dc2626",borderRadius:99}}/>
                        </div>
                        <span style={{fontSize:"0.54rem",fontWeight:700,color:fw.v>=85?"#16a34a":fw.v>=70?"#d97706":"#dc2626",width:24,textAlign:"right"}}>{fw.v}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{background:"#f8fafc",borderTop:"1px solid #e2e8f0",padding:"0.45rem 1rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:"0.5rem",color:"#94a3b8"}}>PosturePilot · posturepilot.io</span>
                  <span style={{fontSize:"0.5rem",color:"#7c3aed",fontWeight:700}}>⬇ Download PDF</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"1.1rem 1.5rem",marginBottom:"1rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#475569",marginBottom:"0.875rem",textTransform:"uppercase",letterSpacing:"0.08em"}}>📬 Delivery Methods</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"0.875rem"}}>
              {[{icon:"📧",l:"Email",d:"Stakeholder list"},{icon:"💬",l:"Slack",d:"#security channel"},{icon:"⏰",l:"Scheduled",d:"Daily/Weekly/Monthly"},{icon:"📱",l:"Webhook",d:"JIRA · ServiceNow"},{icon:"🌐",l:"Portal",d:"Shareable link"},{icon:"🖨️",l:"Print-Ready",d:"A4/Letter PDF"}].map(d=>(
                <div key={d.l} style={{textAlign:"center"}}>
                  <div style={{fontSize:"1.5rem",marginBottom:"0.25rem"}}>{d.icon}</div>
                  <div style={{fontSize:"0.72rem",fontWeight:700,color:"#0f172a"}}>{d.l}</div>
                  <div style={{fontSize:"0.62rem",color:"#94a3b8"}}>{d.d}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.875rem"}}>
            {[{v:"8 sec",l:"Avg generation time"},{v:"5+",l:"Compliance frameworks"},{v:"4 types",l:"Report formats"},{v:"6",l:"Delivery channels"}].map(s=>(
              <div key={s.l} style={{textAlign:"center",background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"1rem"}}>
                <div style={{fontSize:"1.5rem",fontWeight:900,color:"#7c3aed"}}>{s.v}</div>
                <div style={{fontSize:"0.7rem",color:"#64748b",marginTop:"0.25rem"}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── SECURE ── */}
      <section id="secure" style={{scrollMarginTop:64,padding:"2.5rem 2rem 4rem",background:"#fff",minHeight:"100vh",display:"flex",alignItems:"center"}}>
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
