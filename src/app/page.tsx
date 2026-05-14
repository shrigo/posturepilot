
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const TABS = ["Configure","Monitor","Report","Secure"];
const BOARDS = [
  {id:"posture",icon:"🛡️",label:"Cyber Posture",val:"74",unit:"Risk Score",c:"#0072ff"},
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
  {name:"Starter",price:"149",c:"#0072ff",features:["1 user","CSV upload","500 findings","All 9 dashboards"],cta:"Start Free Trial"},
  {name:"Professional",price:"399",c:"#7c3aed",features:["5 users · 3 sources","Qualys · Tenable · Nessus","10K findings","API access"],cta:"Start Free Trial",pop:true},
  {name:"MSSP",price:"999",c:"#0891b2",features:["Unlimited users","Multi-tenant","White-label","Dedicated support"],cta:"Contact Sales"},
];

// Count-up hook
function useCountUp(target: number, duration = 1800, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const timeout = setTimeout(() => {
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.floor(ease * target));
        if (p < 1) raf = requestAnimationFrame(step);
        else setVal(target);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [target, duration, delay]);
  return val;
}

// Live flicker hook — simulates live data
function useLive(base: number, range: number, interval = 3000) {
  const [val, setVal] = useState(base);
  useEffect(() => {
    const iv = setInterval(() => {
      setVal(base + Math.floor((Math.random() * 2 - 1) * range));
    }, interval);
    return () => clearInterval(iv);
  }, [base, range, interval]);
  return val;
}

