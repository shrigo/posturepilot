// GET /api/findings/traffic
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const ORG_ID = 'demo-org';
const KEYWORDS = ['traffic', 'anomaly', 'port scan', 'ddos', 'botnet', 'c2', 'exfil', 'beacon', 'lateral', 'brute', 'flood', 'scan'];

export async function GET() {
  try {
    const orFilter = KEYWORDS.map(k => ({ title: { contains: k } }));

    const [total, open, bySeverity, topCVEs] = await Promise.all([
      prisma.finding.count({ where: { orgId: ORG_ID } }),
      prisma.finding.count({ where: { orgId: ORG_ID, status: 'open' } }),
      prisma.finding.groupBy({
        by: ['severity'],
        where: { orgId: ORG_ID, status: 'open' },
        _count: { severity: true },
      }),
      prisma.finding.groupBy({
        by: ['cveId'],
        where: { orgId: ORG_ID, status: 'open', cveId: { not: null } },
        _count: { cveId: true },
        orderBy: { _count: { cveId: 'desc' } },
        take: 5,
      }),
    ]);

    const hasLiveData = total > 0;
    const sevMap = Object.fromEntries(bySeverity.map(s => [s.severity, s._count.severity]));
    const critical = sevMap['Critical'] || 0;
    const high = sevMap['High'] || 0;
    const anomalies = critical + Math.round(high * 0.4);

    return NextResponse.json({
      hasLiveData,
      total,
      open,
      critical,
      high,
      anomalies,
      activeAlerts: critical,
      bySeverity: sevMap,
      topCVEs: topCVEs.map(c => ({ cveId: c.cveId, count: c._count.cveId })),
    });
  } catch (err) {
    console.error('[findings/traffic]', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
