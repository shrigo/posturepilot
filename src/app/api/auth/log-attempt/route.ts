import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, provider, status, firstName, lastName } = body;
    
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const userAgent = req.headers.get('user-agent') || '';

    // Derive user name and company domain from email if not explicitly provided
    let fName = firstName;
    let lName = lastName;
    const cleanEmail = (email || '').toLowerCase().trim();

    if (!fName && cleanEmail.includes('@')) {
      const [userPart, domainPart] = cleanEmail.split('@');
      const cleanUser = userPart.replace(/[._+-]/g, ' ');
      fName = cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1);
      lName = domainPart;
    }

    const record = await prisma.loginAttempt.create({
      data: {
        email: cleanEmail || 'unknown',
        firstName: fName || null,
        lastName: lName || null,
        provider: provider || 'free_trial',
        status: status || 'success',
        ip,
        userAgent,
      }
    });

    return NextResponse.json({ success: true, id: record.id });
  } catch (error) {
    console.error('Failed to log login attempt:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
