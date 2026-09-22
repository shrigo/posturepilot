'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface TechStackLayer {
  id: number;
  name: string;
  category: string;
  technologies: string;
  color: string;
  badgeColor: string;
  gradient: string;
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
    color: '#38bdf8',
    badgeColor: 'rgba(56, 189, 248, 0.15)',
    gradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(14, 165, 233, 0.05) 100%)',
    icon: '💻',
    summary: 'Renders the interactive client cockpits, dynamic charts, mathematical SVG orbital score animations, and dark-mode glassmorphic theme.',
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
    color: '#818cf8',
    badgeColor: 'rgba(129, 140, 248, 0.15)',
    gradient: 'linear-gradient(135deg, rgba(129, 140, 248, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%)',
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
    color: '#34d399',
    badgeColor: 'rgba(52, 211, 153, 0.15)',
    gradient: 'linear-gradient(135deg, rgba(52, 211, 153, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)',
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
    color: '#f59e0b',
    badgeColor: 'rgba(245, 158, 11, 0.15)',
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.05) 100%)',
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
    color: '#fb923c',
    badgeColor: 'rgba(251, 146, 60, 0.15)',
    gradient: 'linear-gradient(135deg, rgba(251, 146, 60, 0.2) 0%, rgba(249, 115, 22, 0.05) 100%)',
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
    color: '#2dd4bf',
    badgeColor: 'rgba(45, 212, 191, 0.15)',
    gradient: 'linear-gradient(135deg, rgba(45, 212, 191, 0.2) 0%, rgba(20, 184, 166, 0.05) 100%)',
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
    color: '#a855f7',
    badgeColor: 'rgba(168, 85, 247, 0.15)',
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.05) 100%)',
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
      background: 'radial-gradient(circle at top center, #0b0f19 0%, #030712 100%)',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '2rem 1.5rem 4rem',
      boxSizing: 'border-box',
    }}>
      {/* Top Navigation */}
      <header style={{
        maxWidth: 1400,
        margin: '0 auto 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1rem 1.5rem',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(16px)',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.25rem',
          }}>
            <span style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
            }}>🛡️</span>
            <span>PosturePilot<span style={{ color: '#38bdf8' }}>.io</span></span>
          </Link>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.25rem 0.65rem',
            borderRadius: 20,
            background: 'rgba(56, 189, 248, 0.12)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            Software Architecture & Tech Stack
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleCopy}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: 10,
              background: copied ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
              color: '#fff',
              border: copied ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Link Copied!' : '🔗 Copy Direct URL'}
          </button>
          <Link
            href="/dashboard"
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            }}
          >
            App Dashboard →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Title Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 1rem',
            borderRadius: 999,
            background: 'linear-gradient(90deg, rgba(56,189,248,0.1), rgba(168,85,247,0.1))',
            border: '1px solid rgba(168,85,247,0.3)',
            color: '#c084fc',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1rem',
          }}>
            ⚙️ ENGINEERING SPECIFICATION & TECHNOLOGIES
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            margin: '0 0 1rem',
            background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Software Architecture & Engineering Stack
          </h1>
          <p style={{
            fontSize: '1.15rem',
            color: '#94a3b8',
            maxWidth: 820,
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
            borderRadius: 16,
            background: 'rgba(56, 189, 248, 0.04)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>Frontend & UI</span>
              <span>💻</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Next.js 16.2 + React 19.2</div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
              App Router, Server Components, TypeScript 5, Recharts 3.8, and Custom CSS3 Glassmorphism design tokens.
            </p>
          </div>

          {/* Backend & Data Pillar */}
          <div style={{
            padding: '1.5rem',
            borderRadius: 16,
            background: 'rgba(45, 212, 191, 0.04)',
            border: '1px solid rgba(45, 212, 191, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2dd4bf', textTransform: 'uppercase' }}>Backend & Data</span>
              <span>🗄️</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Prisma 7.8 + PostgreSQL</div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
              Type-safe ORM, PostgreSQL connection pooling with @prisma/adapter-pg and pg 8.20, RESTful Route Handlers.
            </p>
          </div>

          {/* Builder & AI Toolchain Pillar */}
          <div style={{
            padding: '1.5rem',
            borderRadius: 16,
            background: 'rgba(168, 85, 247, 0.04)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase' }}>Built With AI Agents</span>
              <span>🤖</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Antigravity AI Agentic IDE</div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
              Engineered via Google DeepMind Agentic Pair Programming, automating fullstack scaffolding, migrations & AST refactors.
            </p>
          </div>
        </section>

        {/* 7-Tier Interactive Stack + Poster View */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '3rem',
        }}>
          {/* Left Column: Stack Layers List */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                7 Software Engineering Tiers
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Click tier to inspect packages</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {TECH_LAYERS.map((layer) => {
                const isSelected = selectedLayer.id === layer.id;
                return (
                  <div
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer)}
                    style={{
                      padding: '1.1rem 1.4rem',
                      borderRadius: 14,
                      background: isSelected ? layer.gradient : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? `2px solid ${layer.color}` : '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isSelected ? `0 10px 30px -10px ${layer.color}40` : 'none',
                      transform: isSelected ? 'translateX(8px)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                        <span style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          background: layer.badgeColor,
                          border: `1px solid ${layer.color}50`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.1rem',
                        }}>
                          {layer.icon}
                        </span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: layer.color }}>
                              TIER {layer.id}
                            </span>
                            <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#fff' }}>
                              {layer.name}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>
                            {layer.technologies}
                          </div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.85rem',
                        color: isSelected ? layer.color : '#475569',
                        fontWeight: 700,
                      }}>
                        {isSelected ? '● ACTIVE' : '○'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Tier Deep Dive & Poster */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Deep Dive Box */}
            <div style={{
              padding: '2rem',
              borderRadius: 20,
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(20px)',
              border: `1.5px solid ${selectedLayer.color}80`,
              boxShadow: `0 25px 50px -15px ${selectedLayer.color}25`,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: 20,
                  background: selectedLayer.badgeColor,
                  color: selectedLayer.color,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  border: `1px solid ${selectedLayer.color}40`,
                }}>
                  TIER {selectedLayer.id} • {selectedLayer.category}
                </span>
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#fff' }}>
                {selectedLayer.icon} {selectedLayer.name}
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
                {selectedLayer.summary}
              </p>

              {/* Package breakdown table */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
                  Dependencies & Libraries
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedLayer.packages.map((pkg, i) => (
                    <div key={i} style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 8,
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{pkg.name}</span>
                        <span style={{ fontSize: '0.75rem', color: selectedLayer.color, fontFamily: 'monospace', fontWeight: 700 }}>v{pkg.version}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{pkg.purpose}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                  File & Codebase References
                </h4>
                <code style={{
                  display: 'block',
                  padding: '0.6rem 0.9rem',
                  borderRadius: 8,
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.8rem',
                  color: selectedLayer.color,
                  fontFamily: 'monospace',
                }}>
                  {selectedLayer.codeLocation}
                </code>
              </div>
            </div>

            {/* Poster Preview */}
            <div style={{
              borderRadius: 20,
              background: '#090d16',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{
                padding: '0.9rem 1.25rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>
                  🖼️ Tech Stack Architecture Infographic
                </span>
                <a
                  href="/posturepilot-tech-stack.jpg"
                  download="posturepilot-tech-stack.jpg"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#38bdf8',
                    textDecoration: 'none',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 6,
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                  }}
                >
                  Download HD Poster ↓
                </a>
              </div>
              <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center', background: '#030712' }}>
                <img
                  src="/posturepilot-tech-stack.jpg"
                  alt="PosturePilot Tech Stack Architecture"
                  style={{
                    width: '100%',
                    maxHeight: 380,
                    objectFit: 'contain',
                    borderRadius: 12,
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: '1.5rem 2rem',
          borderRadius: 16,
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
              PosturePilot.io Software Architecture & Tech Stack
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Direct URL: <code style={{ color: '#38bdf8' }}>/architecture</code>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {['⚡ Next.js 16', '⚛️ React 19', '🔷 Prisma 7.8', '🐘 PostgreSQL', '🤖 AI-Engineered'].map((badge) => (
              <span key={badge} style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 20,
                background: 'rgba(56, 189, 248, 0.1)',
                color: '#38bdf8',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid rgba(56, 189, 248, 0.25)',
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
