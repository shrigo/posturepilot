// src/app/api/soar/tickets/route.ts
// GET  /api/soar/tickets           → list all tickets (optionally filter ?status=open)
// POST /api/soar/tickets           → manually create a ticket (simulation)
// PATCH /api/soar/tickets          → resolve a ticket { id, status }

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const ORG_ID = 'demo-org';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status');

  const tickets = await prisma.soarTicket.findMany({
    where: {
      orgId: ORG_ID,
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return NextResponse.json(tickets);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, cveId, title, asset, assignee, avatar, severity, system, slaLimitMs } = body;

  if (!id || !title || !system) {
    return NextResponse.json({ error: 'id, title, system required' }, { status: 400 });
  }

  const ticket = await prisma.soarTicket.create({
    data: {
      id,
      orgId:      ORG_ID,
      cveId:      cveId ?? null,
      title,
      asset:      asset ?? 'unknown-asset',
      assignee:   assignee ?? 'Unassigned',
      avatar:     avatar ?? '??',
      severity:   severity ?? 'High',
      status:     'Open',
      system,
      slaLimitMs: slaLimitMs ?? 24 * 60 * 60 * 1000,
    },
  });

  return NextResponse.json(ticket);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: 'id and status required' }, { status: 400 });
  }

  const ticket = await prisma.soarTicket.update({
    where:  { id },
    data:   { status },
  });

  return NextResponse.json(ticket);
}
