'use client';
import Link from 'next/link';
import Image from 'next/image';
import AiRiskContent from '@/components/AiRiskContent';

export default function AiRiskPage() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#fff', borderBottom: '1px solid #e0e7ff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.5rem', height: 64,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)', backdropFilter: 'blur(16px)'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/hlogotag_v2.jpg" alt="PosturePilot" width={200} height={46} style={{ objectFit: 'contain', objectPosition: 'left' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link
            href="/dashboard"
            style={{ color: '#4f46e5', textDecoration: 'none', border: '1px solid #c4b5fd', padding: '0.45rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.2s', background: 'transparent' }}
          >
            ← Back to Main Terminal
          </Link>
          <Link href="/login" style={{ color: '#64748b', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          <Link href="/login" style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', fontSize: '0.8rem', fontWeight: 700, padding: '0.5rem 1.25rem', borderRadius: 8, textDecoration: 'none', boxShadow: '0 4px 16px rgba(79,70,229,0.35)' }}>Try Free →</Link>
        </div>
      </nav>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <AiRiskContent />
      </div>
    </div>
  );
}
