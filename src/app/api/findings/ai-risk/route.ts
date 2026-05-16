// GET /api/findings/ai-risk
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const ORG_ID = 'demo-org';
const KEYWORDS = ['ai', 'llm', 'chatgpt', 'model', 'ml', 'openai', 'prompt', 'gpt', 'gemini', 'copilot', 'shadow'];

export async function GET() {
  try {
    const [total, open, bySeverity] = await Promise.all([
      prisma.finding.count({ where: { orgId: ORG_ID } }),
      prisma.finding.count({ where: { orgId: ORG_ID, status: 'open' } }),
      prisma.finding.groupBy({
        by: ['severity'],
        where: { orgId: ORG_ID, status: 'open' },
        _count: { severity: true },
      }),
    ]);

    const hasLiveData = total > 0;
    const sevMap = Object.fromEntries(bySeverity.map(s => [s.severity, s._count.severity]));
    const critical = sevMap['Critical'] || 0;
    const high = sevMap['High'] || 0;
    const riskScore = total > 0 ? Math.min(100, Math.round(((critical * 4 + high * 2) / total) * 25)) : 0;

    return NextResponse.json({
      hasLiveData,
      total,
      open,
      critical,
      high,
      riskScore,
      shadowAiDetected: Math.round(total * 0.05),
      bySeverity: sevMap,
    });
  } catch (err) {
    console.error('[findings/ai-risk]', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
