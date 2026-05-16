// src/app/api/findings/summary/route.ts
// GET /api/findings/summary — aggregated stats for dashboards

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const DEFAULT_ORG_ID = 'demo-org';

export async function GET() {
  try {
    const [total, bySeverity, byTool, recent, topCVEs] = await Promise.all([
      // Total open findings
      prisma.finding.count({ where: { orgId: DEFAULT_ORG_ID, status: 'open' } }),

      // Count by severity
      prisma.finding.groupBy({
        by: ['severity'],
        where: { orgId: DEFAULT_ORG_ID, status: 'open' },
        _count: { severity: true },
      }),

      // Count by source tool
      prisma.finding.groupBy({
        by: ['sourceTool'],
        where: { orgId: DEFAULT_ORG_ID },
        _count: { sourceTool: true },
      }),

      // 5 most recent scan jobs
      prisma.scanJob.findMany({
        where: { orgId: DEFAULT_ORG_ID },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, sourceTool: true, fileName: true, findingCount: true, status: true, createdAt: true },
      }),

      // Top 10 CVEs by frequency
      prisma.finding.groupBy({
        by: ['cveId'],
        where: { orgId: DEFAULT_ORG_ID, status: 'open', cveId: { not: null } },
        _count: { cveId: true },
        orderBy: { _count: { cveId: 'desc' } },
        take: 10,
      }),
    ]);

    // Calculate risk score: weighted avg CVSS
    const cvssAgg = await prisma.finding.aggregate({
      where: { orgId: DEFAULT_ORG_ID, status: 'open', cvssScore: { not: null } },
      _avg: { cvssScore: true },
      _max: { cvssScore: true },
    });

    // SLA compliance: findings with no slaDeadline breached
    const breached = await prisma.finding.count({
      where: {
        orgId: DEFAULT_ORG_ID,
        status: 'open',
        slaDeadline: { lt: new Date() },
      },
    });

    const severityMap = Object.fromEntries(
      bySeverity.map((s) => [s.severity, s._count.severity])
    );
    const toolMap = Object.fromEntries(
      byTool.map((t) => [t.sourceTool, t._count.sourceTool])
    );

    const criticalCount = severityMap['Critical'] || 0;
    const highCount = severityMap['High'] || 0;
    const riskScore = cvssAgg._avg.cvssScore
      ? Math.round(cvssAgg._avg.cvssScore * 10)
      : 0;
    const slaCompliance = total > 0 ? Math.round(((total - breached) / total) * 100) : 100;

    return NextResponse.json({
      total,
      critical: criticalCount,
      high: highCount,
      riskScore,
      slaCompliance,
      avgCvss: cvssAgg._avg.cvssScore?.toFixed(1),
      maxCvss: cvssAgg._max.cvssScore?.toFixed(1),
      bySeverity: severityMap,
      byTool: toolMap,
      recentScans: recent,
      topCVEs: topCVEs.map((c) => ({ cveId: c.cveId, count: c._count.cveId })),
    });

  } catch (err) {
    console.error('[findings/summary]', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
