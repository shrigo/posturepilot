'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface TechStackLayer {
  id: number;
  name: string;
  category: string;
  technologies: string;
  color: string;
  badgeBg: string;
  activeBg: string;
  icon: string;
  summary: string;
  packages: { name: string; version: string; purpose: string }[];
  codeLocation: string;
}

const TECH_LAYERS: TechStackLayer[] = [
  {
    id: 1,
    name: 'Frontend UI & Visualization Layer',
    category: 'Client Presentation',
    technologies: 'Next.js 16.2 • React 19.2 • TypeScript 5 • Recharts 3.8 • CSS3 Glassmorphism',
    color: '#0284c7',
    badgeBg: '#e0f2fe',
    activeBg: '#f0f9ff',
    icon: '💻',
    summary: 'Renders interactive client cockpits, dynamic charts, mathematical SVG orbital score animations, and modern enterprise design tokens.',
    packages: [
      { name: 'next', version: '16.2.6', purpose: 'App Router architecture, React Server Components (RSC), Turbopack bundler' },
      { name: 'react & react-dom', version: '19.2.4', purpose: 'Virtual DOM, UI state hooks (useState, useMemo, useEffect, useRef)' },
      { name: 'recharts', version: '3.8.1', purpose: 'Declarative SVG charting for MTTR curves, risk radars, and SLA trend bars' },
      { name: 'Vanilla CSS3', version: 'Modern W3C', purpose: 'Custom design tokens, CSS Grid, Flexbox, backdrop-filter glassmorphism' }
    ],
    codeLocation: 'src/app/page.tsx, src/components/, src/app/globals.css'
  },
  {
    id: 2,
    name: 'Authentication & Session Security Layer',
    category: 'Identity & Access Control',
    technologies: 'NextAuth.js 4.24 • Bcrypt.js 3.0 • Web Crypto API • JWT Tokens',
    color: '#4f46e5',
    badgeBg: '#e0e7ff',
    activeBg: '#eef2ff',
    icon: '🔐',
    summary: 'Protects application endpoints, manages user sessions, validates role-based access (CISO, Admin, Engineer), and hashes credentials.',
    packages: [
      { name: 'next-auth', version: '4.24.14', purpose: 'Full-stack authentication, encrypted JWT session cookies, credential provider' },
      { name: 'bcryptjs', version: '3.0.3', purpose: 'Salt generation and Blowfish cryptographic password hashing' },
      { name: '@types/bcryptjs', version: '2.4.6', purpose: 'TypeScript type bindings for bcrypt' }
    ],
    codeLocation: 'src/app/api/auth/[...nextauth]/route.ts, src/components/AuthProvider.tsx'
  },
  {
    id: 3,
    name: 'Application Controller & REST API Layer',
    category: 'Backend Route Handlers',
    technologies: 'Next.js API Routes • Node.js Runtime • REST Handlers • Middleware',
    color: '#059669',
    badgeBg: '#d1fae5',
    activeBg: '#ecfdf5',
    icon: '⚡',
    summary: 'Handles HTTP requests (GET, POST, PUT, DELETE), executes business validations, tenant isolation, and aggregates metrics.',
    packages: [
      { name: 'next (Route Handlers)', version: '16.2.6', purpose: 'Serverless-ready HTTP endpoints returning typed JSON payloads' },
      { name: '@types/node', version: '20.x', purpose: 'Node.js global standard library typing and stream interfaces' }
    ],
    codeLocation: 'src/app/api/ (findings/, soar/, auth/, reports/, admin/)'
  },
  {
    id: 4,
    name: 'Ingestion & Security Parser Pipeline',
    category: 'Data Normalization',
    technologies: 'PapaParse 5.5 • xml2js 0.6 • OASIS SARIF v2.1 • Snyk JSON • Tenable Nessus XML',
    color: '#d97706',
    badgeBg: '#fef3c7',
    activeBg: '#fffbeb',
    icon: '📥',
    summary: 'Streaming file upload engine that reads raw multi-vendor security scan outputs and transforms them into unified findings.',
    packages: [
      { name: 'papaparse', version: '5.5.3', purpose: 'Fast streaming in-memory parser for bulk CSV/TSV vulnerability lists' },
      { name: 'xml2js', version: '0.6.2', purpose: 'SAX XML-to-JavaScript object transformer for Tenable Nessus and Qualys XML' },
      { name: 'SARIF Parser', version: 'OASIS v2.1', purpose: 'Custom AST mapper for GitHub Advanced Security, Semgrep, and Trivy' },
      { name: 'Snyk Parser', version: 'JSON Schema', purpose: 'Software Composition Analysis (SCA) dependency scanner adapter' }
    ],
    codeLocation: 'src/lib/parsers/ (sarif.ts, nessus.ts, qualys.ts, snyk.ts, csv.ts), src/app/api/upload/'
  },
  {
    id: 5,
    name: 'Document & Vector PDF Generation Engine',
    category: 'Server/Client Document Rendering',
    technologies: '@react-pdf/renderer 4.5 • Yoga Layout Engine • PDFKit Core',
    color: '#ea580c',
    badgeBg: '#ffedd5',
    activeBg: '#fff7ed',
    icon: '📄',
    summary: 'Renders executive board-level compliance reports and posture clearance audit briefs as pixel-perfect vector PDF documents.',
    packages: [
      { name: '@react-pdf/renderer', version: '4.5.1', purpose: 'Declarative React-based vector PDF generation engine' }
    ],
    codeLocation: 'src/lib/pdf/reportTemplate.tsx, src/app/api/reports/executive/route.ts'
  },
  {
    id: 6,
    name: 'ORM & Query Engine Layer',
    category: 'Data Access & Mapping',
    technologies: 'Prisma ORM 7.8 • @prisma/client • @prisma/adapter-pg • TypeScript Models',
    color: '#0d9488',
    badgeBg: '#ccfbf1',
    activeBg: '#f0fdfa',
    icon: '🔷',
    summary: 'Type-safe object-relational mapping engine translating application queries into optimized SQL with connection pooling.',
    packages: [
      { name: 'prisma', version: '7.8.0', purpose: 'Prisma CLI, schema parser, migration generator (db push / migrate)' },
      { name: '@prisma/client', version: '7.8.0', purpose: 'Type-safe query builder for CRUD, batch operations, and aggregations' },
      { name: '@prisma/adapter-pg', version: '7.8.0', purpose: 'Direct adapter bridging Prisma query engine to Node PostgreSQL driver' }
    ],
    codeLocation: 'prisma/schema.prisma, src/lib/db.ts'
  },
  {
    id: 7,
    name: 'Database & ACID Persistence Layer',
    category: 'Persistent Storage',
    technologies: 'PostgreSQL 15+ • pg (node-postgres) 8.20 • Relational Schemas',
    color: '#7c3aed',
    badgeBg: '#f3e8ff',
    activeBg: '#faf5ff',
    icon: '🗄️',
    summary: 'ACID-compliant relational database storing multi-tenant organizations, normalized findings, SOAR rules, and execution logs.',
    packages: [
      { name: 'pg', version: '8.20.0', purpose: 'Node PostgreSQL driver and connection pooling client' },
      { name: '@types/pg', version: '8.20.0', purpose: 'TypeScript type definitions for pg pool' },
      { name: 'dotenv', version: '17.4.2', purpose: 'Environment variable loader for DATABASE_URL and secrets' }
    ],
    codeLocation: 'prisma/schema.prisma, PostgreSQL Database Instance'
  }
];

