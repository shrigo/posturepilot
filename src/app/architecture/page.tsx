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
    name: 'Multi-Agent Autonomous SOAR & MCP Security Copilot',
    category: 'Agentic AI & Orchestration',
    technologies: 'LangGraph Multi-Agent • Model Context Protocol (MCP) Server • ReAct Planning Loops • Autonomous Tool Dispatcher',
    color: '#0284c7',
    badgeBg: '#e0f2fe',
    activeBg: '#f0f9ff',
    icon: '🤖',
    summary: 'Executes autonomous security orchestration via Anthropic/OpenAI Model Context Protocol (MCP) server endpoints and LangGraph cyclic agents. Standardizes context exchange across SIEM, vulnerability scanners, Jira, and cloud infrastructure through typed MCP tool dispatchers.',
    packages: [
      { name: '@modelcontextprotocol/sdk', version: 'v1.x', purpose: 'Model Context Protocol (MCP) standard server runtime for tool discovery, resource sharing, and secure prompt execution' },
      { name: 'Security MCP Tool Hub', version: 'Native TS', purpose: 'Standardized MCP tools for Tenable, Qualys, Jira, AWS IAM, and Kubernetes automated remediation' },
      { name: 'LangGraph Multi-Agent', version: 'v0.2.x', purpose: 'Cyclic state graph planning, human-in-the-loop approvals, multi-agent coordination' },
      { name: 'ReAct Agent Runtime', version: 'Enterprise', purpose: 'Reasoning + Acting execution loop for dynamic cybersecurity triage' },
      { name: 'Recharts & Cockpit UI', version: '3.8.1', purpose: 'Real-time telemetry charting for agent decision trees and automated MTTR reduction' }
    ],
    codeLocation: 'src/lib/soar/engine.ts, src/lib/mcp/server.ts, src/app/api/soar/execute/route.ts, src/components/AgenticTerminal.tsx'
  },
  {
    id: 2,
    name: 'Enterprise LLM Gateway & Guardrails Engine',
    category: 'Foundation Models & Safety',
    technologies: 'Gemini 1.5 Pro • GPT-4o • Claude 3.5 Sonnet • Local LLaMA-3 • Prompt Shield • PII Redaction',
    color: '#4f46e5',
    badgeBg: '#e0e7ff',
    activeBg: '#eef2ff',
    icon: '🛡️',
    summary: 'High-throughput enterprise AI gateway with dynamic model routing, automatic failover, prompt injection defense, real-time PII token masking, and zero-data-retention compliance guarantees.',
    packages: [
      { name: '@google/genai', version: '1.x', purpose: 'Native Gemini 1.5 Pro / Flash multimodal inference & long-context reasoning' },
      { name: 'OpenAI & Anthropic SDKs', version: 'Latest', purpose: 'Unified multi-provider fallback router for GPT-4o and Claude 3.5 Sonnet' },
      { name: 'Prompt Shield & Guardrails', version: 'Custom AST', purpose: 'Pre-flight prompt injection defense, jailbreak prevention, and output safety' },
      { name: 'PII Token Masker', version: 'Regex + SpaCy', purpose: 'Redacts credentials, AWS keys, SSNs, and internal secrets prior to LLM submission' }
    ],
    codeLocation: 'src/lib/ai/gateway.ts, src/lib/ai/guardrails.ts, src/app/api/ai/stream/route.ts'
  },
  {
    id: 3,
    name: 'Real-Time Shadow AI & Insider Risk Telemetry',
    category: 'AI Security & Threat Intelligence',
    technologies: 'Shadow AI Egress Firewall • IDE Telemetry Interceptor • Prompt Sniffer • Threat Scoring Engine',
    color: '#7c3aed',
    badgeBg: '#f3e8ff',
    activeBg: '#faf5ff',
    icon: '👁️',
    summary: 'Monitors enterprise shadow AI usage across unmanaged local LLM nodes (LLaMA, Ollama), proprietary prompt leaks, unauthorized IDE extensions, and unmasked corporate vector DB sessions in real-time.',
    packages: [
      { name: 'AI Egress Interceptor', version: 'Packet Filter', purpose: 'Sniffs unencrypted outgoing LLM API traffic across corporate endpoints' },
      { name: 'IDE Telemetry Daemon', version: 'VS Code/Cursor API', purpose: 'Captures code prompt telemetry on proprietary trading and algorithmic repos' },
      { name: 'Guruji Insider Risk Scorer', version: 'Dynamic Bayesian', purpose: 'Computes real-time threat scores (0-100) based on prompt sensitivity and volume' },
      { name: 'Masking Sensitivity Engine', version: '3-Tier (L/M/H)', purpose: 'Dynamic on-the-fly redacting for executive reporting and audit logs' }
    ],
    codeLocation: 'src/components/AiRiskContent.tsx, src/app/api/ai-risk/telemetry/route.ts, src/lib/telemetry/sniffer.ts'
  },
  {
    id: 4,
    name: 'Vector Embeddings & RAG Knowledge Graph',
    category: 'Dense Retrieval & Ontologies',
    technologies: 'pgvector • text-embedding-3-large • Gemini Embeddings • Hybrid BM25/Dense RAG • CVE Graph',
    color: '#0d9488',
    badgeBg: '#ccfbf1',
    activeBg: '#f0fdfa',
    icon: '🧠',
    summary: 'High-dimensional vector storage indexing CVE/CWE databases, internal security policies, SOC2/HIPAA compliance standards, and CIS benchmarks for sub-50ms hybrid dense-sparse semantic retrieval.',
    packages: [
      { name: 'pgvector (HNSW Indexing)', version: '0.7.x', purpose: 'Vector similarity search with Hierarchical Navigable Small World graphs' },
      { name: 'text-embedding-3-large', version: '1536/3072 dim', purpose: 'High-precision semantic embeddings for vulnerability descriptions' },
      { name: 'Hybrid RAG Retriever', version: 'BM25 + Dense', purpose: 'Fused keyword and vector search for exact CVE IDs and contextual queries' },
      { name: 'MCP Resource Provider', version: 'RFC-MCP', purpose: 'Exposes CVE/CWE ontology graphs & vector knowledge as MCP Resources to LLMs' },
      { name: 'Security Graph Ontology', version: 'OASIS CSAF', purpose: 'Graph relations connecting assets, software packages, and exploit paths' }
    ],
    codeLocation: 'src/lib/vector/rag.ts, src/lib/embeddings/generator.ts, prisma/schema.prisma'
  },
  {
    id: 5,
    name: 'Multi-Scanner AST Ingestion Pipeline',
    category: 'Data Normalization & ETL',
    technologies: 'OASIS SARIF v2.1 • Snyk JSON • Tenable Nessus XML • Qualys • MCP Tool Adapters • PapaParse 5.5',
    color: '#d97706',
    badgeBg: '#fef3c7',
    activeBg: '#fffbeb',
    icon: '📥',
    summary: 'Streaming ETL parser engine that ingests raw multi-vendor security scan outputs (SARIF, Nessus XML, Snyk SCA, Qualys) and normalizes them into unified, deduplicated finding entities, exposed to AI agents via MCP Tools.',
    packages: [
      { name: 'MCP Tool Scanner Adapters', version: 'v1.4.0', purpose: 'Standardized Model Context Protocol tool endpoints allowing AI agents to trigger & query AST parsers' },
      { name: 'papaparse', version: '5.5.3', purpose: 'Fast streaming in-memory parser for bulk CSV/TSV vulnerability data' },
      { name: 'xml2js', version: '0.6.2', purpose: 'SAX XML-to-JavaScript object transformer for Tenable Nessus and Qualys XML' },
      { name: 'SARIF v2.1 Parser', version: 'OASIS Standard', purpose: 'AST mapper for GitHub Advanced Security, Semgrep, and Trivy' },
      { name: 'Snyk SCA Parser', version: 'JSON Schema v1', purpose: 'Software Composition Analysis and dependency vulnerability normalizer' }
    ],
    codeLocation: 'src/lib/parsers/ (sarif.ts, nessus.ts, qualys.ts, snyk.ts, csv.ts), src/app/api/upload/'
  },
  {
    id: 6,
    name: 'High-Concurrency Backend Controller & Streaming API',
    category: 'Backend & Streaming Engine',
    technologies: 'Next.js 16.2 App Router • TypeScript 5 • Server-Sent Events (SSE) • Async Worker Pool',
    color: '#059669',
    badgeBg: '#d1fae5',
    activeBg: '#ecfdf5',
    icon: '⚡',
    summary: 'Ultra low-latency Node.js route handlers orchestrating real-time streaming AI completions, audit log aggregations, tenant isolation middleware, and asynchronous background jobs.',
    packages: [
      { name: 'next (Route Handlers)', version: '16.2.6', purpose: 'Serverless-ready HTTP endpoints returning typed JSON payloads & SSE streams' },
      { name: 'next-auth', version: '4.24.14', purpose: 'Encrypted JWT session tokens and multi-tenant role-based access control' },
      { name: '@types/node', version: '20.x', purpose: 'Node.js global standard library typing and stream interfaces' },
      { name: 'bcryptjs', version: '3.0.3', purpose: 'Cryptographic salt generation and Blowfish password hashing' }
    ],
    codeLocation: 'src/app/api/ (findings/, soar/, auth/, reports/, admin/), src/middleware.ts'
  },
  {
    id: 7,
    name: 'ACID Persistence & Data Layer',
    category: 'Persistent Storage & ORM',
    technologies: 'PostgreSQL 16 • pgvector • Prisma ORM 7.8 • pg (node-postgres) 8.20 • Audit Ledger',
    color: '#334155',
    badgeBg: '#e2e8f0',
    activeBg: '#f1f5f9',
    icon: '🗄️',
    summary: 'ACID-compliant relational database storing multi-tenant organizations, normalized findings, pgvector vector embeddings, SOAR automation playbooks, and immutable audit ledgers.',
    packages: [
      { name: 'prisma', version: '7.8.0', purpose: 'Prisma CLI, schema parser, migration generator (db push / migrate)' },
      { name: '@prisma/client', version: '7.8.0', purpose: 'Type-safe query builder for CRUD, batch operations, and aggregations' },
      { name: '@prisma/adapter-pg', version: '7.8.0', purpose: 'Direct adapter bridging Prisma query engine to Node PostgreSQL driver' },
      { name: 'pg', version: '8.20.0', purpose: 'Node PostgreSQL driver and connection pooling client' }
    ],
    codeLocation: 'prisma/schema.prisma, src/lib/db.ts, PostgreSQL Database Instance'
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
              AI & Cyber Architecture
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
            🤖 ENTERPRISE AI & AUTONOMOUS AGENTIC ARCHITECTURE
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            margin: '0 0 0.85rem',
            color: '#0f172a',
          }}>
            Software & AI Systems Architecture
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#64748b',
            maxWidth: 860,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Full-stack engineering specification detailing Multi-Agent Autonomous SOAR loops, Enterprise LLM Gateway & Guardrails, Shadow AI Telemetry, pgvector RAG Knowledge Graphs, and streaming security parsers.
          </p>
        </div>

        {/* Top 3 Pillar Cards */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}>
          {/* Multi-Agent SOAR Pillar */}
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
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agentic Orchestration & MCP</span>
              <span style={{ fontSize: '1.2rem' }}>🤖</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Autonomous ReAct & Model Context Protocol (MCP)</div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              LangGraph planning loops, Model Context Protocol (MCP) server endpoints, deterministic tool dispatchers, automated remediation pipelines, and real-time MTTR optimization.
            </p>
          </div>

          {/* LLM Gateway & Security Pillar */}
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
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Security & Guardrails</span>
              <span style={{ fontSize: '1.2rem' }}>🛡️</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>LLM Gateway & Shadow AI Sniffer</div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              Gemini 1.5 Pro / GPT-4o / Claude 3.5 routing, prompt injection AST defense, real-time PII token masking, and unmanaged LLM interception.
            </p>
          </div>

          {/* Vector RAG & Persistence Pillar */}
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
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vector Knowledge & ACID</span>
              <span style={{ fontSize: '1.2rem' }}>🧠</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>pgvector + Prisma + PostgreSQL 16</div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              HNSW vector embeddings for CVE/CWE ontologies, dense semantic retrieval, Prisma 7.8 type-safe ORM, and connection pooling.
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
                7 AI & Software Engineering Tiers
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
                    Key Frameworks & AI Modules ({selectedLayer.packages.length} Packages)
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
                          <span style={{ fontSize: '0.75rem', color: selectedLayer.color, fontFamily: 'monospace', fontWeight: 700 }}>{pkg.version}</span>
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

        {/* ========================================================================= */}
        {/* DIAGRAM 1: PosturePilot Enterprise AI & MCP Architecture Blueprint */}
        {/* ========================================================================= */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 12,
                    background: '#e0f2fe',
                    color: '#0284c7',
                    border: '1px solid #bae6fd',
                  }}>
                    DIAGRAM 1 OF 2
                  </span>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    🔌 Enterprise AI & Model Context Protocol (MCP) Blueprint
                  </h2>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  End-to-end topology displaying the MCP Server & Tool Dispatcher, Multi-Agent SOAR, LLM Gateway, pgvector RAG, and AST tool execution.
                </p>
              </div>

              {/* Action Buttons */}
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
                  download="posturepilot-mcp-architecture.jpg"
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
                  📥 Download HD Blueprint
                </a>
              </div>
            </div>

            {/* Diagram 1 Image Container */}
            <div style={{
              padding: '1.5rem',
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              {/* Diagram Branding & Protocol Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.25rem',
                background: '#ffffff',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                flexWrap: 'wrap',
                gap: '0.75rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Image
                    src="/hlogotag_v2.jpg"
                    alt="PosturePilot Logo"
                    width={180}
                    height={42}
                    style={{ objectFit: 'contain' }}
                  />
                  <div style={{ height: 24, width: 1, background: '#e2e8f0' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.02em' }}>
                    MCP-NATIVE SOAR & AI COPILOT TOPOLOGY
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.3rem 0.75rem',
                    borderRadius: 20,
                    background: '#e0f2fe',
                    color: '#0284c7',
                    border: '1px solid #bae6fd',
                  }}>
                    🔌 MODEL CONTEXT PROTOCOL (MCP) SERVER
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.3rem 0.75rem',
                    borderRadius: 20,
                    background: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                  }}>
                    ● 7-TIER ARCHITECTURE
                  </span>
                </div>
              </div>

              {/* Diagram 1 Image */}
              <img
                src="/posturepilot-tech-stack.jpg"
                alt="PosturePilot Enterprise AI Architecture Blueprint with MCP Server and Official Logo"
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

        {/* ========================================================================= */}
        {/* DIAGRAM 2: PosturePilot Complete 7-Tier AI Stack System Poster */}
        {/* ========================================================================= */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 12,
                    background: '#fdf2f8',
                    color: '#db2777',
                    border: '1px solid #fbcfe8',
                  }}>
                    DIAGRAM 2 OF 2
                  </span>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    🖼️ Complete 7-Tier Autonomous Software & AI Stack Poster
                  </h2>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Full-spectrum high-resolution engineering poster detailing all software layers, runtime dependencies, controllers, and persistence engines.
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <a
                  href="/posturepilot-ai-stack-poster.jpg"
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
                  href="/posturepilot-ai-stack-poster.jpg"
                  download="posturepilot-ai-stack-poster.jpg"
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#db2777',
                    textDecoration: 'none',
                    padding: '0.45rem 1rem',
                    borderRadius: 8,
                    background: '#fdf2f8',
                    border: '1px solid #fbcfe8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  📥 Download HD Poster
                </a>
              </div>
            </div>

            {/* Diagram 2 Image Container */}
            <div style={{
              padding: '1.5rem',
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              {/* Diagram Branding Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.25rem',
                background: '#ffffff',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                flexWrap: 'wrap',
                gap: '0.75rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Image
                    src="/hlogotag_v2.jpg"
                    alt="PosturePilot Logo"
                    width={180}
                    height={42}
                    style={{ objectFit: 'contain' }}
                  />
                  <div style={{ height: 24, width: 1, background: '#e2e8f0' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.02em' }}>
                    OFFICIAL 7-TIER SOFTWARE & AI STACK POSTER
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.3rem 0.75rem',
                    borderRadius: 20,
                    background: '#fef3c7',
                    color: '#d97706',
                    border: '1px solid #fde68a',
                  }}>
                    ★ FULLSTACK INFOGRAPHIC
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.3rem 0.75rem',
                    borderRadius: 20,
                    background: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                  }}>
                    ● PRODUCTION TOPOLOGY
                  </span>
                </div>
              </div>

              {/* Diagram 2 Image */}
              <img
                src="/posturepilot-ai-stack-poster.jpg"
                alt="PosturePilot Complete 7-Tier AI Stack System Poster"
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
              PosturePilot.io Software & AI Architecture
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Direct URL: <code style={{ color: '#0284c7', fontWeight: 700 }}>/architecture</code>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['🤖 Agentic AI', '🔌 Model Context Protocol (MCP)', '🛡️ LLM Gateway', '🧠 pgvector RAG', '⚡ Next.js 16', '⚛️ React 19', '🔷 Prisma 7.8', '🐘 PostgreSQL'].map((badge) => (
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
