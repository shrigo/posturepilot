// GET /api/findings/list
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const ORG_ID = 'demo-org';
const LIMIT  = 25;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page       = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit      = Math.min(100, parseInt(searchParams.get('limit') || String(LIMIT)));
    const severity   = searchParams.get('severity')    || '';
    const tool       = searchParams.get('tool')        || '';
    const status     = searchParams.get('status')      || '';
    const slaOnly    = searchParams.get('slaBreached') === 'true';
    const search     = searchParams.get('search')      || '';
    const sort       = searchParams.get('sort')        || 'firstSeen';
    const order      = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = { orgId: ORG_ID };
    if (severity) where.severity   = severity;
    if (tool)     where.sourceTool = { contains: tool };
    if (slaOnly)  where.status     = 'sla_breach';
    else if (status) where.status  = status;
    if (search) {
      where.OR = [
        { cveId:      { contains: search } },
        { title:      { contains: search } },
        { sourceTool: { contains: search } },
        { host:       { contains: search } },
      ];
    }

    const sortField = ['firstSeen','lastSeen','severity','cvssScore','sourceTool','status'].includes(sort)
      ? sort : 'firstSeen';

    const [findings, total] = await Promise.all([
      prisma.finding.findMany({
        where,
        orderBy: { [sortField]: order },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, cveId: true, title: true, severity: true,
          cvssScore: true, sourceTool: true, host: true,
          status: true, firstSeen: true, lastSeen: true,
          isKev: true, epssScore: true,
        },
      }),
      prisma.finding.count({ where }),
    ]);

    const [severityCounts, toolCounts] = await Promise.all([
      prisma.finding.groupBy({
        by: ['severity'],
        where: { orgId: ORG_ID },
        _count: { severity: true },
      }),
      prisma.finding.groupBy({
        by: ['sourceTool'],
        where: { orgId: ORG_ID },
        _count: { sourceTool: true },
        orderBy: { _count: { sourceTool: 'desc' } },
        take: 20,
      }),
    ]);

    return NextResponse.json({
      findings,
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
      severityCounts: Object.fromEntries(severityCounts.map(s => [s.severity, s._count.severity])),
      toolCounts: Object.fromEntries(toolCounts.map(t => [t.sourceTool, t._count.sourceTool])),
    });
  } catch (err) {
    console.error('[findings/list]', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
