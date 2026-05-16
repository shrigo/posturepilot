'use client';
import { useState, useEffect, useCallback } from 'react';
import Topbar from '@/components/Topbar';

const SEV_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  Critical: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  High:     { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
  Medium:   { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
  Low:      { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  Info:     { bg: '#eff6ff', text: '#3b82f6', border: '#bfdbfe' },
};

const SEV_ORDER: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3, Info: 4 };

interface Finding {
  id: string; cveId: string | null; title: string; severity: string;
  cvssScore: number | null; sourceTool: string; host: string | null;
  status: string;  firstSeen: string; lastSeen: string;
}

interface ApiResponse {
  findings: Finding[]; total: number; page: number; pages: number;
  severityCounts: Record<string, number>; toolCounts: Record<string, number>;
}

export default function FindingsPage() {
  const [data, setData]             = useState<ApiResponse | null>(null);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [severity, setSeverity]     = useState('');
  const [tool, setTool]             = useState('');
  const [status, setStatus]         = useState('');
  const [slaBreached, setSlaBreached] = useState(false);
  const [page, setPage]             = useState(1);
  const [sort, setSort]             = useState('firstSeen');
  const [order, setOrder]           = useState<'asc'|'desc'>('desc');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page), limit: '25', sort, order,
      ...(search      && { search }),
      ...(severity    && { severity }),
      ...(tool        && { tool }),
      ...(status      && { status }),
      ...(slaBreached && { slaBreached: 'true' }),
    });
    try {
      const res = await fetch(`/api/findings/list?${params}`);
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }, [page, sort, order, search, severity, tool, status, slaBreached]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchData(); }, 350);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const toggleSort = (field: string) => {
    if (sort === field) setOrder(o => o === 'desc' ? 'asc' : 'desc');
    else { setSort(field); setOrder('desc'); }
    setPage(1);
  };

  const clearFilters = () => {
    setSearch(''); setSeverity(''); setTool(''); setStatus(''); setSlaBreached(false); setPage(1);
  };

  const exportCSV = () => {
    if (!data?.findings.length) return;
    const headers = ['CVE ID', 'Title', 'Severity', 'CVSS', 'Tool', 'Asset', 'Status', 'SLA Breached', 'First Seen'];
    const rows = data.findings.map(f => [
      f.cveId || 'N/A', `"${f.title.replace(/"/g, "'")}"`, f.severity,
      f.cvssScore ?? '', f.sourceTool, f.host || 'Unknown',
      f.status, f.status === "sla_breach" ? 'Yes' : 'No',
      new Date(f.firstSeen).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `findings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const sortIcon = (field: string) =>
    sort === field ? (order === 'desc' ? ' ↓' : ' ↑') : ' ⇅';

  const hasFilters = search || severity || tool || status || slaBreached;
  const totalFindings = data?.total ?? 0;
  const sc = data?.severityCounts ?? {};
  const tools = Object.keys(data?.toolCounts ?? {});

  return (
    <>
      <Topbar title="🔍 Findings" subtitle="All parsed CVEs & vulnerabilities from uploaded scans" />
      <div className="page-content animate-in">

        {/* Summary pills */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {Object.entries(SEV_ORDER)
            .sort(([a], [b]) => SEV_ORDER[a] - SEV_ORDER[b])
            .map(([sev]) => sc[sev] ? (
              <button key={sev} onClick={() => { setSeverity(severity === sev ? '' : sev); setPage(1); }}
                style={{ padding: '0.35rem 0.875rem', borderRadius: 20, border: `1.5px solid ${SEV_COLOR[sev]?.border}`,
                  background: severity === sev ? SEV_COLOR[sev]?.text : SEV_COLOR[sev]?.bg,
                  color: severity === sev ? '#fff' : SEV_COLOR[sev]?.text,
                  fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                {sev} ({sc[sev]})
              </button>
            ) : null)}
          {totalFindings > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#64748b', alignSelf: 'center' }}>
              {totalFindings.toLocaleString()} total findings
            </span>
          )}
        </div>

        {/* Filter bar */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.875rem' }}>🔎</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search CVE, title, asset…"
              style={{ width: '100%', paddingLeft: 30, paddingRight: 10, paddingTop: 8, paddingBottom: 8,
                border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.8rem', outline: 'none',
                background: '#f8fafc', boxSizing: 'border-box' }}
            />
          </div>

          {/* Severity */}
          <select value={severity} onChange={e => { setSeverity(e.target.value); setPage(1); }}
            style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.8rem', background: '#f8fafc', cursor: 'pointer' }}>
            <option value="">All Severities</option>
            {['Critical','High','Medium','Low','Info'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Tool */}
          <select value={tool} onChange={e => { setTool(e.target.value); setPage(1); }}
            style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.8rem', background: '#f8fafc', cursor: 'pointer', maxWidth: 160 }}>
            <option value="">All Tools</option>
            {tools.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          {/* Status */}
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.8rem', background: '#f8fafc', cursor: 'pointer' }}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="suppressed">Suppressed</option>
          </select>

          {/* SLA Breach toggle */}
          <button onClick={() => { setSlaBreached(b => !b); setPage(1); }}
            style={{ padding: '0.5rem 0.875rem', borderRadius: 8, border: `1.5px solid ${slaBreached ? '#dc2626' : '#e2e8f0'}`,
              background: slaBreached ? '#fef2f2' : '#f8fafc', color: slaBreached ? '#dc2626' : '#64748b',
              fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            🔴 SLA Breached
          </button>

          {hasFilters && (
            <button onClick={clearFilters}
              style={{ padding: '0.5rem 0.875rem', borderRadius: 8, border: '1px solid #e2e8f0',
                background: '#fff', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer' }}>
              ✕ Clear
            </button>
          )}

          {/* Export */}
          <button onClick={exportCSV}
            style={{ marginLeft: 'auto', padding: '0.5rem 1rem', borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg,#1e2d6e,#2d1b69)', color: '#fff',
              fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            ⬇ Export CSV
          </button>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
              Loading findings…
            </div>
          ) : !data?.findings.length ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                {hasFilters ? 'No findings match your filters' : 'No findings yet'}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                {hasFilters ? 'Try adjusting your filters' : 'Upload a scan file to see your findings here'}
              </div>
              {!hasFilters && (
                <a href="/dashboard/upload"
                  style={{ padding: '0.6rem 1.25rem', borderRadius: 8, background: '#1e2d6e',
                    color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem' }}>
                  📤 Upload Scan
                </a>
              )}
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      {[
                        { label: 'CVE ID',    field: 'cveId',      w: 120 },
                        { label: 'Title',     field: 'title',      w: 280 },
                        { label: 'Severity',  field: 'severity',   w: 90 },
                        { label: 'CVSS',      field: 'cvssScore',  w: 70 },
                        { label: 'Tool',      field: 'sourceTool', w: 110 },
                        { label: 'Asset',     field: 'assetName',  w: 120 },
                        { label: 'Status',    field: 'status',     w: 90 },
                        { label: 'SLA',       field: 'slaBreached',w: 70 },
                        { label: 'First Seen',field: 'firstSeen',  w: 100 },
                      ].map(col => (
                        <th key={col.field}
                          onClick={() => toggleSort(col.field)}
                          style={{ padding: '0.7rem 0.875rem', textAlign: 'left', fontWeight: 700,
                            cursor: 'pointer', whiteSpace: 'nowrap',
                            width: col.w, userSelect: 'none',
                            color: sort === col.field ? '#1e2d6e' : '#475569' } as React.CSSProperties}>
                          {col.label}{sortIcon(col.field)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.findings.map((f, i) => {
                      const sc = SEV_COLOR[f.severity] || SEV_COLOR.Info;
                      return (
                        <tr key={f.id}
                          style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa',
                            transition: 'background 0.1s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f0f4ff')}
                          onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafafa')}>
                          <td style={{ padding: '0.65rem 0.875rem', fontWeight: 700, color: '#1e2d6e', whiteSpace: 'nowrap' }}>
                            {f.cveId || <span style={{ color: '#94a3b8' }}>—</span>}
                          </td>
                          <td style={{ padding: '0.65rem 0.875rem', color: '#334155', maxWidth: 280 }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={f.title}>
                              {f.title}
                            </div>
                          </td>
                          <td style={{ padding: '0.65rem 0.875rem' }}>
                            <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
                              background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                              {f.severity}
                            </span>
                          </td>
                          <td style={{ padding: '0.65rem 0.875rem', fontWeight: 700,
                            color: (f.cvssScore ?? 0) >= 9 ? '#dc2626' : (f.cvssScore ?? 0) >= 7 ? '#ea580c' : '#64748b' }}>
                            {f.cvssScore?.toFixed(1) ?? '—'}
                          </td>
                          <td style={{ padding: '0.65rem 0.875rem', color: '#475569', whiteSpace: 'nowrap' }}>
                            <span style={{ padding: '2px 7px', borderRadius: 6, background: '#f1f5f9', fontSize: '0.7rem', fontWeight: 600 }}>
                              {f.sourceTool}
                            </span>
                          </td>
                          <td style={{ padding: '0.65rem 0.875rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                            {f.host || '—'}
                          </td>
                          <td style={{ padding: '0.65rem 0.875rem' }}>
                            <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
                              background: f.status === 'open' ? '#fef2f2' : f.status === 'closed' ? '#f0fdf4' : '#f8fafc',
                              color: f.status === 'open' ? '#dc2626' : f.status === 'closed' ? '#16a34a' : '#64748b' }}>
                              {f.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.65rem 0.875rem', textAlign: 'center' }}>
                            {f.status === "sla_breach"
                              ? <span title="SLA Breached" style={{ color: '#dc2626', fontWeight: 800, fontSize: '1rem' }}>🔴</span>
                              : <span title="On Track"     style={{ color: '#16a34a', fontWeight: 800, fontSize: '1rem' }}>✅</span>}
                          </td>
                          <td style={{ padding: '0.65rem 0.875rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                            {new Date(f.firstSeen).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {(data?.pages ?? 1) > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.875rem 1.25rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Page {page} of {data?.pages} &nbsp;·&nbsp; {totalFindings.toLocaleString()} results
                  </span>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button onClick={() => setPage(1)} disabled={page === 1}
                      style={{ padding: '0.375rem 0.625rem', borderRadius: 6, border: '1px solid #e2e8f0',
                        background: page === 1 ? '#f8fafc' : '#fff', cursor: page === 1 ? 'default' : 'pointer',
                        color: page === 1 ? '#cbd5e1' : '#475569', fontSize: '0.75rem' }}>«</button>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      style={{ padding: '0.375rem 0.75rem', borderRadius: 6, border: '1px solid #e2e8f0',
                        background: page === 1 ? '#f8fafc' : '#fff', cursor: page === 1 ? 'default' : 'pointer',
                        color: page === 1 ? '#cbd5e1' : '#475569', fontSize: '0.75rem' }}>‹ Prev</button>
                    {Array.from({ length: Math.min(5, data?.pages ?? 1) }, (_, i) => {
                      const p = Math.max(1, Math.min((data?.pages ?? 1) - 4, page - 2)) + i;
                      return (
                        <button key={p} onClick={() => setPage(p)}
                          style={{ padding: '0.375rem 0.625rem', borderRadius: 6,
                            border: `1px solid ${p === page ? '#1e2d6e' : '#e2e8f0'}`,
                            background: p === page ? '#1e2d6e' : '#fff',
                            color: p === page ? '#fff' : '#475569',
                            fontWeight: p === page ? 700 : 400, fontSize: '0.75rem', cursor: 'pointer' }}>
                          {p}
                        </button>
                      );
                    })}
                    <button onClick={() => setPage(p => Math.min(data?.pages ?? 1, p + 1))} disabled={page === data?.pages}
                      style={{ padding: '0.375rem 0.75rem', borderRadius: 6, border: '1px solid #e2e8f0',
                        background: page === data?.pages ? '#f8fafc' : '#fff',
                        cursor: page === data?.pages ? 'default' : 'pointer',
                        color: page === data?.pages ? '#cbd5e1' : '#475569', fontSize: '0.75rem' }}>Next ›</button>
                    <button onClick={() => setPage(data?.pages ?? 1)} disabled={page === data?.pages}
                      style={{ padding: '0.375rem 0.625rem', borderRadius: 6, border: '1px solid #e2e8f0',
                        background: page === data?.pages ? '#f8fafc' : '#fff',
                        cursor: page === data?.pages ? 'default' : 'pointer',
                        color: page === data?.pages ? '#cbd5e1' : '#475569', fontSize: '0.75rem' }}>»</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
