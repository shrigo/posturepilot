'use client';
import { useState } from 'react';
import Topbar from '@/components/Topbar';

export default function UploadPage() {
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<null | { parsed: number; critical: number; high: number; medium: number; low: number; source: string }>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    // Simulate parse result
    const isQualys = file.name.toLowerCase().includes('qualys') || file.name.endsWith('.xml');
    setResult({
      source: isQualys ? 'Qualys VMDR' : 'Nessus / CSV',
      parsed: 847,
      critical: 14,
      high: 67,
      medium: 148,
      low: 83,
    });
    setLoading(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <>
      <Topbar title="📤 Upload Scan Results" subtitle="Import findings from Qualys, Tenable, Nessus or CSV" />
      <div className="page-content animate-in">

        {/* Supported formats */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { icon: '🔵', name: 'Qualys XML', format: '.xml', desc: 'VMDR / WAS report' },
            { icon: '🔴', name: 'Nessus',     format: '.nessus / .csv', desc: 'Export from Nessus Pro' },
            { icon: '🟡', name: 'OpenVAS',    format: '.xml', desc: 'GSF report format' },
            { icon: '📊', name: 'Generic CSV', format: '.csv', desc: 'Any scanner CSV output' },
          ].map(f => (
            <div key={f.name} style={{ padding: '0.75rem 1.125rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{f.icon}</span>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{f.name}</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{f.format} · {f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Drop zone */}
        <label htmlFor="file-upload" style={{ display: 'block', cursor: 'pointer' }}>
          <div
            className={`upload-zone${dragOver ? ' drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.375rem' }}>
              {loading ? 'Parsing scan results...' : 'Drop your scan file here'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Supports: Qualys XML, Nessus .nessus, CSV files
            </div>
            {!loading && (
              <div style={{ display: 'inline-block', padding: '0.625rem 1.5rem', background: 'linear-gradient(135deg, #3b82f6, #0891b2)', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>
                Or click to browse files
              </div>
            )}
            {loading && (
              <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', animation: `pulse-dot 1s ${i*0.2}s infinite` }} />
                ))}
              </div>
            )}
          </div>
          <input id="file-upload" type="file" accept=".xml,.csv,.nessus" style={{ display: 'none' }} onChange={onFileInput} />
        </label>

        {/* Parse result */}
        {result && (
          <div className="card animate-in" style={{ marginTop: '1.5rem', border: '1px solid #bbf7d0', background: '#f0fdf4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>✅</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>Parse complete — {result.parsed} findings imported</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Source detected: <strong>{result.source}</strong> · Dashboards updated</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }}>
              {[
                { label: 'Critical', value: result.critical, color: '#dc2626', bg: '#fef2f2' },
                { label: 'High',     value: result.high,     color: '#ea580c', bg: '#fff7ed' },
                { label: 'Medium',   value: result.medium,   color: '#d97706', bg: '#fffbeb' },
                { label: 'Low',      value: result.low,      color: '#16a34a', bg: '#f0fdf4' },
              ].map(s => (
                <div key={s.label} style={{ padding: '0.75rem', background: s.bg, borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: s.color, textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
