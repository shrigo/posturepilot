// src/lib/soar/engine.ts
// SOAR Auto-Ticketing Engine
// Called after findings are batch-inserted. Evaluates rules and creates
// Jira / ServiceNow tickets directly in the DB for Critical/High findings.

import { prisma } from '@/lib/db';
import { UFinding } from '@/lib/parsers/qualys';

const DEFAULT_ORG_ID = 'demo-org';

// SLA durations by severity (milliseconds)
const SLA_MS: Record<string, number> = {
  Critical: 24  * 60 * 60 * 1000,   // 24 hours
  High:     7   * 24 * 60 * 60 * 1000, // 7 days
  Medium:   30  * 24 * 60 * 60 * 1000, // 30 days
  Low:      90  * 24 * 60 * 60 * 1000, // 90 days
};

// Map a finding's category context to a routing rule category
function inferCategory(finding: UFinding): string {
  const src = finding.sourceTool?.toLowerCase() ?? '';
  const title = (finding.title ?? '').toLowerCase();
  const host = (finding.host ?? '').toLowerCase();

  if (src === 'snyk' || src === 'sarif' || title.includes('injection') || title.includes('xss') || title.includes('sast'))
    return 'App Security Check (OWASP/SAST/DAST)';
  if (host.includes('aws') || host.includes('azure') || host.includes('gcp') || host.includes('s3') || title.includes('cloud'))
    return 'Cloud Altitude (AWS/Azure/GCP)';
  if (title.includes('ssh') || title.includes('ssl') || title.includes('vpn') || title.includes('firewall') || title.includes('network'))
    return 'Network Runway (Perimeters/FW/VPN)';
  if (title.includes('iam') || title.includes('sso') || title.includes('mfa') || title.includes('identity') || title.includes('privilege'))
    return 'Identity PreCheck (SSO/IAM/MFA)';

  // Default fallback
  return 'App Security Check (OWASP/SAST/DAST)';
}

// Generate a sequential-looking ticket ID
function genTicketId(system: 'Jira' | 'ServiceNow'): string {
  const suffix = Math.floor(Math.random() * 7000 + 2000);
  return system === 'Jira' ? `JIRA-SEC-${suffix}` : `SNOW-INC-${suffix}`;
}

// ─── Main SOAR dispatch function ──────────────────────────────────────────────
export async function runSoarDispatch(
  scanJobId: string,
  findings: UFinding[]
): Promise<void> {
  // Only process Critical and High findings
  const actionable = findings.filter(
    (f) => f.severity === 'Critical' || f.severity === 'High'
  );
  if (actionable.length === 0) return;

  // Fetch all active SOAR rules for this org
  const rules = await prisma.soarRule.findMany({
    where: { orgId: DEFAULT_ORG_ID },
  });

  // If no rules in DB yet, nothing to do (UI still shows localStorage-seeded rules)
  if (rules.length === 0) return;

  const logs: string[] = [];
  const tickets: Array<{
    id: string;
    orgId: string;
    cveId?: string | null;
    title: string;
    asset: string;
    assignee: string;
    avatar: string;
    severity: string;
    status: string;
    system: string;
    slaLimitMs: number;
  }> = [];

  for (const finding of actionable) {
    const category = inferCategory(finding);
    const rule = rules.find((r) => r.category === category);
    if (!rule) continue;

    const asset   = finding.host ?? finding.ip ?? 'unknown-asset';
    const slaMs   = SLA_MS[finding.severity] ?? SLA_MS['High'];
    const truncatedTitle = finding.title.slice(0, 200);

    if (rule.autoJira) {
      const ticketId = genTicketId('Jira');
      tickets.push({
        id:         ticketId,
        orgId:      DEFAULT_ORG_ID,
        cveId:      finding.cveId ?? null,
        title:      truncatedTitle,
        asset,
        assignee:   rule.leadName,
        avatar:     rule.avatar,
        severity:   finding.severity,
        status:     'Open',
        system:     'Jira',
        slaLimitMs: slaMs,
      });
      logs.push(
        `[SOAR-JIRA] Auto-created ${ticketId} for ${finding.cveId ?? finding.pluginId ?? 'finding'} → assigned to ${rule.leadName} (${category})`
      );
    }

    if (rule.autoSnow) {
      const ticketId = genTicketId('ServiceNow');
      tickets.push({
        id:         ticketId,
        orgId:      DEFAULT_ORG_ID,
        cveId:      finding.cveId ?? null,
        title:      truncatedTitle,
        asset,
        assignee:   rule.leadName,
        avatar:     rule.avatar,
        severity:   finding.severity,
        status:     'Open',
        system:     'ServiceNow',
        slaLimitMs: slaMs,
      });
      logs.push(
        `[SOAR-SNOW] Auto-created ${ticketId} for ${finding.cveId ?? finding.pluginId ?? 'finding'} → assigned to ${rule.leadName} (${category})`
      );
    }
  }

  // Batch-insert tickets and logs in parallel
  if (tickets.length > 0) {
    await prisma.soarTicket.createMany({ data: tickets, skipDuplicates: true });
  }

  if (logs.length > 0) {
    const logRecords = logs.map((message) => ({
      orgId:   DEFAULT_ORG_ID,
      message: `[${new Date().toISOString()}] ${message}`,
    }));
    await prisma.soarLog.createMany({ data: logRecords });
  }
}
