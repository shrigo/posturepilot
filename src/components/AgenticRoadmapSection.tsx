'use client';

import React, { useState } from 'react';

interface RoadmapStep {
  level: number;
  name: string;
  shortName: string;
  icon: string;
  badge: string;
  color: string;
  bgLight: string;
  borderColor: string;
  industryDefinition: string;
  industryLimitation: string;
  ppImplementation: string;
  ppFeatures: string[];
  codeLocation: string;
  techStack: string;
}

const ROADMAP_STEPS: RoadmapStep[] = [
  {
    level: 1,
    name: 'Prompting',
    shortName: 'Prompting',
    icon: '💬',
    badge: 'Foundation',
    color: '#0284c7',
    bgLight: '#f0f9ff',
    borderColor: '#bae6fd',
    industryDefinition: 'System instructions, few-shot examples, and prompt engineering to guide foundation model outputs.',
    industryLimitation: 'Stateless, prone to hallucinations, cannot reliably parse complex multi-vendor AST scan formats.',
    ppImplementation: 'Strict CISO executive translation prompts, deterministic CVSS/EPSS scoring directives, and zero-leakage PII tokenization.',
    ppFeatures: [
      'Deterministic JSON output formatting for SARIF & scan results',
      'Board-ready executive summary translation directives',
      'Inbound prompt injection screening and sanitization'
    ],
    codeLocation: 'src/lib/ai/prompts.ts, src/app/api/findings/ai-risk',
    techStack: 'System Prompt Engineering • Zod Schema Validation • Prompt Shield'
  },
  {
    level: 2,
    name: 'RAG (Retrieval-Augmented Generation)',
    shortName: 'RAG',
    icon: '📚',
    badge: 'Knowledge Grounding',
    color: '#16a34a',
    bgLight: '#f0fdf4',
    borderColor: '#bbf7d0',
    industryDefinition: 'Chunking proprietary documents into vector embeddings for semantic similarity search.',
    industryLimitation: 'Passive knowledge retrieval only; retrieves text snippets without understanding threat vectors or asset context.',
    ppImplementation: 'pgvector grounding against live CVE/CWE ontology graphs, NIST CSF, CIS Controls, and CISA Known Exploited Vulnerabilities (KEV).',
    ppFeatures: [
      'Multi-vendor scan grounding (Qualys, Tenable, Snyk, Nessus)',
      'Real-time EPSS (Exploit Prediction Scoring System) lookup',
      'Hybrid semantic vector + metadata relational query engine'
    ],
    codeLocation: 'prisma/schema.prisma, src/lib/parsers/sarif.ts',
    techStack: 'PostgreSQL pgvector • Prisma ORM • CISA KEV Feed • OASIS SARIF v2.1'
  },
  {
    level: 3,
    name: 'Agents (Autonomous Loops)',
    shortName: 'Agents',
    icon: '🤖',
    badge: 'Dynamic Reasoning',
    color: '#d97706',
    bgLight: '#fefce8',
    borderColor: '#fde68a',
    industryDefinition: 'Autonomous ReAct (Reasoning + Acting) loops that decide the next step dynamically based on runtime feedback.',
    industryLimitation: 'Unconstrained execution risk, infinite looping, unpredictable cost escalation, and lack of deterministic boundaries.',
    ppImplementation: 'Autonomous Security Triage & Remediation loop that investigates host exposures, calculates blast radius, and drafts remediation plans.',
    ppFeatures: [
      'Cyclic ReAct loop for vulnerability triage and blast radius calculation',
      'Deterministic max-step budgets to eliminate runaway agent costs',
      'Live execution trace streaming via WebSocket / Server-Sent Events'
    ],
    codeLocation: 'src/lib/soar/engine.ts, src/components/AgenticTerminal.tsx',
    techStack: 'ReAct Agent Runtime • LangGraph Cyclic Loops • Agentic Terminal'
  },
  {
    level: 4,
    name: 'MCP (Model Context Protocol)',
    shortName: 'MCP',
    icon: '🔌',
    badge: 'Standardized Context',
    color: '#7c3aed',
    bgLight: '#f5f3ff',
    borderColor: '#ddd6fe',
    industryDefinition: 'Anthropic open RFC standard decoupling LLMs from tools and data sources via typed JSON-RPC 2.0.',
    industryLimitation: 'Custom brittle API wrappers with vendor lock-in that break whenever foundation model providers change.',
    ppImplementation: 'Native PosturePilot MCP Server exposing standardized tools (Tenable, Qualys, Jira, AWS IAM) and URI resource streams (cve://, posture://).',
    ppFeatures: [
      'Universal model compatibility (Claude 3.5, GPT-4o, Gemini, local Ollama)',
      'Typed JSON-RPC 2.0 schema discovery with strict Zod validation',
      'Decoupled tool execution engine ensuring zero vendor lock-in'
    ],
    codeLocation: 'src/components/McpArchitectureDiagram.tsx, src/app/mcp/page.tsx',
    techStack: '@modelcontextprotocol/sdk v1.x • JSON-RPC 2.0 • SSE & stdio transports'
  },
  {
    level: 5,
    name: 'Evaluation (Evals & Guardrails)',
    shortName: 'Evaluation',
    icon: '🛡️',
    badge: 'Safety & Governance',
    color: '#0891b2',
    bgLight: '#ecfeff',
    borderColor: '#a5f3fc',
    industryDefinition: 'Benchmarking model responses, measuring regression, latency tracking, and enforcing safety guardrails.',
    industryLimitation: 'Generic text toxicity benchmarks that fail to evaluate destructive cybersecurity actions or infrastructure risks.',
    ppImplementation: 'Mandatory Human-in-the-Loop policy gates for mutating actions (AWS IAM revoke, ticket creation), MTTR tracking, and Shadow AI detection.',
    ppFeatures: [
      'Human-in-the-Loop Multi-Factor Approval for destructive cloud remediation',
      'Real-time Shadow AI endpoint discovery and unmanaged LLM interception',
      'Quantitative MTTR (Mean Time to Remediate) SLA benchmarking'
    ],
    codeLocation: 'src/app/dashboard/secure, src/app/ai-risk',
    techStack: 'Human-in-the-Loop Policy Gate • LLM Gateway Guardrails • PII Redaction'
  },
  {
    level: 6,
    name: 'Orchestration (The Apex)',
    shortName: 'Orchestration',
    icon: '👑',
    badge: 'Enterprise Multi-Agent',
    color: '#b45309',
    bgLight: '#fffbeb',
    borderColor: '#fcd34d',
    industryDefinition: 'Multi-agent state machines coordinating specialized agents across complex enterprise workflows.',
    industryLimitation: 'Single monolithic prompts pretending to handle complex end-to-end security operations.',
    ppImplementation: 'LangGraph Multi-Agent Autonomous SOAR coordinating Triage Agent, Threat Intel Agent, Compliance Agent, and Remediation Dispatcher.',
    ppFeatures: [
      'Specialized sub-agent delegation with persistent shared state',
      'Automated multi-system synchronization (Jira + AWS + Tenable + Qualys)',
      'Continuous cyber posture score recalibration and automated executive reporting'
    ],
    codeLocation: 'src/app/architecture/page.tsx, src/app/dashboard/dispatch',
    techStack: 'LangGraph State Graph • Multi-Agent SOAR Engine • Multi-Tenant Isolation'
  }
];

