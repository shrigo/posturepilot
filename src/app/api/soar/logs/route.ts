// src/app/api/soar/logs/route.ts
// GET    /api/soar/logs  → fetch last N SOAR audit log entries
// DELETE /api/soar/logs  → clear all SOAR logs for org

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const ORG_ID = 'demo-org';

export async function GET() {
  const logs = await prisma.soarLog.findMany({
    where:   { orgId: ORG_ID },
    orderBy: { createdAt: 'desc' },
    take:    500,
  });
  // Return oldest-first so the terminal log reads chronologically
  return NextResponse.json(logs.reverse());
}

export async function DELETE() {
  await prisma.soarLog.deleteMany({ where: { orgId: ORG_ID } });
  return NextResponse.json({ cleared: true });
}