function CommandCenter() {
  const risk   = useCountUp(74, 1600, 200);
  const crits  = useCountUp(23, 1400, 400);
  const sla    = useCountUp(91, 1500, 600);
  const mtta   = useCountUp(28, 1300, 300);
  const patch  = useCountUp(147, 1700, 500);
  const finds  = useCountUp(847, 2000, 100);

  const liveFinds = useLive(847, 3, 4000);
  const livePatch = useLive(147, 2, 5000);
  const liveMtta  = useLive(28, 1, 6000);

  const [bars, setBars] = useState([0,0,0,0,0,0,0,0,0,0,0,0]);
  const targets = [38,62,45,78,55,90,67,82,59,94,71,88];
  useEffect(() => {
    const t = setTimeout(() => setBars(targets), 300);
    return () => clearTimeout(t);
  }, []);

  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 800); }, 4000);
    return () => clearInterval(iv);
  }, []);

  const metrics = [
    {l:"Risk Score",   v: finds>0 ? risk  : 0,  u:"/100",  bg:"#ffedd5",tc:"#ea580c", live:false},
    {l:"Critical CVEs",v: finds>0 ? crits : 0,  u:"",      bg:"#fee2e2",tc:"#dc2626", live:false},
    {l:"SLA",          v: finds>0 ? sla   : 0,  u:"%",     bg:"#dcfce7",tc:"#16a34a", live:false},
    {l:"MTTA",         v: finds>0 ? liveMtta:0,  u:" min",  bg:"#ede9fe",tc:"#7c3aed", live:true},
    {l:"Patched",      v: finds>0 ? livePatch:0, u:" today",bg:"#dbeafe",tc:"#0072ff", live:true},
    {l:"Findings",     v: finds>0 ? liveFinds:0, u:" open", bg:"#fef9c3",tc:"#ca8a04", live:true},
  ];

  return (
    <div style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:18,padding:"1.25rem",backdropFilter:"blur(20px)",boxShadow:"0 40px 80px rgba(0,0,0,0.3)"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem",paddingBottom:"0.75rem",borderBottom:"1px solid rgba(255,255,255,0.15)"}}>
        <div style={{display:"flex",gap:6}}>
          {["#ff5f57","#febc2e","#28c840"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}} />)}
        </div>
        <span style={{fontSize:"0.58rem",color:"rgba(255,255,255,0.55)",fontFamily:"monospace",letterSpacing:"0.08em"}}>POSTUREPILOT · COMMAND CENTER · LIVE</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:"0.58rem",color:"rgba(255,255,255,0.55)",fontFamily:"monospace"}}>{new Date().toLocaleTimeString()}</span>
          <span style={{width:7,height:7,borderRadius:"50%",background:"#00ff88",display:"inline-block",boxShadow:pulse?"0 0 12px #00ff88":"0 0 6px #00ff88",transition:"box-shadow 0.3s"}} />
        </div>
      </div>

      {/* Metric cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.6rem",marginBottom:"0.875rem"}}>
        {metrics.map(m=>(
          <div key={m.l} style={{background:m.bg,borderRadius:9,padding:"0.625rem",border:"1px solid rgba(0,0,0,0.06)",position:"relative",overflow:"hidden"}}>
            {m.live && <div style={{position:"absolute",top:5,right:6,width:5,height:5,borderRadius:"50%",background:"#00c853",boxShadow:"0 0 6px #00c853",opacity:pulse?1:0.5,transition:"opacity 0.3s"}} />}
            <div style={{fontSize:"0.52rem",color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"0.2rem"}}>{m.l}</div>
            <div style={{fontSize:"1.3rem",fontWeight:900,color:m.tc,fontFamily:"monospace",letterSpacing:"-0.03em",lineHeight:1,transition:"all 0.4s"}}>
              {m.v}{m.u}
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{background:"rgba(255,255,255,0.1)",borderRadius:10,padding:"0.75rem",marginBottom:"0.75rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.4rem"}}>
          <span style={{fontSize:"0.58rem",color:"rgba(255,255,255,0.55)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>Findings Trend · 12 Weeks</span>
          <span style={{fontSize:"0.58rem",color:"#86efac",fontWeight:700}}>▼ 24% resolved</span>
        </div>
        <div style={{display:"flex",alignItems:"flex-end",gap:3,height:44}}>
          {bars.map((h,i)=>(
            <div key={i} style={{flex:1,background:i===11?"#fff":i===10?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.3)",borderRadius:"3px 3px 0 0",height:h+"%",transition:"height 1s cubic-bezier(0.34,1.56,0.64,1)",transitionDelay:i*0.05+"s",boxShadow:i===11?"0 0 8px rgba(255,255,255,0.6)":"none"}} />
          ))}
        </div>
      </div>

      {/* Severity row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.5rem"}}>
        {[["Crit","23","#dc2626","#fee2e2"],["High","89","#ea580c","#ffedd5"],["Med","312","#ca8a04","#fef9c3"],["Low","423","#16a34a","#dcfce7"]].map(([s,n,tc,bg])=>(
          <div key={s} style={{background:bg,border:"1px solid rgba(0,0,0,0.07)",borderRadius:8,padding:"0.4rem",textAlign:"center"}}>
            <div style={{fontSize:"1rem",fontWeight:900,color:tc,fontFamily:"monospace"}}>{n}</div>
            <div style={{fontSize:"0.55rem",color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const [tab,setTab] = useState("Monitor");
  return (
    <div style={{fontFamily:"Inter,sans-serif",background:"#f0f6ff",color:"#0f172a",minHeight:"100vh"}}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap");
        *{box-sizing:border-box;margin:0;padding:0} html{scroll-behavior:smooth}
        .hcard:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,114,255,0.15)!important}
        .hcard{transition:all 0.2s}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(240,246,255,0.94)",backdropFilter:"blur(16px)",borderBottom:"1px solid #dbeafe",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 2.5rem",height:64}}>
        <Image src="/posturepilot.jpg" alt="PosturePilot" width={160} height={52} style={{objectFit:"contain"}} onError={e=>{(e.target as HTMLImageElement).style.display="none";}} />
        <div style={{display:"flex",gap:"2rem"}}>
          {["Features","Pricing"].map(t=><a key={t} href={"#"+t.toLowerCase()} style={{color:"#64748b",fontSize:"0.875rem",fontWeight:600,textDecoration:"none"}}>{t}</a>)}
        </div>
        <div style={{display:"flex",gap:"0.75rem"}}>
          <Link href="/login" style={{color:"#64748b",fontSize:"0.875rem",textDecoration:"none",padding:"0.5rem 1rem",fontWeight:600}}>Sign in</Link>
          <Link href="/login" style={{background:"linear-gradient(135deg,#0072ff,#00c6ff)",color:"#fff",fontSize:"0.875rem",fontWeight:700,padding:"0.5rem 1.25rem",borderRadius:8,textDecoration:"none",boxShadow:"0 4px 16px rgba(0,114,255,0.3)"}}>Try Free →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{background:"linear-gradient(135deg,#0f2d6e 0%,#0072ff 45%,#00c6ff 100%)",padding:"5rem 2.5rem 4rem",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",backgroundSize:"50px 50px",pointerEvents:"none"}} />
        <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem",alignItems:"center",position:"relative",zIndex:1}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:20,padding:"0.375rem 1rem",fontSize:"0.7rem",fontWeight:700,color:"#fff",marginBottom:"1.5rem",letterSpacing:"0.08em",textTransform:"uppercase",backdropFilter:"blur(8px)"}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#00ff88",display:"inline-block",boxShadow:"0 0 8px #00ff88"}} /> Live · 9 Security Dashboards
            </div>
            <h1 style={{fontSize:"clamp(2.2rem,4vw,3.8rem)",fontWeight:900,letterSpacing:"-0.04em",lineHeight:1.08,color:"#fff",marginBottom:"1.25rem"}}>
              Your Security<br/><span style={{opacity:0.9}}>Command Center</span>
            </h1>
            <p style={{fontSize:"1rem",color:"rgba(255,255,255,0.75)",lineHeight:1.8,marginBottom:"2rem",maxWidth:440}}>
              Upload Qualys · Tenable · Nessus scans. Get a board-ready dashboard in 5 minutes with Triple-Filter Triage built in.
            </p>
            <div style={{display:"flex",gap:"0.875rem",marginBottom:"2.5rem"}}>
              <Link href="/login" style={{background:"#fff",color:"#0072ff",fontWeight:700,fontSize:"0.95rem",padding:"0.8rem 1.75rem",borderRadius:10,textDecoration:"none",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>Start Free Trial →</Link>
              <Link href="/dashboard" style={{background:"rgba(255,255,255,0.12)",color:"#fff",fontWeight:600,fontSize:"0.95rem",padding:"0.8rem 1.5rem",borderRadius:10,textDecoration:"none",border:"1px solid rgba(255,255,255,0.25)",backdropFilter:"blur(8px)"}}>View Demo</Link>
            </div>
            <div style={{display:"flex",gap:"2.5rem"}}>
              {[["9","Dashboards"],["5 min","First Report"],["80%","Less Reporting"]].map(([v,l])=>(
                <div key={l}><div style={{fontSize:"2rem",fontWeight:900,color:"#fff"}}>{v}</div><div style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.6)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>{l}</div></div>
              ))}
            </div>
          </div>
          <CommandCenter />
        </div>
      </section>

      {/* TABS */}
      <section style={{background:"#fff",borderBottom:"1px solid #e2e8f0"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex"}}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,background:"none",border:"none",cursor:"pointer",padding:"1.25rem",fontSize:"0.9rem",fontWeight:700,color:tab===t?"#0072ff":"#64748b",borderBottom:tab===t?"3px solid #0072ff":"3px solid transparent",transition:"all 0.2s"}}>{t}</button>
          ))}
        </div>
      </section>

      {/* DASHBOARDS */}
      <section id="features" style={{padding:"4rem 2rem",maxWidth:1200,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
          <div style={{fontSize:"0.68rem",fontWeight:700,color:"#0072ff",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>9 Modules · One Command Center</div>
          <h2 style={{fontSize:"clamp(1.75rem,3vw,2.25rem)",fontWeight:800,letterSpacing:"-0.03em",color:"#0f172a"}}>Everything your team needs to see</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"1rem"}}>
          {BOARDS.map(d=>(
            <Link key={d.id} href={"/dashboard/"+d.id} className="hcard" style={{display:"block",textDecoration:"none",background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:"1.25rem 1.5rem",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",position:"relative"}}>
              {d.isNew&&<div style={{position:"absolute",top:10,right:10,background:"linear-gradient(135deg,#ea580c,#7c3aed)",color:"#fff",fontSize:"0.55rem",fontWeight:800,padding:"2px 8px",borderRadius:8}}>NEW</div>}
              <div style={{width:42,height:42,borderRadius:10,background:d.c+"15",border:"1px solid "+d.c+"30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.25rem",marginBottom:"0.875rem"}}>{d.icon}</div>
              <div style={{fontWeight:700,fontSize:"0.9rem",color:"#0f172a",marginBottom:"0.5rem"}}>{d.label}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:"0.375rem"}}>
                <span style={{fontSize:"1.5rem",fontWeight:900,color:d.c,fontFamily:"monospace",letterSpacing:"-0.03em"}}>{d.val}</span>
                <span style={{fontSize:"0.7rem",color:"#94a3b8",fontWeight:600}}>{d.unit}</span>
              </div>
              <div style={{marginTop:"0.625rem",height:4,background:"#f1f5f9",borderRadius:4}}>
                <div style={{height:"100%",width:"70%",background:"linear-gradient(90deg,"+d.c+","+d.c+"88)",borderRadius:4}} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{padding:"4rem 2rem",background:"linear-gradient(135deg,#f0f6ff,#f8fafc)"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:"#0072ff",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.5rem"}}>Transparent Pricing</div>
            <h2 style={{fontSize:"2rem",fontWeight:800,letterSpacing:"-0.03em",color:"#0f172a"}}>No six-figure contracts</h2>
            <p style={{color:"#64748b",marginTop:"0.5rem",fontSize:"0.875rem"}}>14-day free trial · No credit card required</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.25rem"}}>
            {PLANS.map(p=>(
              <div key={p.name} style={{background:"#fff",border:"1px solid "+(p.pop?p.c+"60":"#e2e8f0"),borderRadius:16,padding:"1.75rem",position:"relative",transform:p.pop?"scale(1.03)":"none",boxShadow:p.pop?"0 8px 40px rgba(0,114,255,0.15)":"0 2px 8px rgba(0,0,0,0.04)"}}>
                {p.pop&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#0072ff,#00c6ff)",color:"#fff",fontSize:"0.6rem",fontWeight:800,padding:"3px 14px",borderRadius:20,whiteSpace:"nowrap"}}>MOST POPULAR</div>}
                <div style={{fontWeight:800,color:"#0f172a",marginBottom:"0.25rem",fontSize:"1rem"}}>{p.name}</div>
                <div style={{marginBottom:"1.25rem"}}><span style={{fontSize:"2rem",fontWeight:900,color:p.c,fontFamily:"monospace",letterSpacing:"-0.04em"}}>${p.price}</span><span style={{fontSize:"0.75rem",color:"#94a3b8"}}>/mo</span></div>
                <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"1.5rem"}}>
                  {p.features.map(f=><li key={f} style={{fontSize:"0.8rem",color:"#475569",display:"flex",gap:"0.4rem"}}><span style={{color:p.c,fontWeight:700}}>✓</span>{f}</li>)}
                </ul>
                <Link href="/login" style={{display:"block",textAlign:"center",padding:"0.7rem",background:p.pop?"linear-gradient(135deg,#0072ff,#00c6ff)":p.c+"12",border:p.pop?"none":"1px solid "+p.c+"30",borderRadius:10,color:p.pop?"#fff":p.c,fontWeight:700,fontSize:"0.82rem",textDecoration:"none"}}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{background:"linear-gradient(135deg,#0f2d6e,#0072ff)",padding:"4rem 2rem",textAlign:"center"}}>
        <h2 style={{fontSize:"2rem",fontWeight:800,color:"#fff",marginBottom:"1rem",letterSpacing:"-0.03em"}}>Ready to pilot your security posture?</h2>
        <p style={{color:"rgba(255,255,255,0.7)",marginBottom:"2rem"}}>Upload your first scan in minutes. No credit card required.</p>
        <Link href="/login" style={{display:"inline-block",background:"#fff",color:"#0072ff",fontWeight:700,fontSize:"1rem",padding:"1rem 2.5rem",borderRadius:10,textDecoration:"none",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>Start Your Free Trial →</Link>
      </section>

      <footer style={{background:"#0f172a",padding:"2rem 2.5rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
        <span style={{fontWeight:800,color:"#f1f5f9",fontSize:"1rem"}}>Posture<span style={{color:"#00c6ff"}}>Pilot</span><span style={{color:"#334155",fontWeight:400,fontSize:"0.75rem"}}> · Configure · Monitor · Report · Secure</span></span>
        <span style={{fontSize:"0.7rem",color:"#334155"}}>© 2026 PosturePilot · posturepilot.io</span>
      </footer>
    </div>
  );
}
