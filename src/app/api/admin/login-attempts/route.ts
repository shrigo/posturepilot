import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getAllLeads } from '@/lib/lead-storage';

const ADMIN_EMAILS = ['shrigo.now@gmail.com', 'shrigonow@gmail.com'];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.toLowerCase().trim();
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const isAuthorized = ADMIN_EMAILS.includes(email);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { attempts, isDatabaseConnected } = await getAllLeads();
    return NextResponse.json({ attempts, isDatabaseConnected });

  } catch (error) {
    console.error('Failed to fetch login attempts:', error);
    // Never return 500 to the admin dashboard; return clean empty list with 200
    return NextResponse.json({ attempts: [], error: 'Fallback active' }, { status: 200 });
  }
}


