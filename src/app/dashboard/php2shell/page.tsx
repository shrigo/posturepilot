'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useClient } from '@/context/ClientContext';
import ModuleCockpitCard, { ModuleCockpitConfig } from '@/components/ModuleCockpitCard';
import {
  INTERIM_CONTROLS,
  PATCHED_RELEASES,
  PHP2SHELL_CVES,
  Php2ShellFinding,
  Php2ShellStatus,
  isOpenStatus,
  php2shellInventories,
} from '@/data/php2shell';

const cockpitConfig: ModuleCockpitConfig = {
  title: 'PHP2Shell Exposure Telemetry',
  badge: 'Module 13',
  apiEndpoint: '',
  rings: [
    { label: 'Patched%', color: '#10b981', glowColor: 'rgba(16,185,129,0.35)' },
    { label: 'Hidden%', color: '#f59e0b', glowColor: 'rgba(245,158,11,0.35)' },
    { label: 'KEV%', color: '#dc2626', glowColor: 'rgba(220,38,38,0.35)' },
  ],
  indexLabel: 'PHP2SH',
  funnel: [
    { label: 'Runtimes Seen', sublabel: 'PHP interpreters found in repos, images, and workers', color: '#7c3aed' },
    { label: 'Below Fix', sublabel: 'Versions older than the Oct 21 patched releases', color: '#ef4444' },
    { label: 'Hidden PHP', sublabel: 'Interpreter bundled inside CMS or marketplace images', color: '#ea580c' },
    { label: 'Workers Recycled', sublabel: 'Live web request matches a patched binary', color: '#10b981' },
  ],
  gates: ['VERSION PIN', 'IMAGE SCAN', 'WORKER CHECK'],
  syncLabel: 'Repo Connectors Synced',
  checklist: [
    { name: 'Patch the runtime', desc: 'Move every web-serving PHP worker to 8.5.12, 8.4.27, 8.3.36, or 8.2.35 and restart it.' },
    { name: 'Hunt bundled PHP', desc: 'Check CMS, LAMP, and marketplace images whose app repos contain no PHP version file.' },
  ],
};

const CODEBASE_CHECKS = [
  { name: 'Version pins', detail: 'Dockerfiles, composer.json, composer.lock, and CI setup-php versions compared with 8.5.12, 8.4.27, 8.3.36, and 8.2.35.' },
  { name: 'Bundled interpreters', detail: 'WordPress, Drupal, Magento, and marketplace LAMP images, where the app tree has no PHP manifest.' },
  { name: 'Tag versus digest', detail: 'Chart tags such as php-8.2 that still resolve to a digest below the fixed release.' },
  { name: 'CLI versus worker', detail: 'Build-agent php -v can look patched while the FPM or Apache worker serving traffic is older.' },
  { name: 'End-of-life branches', detail: 'PHP 8.1 and earlier stay open. Those branches do not get a binary fix.' },
];

type FilterKey = 'all' | 'open' | 'hidden' | 'patched';

function statusLabel(status: Php2ShellStatus) {
  if (status === 'vulnerable') return 'Vulnerable';
  if (status === 'eol') return 'End of life';
  if (status === 'mitigated') return 'Interim only';
  if (status === 'remediated') return 'Remediated';
  return 'Patched';
}

function statusColor(status: Php2ShellStatus) {
  if (status === 'vulnerable' || status === 'eol') return '#dc2626';
  if (status === 'mitigated') return '#d97706';
  return '#059669';
}

