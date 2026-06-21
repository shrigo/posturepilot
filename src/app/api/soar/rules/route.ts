// src/app/api/soar/rules/route.ts
// GET  /api/soar/rules          → list all SOAR routing rules for org
// POST /api/soar/rules          → upsert a rule (toggle autoJira / autoSnow)
// DELETE /api/soar/rules?id=X  → delete a rule

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const ORG_ID = 'demo-org';

export async function GET() {
  const rules = await prisma.soarRule.findMany({
    where:   { orgId: ORG_ID },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json(rules);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { category, leadName, leadRole, avatar, autoJira, autoSnow } = body;

  if (!category || !leadName) {
    return NextResponse.json({ error: 'category and leadName required' }, { status: 400 });
  }

  const rule = await prisma.soarRule.upsert({
    where:  { orgId_category: { orgId: ORG_ID, category } },
    update: { leadName, leadRole, avatar, autoJira: !!autoJira, autoSnow: !!autoSnow },
    create: { orgId: ORG_ID, category, leadName, leadRole: leadRole ?? '', avatar: avatar ?? '', autoJira: !!autoJira, autoSnow: !!autoSnow },
  });

  return NextResponse.json(rule);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  await prisma.soarRule.delete({ where: { id } });
  return NextResponse.json({ deleted: id });
}