export default function ArchitectureTechStackPage() {
  const [selectedLayer, setSelectedLayer] = useState<TechStackLayer>(TECH_LAYERS[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      color: '#0f172a',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '0 0 4rem',
      boxSizing: 'border-box',
    }}>
      {/* Top Navigation */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.85rem 1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        marginBottom: '2rem',
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <Image
                src="/hlogotag_v2.jpg"
                alt="PosturePilot"
                width={190}
                height={44}
                style={{ objectFit: 'contain', objectPosition: 'left' }}
                priority
              />
            </Link>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.3rem 0.75rem',
              borderRadius: 20,
              background: '#e0f2fe',
              color: '#0369a1',
              border: '1px solid #bae6fd',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Architecture & Stack
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleCopy}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: 8,
                background: copied ? '#ecfdf5' : '#ffffff',
                color: copied ? '#059669' : '#475569',
                border: copied ? '1px solid #a7f3d0' : '1px solid #cbd5e1',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s',
              }}
            >
              {copied ? '✓ Link Copied!' : '🔗 Copy Link'}
            </button>
            <Link
              href="/dashboard"
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)',
              }}
            >
              Dashboard Terminal →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Title Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 1rem',
            borderRadius: 999,
            background: '#eef2ff',
            border: '1px solid #c7d2fe',
            color: '#4338ca',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '0.85rem',
          }}>
            ⚙️ ENGINEERING SPECIFICATION & TECHNOLOGIES
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            margin: '0 0 0.85rem',
            color: '#0f172a',
          }}>
            Software Architecture & Engineering Stack
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#64748b',
            maxWidth: 800,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Comprehensive breakdown of every framework, language, database, parser, and AI builder tool used to engineer PosturePilot.io.
          </p>
        </div>

        {/* Top 3 Pillar Cards */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}>
          {/* Frontend Pillar */}
          <div style={{
            padding: '1.5rem',
            borderRadius: 14,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderTop: '3px solid #0284c7',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Frontend & UI</span>
              <span style={{ fontSize: '1.2rem' }}>💻</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Next.js 16.2 + React 19.2</div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              App Router, React Server Components (RSC), TypeScript 5, Recharts 3.8, and Custom CSS3 Design Tokens.
            </p>
          </div>

          {/* Backend & Data Pillar */}
          <div style={{
            padding: '1.5rem',
            borderRadius: 14,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderTop: '3px solid #0d9488',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Backend & Data</span>
              <span style={{ fontSize: '1.2rem' }}>🗄️</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Prisma 7.8 + PostgreSQL</div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              Type-safe ORM, PostgreSQL connection pooling with @prisma/adapter-pg and pg 8.20, RESTful Route Handlers.
            </p>
          </div>

          {/* Builder & AI Toolchain Pillar */}
          <div style={{
            padding: '1.5rem',
            borderRadius: 14,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderTop: '3px solid #7c3aed',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Built With AI Agents</span>
              <span style={{ fontSize: '1.2rem' }}>🤖</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Antigravity AI Agentic IDE</div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              Engineered via Google DeepMind Agentic Pair Programming, automating fullstack scaffolding, migrations & AST refactors.
            </p>
          </div>
        </section>

        {/* 7-Tier Interactive Stack: Equal 50/50 Columns */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
          gap: '1.75rem',
          marginBottom: '3rem',
          alignItems: 'stretch',
        }}>
          {/* Left Column: 7 Stack Layers List */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                7 Software Engineering Tiers
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Select tier to view specs</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, justifyContent: 'space-between' }}>
              {TECH_LAYERS.map((layer) => {
                const isSelected = selectedLayer.id === layer.id;
                return (
                  <div
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer)}
                    style={{
                      padding: '0.95rem 1.2rem',
                      borderRadius: 12,
                      background: isSelected ? layer.activeBg : '#ffffff',
                      border: isSelected ? `2px solid ${layer.color}` : '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 6px 18px -4px ${layer.color}25` : '0 1px 3px rgba(0,0,0,0.02)',
                      transform: isSelected ? 'translateX(6px)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: layer.badgeBg,
                        border: `1px solid ${layer.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.15rem',
                        flexShrink: 0,
                      }}>
                        {layer.icon}
                      </span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: layer.color }}>
                            TIER {layer.id}
                          </span>
                          <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>
                            {layer.name}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                          {layer.technologies}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.8rem',
                      color: isSelected ? layer.color : '#94a3b8',
                      fontWeight: 800,
                      flexShrink: 0,
                      marginLeft: '0.5rem',
                    }}>
                      {isSelected ? '● ACTIVE' : '○'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Tier Deep Dive (Equal Height & Width) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Tier {selectedLayer.id} Technical Specification
              </h2>
              <span style={{
                padding: '0.2rem 0.65rem',
                borderRadius: 20,
                background: selectedLayer.badgeBg,
                color: selectedLayer.color,
                fontSize: '0.72rem',
                fontWeight: 800,
                border: `1px solid ${selectedLayer.color}40`,
              }}>
                {selectedLayer.category}
              </span>
            </div>

            <div style={{
              padding: '1.75rem',
              borderRadius: 16,
              background: '#ffffff',
              border: `1.5px solid ${selectedLayer.color}80`,
              boxShadow: `0 10px 25px -5px ${selectedLayer.color}15`,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#0f172a' }}>
                  {selectedLayer.icon} {selectedLayer.name}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
                  {selectedLayer.summary}
                </p>

                {/* Package breakdown table */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                    Dependencies & Libraries ({selectedLayer.packages.length} Packages)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedLayer.packages.map((pkg, i) => (
                      <div key={i} style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 8,
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>{pkg.name}</span>
                          <span style={{ fontSize: '0.75rem', color: selectedLayer.color, fontFamily: 'monospace', fontWeight: 700 }}>v{pkg.version}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{pkg.purpose}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                  File & Codebase References
                </h4>
                <code style={{
                  display: 'block',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 8,
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.8rem',
                  color: selectedLayer.color,
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                }}>
                  {selectedLayer.codeLocation}
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Full Page-Wide Architecture Diagram (Left to Right after 7 Tiers) */}
        <section style={{
          marginBottom: '3rem',
        }}>
          <div style={{
            borderRadius: 16,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}>
            {/* Header Toolbar */}
            <div style={{
              padding: '1.2rem 1.75rem',
              background: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#0f172a' }}>
                  🖼️ Complete System Architecture & Tech Stack Blueprint
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Full-spectrum end-to-end topology across all 7 software layers, ingestion pipelines, database schemas, and AI agents.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <a
                  href="/posturepilot-tech-stack.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#475569',
                    textDecoration: 'none',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 8,
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  🔍 Open Fullscreen
                </a>
                <a
                  href="/posturepilot-tech-stack.jpg"
                  download="posturepilot-tech-stack.jpg"
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#0284c7',
                    textDecoration: 'none',
                    padding: '0.45rem 1rem',
                    borderRadius: 8,
                    background: '#e0f2fe',
                    border: '1px solid #bae6fd',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  📥 Download HD Poster
                </a>
              </div>
            </div>

            {/* Page-Wide Diagram Showcase */}
            <div style={{
              padding: '1.5rem',
              background: '#f8fafc',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              <img
                src="/posturepilot-tech-stack.jpg"
                alt="PosturePilot Tech Stack Architecture Diagram"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: '1.5rem 2rem',
          borderRadius: 14,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
              PosturePilot.io Software Architecture & Tech Stack
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Direct URL: <code style={{ color: '#0284c7', fontWeight: 700 }}>/architecture</code>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['⚡ Next.js 16', '⚛️ React 19', '🔷 Prisma 7.8', '🐘 PostgreSQL', '🤖 AI-Engineered'].map((badge) => (
              <span key={badge} style={{
                padding: '0.3rem 0.65rem',
                borderRadius: 20,
                background: '#f1f5f9',
                color: '#334155',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid #cbd5e1',
              }}>
                {badge}
              </span>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
