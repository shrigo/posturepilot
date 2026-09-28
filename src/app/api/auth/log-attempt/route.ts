import { NextResponse } from 'next/server';
import { saveLeadAttempt } from '@/lib/lead-storage';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, provider, status, firstName, lastName } = body;
    
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const userAgent = req.headers.get('user-agent') || '';

    const record = await saveLeadAttempt({
      email,
      firstName,
      lastName,
      provider: provider || 'free_trial',
      status: status || 'success',
      ip,
      userAgent,
    });

    return NextResponse.json({ success: true, id: record.id });
  } catch (error) {
    console.error('Failed to log login attempt:', error);
    return NextResponse.json({ success: true, fallback: true });
  }
}
