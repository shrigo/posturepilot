// src/app/api/findings/cloud/route.ts
// GET /api/findings/cloud — aggregated stats for cloud-related findings

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const DEFAULT_ORG_ID  = 'demo-org';
const CLOUD_TOOLS     = ['aws_security_hub', 'wiz', 'prisma', 'crowdstrike', 'ms_defender', 'azure', 'gcp'];
const CLOUD_KEYWORDS  = ['s3', 'bucket', 'iam', 'cloud', 'azure', 'gcp', 'lambda', 'ec2', 'rds', 'storage', 'permission'];

export async function GET() {
  try {
    // Cloud tool findings (direct match)
    const [cloudByTool, allFindings, bySeverity] = await Promise.all([
      // Findings from known cloud tools
      prisma.finding.groupBy({
        by: ['sourceTool'],
        where: { orgId: DEFAULT_ORG_ID, sourceTool: { in: CLOUD_TOOLS } },
        _count: { sourceTool: true },
      }),

      // All findings count (fallback: derive cloud metrics from all)
      prisma.finding.count({ where: { orgId: DEFAULT_ORG_ID, status: 'open' } }),

      // Severity breakdown for cloud tools (or all if no cloud tools)
      prisma.finding.groupBy({
        by: ['severity'],
        where: {
          orgId: DEFAULT_ORG_ID,
          status: 'open',
          OR: [
            { sourceTool: { in: CLOUD_TOOLS } },
            { title: { contains: 'cloud' } },
            { title: { contains: 'IAM' } },
            { title: { contains: 'bucket' } },
            { title: { contains: 'S3' } },
          ],
        },
        _count: { severity: true },
      }),
    ]);

    const cloudTotal    = cloudByTool.reduce((s, t) => s + t._count.sourceTool, 0);
    const hasCloudTools = cloudTotal > 0;

    const sevMap = Object.fromEntries(bySeverity.map(s => [s.severity, s._count.severity]));
    const total  = hasCloudTools ? cloudTotal : allFindings;
    const critical = sevMap['Critical'] || 0;
    const high     = sevMap['High']     || 0;

    // Misconfig estimate: findings with cloud keywords
    const misconfigCount = await prisma.finding.count({
      where: {
        orgId: DEFAULT_ORG_ID,
        status: 'open',
        OR: CLOUD_KEYWORDS.map(k => ({ title: { contains: k } })),
      },
    });

    // Compliance score: inverse of critical+high ratio
    const complianceScore = total > 0 ? Math.max(0, Math.round(100 - ((critical + high) / total) * 100)) : 100;

    // Top cloud CVEs
    const topCVEs = await prisma.finding.groupBy({
      by: ['cveId'],
      where: {
        orgId: DEFAULT_ORG_ID,
        status: 'open',
        cveId: { not: null },
        OR: [
          { sourceTool: { in: CLOUD_TOOLS } },
          { title: { contains: 'cloud' } },
        ],
      },
      _count: { cveId: true },
      orderBy: { _count: { cveId: 'desc' } },
      take: 5,
    });

    return NextResponse.json({
      hasCloudTools,
      total,
      critical,
      high,
      misconfigCount,
      complianceScore,
      bySeverity: sevMap,
      byTool: Object.fromEntries(cloudByTool.map(t => [t.sourceTool, t._count.sourceTool])),
      topCVEs: topCVEs.map(c => ({ cveId: c.cveId, count: c._count.cveId })),
    });

  } catch (err) {
    console.error('[findings/cloud]', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
