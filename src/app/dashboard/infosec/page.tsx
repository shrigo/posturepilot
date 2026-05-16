'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { infosecData } from '@/data/mockData';
import Topbar from '@/components/Topbar';
import Link from 'next/link';

interface LiveData {
  hasLiveData: boolean; total: number; critical: number; high: number;
  open: number; closed: number; complianceScore: number;
  bySeverity: Record<string,number>;
  topCVEs: { cveId: string|null; count: number }[];
}

export default function InfosecPage() {
  const [live, setLive] = useState<LiveData | null>(null);

  useEffect(() => {
    fetch('/api/findings/infosec').then(r => r.json())
      .then(d => { if (d.hasLiveData) setLive(d); }).catch(() => {});
  }, []);

  const sevChart = live
    ? Object.entries(live.bySeverity).map(([name, value]) => ({ name, value }))
    : infosecData.policyViolations;

  return (
    <>
      <Topbar title="🔏 InfoSec & Compliance" subtitle="Policy violations, access control audits & data classification" />
      <div className="page-content animate-in">

        {live && (
          <div style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #86efac', borderRadius:12, padding:'0.875rem 1.25rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.75rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:'#22c55e', display:'inline-block', boxShadow:'0 0 8px #22c55e' }} />
              <div>
                <div style={{ fontWeight:800, color:'#15803d', fontSize:'0.9rem' }}>Live Data — {live.total.toLocaleString()} InfoSec findings · Compliance Score: {live.complianceScore}%</div>
                <div style={{ fontSize:'0.75rem', color:'#16a34a' }}>Open: {live.open} · Closed: {live.closed} · Critical: {live.critical}</div>
              </div>
            </div>
            <Link href="/dashboard/findings" style={{ fontSize:'0.78rem', fontWeight:700, color:'#16a34a', textDecoration:'none', border:'1px solid #86efac', padding:'0.375rem 0.875rem', borderRadius:8 }}>View All →</Link>
          </div>
        )}

        <div className="grid-4">
          {[
            { label:'Total Findings',      value: live ? live.total.toLocaleString()           : infosecData.totalFindings,     accent:'#3b82f6', delta: live ? 'Real scans'          : 'Active issues' },
            { label:'Critical',            value: live ? live.critical.toLocaleString()         : infosecData.critical,          accent:'#dc2626', delta: live ? 'Immediate action'    : 'High risk' },
            { label:'Compliance Score',    value: live ? `${live.complianceScore}%`             : `${infosecData.complianceScore}%`, accent:'#059669', delta: live ? 'Computed live'  : 'Overall' },
            { label:'Open Findings',       value: live ? live.open.toLocaleString()             : infosecData.openIssues,        accent:'#d97706', delta: live ? `${live.closed} closed` : 'Unresolved' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-delta delta-down">{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-title">{live ? '📊 Findings by Severity (Live)' : '📋 Policy Violations'}</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sevChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey={live ? 'value' : 'count'} name="Count" fill="#3b82f6" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title">{live ? '🎯 Top CVEs (Live)' : '🔐 Access Review'}</div>
            {live ? (
              <table className="data-table">
                <thead><tr><th>CVE ID</th><th>Count</th><th>Category</th></tr></thead>
                <tbody>
                  {live.topCVEs.map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'#3b82f6', fontWeight:600 }}>{c.cveId || 'N/A'}</td>
                      <td style={{ fontWeight:700 }}>{c.count}</td>
                      <td><span className="badge badge-high">InfoSec</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="data-table">
                <thead><tr><th>Category</th><th>Count</th><th>Status</th></tr></thead>
                <tbody>
                  {infosecData.accessReview.map(a => (
                    <tr key={a.category}>
                      <td style={{ fontWeight:600, color:'#0f172a' }}>{a.category}</td>
                      <td style={{ fontWeight:700 }}>{a.count}</td>
                      <td><span className={`badge badge-${a.status === 'Reviewed' ? 'low' : a.status === 'Pending' ? 'medium' : 'critical'}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
