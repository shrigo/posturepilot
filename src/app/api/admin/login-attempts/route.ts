import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

const ADMIN_EMAILS = ['shrigo.now@gmail.com', 'shrigonow@gmail.com', 'demo@posturepilot.io'];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const attempts = await prisma.loginAttempt.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    return NextResponse.json({ attempts });

  } catch (error) {
    console.error('Failed to fetch login attempts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


