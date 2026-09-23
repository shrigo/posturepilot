'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import McpArchitectureDiagram from '@/components/McpArchitectureDiagram';

export default function McpStandalonePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      color: '#0f172a',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '4rem',
    }}>
      {/* Top Navbar */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          {/* Logo & Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <Image
                src="/hlogotag_v2.jpg"
                alt="PosturePilot Logo"
                width={190}
                height={46}
                priority
                style={{ objectFit: 'contain' }}
              />
            </Link>
            <div style={{ height: 24, width: 1, background: '#e2e8f0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Link href="/architecture" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>
                Architecture
              </Link>
              <span style={{ color: '#cbd5e1' }}>/</span>
              <span style={{ color: '#0284c7', fontWeight: 800 }}>Model Context Protocol (MCP)</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/architecture"
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#475569',
                textDecoration: 'none',
                padding: '0.45rem 0.95rem',
                borderRadius: 8,
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              ← Back to Full Tech Stack
            </Link>
            <Link
              href="/dashboard"
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#ffffff',
                textDecoration: 'none',
                padding: '0.45rem 1.1rem',
                borderRadius: 8,
                background: '#0284c7',
                boxShadow: '0 2px 8px rgba(2,132,199,0.3)',
              }}
            >
              Go to Command Center
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: 1400, margin: '2rem auto 0', padding: '0 1.5rem' }}>
        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 1rem',
            borderRadius: 999,
            background: '#e0f2fe',
            border: '1px solid #bae6fd',
            color: '#0369a1',
            fontSize: '0.82rem',
            fontWeight: 800,
            marginBottom: '0.85rem',
          }}>
            🔌 OFFICIAL MCP RUNTIME SPECIFICATION
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            margin: '0 0 0.85rem',
            color: '#0f172a',
          }}>
            Model Context Protocol (MCP) Security Architecture
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: '#64748b',
            maxWidth: 820,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Standardized context exchange topology connecting AI Copilots to SIEM, vulnerability scanners (Tenable, Qualys), Jira SOAR tickets, and cloud isolation tools through typed JSON-RPC 2.0 dispatchers.
          </p>
        </div>

        {/* Dedicated MCP Diagram Card */}
        <div style={{
          borderRadius: 16,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          padding: '1.5rem',
        }}>
          <McpArchitectureDiagram />
        </div>
      </main>
    </div>
  );
}
