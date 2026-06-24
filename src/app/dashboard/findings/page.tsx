'use client';
import { useState, useEffect, useCallback } from 'react';
import { useClient } from '@/context/ClientContext';
import Link from 'next/link';

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

const INJECTED_FINDINGS: Finding[] = [
  {
    id: 'injected-cve-001',
    cveId: 'CVE-2026-3400',
    title: '🚨 EXPLOIT WAVE: Palo Alto PAN-OS RCE DDoS Ingress Flow',
    severity: 'Critical',
    cvssScore: 10.0,
    sourceTool: 'PaloAlto PAN-OS Threat Feed',
    host: 'edge-ingress-fw01',
    status: 'open',
    firstSeen: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago (breached!)
    lastSeen: new Date().toISOString(),
  },
  {
    id: 'injected-cve-002',
    cveId: 'CVE-2026-9800',
    title: '🚨 EXPLOIT WAVE: OpenSSH core-db-01 Remote Root Buffer Overflow',
    severity: 'Critical',
    cvssScore: 10.0,
    sourceTool: 'EDR Host Scanner',
    host: 'core-db-01.internal',
    status: 'open',
    firstSeen: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago (breached!)
    lastSeen: new Date().toISOString(),
  },
  {
    id: 'injected-cve-003',
    cveId: 'CVE-2026-1124',
    title: '🚨 EXPLOIT WAVE: Public Exposed AWS S3 Data Leakage Container',
    severity: 'Critical',
    cvssScore: 10.0,
    sourceTool: 'Prisma Cloud Scanner',
    host: 's3://acme-prod-customer-vault-backup',
    status: 'open',
    firstSeen: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago (breached!)
    lastSeen: new Date().toISOString(),
  }
];

