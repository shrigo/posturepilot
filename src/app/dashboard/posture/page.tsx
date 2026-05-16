'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { postureData } from '@/data/mockData';
import Topbar from '@/components/Topbar';
import Link from 'next/link';

const statusColor: Record<string, string> = {
  'KEV Listed':     '#dc2626',
  'Active Exploit': '#ea580c',
  'PoC Available':  '#d97706',
  'Patch Available':'#16a34a',
};

interface LiveSummary {
  total: number; critical: number; high: number; riskScore: number;
  slaCompliance: number; avgCvss: string; bySeverity: Record<string,number>;
  byTool: Record<string,number>; recentScans: { id:string; sourceTool:string; findingCount:number; createdAt:string }[];
  topCVEs: { cveId:string|null; count:number }[];
}

export default function PosturePage() {
  const [live, setLive]           = useState<LiveSummary | null>(null);
  const [liveErr, setLiveErr]     = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetch('/api/findings/summary')
      .then(r => r.json())
      .then(d => { if (d.total > 0) setLive(d); })
      .catch(() => setLiveErr(true));
  }, []);

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const res  = await fetch('/api/reports/executive');
      if (!res.ok) throw new Error('Failed');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `PosturePilot-Report-${new Date().toISOString().slice(0,10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { alert('Report generation failed — please upload a scan first.'); }
    finally { setDownloading(false); }
  };

  const hasLive = !!live;

  return (
    <>
      <Topbar title="🛡️ Cyber Posture" subtitle="Overall risk score, threat level & threat intelligence feed" />
      <div className="page-content animate-in">

        {/* Live data banner */}
        {hasLive && (
          <div style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #86efac', borderRadius:12, padding:'0.875rem 1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.75rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:'#22c55e', display:'inline-block', boxShadow:'0 0 8px #22c55e' }} />
              <div>
                <div style={{ fontWeight:800, color:'#15803d', fontSize:'0.9rem' }}>Live Data Active — {live!.total.toLocaleString()} findings from real scans</div>
                <div style={{ fontSize:'0.75rem', color:'#16a34a' }}>
                  Tools: {Object.keys(live!.byTool).join(', ')} · Avg CVSS: {live!.avgCvss}
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:'0.625rem' }}>
              <button onClick={downloadPDF} disabled={downloading} style={{ fontSize:'0.78rem', fontWeight:700, color:'#fff', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', border:'none', padding:'0.375rem 0.875rem', borderRadius:8, cursor: downloading ? 'not-allowed' : 'pointer', opacity: downloading ? 0.7 : 1 }}>
                {downloading ? '⏳ Generating…' : '📄 Download Report'}
              </button>
              <Link href="/dashboard/upload" style={{ fontSize:'0.78rem', fontWeight:700, color:'#16a34a', textDecoration:'none', border:'1px solid #86efac', padding:'0.375rem 0.875rem', borderRadius:8 }}>
                + Upload More →
              </Link>
            </div>
          </div>
        )}

        {/* Top stat row — live if available, else mock */}
        <div className="grid-4">
          {(hasLive ? [
            { label:'Total Findings',   value: live!.total.toLocaleString(),       accent:'#3b82f6', delta:`${live!.critical} Critical` },
            { label:'Risk Score',       value: `${live!.riskScore}`,               accent:'#ea580c', delta:`Avg CVSS ${live!.avgCvss}` },
            { label:'SLA Compliance',   value: `${live!.slaCompliance}%`,          accent:'#059669', delta:'Based on scan dates' },
            { label:'Open Criticals',   value: live!.critical.toLocaleString(),    accent:'#dc2626', delta:`+ ${live!.high} High` },
          ] : [
            { label:'Posture Score',    value: `${postureData.score}/100`,         accent:'#3b82f6', delta:'↓3 vs last month' },
            { label:'Threat Level',     value: String(postureData.threatLevel),    accent:'#ea580c', delta:'Elevated since May 9' },
            { label:'Control Coverage', value: `${postureData.controlCoverage}%`,  accent:'#059669', delta:'↑2% this month' },
            { label:'Open Criticals',   value: String(postureData.openCriticals),  accent:'#dc2626', delta:'↑4 since last scan' },
          ]).map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-delta delta-down">{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Severity breakdown (live) + trend chart */}
        <div className="grid-2-1">

          {hasLive ? (
            <div className="card">
              <div className="card-title">📊 Findings by Severity (Live)</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {[
                  { sev:'Critical', color:'#dc2626', bg:'#fef2f2' },
                  { sev:'High',     color:'#ea580c', bg:'#fff7ed' },
                  { sev:'Medium',   color:'#d97706', bg:'#fffbeb' },
                  { sev:'Low',      color:'#16a34a', bg:'#f0fdf4' },
                  { sev:'Info',     color:'#3b82f6', bg:'#eff6ff' },
                ].map(({ sev, color, bg }) => {
                  const count = live!.bySeverity[sev] || 0;
                  const pct = live!.total > 0 ? Math.round((count / live!.total) * 100) : 0;
                  return (
                    <div key={sev}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.25rem' }}>
                        <span style={{ fontSize:'0.8rem', fontWeight:700, color }}>{sev}</span>
                        <span style={{ fontSize:'0.8rem', fontWeight:700, color }}>{count.toLocaleString()} <span style={{ color:'#94a3b8', fontWeight:400 }}>({pct}%)</span></span>
                      </div>
                      <div style={{ height:8, background:bg, borderRadius:99, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:99, transition:'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-title">📈 Posture Score Trend (6 months)</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={postureData.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize:11, fill:'#94a3b8' }} />
                  <YAxis domain={[50,100]} tick={{ fontSize:11, fill:'#94a3b8' }} />
                  <Tooltip contentStyle={{ fontSize:12, borderRadius:8, border:'1px solid #e2e8f0' }} />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill:'#3b82f6', r:4 }} activeDot={{ r:6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="card">
            <div className="card-title">🔥 Active Threat Campaigns</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {[
                { name:'FIN7 (Ransomware)', target:'Finance sector', severity:'critical', ttps:'T1059, T1486' },
                { name:'Lazarus APT',       target:'Banking apps',   severity:'high',     ttps:'T1190, T1566' },
                { name:'DarkGate Loader',   target:'Email phishing', severity:'high',     ttps:'T1566.001'    },
              ].map(c => (
                <div key={c.name} style={{ padding:'0.75rem', background:'#f8fafc', borderRadius:10, border:'1px solid #e2e8f0' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.25rem' }}>
                    <div style={{ fontSize:'0.82rem', fontWeight:700, color:'#0f172a' }}>{c.name}</div>
                    <span className={`badge badge-${c.severity}`}>{c.severity}</span>
                  </div>
                  <div style={{ fontSize:'0.72rem', color:'#64748b' }}>Target: {c.target}</div>
                  <div style={{ fontSize:'0.68rem', color:'#94a3b8', marginTop:'0.2rem' }}>TTPs: {c.ttps}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top CVEs from real data */}
        {hasLive && live!.topCVEs.length > 0 && (
          <div className="card">
            <div className="card-title">🔁 Top CVEs in Your Environment (Live)</div>
            <table className="data-table">
              <thead><tr><th>CVE ID</th><th>Occurrences</th><th>Priority</th></tr></thead>
              <tbody>
                {live!.topCVEs.slice(0,10).map((c, i) => (
                  <tr key={c.cveId || i}>
                    <td><span style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'#4f46e5', fontWeight:600 }}>{c.cveId || '—'}</span></td>
                    <td><strong>{c.count}</strong></td>
                    <td><span className={`badge badge-${i < 3 ? 'critical' : i < 6 ? 'high' : 'medium'}`}>{i < 3 ? 'Patch Now' : i < 6 ? 'High' : 'Medium'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Threat Intel Feed */}
        <div className="card">
          <div className="card-title">🚨 Threat Intelligence Feed — Relevant CVEs</div>
          <table className="data-table">
            <thead>
              <tr><th>CVE ID</th><th>Title</th><th>CVSS</th><th>EPSS</th><th>Status</th><th>Severity</th><th>Published</th></tr>
            </thead>
            <tbody>
              {postureData.threatIntelFeed.map(t => (
                <tr key={t.id}>
                  <td><span style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'#3b82f6', fontWeight:600 }}>{t.cve}</span></td>
                  <td style={{ fontWeight:500, color:'#0f172a', fontSize:'0.8rem' }}>{t.title}</td>
                  <td><span style={{ fontWeight:700, color: t.cvss >= 9 ? '#dc2626' : t.cvss >= 7 ? '#ea580c' : '#d97706' }}>{t.cvss}</span></td>
                  <td><span style={{ fontWeight:700, color: t.epss >= 0.7 ? '#dc2626' : '#d97706' }}>{(t.epss * 100).toFixed(0)}%</span></td>
                  <td><span style={{ fontSize:'0.7rem', fontWeight:700, color: statusColor[t.status] || '#64748b', background:`${statusColor[t.status] || '#64748b'}15`, padding:'2px 8px', borderRadius:20, border:`1px solid ${statusColor[t.status] || '#64748b'}33` }}>{t.status}</span></td>
                  <td><span className={`badge badge-${t.severity}`}>{t.severity}</span></td>
                  <td style={{ fontSize:'0.75rem', color:'#94a3b8' }}>{t.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No data CTA */}
        {!hasLive && !liveErr && (
          <div style={{ textAlign:'center', padding:'2rem', color:'#94a3b8' }}>
            <div style={{ fontSize:'2rem', marginBottom:'0.5rem' }}>📂</div>
            <div style={{ fontWeight:700, color:'#64748b', marginBottom:'0.5rem' }}>No real scan data yet</div>
            <div style={{ fontSize:'0.85rem', marginBottom:'1rem' }}>Upload a Qualys, Nessus or CSV file to see live stats above</div>
            <Link href="/dashboard/upload" style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', padding:'0.625rem 1.5rem', borderRadius:8, textDecoration:'none', fontWeight:700, fontSize:'0.85rem' }}>
              Upload First Scan →
            </Link>
          </div>
        )}

      </div>
    </>
  );
}
