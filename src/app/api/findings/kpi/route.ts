// GET /api/findings/kpi
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const ORG_ID = 'demo-org';

export async function GET() {
  try {
    const [total, open, closed, slaBreached, bySeverity, byTool] = await Promise.all([
      prisma.finding.count({ where: { orgId: ORG_ID } }),
      prisma.finding.count({ where: { orgId: ORG_ID, status: 'open' } }),
      prisma.finding.count({ where: { orgId: ORG_ID, status: 'closed' } }),
      prisma.finding.count({ where: { orgId: ORG_ID, status: "sla_breach" } }),
      prisma.finding.groupBy({
        by: ['severity'],
        where: { orgId: ORG_ID, status: 'open' },
        _count: { severity: true },
      }),
      prisma.finding.groupBy({
        by: ['sourceTool'],
        where: { orgId: ORG_ID, status: 'open' },
        _count: { sourceTool: true },
        orderBy: { _count: { sourceTool: 'desc' } },
        take: 6,
      }),
    ]);

    const hasLiveData = total > 0;
    const sevMap = Object.fromEntries(bySeverity.map(s => [s.severity, s._count.severity]));
    const critical = sevMap['Critical'] || 0;
    const high = sevMap['High'] || 0;
    const remediationRate = total > 0 ? Math.round((closed / total) * 100) : 0;
    const riskScore = total > 0 ? Math.min(100, Math.round(((critical * 4 + high * 2) / total) * 25)) : 0;
    const slaCompliance = total > 0 ? Math.round(((total - slaBreached) / total) * 100) : 100;

    return NextResponse.json({
      hasLiveData,
      total,
      open,
      closed,
      critical,
      high,
      slaBreached,
      slaCompliance,
      remediationRate,
      riskScore,
      bySeverity: sevMap,
      byTool: Object.fromEntries(byTool.map(t => [t.sourceTool, t._count.sourceTool])),
    });
  } catch (err) {
    console.error('[findings/kpi]', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
