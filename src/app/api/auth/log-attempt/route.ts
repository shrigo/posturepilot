import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, provider, status } = await req.json();
    
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const userAgent = req.headers.get('user-agent') || '';

    await prisma.loginAttempt.create({
      data: {
        email: email || 'unknown',
        provider: provider || 'credentials',
        status: status || 'failed',
        ip,
        userAgent,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to log login attempt:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
