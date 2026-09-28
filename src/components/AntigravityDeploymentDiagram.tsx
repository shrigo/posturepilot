'use client';

import React, { useState, useEffect } from 'react';

interface PipelineStage {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  category: string;
  icon: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  summary: string;
  technicalDetails: string[];
  protocol: string;
  outputArtifact: string;
  sampleLog: string;
  metrics: { label: string; value: string }[];
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'prompt_ingest',
    stepNumber: 1,
    title: 'Prompt Ingestion & Context Ingestion',
    subtitle: 'User Intent & Environment Context',
    category: 'Ingress & Context',
    icon: '💬',
    color: '#0284c7',
    badgeBg: '#e0f2fe',
    borderColor: '#bae6fd',
    summary: 'Ingests user prompt, IDE workspace state (open files, cursor position), project rules (AGENTS.md), and customized skills into high-density context tokens.',
    technicalDetails: [
      'Parses user goal ("Add SOAR login-tracker & deploy to posturepilot.io")',
      'Binds active workspace metadata: /Users/shrigo/Desktop/Apps/posturepilot',
      'Loads strict project constraints from AGENTS.md and relevant skills',
      'Calculates file graph boundaries across App Router, Prisma ORM, and API endpoints'
    ],
    protocol: 'JSON-RPC 2.0 / IDE State Stream',
    outputArtifact: 'Context Vector Buffer (AST + Metadata + Instruction Schema)',
    sampleLog: `[INGEST] Received user request: "Add SOAR login-tracker & publish to posturepilot.io"
[INGEST] Loaded 23 active workspace files & AGENTS.md rules
[INGEST] Context token assembly: 4,820 prompt tokens mapped`,
    metrics: [
      { label: 'Token Assembly', value: '4.8k tokens' },
      { label: 'Rule Constraints', value: '3 Active (AGENTS.md)' },
      { label: 'Ingress Latency', value: '42ms' }
    ]
  },
  {
    id: 'agent_reasoning',
    stepNumber: 2,
    title: 'Cognitive Planning & ReAct Agent Loop',
    subtitle: 'Autonomous Reasoning & Decision Trees',
    category: 'Agent Intelligence',
    icon: '🧠',
    color: '#7c3aed',
    badgeBg: '#f3e8ff',
    borderColor: '#d8b4fe',
    summary: 'Autonomous agent decomposes the high-level objective into atomic tasks, formulates hypotheses, chooses specific tools, and prepares verification checkpoints.',
    technicalDetails: [
      'ReAct (Reasoning + Acting) thought loops evaluating file dependencies',
      'Checks Knowledge Items (KIs) and architectural guidelines before executing',
      'Selects optimal tools: replace_file_content, run_command, browser_subagent',
      'Synthesizes change plan preventing regressions in auth routes and Prisma schemas'
    ],
    protocol: 'DeepMind Antigravity Cognitive Core',
    outputArtifact: 'Atomic Execution Plan (DAG of Tool Calls)',
    sampleLog: `[PLANNER] Thought: We need to implement login-tracker UI and link to /api/auth/log-attempt.
[PLANNER] Action: Inspect src/app/dashboard/login-tracker/page.tsx
[PLANNER] Verification: Test endpoint response with mock payload before committing.`,
    metrics: [
      { label: 'Reasoning Mode', value: 'Plan-Execute-Verify' },
      { label: 'Selected Tools', value: '4 Tools Orchestrated' },
      { label: 'Branch Safety', value: 'Zero Regressions' }
    ]
  },
  {
    id: 'workspace_execution',
    stepNumber: 3,
    title: 'Workspace Code Generation & Compilation',
    subtitle: 'Atomic File Edits & Local Compilation',
    category: 'Codebase Operations',
    icon: '⚡',
    color: '#059669',
    badgeBg: '#d1fae5',
    borderColor: '#a7f3d0',
    summary: 'Applies precision code modifications using AST-aware string replacements and executes build sanity checks in a persistent local terminal session.',
    technicalDetails: [
      'Executes replace_file_content / write_to_file with exact whitespace preservation',
      'Compiles React 19 server/client components and Next.js 16 route handlers',
      'Executes TypeScript 5 type checker and ESLint rules in persistent zsh subshell',
      'Verifies database ORM bindings via Prisma 7.8 client generator'
    ],
    protocol: 'Persistent PTY (zsh) & Filesystem Bridge',
    outputArtifact: 'Validated Source Diff & Compiled JS Bundles',
    sampleLog: `[WORKSPACE] Wrote update to src/app/architecture/page.tsx (940 lines)
[COMPILER]  ▲ Next.js 16.2.6 - Compiled /architecture in 340ms (client and server)
[TYPESCRIPT] Found 0 errors in 18 source files.`,
    metrics: [
      { label: 'Compile Time', value: '340ms' },
      { label: 'TS Diagnostics', value: '0 Errors / Clean' },
      { label: 'Atomic Edits', value: '100% Deterministic' }
    ]
  },
  {
    id: 'automated_testing',
    stepNumber: 4,
    title: 'Autonomous Verification & Browser Testing',
    subtitle: 'Subagent Headless QA & Error Auditing',
    category: 'Verification & QA',
    icon: '🧪',
    color: '#d97706',
    badgeBg: '#fef3c7',
    borderColor: '#fde68a',
    summary: 'Launches autonomous browser subagents or automated integration tests to inspect the DOM, verify rendered UI states, and catch console exceptions.',
    technicalDetails: [
      'Controls Chromium headless session via Chrome DevTools Protocol',
      'Captures DOM snapshots and inspects interactive elements & accessibility',
      'Records visual interaction sessions and saves artifacts in IDE brain directory',
      'Guarantees zero hydration errors, unhandled rejections, or broken links'
    ],
    protocol: 'Chrome DevTools Protocol (CDP) / Subagent RPC',
    outputArtifact: 'Browser Verification Report & WebP Interaction Recording',
    sampleLog: `[QA_SUBAGENT] Navigating to http://localhost:3000/architecture...
[QA_SUBAGENT] Checked DOM elements: header (OK), diagram container (OK), footer (OK)
[QA_SUBAGENT] Console audits: 0 warnings, 0 unhandled promise rejections.`,
    metrics: [
      { label: 'DOM Checks', value: 'Pass (No Hydration Mismatch)' },
      { label: 'Console Status', value: 'Clean (0 Exceptions)' },
      { label: 'Visual QA', value: 'Verified' }
    ]
  },
  {
    id: 'cicd_promotion',
    stepNumber: 5,
    title: 'Git Version Control & CI/CD Pipeline',
    subtitle: 'VCS Commit, Automated Build & Artifact Packaging',
    category: 'Release Engineering',
    icon: '📦',
    color: '#4f46e5',
    badgeBg: '#e0e7ff',
    borderColor: '#c7d2fe',
    summary: 'Commits verified code to git, pushes to remote repository (main branch), and triggers cloud CI/CD build runner with containerized assets.',
    technicalDetails: [
      'Executes git commit -m "feat(arch): add antigravity deployment pipeline diagram"',
      'Pushes to GitHub origin repository with signed SHA commit hashes',
      'Triggers automated GitHub Actions & Vercel / Cloud Run build runners',
      'Minifies production JS bundles and optimizes CSS/SVG assets'
    ],
    protocol: 'Git SSH / GitHub Webhooks / Cloud Runner',
    outputArtifact: 'Signed Git Commit & Edge Container Image',
    sampleLog: `[GIT] [main 8f9b21a] feat: publish antigravity deployment architecture diagram
[GIT] Pushed 3 files changed, 412 insertions(+) to origin/main
[CI_BUILD] Build job #142 triggered: Production Next.js bundle created (24.2s)`,
    metrics: [
      { label: 'VCS Branch', value: 'origin/main' },
      { label: 'Build Runtime', value: '24.2s' },
      { label: 'Asset Compression', value: 'Brotli / Gzip Enabled' }
    ]
  },
  {
    id: 'live_domain',
    stepNumber: 6,
    title: 'Edge Routing, DNS & Live Domain',
    subtitle: 'Global Anycast Edge & posturepilot.io Deployment',
    category: 'Global Edge & Production',
    icon: '🌐',
    color: '#16a34a',
    badgeBg: '#dcfce7',
    borderColor: '#86efac',
    summary: 'Instantaneous zero-downtime cutover across global Anycast Edge networks, routing traffic to posturepilot.io with TLS 1.3 encryption.',
    technicalDetails: [
      'Propagates Edge CDN caches across 300+ global edge locations',
      'Validates DNS A/AAAA and CNAME records pointing to posturepilot.io',
      'Enforces HTTP/3, TLS 1.3 certificates, and strict HSTS security headers',
      'Live production release accessible instantly worldwide with sub-50ms TTFB'
    ],
    protocol: 'HTTPS / HTTP3 (QUIC) / Global Anycast DNS',
    outputArtifact: 'Live Production Website: https://posturepilot.io',
    sampleLog: `[EDGE] Edge deployment completed in 4.1s across 320 points of presence.
[DNS] DNS health check passed for posturepilot.io (200 OK)
[LIVE] Target endpoint active: https://posturepilot.io/architecture (SSL Valid)`,
    metrics: [
      { label: 'Live Domain', value: 'https://posturepilot.io' },
      { label: 'Global TTFB', value: '38ms' },
      { label: 'Deployment State', value: '100% HEALTHY' }
    ]
  }
];

