// src/app/api/reports/executive/route.ts
// GET /api/reports/executive — generate and return branded PDF

import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createElement } from 'react';
import { ExecutiveReport } from '@/lib/pdf/reportTemplate';
import { prisma } from '@/lib/db';

const DEFAULT_ORG_ID = 'demo-org';

export async function GET() {
  try {
    const [total, bySeverity, byTool, recentScans, topCVEs, cvssAgg] = await Promise.all([
      prisma.finding.count({ where: { orgId: DEFAULT_ORG_ID, status: 'open' } }),
      prisma.finding.groupBy({ by: ['severity'], where: { orgId: DEFAULT_ORG_ID, status: 'open' }, _count: { severity: true } }),
      prisma.finding.groupBy({ by: ['sourceTool'], where: { orgId: DEFAULT_ORG_ID }, _count: { sourceTool: true } }),
      prisma.scanJob.findMany({ where: { orgId: DEFAULT_ORG_ID }, orderBy: { createdAt: 'desc' }, take: 5,
        select: { sourceTool: true, fileName: true, findingCount: true, createdAt: true } }),
      prisma.finding.groupBy({ by: ['cveId'], where: { orgId: DEFAULT_ORG_ID, status: 'open', cveId: { not: null } },
        _count: { cveId: true }, orderBy: { _count: { cveId: 'desc' } }, take: 10 }),
      prisma.finding.aggregate({ where: { orgId: DEFAULT_ORG_ID, status: 'open', cvssScore: { not: null } },
        _avg: { cvssScore: true } }),
    ]);

    const sevMap   = Object.fromEntries(bySeverity.map(s => [s.severity, s._count.severity]));
    const toolMap  = Object.fromEntries(byTool.map(t => [t.sourceTool, t._count.sourceTool]));
    const critical = sevMap['Critical'] || 0;
    const high     = sevMap['High']     || 0;
    const breached = await prisma.finding.count({
      where: { orgId: DEFAULT_ORG_ID, status: 'open', slaDeadline: { lt: new Date() } },
    });
    const slaCompliance = total > 0 ? Math.round(((total - breached) / total) * 100) : 100;
    const riskScore     = cvssAgg._avg.cvssScore ? Math.round(cvssAgg._avg.cvssScore * 10) : 0;
    const avgCvss       = cvssAgg._avg.cvssScore?.toFixed(1) || '—';

    const data = {
      orgName:       'PosturePilot Demo',
      generatedAt:   new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }),
      total, critical, high, riskScore, slaCompliance, avgCvss,
      bySeverity:    sevMap,
      byTool:        toolMap,
      topCVEs:       topCVEs.map(c => ({ cveId: c.cveId, count: c._count.cveId })),
      recentScans:   recentScans.map(s => ({ ...s, createdAt: s.createdAt.toISOString() })),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = createElement(ExecutiveReport, { data }) as any;
    const buffer  = await renderToBuffer(element);

    const filename = `PosturePilot-Security-Report-${new Date().toISOString().slice(0,10)}.pdf`;
    const uint8    = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length':      uint8.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error('[report/executive]', err);
    return NextResponse.json({ error: 'Report generation failed', detail: String(err) }, { status: 500 });
  }
}