export default function AgenticRoadmapSection() {
  const [selectedLevel, setSelectedLevel] = useState<number>(4); // Default to MCP

  const currentStep = ROADMAP_STEPS.find((s) => s.level === selectedLevel) || ROADMAP_STEPS[3];

  return (
    <section id="agentic-roadmap" style={{ marginBottom: '3.5rem' }}>
      <div style={{
        borderRadius: 16,
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}>
        {/* Section Header */}
        <div style={{
          padding: '1.5rem 1.75rem',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
          borderBottom: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.2rem 0.65rem',
              borderRadius: 12,
              background: '#fef3c7',
              color: '#d97706',
              border: '1px solid #fde68a',
            }}>
              AGENTIC AI MATURITY LADDER
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
              INDUSTRY BENCHMARK COMPARISON
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
            🪜 The 6-Stage Agentic AI Roadmap: How PosturePilot Maps Side-by-Side
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, maxWidth: 900, lineHeight: 1.5 }}>
            Most security tools are stuck at Level 1 (Prompting) or Level 2 (RAG). PosturePilot is engineered across all 6 tiers—advancing through Autonomous Agents, Model Context Protocol (MCP), Rigorous Evals, to Multi-Agent Orchestration.
          </p>
        </div>

        {/* Content Body: Staircase Selector + Side-by-Side Comparison */}
        <div style={{ padding: '1.75rem' }}>
          {/* Staircase Step Progression Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.75rem',
          }}>
            {ROADMAP_STEPS.map((step) => {
              const isSelected = selectedLevel === step.level;
              return (
                <button
                  key={step.level}
                  onClick={() => setSelectedLevel(step.level)}
                  style={{
                    background: isSelected ? step.bgLight : '#ffffff',
                    border: isSelected ? `2px solid ${step.color}` : '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '0.85rem 1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: isSelected ? `0 4px 14px ${step.color}25` : '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: isSelected ? step.color : '#94a3b8',
                      letterSpacing: '0.04em',
                    }}>
                      LEVEL {step.level}
                    </span>
                    <span style={{ fontSize: '1.1rem' }}>{step.icon}</span>
                  </div>
                  <div style={{
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    color: isSelected ? step.color : '#0f172a',
                    lineHeight: 1.2,
                  }}>
                    {step.shortName}
                  </div>
                  <div style={{
                    fontSize: '0.68rem',
                    color: isSelected ? '#475569' : '#94a3b8',
                    marginTop: '0.25rem',
                    fontWeight: 600,
                  }}>
                    {step.badge}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Side-by-Side Detailed Breakdown Card */}
          <div style={{
            borderRadius: 14,
            border: `1px solid ${currentStep.borderColor}`,
            background: currentStep.bgLight,
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          }}>
            {/* Step Header Banner */}
            <div style={{
              padding: '1rem 1.5rem',
              background: '#ffffff',
              borderBottom: `1px solid ${currentStep.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  fontSize: '1.5rem',
                  padding: '0.4rem',
                  borderRadius: 10,
                  background: currentStep.bgLight,
                  border: `1px solid ${currentStep.borderColor}`,
                }}>
                  {currentStep.icon}
                </span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: currentStep.color, letterSpacing: '0.05em' }}>
                      LEVEL {currentStep.level} OF 6
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: 10,
                      background: currentStep.bgLight,
                      color: currentStep.color,
                      border: `1px solid ${currentStep.borderColor}`,
                    }}>
                      {currentStep.badge}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0.15rem 0 0 0' }}>
                    {currentStep.name}
                  </h3>
                </div>
              </div>

              <div style={{
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                background: '#f8fafc',
                padding: '0.35rem 0.75rem',
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                color: '#475569',
              }}>
                📂 {currentStep.codeLocation}
              </div>
            </div>

            {/* Side-by-Side 2-Column Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.25rem',
              padding: '1.5rem',
            }}>
              {/* Column 1: General Industry Baseline */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🌐 Industry Standard Definition
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                  {currentStep.industryDefinition}
                </p>

                <div style={{
                  marginTop: 'auto',
                  padding: '0.75rem',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 8,
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#b91c1c', marginBottom: 2 }}>
                    ⚠️ Common Industry Limitation
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#991b1b', lineHeight: 1.45 }}>
                    {currentStep.industryLimitation}
                  </div>
                </div>
              </div>

              {/* Column 2: PosturePilot Production Implementation */}
              <div style={{
                background: '#ffffff',
                border: `1.5px solid ${currentStep.color}`,
                borderRadius: 12,
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                boxShadow: `0 4px 14px ${currentStep.color}15`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: currentStep.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🛡️ How PosturePilot Implements It
                  </span>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 4,
                    background: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                  }}>
                    PRODUCTION LIVE
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.5, margin: 0 }}>
                  {currentStep.ppImplementation}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
                  {currentStep.ppFeatures.map((feat, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      fontSize: '0.8rem',
                      color: '#334155',
                      lineHeight: 1.45,
                    }}>
                      <span style={{ color: currentStep.color, fontWeight: 900 }}>✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  marginTop: 'auto',
                  paddingTop: '0.65rem',
                  borderTop: '1px dashed #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                }}>
                  <span style={{ color: '#64748b' }}>Technologies:</span>
                  <span style={{ fontWeight: 700, color: currentStep.color }}>{currentStep.techStack}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Side-by-Side Summary Table */}
          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              📊 Complete 6-Stage Roadmap Matrix
            </h4>
            <div style={{
              overflowX: 'auto',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              background: '#ffffff',
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.82rem',
              }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#334155', width: '15%' }}>Roadmap Stage</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#334155', width: '25%' }}>Industry Definition</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#0284c7', width: '38%' }}>PosturePilot Architecture (`PP.io`)</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#64748b', width: '22%' }}>Key Technologies</th>
                  </tr>
                </thead>
                <tbody>
                  {ROADMAP_STEPS.map((s, idx) => (
                    <tr
                      key={s.level}
                      onClick={() => setSelectedLevel(s.level)}
                      style={{
                        borderBottom: idx === ROADMAP_STEPS.length - 1 ? 'none' : '1px solid #f1f5f9',
                        background: selectedLevel === s.level ? s.bgLight : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: s.color }}>
                        <span style={{ marginRight: '0.4rem' }}>{s.icon}</span>
                        <span>{s.shortName}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#475569', lineHeight: 1.45 }}>
                        {s.industryDefinition}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#0f172a', fontWeight: 600, lineHeight: 1.45 }}>
                        {s.ppImplementation}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontFamily: 'monospace', fontSize: '0.74rem' }}>
                        {s.techStack}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