export default function FindingsPage() {
  const { isUnderAttack, slaThresholds, currentClient } = useClient();

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
  const [dispatchedIds, setDispatchedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('posturepilot_soar_tickets');
        if (saved) {
          const tickets = JSON.parse(saved);
          const cves = new Set<string>(tickets.map((t: any) => t.cveId));
          setDispatchedIds(cves);
        }
      } catch {}
    }
  }, [data]);

  const handleAutoDispatch = (f: Finding) => {
    if (typeof window === 'undefined') return;
    try {
      const savedRules = localStorage.getItem('posturepilot_routing_rules');
      const rules = savedRules ? JSON.parse(savedRules) : [
        { category: 'Cloud Altitude (AWS/Azure/GCP)', leadName: 'Sarah Connor', leadRole: 'Cloud Security Lead', avatar: 'SC', autoJira: true, autoSnow: false },
        { category: 'Network Runway (Perimeters/FW/VPN)', leadName: 'Devon Vance', leadRole: 'Network Ops Specialist', avatar: 'DV', autoJira: true, autoSnow: true },
        { category: 'App Security Check (OWASP/SAST/DAST)', leadName: 'Marcus Brody', leadRole: 'Application Architect', avatar: 'MB', autoJira: false, autoSnow: true },
        { category: 'Identity PreCheck (SSO/IAM/MFA)', leadName: 'Elena Rostova', leadRole: 'IAM & Zero-Trust Director', avatar: 'ER', autoJira: true, autoSnow: false },
      ];

      let lead = rules[2]; // fallback Marcus
      const host = (f.host || '').toLowerCase();
      const sTool = (f.sourceTool || '').toLowerCase();
      if (host.includes('db') || host.includes('vault') || host.includes('s3') || sTool.includes('prisma')) {
        lead = rules[0];
      } else if (host.includes('fw') || host.includes('vpn') || host.includes('gateway') || sTool.includes('palo')) {
        lead = rules[1];
      } else if (host.includes('auth') || host.includes('directory') || sTool.includes('identity')) {
        lead = rules[3];
      }

      const savedTickets = localStorage.getItem('posturepilot_soar_tickets');
      let tickets = savedTickets ? JSON.parse(savedTickets) : [];

      const savedLogs = localStorage.getItem('posturepilot_soar_logs');
      let logs = savedLogs ? JSON.parse(savedLogs) : [];

      const timestamp = new Date().toLocaleTimeString();
      const ticketId = `JIRA-SEC-${Math.floor(Math.random() * 8000 + 2000)}`;
      const targetCve = f.cveId || `CVE-2026-${Math.floor(Math.random() * 8000 + 2000)}`;

      const newTicket = {
        id: ticketId,
        cveId: targetCve,
        title: f.title,
        asset: f.host || 'Unknown Asset',
        assignee: lead.leadName,
        avatar: lead.avatar,
        severity: f.severity as any,
        status: 'Dispatched',
        system: lead.autoJira ? 'Jira' : 'ServiceNow',
        createdAt: Date.now(),
        slaLimitMs: f.severity === 'Critical' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
      };

      tickets.unshift(newTicket);
      logs.push(`[${timestamp} SOAR-OVERRIDE] 1-Click Auto-Dispatch triggered from Customs Check: ${newTicket.cveId}`);
      logs.push(`[${timestamp} SOAR-ROUTER] Routing matched: assigned to ${lead.leadName} (${lead.leadRole})`);
      logs.push(`[${timestamp} SOAR-${newTicket.system.toUpperCase()}] Created ticket ${ticketId}.`);

      localStorage.setItem('posturepilot_soar_tickets', JSON.stringify(tickets));
      localStorage.setItem('posturepilot_soar_logs', JSON.stringify(logs));

      setDispatchedIds(prev => {
        const next = new Set(prev);
        next.add(targetCve);
        return next;
      });
    } catch (e) {
      console.error(e);
    }
  };

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

  const isSlaBreached = useCallback((f: Finding) => {
    if (f.status === 'closed' || f.status === 'suppressed') return false;
    if (f.status === 'sla_breach') return true;
    
    // Compute based on customized thresholds
    const sev = f.severity.toLowerCase();
    const thresholdDays = 
      sev === 'critical' ? slaThresholds.critical :
      sev === 'high' ? slaThresholds.high :
      sev === 'medium' ? slaThresholds.med :
      90; // default for low/info
      
    const firstSeenDate = new Date(f.firstSeen);
    const diffTime = Math.abs(Date.now() - firstSeenDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > thresholdDays;
  }, [slaThresholds]);

  let displayedFindings = data?.findings ? [...data.findings] : [];

  // Local SLA recalculations & filters
  if (data?.findings) {
    if (slaBreached) {
      displayedFindings = displayedFindings.filter(f => isSlaBreached(f));
    }
  }

  // Prepend simulated attack exploits if active
  if (isUnderAttack && data?.findings) {
    const matchedInjected = INJECTED_FINDINGS.filter(f => {
      if (search && !f.title.toLowerCase().includes(search.toLowerCase()) && !f.cveId?.toLowerCase().includes(search.toLowerCase()) && !f.host?.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (severity && f.severity !== severity) {
        return false;
      }
      if (tool && f.sourceTool !== tool) {
        return false;
      }
      if (status && f.status !== status) {
        return false;
      }
      return true;
    });
    displayedFindings = [...matchedInjected, ...displayedFindings];
  }

  const exportCSV = () => {
    if (!displayedFindings.length) return;
    const headers = ['CVE ID', 'Title', 'Severity', 'CVSS', 'Tool', 'Asset', 'Status', 'SLA Breached', 'First Seen'];
    const rows = displayedFindings.map(f => [
      f.cveId || 'N/A', `"${f.title.replace(/"/g, "'")}"`, f.severity,
      f.cvssScore ?? '', f.sourceTool, f.host || 'Unknown',
      f.status, isSlaBreached(f) ? 'Yes' : 'No',
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
      <div className="page-content animate-in">

        {isUnderAttack && (
          <div style={{
            background: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)',
            border: '2px solid #ef4444',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.08)',
            animation: 'pulse-dot 2s infinite'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.75rem' }}>🚨</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#9f1239' }}>Active Exploit Campaign Detected</h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#be123c', fontWeight: 600 }}>
                  3 Critical CVE vectors have breached security boundaries! Go to the <strong>Posture</strong> page or use the <strong>Upload Scan</strong> patcher to hot-patch active endpoints.
                </p>
              </div>
            </div>
            <Link href="/dashboard" style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 800,
              textDecoration: 'none',
              padding: '0.5rem 1.125rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
            }}>
              View Posture Sandbox →
            </Link>
          </div>
        )}

        {/* Summary pills */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
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
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', position: 'relative', minHeight: '180px' }}>
          {loading && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 1.5s linear infinite',
              zIndex: 10
            }} />
          )}

          {!data && loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
              Loading findings…
            </div>
          ) : !displayedFindings.length ? (
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
            <div style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.15s ease' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      {[
                        { label: 'CVE ID',    field: 'cveId',      w: 110 },
                        { label: 'Title',     field: 'title',      w: 240 },
                        { label: 'Severity',  field: 'severity',   w: 80 },
                        { label: 'CVSS',      field: 'cvssScore',  w: 60 },
                        { label: 'Tool',      field: 'sourceTool', w: 100 },
                        { label: 'Asset',     field: 'assetName',  w: 110 },
                        { label: 'Status',    field: 'status',     w: 85 },
                        { label: 'SLA',       field: 'slaBreached',w: 65 },
                        { label: 'First Seen',field: 'firstSeen',  w: 90 },
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
                      <th style={{ padding: '0.7rem 0.875rem', textAlign: 'left', fontWeight: 700, width: 120, color: '#475569' }}>
                        SOAR Ticket Gate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedFindings.map((f, i) => {
                      const sc = SEV_COLOR[f.severity] || SEV_COLOR.Info;
                      const breached = isSlaBreached(f);
                      const isExploitCampaign = f.id.startsWith('injected-');
                      return (
                        <tr key={f.id}
                          style={{ 
                            borderBottom: '1px solid #f1f5f9', 
                            background: isExploitCampaign ? '#fef2f2' : (i % 2 === 0 ? '#fff' : '#fafafa'),
                            transition: 'background 0.1s' 
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = isExploitCampaign ? '#ffe4e6' : '#f0f4ff')}
                          onMouseLeave={e => (e.currentTarget.style.background = isExploitCampaign ? '#fef2f2' : (i % 2 === 0 ? '#fff' : '#fafafa'))}>
                          <td style={{ padding: '0.65rem 0.875rem', fontWeight: 700, color: isExploitCampaign ? '#e11d48' : '#1e2d6e', whiteSpace: 'nowrap' }}>
                            {f.cveId || <span style={{ color: '#94a3b8' }}>—</span>}
                          </td>
                          <td style={{ padding: '0.65rem 0.875rem', color: '#334155', maxWidth: 240 }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: isExploitCampaign ? 700 : 400 }} title={f.title}>
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
                            <span style={{ padding: '2px 7px', borderRadius: 6, background: isExploitCampaign ? '#ffe4e6' : '#f1f5f9', fontSize: '0.7rem', fontWeight: 600, color: isExploitCampaign ? '#be123c' : undefined }}>
                              {f.sourceTool}
                            </span>
                          </td>
                          <td style={{ padding: '0.65rem 0.875rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                            {f.host || '—'}
                          </td>
                          <td style={{ padding: '0.65rem 0.875rem' }}>
                            <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
                              background: isExploitCampaign ? '#ffe4e6' : (f.status === 'open' ? '#fef2f2' : f.status === 'closed' ? '#f0fdf4' : '#f8fafc'),
                              color: isExploitCampaign ? '#be123c' : (f.status === 'open' ? '#dc2626' : f.status === 'closed' ? '#16a34a' : '#64748b') }}>
                              {isExploitCampaign ? 'active exploit' : f.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.65rem 0.875rem', textAlign: 'center' }}>
                            {breached
                              ? <span title="SLA Breached" style={{ color: '#dc2626', fontWeight: 800, fontSize: '1rem' }}>🔴</span>
                              : <span title="On Track"     style={{ color: '#16a34a', fontWeight: 800, fontSize: '1rem' }}>✅</span>}
                          </td>
                          <td style={{ padding: '0.65rem 0.875rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                            {new Date(f.firstSeen).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '0.65rem 0.875rem' }}>
                            {dispatchedIds.has(f.cveId || '') ? (
                              <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 2 }}>
                                ✓ DISPATCHED
                              </span>
                            ) : (
                              <button
                                onClick={() => handleAutoDispatch(f)}
                                style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 800,
                                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '3px 7px',
                                  borderRadius: 4,
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 4px rgba(124, 58, 237, 0.15)',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                ⚡ Dispatch
                              </button>
                            )}
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}