export default function Php2ShellPage() {
  const { currentClient } = useClient();
  const inventory = php2shellInventories[currentClient.key] ?? php2shellInventories.WELLS;
  const [activeKey, setActiveKey] = useState(currentClient.key);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, Php2ShellStatus>>({});
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const first = inventory.find(item => isOpenStatus(item.status)) ?? inventory[0];
    return first?.id ?? null;
  });
  const [filter, setFilter] = useState<FilterKey>('open');
  const [logs, setLogs] = useState<string[]>([
    `[INVENTORY] Loaded connected repositories for ${currentClient.name}.`,
    '[INVENTORY] This check reads version pins, image digests, and worker banners. It does not send exploit traffic.',
  ]);
  const [scanning, setScanning] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const scanTimers = useRef<number[]>([]);

  if (activeKey !== currentClient.key) {
    const next = php2shellInventories[currentClient.key] ?? php2shellInventories.WELLS;
    const first = next.find(item => isOpenStatus(item.status)) ?? next[0];
    scanTimers.current.forEach(id => window.clearTimeout(id));
    scanTimers.current = [];
    setActiveKey(currentClient.key);
    setStatusOverrides({});
    setSelectedId(first?.id ?? null);
    setFilter('open');
    setLogs([
      `[INVENTORY] Loaded connected repositories for ${currentClient.name}.`,
      '[INVENTORY] This check reads version pins, image digests, and worker banners. It does not send exploit traffic.',
    ]);
    setScanning(false);
    setBusyId(null);
  }

  useEffect(() => () => {
    scanTimers.current.forEach(id => window.clearTimeout(id));
  }, []);

  const findings: Php2ShellFinding[] = inventory.map(item => ({
    ...item,
    status: statusOverrides[item.id] ?? item.status,
  }));

  const counts = useMemo(() => {
    const open = findings.filter(item => isOpenStatus(item.status)).length;
    const interim = findings.filter(item => item.status === 'mitigated').length;
    const hidden = findings.filter(item => item.hidden && item.status !== 'patched' && item.status !== 'remediated').length;
    const internet = findings.filter(item => item.internetFacing && item.status !== 'patched' && item.status !== 'remediated').length;
    const closed = findings.filter(item => item.status === 'patched' || item.status === 'remediated').length;
    return {
      open,
      interim,
      hidden,
      internet,
      closed,
      progress: findings.length ? Math.round((closed / findings.length) * 100) : 100,
    };
  }, [findings]);

  const visible = findings.filter(item => {
    if (filter === 'open') return item.status !== 'patched' && item.status !== 'remediated';
    if (filter === 'hidden') return item.hidden;
    if (filter === 'patched') return item.status === 'patched' || item.status === 'remediated';
    return true;
  });

  const selected = visible.find(item => item.id === selectedId) ?? visible[0] ?? null;

  const runCodebaseScan = () => {
    if (scanning) return;
    setScanning(true);
    setLogs([`[SCAN] Walking ${currentClient.name} repositories, image locks, and live worker banners...`]);

    const openCount = findings.filter(item => item.status !== 'patched' && item.status !== 'remediated').length;
    const hiddenCount = findings.filter(item => item.hidden && item.status !== 'patched' && item.status !== 'remediated').length;
    const steps = [
      '[SCAN] Comparing Dockerfiles and composer platform.php with the Oct 21 fixed releases.',
      '[SCAN] Opening marketplace and CMS base images that never appear in an application lockfile.',
      '[SCAN] Diffing chart tags against image digests, then against the PHP banner on the live worker.',
      ...findings.map(item => {
        const flag = item.hidden ? 'HIDDEN' : item.kind.toUpperCase();
        const state = item.status === 'patched' || item.status === 'remediated' ? 'CLEAR' : 'OPEN';
        return `[${flag}] ${item.asset} ${item.path} — PHP ${item.version} (${item.sapi}) — ${state}`;
      }),
      `[DONE] ${openCount} runtime${openCount === 1 ? '' : 's'} still below a fixed release. ${hiddenCount} of those are bundled where a normal SCA scan stays quiet.`,
    ];

    scanTimers.current.forEach(id => window.clearTimeout(id));
    scanTimers.current = steps.map((line, index) => window.setTimeout(() => {
      setLogs(prev => [...prev, line]);
      if (index === steps.length - 1) setScanning(false);
    }, 280 * (index + 1)));
  };

  const applyFix = (finding: Php2ShellFinding, mode: 'patch' | 'interim') => {
    if (busyId || !isOpenStatus(finding.status)) return;
    setBusyId(finding.id);
    const nextStatus: Php2ShellStatus = mode === 'patch' ? 'remediated' : 'mitigated';
    const line = mode === 'patch'
      ? `[REMEDIATE] ${finding.asset}: change queued to replace PHP ${finding.version} and restart ${finding.sapi} workers.`
      : `[INTERIM] ${finding.asset}: published config profile noted. Internet exposure should still come down until the binary is upgraded.`;

    window.setTimeout(() => {
      setStatusOverrides(prev => ({ ...prev, [finding.id]: nextStatus }));
      setLogs(prev => [...prev, line]);
      setBusyId(null);
    }, 500);
  };

  return (
    <div className="page-content animate-in" style={{ paddingBottom: '2.5rem' }}>
      <div className="sticky-alert-banner" style={{ borderColor: '#fecaca', background: '#fff7f7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#dc2626', display: 'inline-block', boxShadow: '0 0 8px #dc2626' }} />
          <div>
            <div style={{ fontWeight: 800, color: '#991b1b', fontSize: '0.9rem' }}>
              PHP2Shell — CVE-2026-109618 and CVE-2026-109619 are on the CISA KEV list
            </div>
            <div style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: 600 }}>
              CVSS v4.0 9.2 · unauthenticated RCE in the PHP runtime · fixed Oct 21, 2026 · KEV since Oct 26, 2026 · {currentClient.name}
            </div>
          </div>
        </div>
        <button
          onClick={runCodebaseScan}
          disabled={scanning}
          style={{
            fontSize: '0.78rem', fontWeight: 800, color: '#fff',
            background: scanning ? '#94a3b8' : 'linear-gradient(135deg, #b91c1c, #9a3412)',
            border: 'none', padding: '0.5rem 1.25rem', borderRadius: 8,
            cursor: scanning ? 'not-allowed' : 'pointer',
          }}
        >
          {scanning ? 'Scanning codebase…' : 'Scan codebase'}
        </button>
      </div>

      <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
        {[
          { label: 'Open runtimes', value: String(counts.open), hint: 'Below a fixed release', color: '#dc2626' },
          { label: 'Hidden in images', value: String(counts.hidden), hint: 'Missed by a normal SCA pass', color: '#d97706' },
          { label: 'Internet-facing', value: String(counts.internet), hint: 'Patch these first', color: '#9f1239' },
          { label: 'Remediation', value: `${counts.progress}%`, hint: counts.interim ? `${counts.closed} patched · ${counts.interim} interim` : `${counts.closed} of ${findings.length} patched`, color: '#059669' },
        ].map(card => (
          <div className="stat-card" key={card.label}>
            <div className="stat-card-accent" style={{ background: card.color }} />
            <div>
              <div className="stat-label">{card.label}</div>
              <div className="stat-value" style={{ color: card.color, fontSize: '1.8rem', marginTop: 4 }}>{card.value}</div>
            </div>
            <div className="stat-delta" style={{ color: card.color, fontWeight: 700 }}>{card.hint}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
        {PHP2SHELL_CVES.map(cve => (
          <div className="card" key={cve.id} style={{ padding: '1.1rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#dc2626', letterSpacing: '0.04em' }}>{cve.id} · KEV</div>
                <div style={{ fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{cve.title}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#dc2626', lineHeight: 1 }}>{cve.cvss}</div>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#94a3b8' }}>{cve.scoreSystem}</div>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, margin: '0.75rem 0 0' }}>{cve.summary}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem' }}>Fixed releases — every web SAPI</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {PATCHED_RELEASES.map(release => (
            <span key={release.branch} style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 8, padding: '0.35rem 0.7rem', fontSize: '0.78rem', fontWeight: 800 }}>
              PHP {release.branch} → {release.version}
            </span>
          ))}
          <span style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 8, padding: '0.35rem 0.7rem', fontSize: '0.78rem', fontWeight: 800 }}>
            8.1 and earlier · no binary fix
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
          Affected range is PHP 5.4 through 8.5.11, including Apache mod_php, PHP-FPM, php-cgi, FrankenPHP, and LiteSpeed. The PHP project rates Apache mod_php as the highest-risk deployment. Restart workers after the upgrade and verify the running worker, not the image tag alone.
        </p>
      </div>

      <ModuleCockpitCard config={cockpitConfig} live={null} overrideScore={counts.progress} />

      <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
        <div className="card" style={{ padding: '1rem 1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ fontWeight: 800, color: '#0f172a' }}>Codebase findings</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {([
                ['open', 'Open'],
                ['hidden', 'Hidden'],
                ['patched', 'Closed'],
                ['all', 'All'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  style={{
                    border: '1px solid #e2e8f0',
                    background: filter === key ? '#0f172a' : '#fff',
                    color: filter === key ? '#fff' : '#475569',
                    borderRadius: 6,
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.25rem 0.5rem',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {visible.length === 0 && (
              <div style={{ fontSize: '0.8rem', color: '#64748b', padding: '0.75rem 0' }}>Nothing in this filter.</div>
            )}
            {visible.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                style={{
                  textAlign: 'left',
                  border: selected?.id === item.id ? '1px solid #7c3aed' : '1px solid #e2e8f0',
                  background: selected?.id === item.id ? '#faf5ff' : '#fff',
                  borderRadius: 10,
                  padding: '0.65rem 0.75rem',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.82rem' }}>{item.asset}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: statusColor(item.status) }}>{statusLabel(item.status)}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                  PHP {item.version} · {item.sapi} · {item.kind}
                  {item.hidden ? ' · hidden' : ''}
                  {item.internetFacing ? ' · internet' : ''}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.15rem' }}>
          {selected ? (
            <>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#7c3aed' }}>{selected.id}</div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginTop: 4 }}>{selected.asset}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>{selected.path}</div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', margin: '0.75rem 0' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: statusColor(selected.status), background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '2px 8px' }}>{statusLabel(selected.status)}</span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#334155', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '2px 8px' }}>PHP {selected.version}</span>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#334155', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '2px 8px' }}>{selected.sapi}</span>
              </div>
              {selected.hidden && (
                <p style={{ fontSize: '0.8rem', color: '#9a3412', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '0.6rem 0.7rem', margin: '0 0 0.75rem' }}>
                  {selected.hiddenReason}
                </p>
              )}
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Evidence in repo</div>
              <pre style={{ background: '#0f172a', color: '#e2e8f0', borderRadius: 8, padding: '0.7rem 0.8rem', fontSize: '0.75rem', overflowX: 'auto', margin: '0.35rem 0 0.75rem' }}>{selected.evidence}</pre>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Remediation</div>
              <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.5, margin: '0.35rem 0 0.85rem' }}>{selected.fix}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => applyFix(selected, 'patch')}
                  disabled={!isOpenStatus(selected.status) || busyId === selected.id}
                  style={{
                    background: '#059669', color: '#fff', border: 'none', borderRadius: 8,
                    padding: '0.5rem 0.85rem', fontWeight: 800, fontSize: '0.75rem',
                    cursor: isOpenStatus(selected.status) ? 'pointer' : 'not-allowed', opacity: isOpenStatus(selected.status) ? 1 : 0.55,
                  }}
                >
                  Queue runtime upgrade
                </button>
                <button
                  onClick={() => applyFix(selected, 'interim')}
                  disabled={!isOpenStatus(selected.status) || busyId === selected.id}
                  style={{
                    background: '#fff', color: '#9a3412', border: '1px solid #fdba74', borderRadius: 8,
                    padding: '0.5rem 0.85rem', fontWeight: 800, fontSize: '0.75rem',
                    cursor: isOpenStatus(selected.status) ? 'pointer' : 'not-allowed', opacity: isOpenStatus(selected.status) ? 1 : 0.55,
                  }}
                >
                  Note interim profile
                </button>
              </div>
            </>
          ) : (
            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Select a finding.</div>
          )}
        </div>
      </div>

      <div className="grid-2">
        <div className="card" style={{ padding: '1rem 1.15rem' }}>
          <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem' }}>What the codebase check covers</div>
          {CODEBASE_CHECKS.map(check => (
            <div key={check.name} style={{ marginBottom: '0.65rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>{check.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.45 }}>{check.detail}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: '1rem 1.15rem', background: '#0f172a', color: '#e2e8f0' }}>
          <div style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Scan log</div>
          <div style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.72rem', lineHeight: 1.55, maxHeight: 280, overflowY: 'auto' }}>
            {logs.map((line, index) => (
              <div key={`${index}-${line}`}>{line}</div>
            ))}
          </div>
          <div style={{ marginTop: '0.9rem', borderTop: '1px solid #334155', paddingTop: '0.75rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.78rem', marginBottom: '0.4rem' }}>Severity remediation order</div>
            {INTERIM_CONTROLS.map(item => (
              <div key={item} style={{ fontSize: '0.72rem', color: '#cbd5e1', marginBottom: '0.35rem', lineHeight: 1.4 }}>• {item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
