import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { getAllUpgradeRequests } from '@/lib/lead-storage';

const ADMIN_EMAILS = ['shrigo.now@gmail.com', 'shrigonow@gmail.com'];

// ── GET: List all upgrade requests (Admin Whitelist only) ──────────────────────
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const requests = await getAllUpgradeRequests();
    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Failed to fetch upgrade requests:', error);
    return NextResponse.json({ requests: [] }, { status: 200 });
  }
}

// ── POST: Record an upgrade request (Any Authenticated User) ──────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clientName, moduleName } = await req.json();

    if (clientName === undefined || !moduleName) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const request = await prisma.upgradeRequest.create({
      data: {
        clientName,
        userEmail: session.user.email,
        moduleName,
      }
    });

    return NextResponse.json({ ok: true, request });
  } catch (error) {
    console.error('Failed to create upgrade request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
