'use client';
import { useState, useRef } from 'react';
import Topbar from '@/components/Topbar';
import Link from 'next/link';

interface UploadResult {
  success: boolean;
  jobId: string;
  tool: string;
  total: number;
  bySeverity: Record<string, number>;
  error?: string;
}

interface ScanHistory {
  id: string; sourceTool: string; fileName: string | null;
  findingCount: number; status: string; createdAt: string;
}

const TOOL_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  qualys:   { label: 'Qualys VMDR',   icon: '🔵', color: '#3b82f6' },
  nessus:   { label: 'Nessus',        icon: '🔴', color: '#dc2626' },
  openvas:  { label: 'OpenVAS',       icon: '🟢', color: '#16a34a' },
  tenable:  { label: 'Tenable.io',    icon: '🟠', color: '#ea580c' },
  csv:      { label: 'Generic CSV',   icon: '📊', color: '#8b5cf6' },
};

export default function UploadPage() {
  const [dragOver, setDragOver]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [progress, setProgress]     = useState('');
  const [result, setResult]         = useState<UploadResult | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [history, setHistory]       = useState<ScanHistory[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadHistory = async () => {
    if (historyLoaded) return;
    try {
      const res = await fetch('/api/findings/summary');
      const data = await res.json();
      setHistory(data.recentScans || []);
      setHistoryLoaded(true);
    } catch { /* silent */ }
  };

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress('Uploading file…');

    try {
      const form = new FormData();
      form.append('file', file);

      setProgress('Parsing findings…');
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
      } else {
        setResult(data);
        setHistoryLoaded(false); // refresh history
        loadHistory();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const sev = result?.bySeverity || {};

  return (
    <>
      <Topbar title="📤 Upload Scan Results" subtitle="Import findings from Qualys, Tenable, Nessus or CSV — results go live instantly" />
      <div className="page-content animate-in">

        {/* Supported formats */}
        <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
          {[
            { icon:'🔵', name:'Qualys VMDR',  format:'.xml',    desc:'VMDR / WAS report'       },
            { icon:'🔴', name:'Nessus',        format:'.nessus', desc:'Export from Nessus Pro'  },
            { icon:'🟡', name:'OpenVAS',       format:'.xml',    desc:'GSF report format'       },
            { icon:'📊', name:'Generic CSV',   format:'.csv',    desc:'Any scanner CSV output'  },
            { icon:'🟠', name:'Tenable.io',    format:'.csv',    desc:'Tenable export'          },
          ].map(f => (
            <div key={f.name} style={{ padding:'0.75rem 1.125rem', background:'#fff', border:'1px solid #e2e8f0', borderRadius:10, display:'flex', alignItems:'center', gap:'0.625rem' }}>
              <span style={{ fontSize:'1.25rem' }}>{f.icon}</span>
              <div>
                <div style={{ fontSize:'0.8rem', fontWeight:700, color:'#0f172a' }}>{f.name}</div>
                <div style={{ fontSize:'0.68rem', color:'#94a3b8' }}>{f.format} · {f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Drop zone */}
        <label htmlFor="file-upload" style={{ display:'block', cursor: loading ? 'not-allowed' : 'pointer' }}>
          <div
            className={`upload-zone${dragOver ? ' drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            style={{ opacity: loading ? 0.75 : 1 }}
          >
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>
              {loading ? '⚙️' : dragOver ? '📂' : '📁'}
            </div>
            <div style={{ fontSize:'1.05rem', fontWeight:700, color:'#0f172a', marginBottom:'0.375rem' }}>
              {loading ? progress : 'Drop your scan file here'}
            </div>
            <div style={{ fontSize:'0.8rem', color:'#94a3b8', marginBottom:'1rem' }}>
              Supports: Qualys XML · Nessus .nessus · Tenable CSV · OpenVAS XML · Any CSV
            </div>
            {!loading && (
              <div style={{ display:'inline-block', padding:'0.625rem 1.5rem', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius:8, color:'#fff', fontWeight:700, fontSize:'0.85rem' }}>
                Or click to browse files
              </div>
            )}
            {loading && (
              <div style={{ display:'flex', gap:'0.3rem', justifyContent:'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:'#4f46e5', animation:`pulse-dot 1s ${i*0.2}s infinite` }} />
                ))}
              </div>
            )}
          </div>
          <input ref={inputRef} id="file-upload" type="file" accept=".xml,.csv,.nessus" style={{ display:'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} disabled={loading} />
        </label>

        {/* Error */}
        {error && (
          <div className="card animate-in" style={{ marginTop:'1.5rem', border:'1px solid #fecaca', background:'#fef2f2' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <span style={{ fontSize:'1.5rem' }}>❌</span>
              <div>
                <div style={{ fontWeight:800, color:'#dc2626' }}>Parse failed</div>
                <div style={{ fontSize:'0.82rem', color:'#64748b', marginTop:'0.25rem' }}>{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Success result */}
        {result && (
          <div className="card animate-in" style={{ marginTop:'1.5rem', border:'1px solid #bbf7d0', background:'#f0fdf4' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:'0.75rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <span style={{ fontSize:'1.5rem' }}>✅</span>
                <div>
                  <div style={{ fontWeight:800, fontSize:'1rem', color:'#0f172a' }}>
                    {result.total.toLocaleString()} findings imported successfully
                  </div>
                  <div style={{ fontSize:'0.78rem', color:'#64748b', marginTop:'0.2rem' }}>
                    Source: <strong>{TOOL_LABELS[result.tool]?.label || result.tool}</strong> · Job ID: <code style={{ fontSize:'0.72rem' }}>{result.jobId.slice(0,12)}…</code>
                  </div>
                </div>
              </div>
              <Link href="/dashboard/posture" style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', padding:'0.5rem 1.25rem', borderRadius:8, textDecoration:'none', fontWeight:700, fontSize:'0.85rem' }}>
                View Dashboard →
              </Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'0.75rem' }}>
              {[
                { label:'Critical', value: sev['Critical'] || 0, color:'#dc2626', bg:'#fef2f2' },
                { label:'High',     value: sev['High']     || 0, color:'#ea580c', bg:'#fff7ed' },
                { label:'Medium',   value: sev['Medium']   || 0, color:'#d97706', bg:'#fffbeb' },
                { label:'Low',      value: sev['Low']      || 0, color:'#16a34a', bg:'#f0fdf4' },
                { label:'Info',     value: sev['Info']     || 0, color:'#3b82f6', bg:'#eff6ff' },
              ].map(s => (
                <div key={s.label} style={{ padding:'0.75rem', background:s.bg, borderRadius:10, textAlign:'center', border:`1px solid ${s.color}22` }}>
                  <div style={{ fontSize:'1.5rem', fontWeight:800, color:s.color }}>{s.value.toLocaleString()}</div>
                  <div style={{ fontSize:'0.72rem', fontWeight:700, color:s.color, textTransform:'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent scan history */}
        <div className="card" style={{ marginTop:'2rem' }} onMouseEnter={loadHistory}>
          <div className="card-title">📋 Recent Scan Jobs</div>
          {history.length === 0 ? (
            <div style={{ color:'#94a3b8', fontSize:'0.85rem', padding:'1rem 0' }}>
              {historyLoaded ? 'No scans yet — upload your first file above.' : 'Hover to load history…'}
            </div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Tool</th><th>File</th><th>Findings</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {history.map(h => {
                  const t = TOOL_LABELS[h.sourceTool] || { label: h.sourceTool, icon:'📄', color:'#64748b' };
                  return (
                    <tr key={h.id}>
                      <td><span style={{ fontWeight:700, color:t.color }}>{t.icon} {t.label}</span></td>
                      <td style={{ fontSize:'0.78rem', color:'#64748b' }}>{h.fileName || '—'}</td>
                      <td><strong>{h.findingCount.toLocaleString()}</strong></td>
                      <td><span className={`badge badge-${h.status === 'done' ? 'low' : h.status === 'error' ? 'critical' : 'medium'}`}>{h.status}</span></td>
                      <td style={{ fontSize:'0.75rem', color:'#94a3b8' }}>{new Date(h.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </>
  );
}
