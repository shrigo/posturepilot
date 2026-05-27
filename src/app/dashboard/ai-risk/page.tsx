'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyAiRiskRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/ai-risk');
  }, [router]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', fontFamily: 'Inter, sans-serif', color: '#64748b' }}>
      <span className="hud-pulse" style={{ width: 12, height: 12, borderRadius: '50%', background: '#7c3aed', boxShadow: '0 0 10px #7c3aed', marginBottom: 16 }} />
      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Redirecting to Standalone AI Risk Portal...</div>
      <div style={{ fontSize: '0.75rem', marginTop: 4 }}>Bypassing dashboard sidebar constraints...</div>
    </div>
  );
}