export default function AntigravityDeploymentDiagram() {
  const [selectedStage, setSelectedStage] = useState<PipelineStage>(PIPELINE_STAGES[0]);
  const [activeTab, setActiveTab] = useState<'visual' | 'mermaid' | 'simulation'>('visual');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationIndex, setSimulationIndex] = useState(0);
  const [copiedMermaid, setCopiedMermaid] = useState(false);

  // Simulation step-through effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating) {
      timer = setTimeout(() => {
        if (simulationIndex < PIPELINE_STAGES.length - 1) {
          const next = simulationIndex + 1;
          setSimulationIndex(next);
          setSelectedStage(PIPELINE_STAGES[next]);
        } else {
          setIsSimulating(false);
        }
      }, 1600);
    }
    return () => clearTimeout(timer);
  }, [isSimulating, simulationIndex]);

  const handleStartSimulation = () => {
    setSimulationIndex(0);
    setSelectedStage(PIPELINE_STAGES[0]);
    setIsSimulating(true);
  };

  const mermaidCode = `flowchart TD
    %% Antigravity Prompt-to-Production Architecture
    classDef input fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef agent fill:#0f172a,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    classDef workspace fill:#0f172a,stroke:#34d399,stroke-width:2px,color:#f8fafc;
    classDef test fill:#0f172a,stroke:#f59e0b,stroke-width:2px,color:#f8fafc;
    classDef cicd fill:#0f172a,stroke:#6366f1,stroke-width:2px,color:#f8fafc;
    classDef live fill:#064e3b,stroke:#10b981,stroke-width:3px,color:#f8fafc;

    UserPrompt["1. User Prompt Ingestion<br/>'Add SOAR login-tracker & publish'"]:::input

    subgraph AgentIntelligence ["DeepMind Antigravity Engine"]
        Planning["2. Cognitive Planning & ReAct Loops<br/>(Reads AGENTS.md, KIs, Workspace State)"]:::agent
        ToolSelect["3. Deterministic Tool Dispatcher<br/>(replace_file_content, run_command)"]:::agent
    end

    subgraph WorkspaceCore ["Local Workspace & Compilation"]
        CodeEdits["4. Precision Code Modification<br/>(src/app/..., components, routes)"]:::workspace
        Typecheck["5. Next.js 16 & TypeScript Compile<br/>(Zero build diagnostics)"]:::workspace
    end

    subgraph Verification ["Autonomous QA"]
        Subagent["6. Headless Browser QA<br/>(DOM verification & console logs)"]:::test
    end

    subgraph ReleasePipeline ["Release & Cloud CI/CD"]
        GitCommit["7. Git Commit & Push<br/>(Signed commit to origin/main)"]:::cicd
        CloudBuild["8. Automated CI/CD Runner<br/>(Vercel / Cloud Container Build)"]:::cicd
    end

    LiveProduction["🚀 9. Live Domain Deployment<br/>https://posturepilot.io"]:::live

    %% Flow Connections
    UserPrompt --> Planning
    Planning --> ToolSelect
    ToolSelect --> CodeEdits
    CodeEdits --> Typecheck
    Typecheck --> Subagent
    Subagent -->|Tests Pass| GitCommit
    Subagent -.->|Regression Detected| Planning
    GitCommit --> CloudBuild
    CloudBuild --> LiveProduction`;

  const handleCopyMermaid = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(mermaidCode);
      setCopiedMermaid(true);
      setTimeout(() => setCopiedMermaid(false), 2500);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      color: '#0f172a',
    }}>
      {/* Control Navigation Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.9rem 1.25rem',
        background: '#ffffff',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        {/* Left: View Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('visual')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'visual' ? '#0f172a' : '#f1f5f9',
              color: activeTab === 'visual' ? '#ffffff' : '#475569',
              transition: 'all 0.15s ease',
            }}
          >
            📊 Interactive Flow Pipeline
          </button>
          <button
            onClick={() => setActiveTab('mermaid')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'mermaid' ? '#0f172a' : '#f1f5f9',
              color: activeTab === 'mermaid' ? '#ffffff' : '#475569',
              transition: 'all 0.15s ease',
            }}
          >
            🧬 Mermaid Architecture Code
          </button>
        </div>

        {/* Right: Simulation trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleStartSimulation}
            disabled={isSimulating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1.1rem',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: isSimulating ? 'not-allowed' : 'pointer',
              border: 'none',
              background: isSimulating ? '#dcfce7' : 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: isSimulating ? '#15803d' : '#ffffff',
              boxShadow: isSimulating ? 'none' : '0 2px 10px rgba(37,99,235,0.25)',
              transition: 'all 0.2s',
            }}
          >
            {isSimulating ? (
              <>
                <span style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#16a34a',
                  animation: 'pulse 1s infinite alternate',
                }} />
                Running Step {simulationIndex + 1}/6...
              </>
            ) : (
              <>▶ Simulate Prompt ➔ posturepilot.io Flow</>
            )}
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {activeTab === 'visual' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 6-Stage Pipeline Graphic Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
          }}>
            {PIPELINE_STAGES.map((stage, idx) => {
              const isSelected = selectedStage.id === stage.id;
              const isSimActive = isSimulating && simulationIndex === idx;

              return (
                <div
                  key={stage.id}
                  onClick={() => {
                    if (!isSimulating) setSelectedStage(stage);
                  }}
                  style={{
                    padding: '1rem',
                    borderRadius: 12,
                    background: isSelected ? stage.badgeBg : '#ffffff',
                    border: isSelected
                      ? `2px solid ${stage.color}`
                      : isSimActive
                      ? `2px solid #2563eb`
                      : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected
                      ? `0 6px 16px -2px ${stage.color}25`
                      : '0 1px 3px rgba(0,0,0,0.03)',
                    transform: isSelected ? 'translateY(-3px)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                  }}
                >
                  {/* Top: Step indicator & Icon */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 12,
                        background: '#ffffff',
                        border: `1px solid ${stage.borderColor}`,
                        color: stage.color,
                      }}>
                        STAGE {stage.stepNumber}
                      </span>
                      <span style={{ fontSize: '1.2rem' }}>{stage.icon}</span>
                    </div>

                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '0.35rem' }}>
                      {stage.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.3 }}>
                      {stage.subtitle}
                    </div>
                  </div>

                  {/* Bottom: Status Pill */}
                  <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: isSelected ? stage.color : '#94a3b8',
                    }}>
                      {isSelected ? '● ACTIVE' : '○ INSPECT'}
                    </span>
                    {idx < PIPELINE_STAGES.length - 1 && (
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>➔</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Stage Inspector Panel */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '1.5rem',
            alignItems: 'stretch',
          }}>
            {/* Left: Stage Architecture Specification */}
            <div style={{
              padding: '1.75rem',
              borderRadius: 14,
              background: '#ffffff',
              border: `1.5px solid ${selectedStage.borderColor}`,
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.25rem 0.7rem',
                    borderRadius: 20,
                    background: selectedStage.badgeBg,
                    color: selectedStage.color,
                    border: `1px solid ${selectedStage.borderColor}`,
                  }}>
                    STAGE {selectedStage.stepNumber} OF 6: {selectedStage.category.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'monospace' }}>
                    {selectedStage.protocol}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#0f172a' }}>
                  {selectedStage.icon} {selectedStage.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
                  {selectedStage.summary}
                </p>

                {/* Technical Operations List */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Engine Operations & Execution Protocol
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {selectedStage.technicalDetails.map((detail, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        fontSize: '0.84rem',
                        color: '#334155',
                        lineHeight: 1.4,
                      }}>
                        <span style={{ color: selectedStage.color, fontWeight: 900 }}>•</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metrics Row */}
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                  padding: '0.9rem',
                  borderRadius: 10,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}>
                  {selectedStage.metrics.map((metric, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        {metric.label}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: selectedStage.color, marginTop: 2 }}>
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live Telemetry & Artifact Inspector Terminal */}
            <div style={{
              borderRadius: 14,
              background: '#090d16',
              border: '1px solid #1e293b',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Terminal Window Header */}
              <div style={{
                padding: '0.75rem 1.25rem',
                background: '#0f172a',
                borderBottom: '1px solid #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace', marginLeft: '0.5rem' }}>
                    antigravity-pipeline-telemetry.log
                  </span>
                </div>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 12,
                  background: '#1e293b',
                  color: '#38bdf8',
                  fontFamily: 'monospace',
                }}>
                  LIVE EXECUTION
                </span>
              </div>

              {/* Terminal Log Content */}
              <div style={{
                padding: '1.25rem',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                fontSize: '0.8rem',
                color: '#e2e8f0',
                lineHeight: 1.6,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ color: '#64748b', marginBottom: '0.75rem' }}>
                    // STAGE {selectedStage.stepNumber} RUNTIME TRACE &amp; ARTIFACT VERIFICATION
                  </div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#38bdf8' }}>
                    {selectedStage.sampleLog}
                  </pre>
                </div>

                {/* Target Artifact Output Box */}
                <div style={{
                  marginTop: '1.5rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 8,
                  background: '#131b2e',
                  border: '1px solid #1e293b',
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                    Generated Output Artifact
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4ade80' }}>
                    ✔ {selectedStage.outputArtifact}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mermaid Code View */
        <div style={{
          borderRadius: 14,
          background: '#090d16',
          border: '1px solid #1e293b',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            padding: '0.85rem 1.25rem',
            background: '#0f172a',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>
              antigravity-deployment-flowchart.mmd
            </span>
            <button
              onClick={handleCopyMermaid}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 6,
                background: copiedMermaid ? '#065f46' : '#1e293b',
                color: copiedMermaid ? '#6ee7b7' : '#e2e8f0',
                border: '1px solid #334155',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {copiedMermaid ? '✓ Copied Mermaid Code!' : '📋 Copy Mermaid Markdown'}
            </button>
          </div>
          <pre style={{
            padding: '1.5rem',
            margin: 0,
            color: '#38bdf8',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            overflowX: 'auto',
          }}>
            {mermaidCode}
          </pre>
        </div>
      )}
    </div>
  );
}
