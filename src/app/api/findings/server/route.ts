// GET /api/findings/server
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const ORG_ID = 'demo-org';
const TOOLS = ['qualys', 'tenable', 'nessus', 'rapid7', 'openvas'];
const KEYWORDS = ['windows', 'linux', 'patch', 'os', 'kernel', 'system', 'server', 'host', 'endpoint', 'registry', 'service'];

export async function GET() {
  try {
    const orFilter = [
      ...TOOLS.map(t => ({ sourceTool: { contains: t } })),
      ...KEYWORDS.map(k => ({ title: { contains: k } })),
    ];

    const [byTool, bySeverity, topCVEs, slaBreached] = await Promise.all([
      prisma.finding.groupBy({
        by: ['sourceTool'],
        where: { orgId: ORG_ID, status: 'open', sourceTool: { in: TOOLS } },
        _count: { sourceTool: true },
      }),
      prisma.finding.groupBy({
        by: ['severity'],
        where: { orgId: ORG_ID, status: 'open', OR: orFilter },
        _count: { severity: true },
      }),
      prisma.finding.groupBy({
        by: ['cveId'],
        where: { orgId: ORG_ID, status: 'open', cveId: { not: null }, OR: orFilter },
        _count: { cveId: true },
        orderBy: { _count: { cveId: 'desc' } },
        take: 5,
      }),
      prisma.finding.count({
        where: { orgId: ORG_ID, status: "sla_breach" },
      }),
    ]);

    const moduleTotal = byTool.reduce((s, t) => s + t._count.sourceTool, 0);
    const hasLiveData = moduleTotal > 0;
    const sevMap = Object.fromEntries(bySeverity.map(s => [s.severity, s._count.severity]));
    const critical = sevMap['Critical'] || 0;
    const high = sevMap['High'] || 0;
    const total = hasLiveData ? moduleTotal : 0;
    const patchedHosts = Math.round(total * 0.6);
    const unhealthyHosts = critical + Math.round(high * 0.5);

    return NextResponse.json({
      hasLiveData,
      total,
      critical,
      high,
      slaBreached,
      patchedHosts,
      unhealthyHosts,
      bySeverity: sevMap,
      byTool: Object.fromEntries(byTool.map(t => [t.sourceTool, t._count.sourceTool])),
      topCVEs: topCVEs.map(c => ({ cveId: c.cveId, count: c._count.cveId })),
    });
  } catch (err) {
    console.error('[findings/server]', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
