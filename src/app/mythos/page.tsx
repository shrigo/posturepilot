'use client';

import MythosPromo from '@/components/MythosPromo';
import { useRouter } from 'next/navigation';

export default function MythosPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: '#090d16' }}>
      <MythosPromo onClose={() => router.push('/')} />
    </div>
  );
}
