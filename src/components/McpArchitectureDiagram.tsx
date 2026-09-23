'use client';

import React, { useState } from 'react';

interface McpTool {
  id: string;
  name: string;
  category: 'Scanner' | 'ETL' | 'SOAR' | 'Cloud Enforcement';
  icon: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  description: string;
  targetSystem: string;
  requiresApproval: boolean;
  rpcMethod: string;
  sampleRequest: {
    jsonrpc: string;
    method: string;
    params: {
      name: string;
      arguments: Record<string, any>;
    };
    id: number;
  };
  sampleResponse: {
    jsonrpc: string;
    result: {
      content: Array<{ type: string; text?: string; data?: any }>;
      isError: boolean;
    };
    id: number;
  };
}

const MCP_TOOLS: McpTool[] = [
  {
    id: 'tenable_query',
    name: 'tenable_query_cves',
    category: 'Scanner',
    icon: '🎯',
    color: '#0284c7',
    badgeBg: '#e0f2fe',
    borderColor: '#bae6fd',
    description: 'Queries live Tenable.io / Nessus agent scan results for host vulnerabilities, EPSS probabilities, and exploit maturity.',
    targetSystem: 'Tenable.io REST API v3',
    requiresApproval: false,
    rpcMethod: 'tools/call',
    sampleRequest: {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'tenable_query_cves',
        arguments: {
          asset_ip: '10.240.12.88',
          min_severity: 'HIGH',
          include_epss: true,
        },
      },
      id: 101,
    },
    sampleResponse: {
      jsonrpc: '2.0',
      result: {
        content: [
          {
            type: 'text',
            text: 'Found 3 matching findings: CVE-2024-21762 (FortiOS SSL-VPN RCE, CVSS 9.8, EPSS 0.94), CVE-2024-3400 (PAN-OS GlobalProtect Command Injection, CVSS 10.0, EPSS 0.98), CVE-2023-46805 (Ivanti Connect Secure Auth Bypass, CVSS 8.2). All detected on primary perimeter interface.',
          },
        ],
        isError: false,
      },
      id: 101,
    },
  },
  {
    id: 'qualys_sync',
    name: 'qualys_sync_assets',
    category: 'Scanner',
    icon: '🛡️',
    color: '#059669',
    badgeBg: '#d1fae5',
    borderColor: '#a7f3d0',
    description: 'Pulls asset vulnerability posture, patch status, and detection telemetry from Qualys VMDR cloud agent clusters.',
    targetSystem: 'Qualys VMDR Cloud Gateway',
    requiresApproval: false,
    rpcMethod: 'tools/call',
    sampleRequest: {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'qualys_sync_assets',
        arguments: {
          tenant_id: 'acme-corp-prod',
          qids: [378901, 379204],
          status_filter: 'ACTIVE_VULNERABLE',
        },
      },
      id: 102,
    },
    sampleResponse: {
      jsonrpc: '2.0',
      result: {
        content: [
          {
            type: 'text',
            text: 'Successfully ingested 142 host records. 18 critical CVEs mapped directly to PosturePilot posture index. Qualys QID 378901 matches active CISA KEV listing.',
          },
        ],
        isError: false,
      },
      id: 102,
    },
  },
  {
    id: 'sarif_ingest',
    name: 'ingest_sarif_ast',
    category: 'ETL',
    icon: '⚡',
    color: '#d97706',
    badgeBg: '#fef3c7',
    borderColor: '#fde68a',
    description: 'Parses OASIS SARIF v2.1 code scanning outputs, Snyk SCA manifests, and Semgrep AST artifacts into unified finding entities.',
    targetSystem: 'Streaming SARIF / AST Normalizer',
    requiresApproval: false,
    rpcMethod: 'tools/call',
    sampleRequest: {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'ingest_sarif_ast',
        arguments: {
          scan_format: 'SARIF_V2_1',
          source_repo: 'org/backend-auth-service',
          deduplicate: true,
        },
      },
      id: 103,
    },
    sampleResponse: {
      jsonrpc: '2.0',
      result: {
        content: [
          {
            type: 'text',
            text: 'Processed 8,420 SARIF result nodes. Normalized 12 high-confidence AST code injections and 4 dependency vulnerabilities. Hash signatures recorded.',
          },
        ],
        isError: false,
      },
      id: 103,
    },
  },
  {
    id: 'jira_soar',
    name: 'jira_create_ticket',
    category: 'SOAR',
    icon: '🎫',
    color: '#4f46e5',
    badgeBg: '#e0e7ff',
    borderColor: '#c7d2fe',
    description: 'Dispatches automated Jira remediation tickets with assigned engineering squads, SLA deadlines, and verified patch instructions.',
    targetSystem: 'Atlassian Jira Software Cloud',
    requiresApproval: true,
    rpcMethod: 'tools/call',
    sampleRequest: {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'jira_create_ticket',
        arguments: {
          project_key: 'SEC',
          summary: 'URGENT: Remediate CVE-2024-21762 on edge bastion 10.240.12.88',
          priority: 'Highest',
          sla_hours: 24,
          cve_id: 'CVE-2024-21762',
          assignee_group: 'secops-tier3',
        },
      },
      id: 104,
    },
    sampleResponse: {
      jsonrpc: '2.0',
      result: {
        content: [
          {
            type: 'text',
            text: 'Created Jira issue SEC-4091. Attached CIS benchmark remediation guide. SLA timer active: 24h deadline set. PagerDuty on-call paged.',
          },
        ],
        isError: false,
      },
      id: 104,
    },
  },
  {
    id: 'aws_quarantine',
    name: 'aws_quarantine_iam_role',
    category: 'Cloud Enforcement',
    icon: '🔒',
    color: '#dc2626',
    badgeBg: '#fee2e2',
    borderColor: '#fca5a5',
    description: 'Emergency containment tool: Attaches an explicit deny policy to a compromised AWS IAM principal or detaches security groups from an EC2 instance.',
    targetSystem: 'AWS IAM / EC2 Security API',
    requiresApproval: true,
    rpcMethod: 'tools/call',
    sampleRequest: {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'aws_quarantine_iam_role',
        arguments: {
          role_arn: 'arn:aws:iam::123456789012:role/DeployPipelineRunner',
          quarantine_policy: 'AWSCompromisedCredentialsQuarantine',
          notify_ciso: true,
        },
      },
      id: 105,
    },
    sampleResponse: {
      jsonrpc: '2.0',
      result: {
        content: [
          {
            type: 'text',
            text: 'POLICY ENFORCED: Explicit deny policy attached to arn:aws:iam::123456789012:role/DeployPipelineRunner. Active STS sessions revoked. Security audit trail generated.',
          },
        ],
        isError: false,
      },
      id: 105,
    },
  },
];

export default function McpArchitectureDiagram() {
  const [activeTab, setActiveTab] = useState<'topology' | 'inspector' | 'spec'>('topology');
  const [selectedTool, setSelectedTool] = useState<McpTool>(MCP_TOOLS[0]);
  const [simulatedExecution, setSimulatedExecution] = useState(false);

  const triggerSimulation = () => {
    setSimulatedExecution(true);
    setTimeout(() => setSimulatedExecution(false), 2400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Subheader Toolbar & Mode Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.75rem 1.25rem',
        background: '#ffffff',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.25rem 0.65rem',
            borderRadius: 6,
            background: '#e0f2fe',
            color: '#0369a1',
            letterSpacing: '0.04em',
          }}>
            RFC SPEC: MCP v1.x
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
            Model Context Protocol Topology &amp; Security Dispatcher
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          padding: 3,
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          gap: 2,
        }}>
          <button
            onClick={() => setActiveTab('topology')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              background: activeTab === 'topology' ? '#ffffff' : 'transparent',
              color: activeTab === 'topology' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'topology' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            🗺️ Protocol Topology
          </button>
          <button
            onClick={() => setActiveTab('inspector')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              background: activeTab === 'inspector' ? '#ffffff' : 'transparent',
              color: activeTab === 'inspector' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'inspector' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            🔬 Live Tool &amp; RPC Inspector
          </button>
          <button
            onClick={() => setActiveTab('spec')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              background: activeTab === 'spec' ? '#ffffff' : 'transparent',
              color: activeTab === 'spec' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'spec' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            🛡️ Governance &amp; Security Boundary
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: PROTOCOL TOPOLOGY DIAGRAM */}
      {/* ========================================================================= */}
      {activeTab === 'topology' && (
        <div style={{
          background: '#ffffff',
          borderRadius: 14,
          border: '1px solid #e2e8f0',
          padding: '1.75rem',
          boxShadow: '0 4px 16px -2px rgba(0,0,0,0.03)',
        }}>
          {/* Top Banner Explainer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            padding: '1rem 1.5rem',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                How Model Context Protocol (MCP) Functions in PosturePilot
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 2 }}>
                Standardizes how AI Copilots discover security tools, inspect vulnerability resources, and execute deterministic remediation.
              </div>
            </div>
            <button
              onClick={triggerSimulation}
              disabled={simulatedExecution}
              style={{
                background: simulatedExecution ? '#10b981' : '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: 8,
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: simulatedExecution ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 8px rgba(2,132,199,0.25)',
                transition: 'all 0.2s ease',
              }}
            >
              {simulatedExecution ? '⚡ JSON-RPC Dispatch In Flight...' : '▶ Simulate Tool Call Flow'}
            </button>
          </div>

          {/* Diagram Flow Columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            position: 'relative',
          }}>
            {/* COLUMN 1: AI ORCHESTRATION HOST */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: 12,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#475569',
                  letterSpacing: '0.05em',
                }}>
                  LAYER 1 • CLIENT HOST
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 10,
                  background: '#e2e8f0',
                  color: '#334155',
                  fontWeight: 700,
                }}>
                  MCP Client
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🤖 AI Copilot &amp; SOAR Agents
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Frontier LLMs executing autonomous ReAct loops (Reasoning + Tool Acting) with cyclic state graphs.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '0.6rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span>🧠</span> Anthropic Claude 3.5 Sonnet
                </div>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '0.6rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span>⚡</span> OpenAI GPT-4o / Gemini 1.5
                </div>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '0.6rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span>🔄</span> LangGraph Multi-Agent Planner
                </div>
              </div>

              <div style={{
                marginTop: 'auto',
                paddingTop: '0.75rem',
                borderTop: '1px dashed #cbd5e1',
                fontSize: '0.72rem',
                color: '#64748b',
              }}>
                Dispatches typed <code>tools/call</code> &amp; queries <code>resources/read</code>
              </div>
            </div>

            {/* COLUMN 2: MCP PROTOCOL GATEWAY & SERVER */}
            <div style={{
              background: '#f0f9ff',
              border: simulatedExecution ? '2px solid #0284c7' : '1px solid #bae6fd',
              borderRadius: 12,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: simulatedExecution ? '0 0 20px rgba(2,132,199,0.25)' : 'none',
              transition: 'all 0.3s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#0284c7',
                  letterSpacing: '0.05em',
                }}>
                  LAYER 2 • PROTOCOL SERVER
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 10,
                  background: '#0284c7',
                  color: '#ffffff',
                  fontWeight: 700,
                }}>
                  JSON-RPC 2.0
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0369a1', margin: 0 }}>
                🔌 PosturePilot MCP Server
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#0369a1', margin: 0, lineHeight: 1.5 }}>
                Central runtime exposing verified schema tools, posture resources, and enforcing strict human approval gates.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #bae6fd',
                  borderRadius: 8,
                  padding: '0.6rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#0369a1',
                }}>
                  <strong>📦 Tools Registry:</strong> Dynamic JSON Schema discovery
                </div>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #bae6fd',
                  borderRadius: 8,
                  padding: '0.6rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#0369a1',
                }}>
                  <strong>📂 Resources Provider:</strong> <code>cve://</code> &amp; <code>posture://</code> URIs
                </div>
                <div style={{
                  background: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: 8,
                  padding: '0.6rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#b91c1c',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}>
                  <span>🛡️</span> Human-in-the-Loop Policy Gate
                </div>
              </div>

              <div style={{
                marginTop: 'auto',
                paddingTop: '0.75rem',
                borderTop: '1px dashed #bae6fd',
                fontSize: '0.72rem',
                color: '#0369a1',
              }}>
                Transport: Standard I/O (<code>stdio</code>) &amp; Server-Sent Events (<code>SSE</code>)
              </div>
            </div>

            {/* COLUMN 3: SECURITY TOOL DISPATCHERS */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: 12,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#475569',
                  letterSpacing: '0.05em',
                }}>
                  LAYER 3 • TOOL DISPATCHERS
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 10,
                  background: '#e0f2fe',
                  color: '#0284c7',
                  fontWeight: 700,
                }}>
                  5 Active Handlers
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                ⚡ Deterministic Security Tools
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Sandboxed execution units that interact directly with scanners, cloud providers, and ticketing systems.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.5rem' }}>
                {MCP_TOOLS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTool(t);
                      setActiveTab('inspector');
                    }}
                    style={{
                      background: '#ffffff',
                      border: `1px solid ${t.borderColor}`,
                      borderRadius: 8,
                      padding: '0.55rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem' }}>{t.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>{t.name}</div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{t.targetSystem}</div>
                      </div>
                    </div>
                    {t.requiresApproval ? (
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#dc2626', background: '#fee2e2', padding: '0.15rem 0.4rem', borderRadius: 4 }}>
                        Approval Req
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#059669', background: '#d1fae5', padding: '0.15rem 0.4rem', borderRadius: 4 }}>
                        Auto Read
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Protocol Step Flow Guide */}
          <div style={{
            marginTop: '1.75rem',
            padding: '1.25rem',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              Execution Lifecycle: How an MCP Security Tool is Called in PosturePilot
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.75rem',
            }}>
              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7' }}>1. Tool Discovery</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 3 }}>
                  Copilot queries <code>tools/list</code>. MCP Server returns JSON Schema specs for all 5 security endpoints.
                </div>
              </div>
              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7' }}>2. ReAct Decision</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 3 }}>
                  Agent formulates reasoning, builds typed input payload matching target tool schema, and issues <code>tools/call</code>.
                </div>
              </div>
              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706' }}>3. Policy &amp; Approval</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 3 }}>
                  If tool mutates state (e.g., AWS IAM isolation or Jira ticket), MCP Server halts and triggers CISO approval prompt.
                </div>
              </div>
              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669' }}>4. Context Enrichment</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 3 }}>
                  Tool executes against downstream API, normalizes response into standard JSON-RPC envelope, and updates Posture score.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: LIVE TOOL & RPC INSPECTOR */}
      {/* ========================================================================= */}
      {activeTab === 'inspector' && (
        <div style={{
          background: '#ffffff',
          borderRadius: 14,
          border: '1px solid #e2e8f0',
          padding: '1.75rem',
          boxShadow: '0 4px 16px -2px rgba(0,0,0,0.03)',
        }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              🔬 Interactive MCP Tool Payload Inspector
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 2 }}>
              Select any registered PosturePilot MCP tool to inspect its live JSON-RPC 2.0 schema, invocation arguments, and verified return payload.
            </div>
          </div>

          {/* Tool Selector Bar */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            marginBottom: '1.25rem',
          }}>
            {MCP_TOOLS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTool(t)}
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: 8,
                  border: selectedTool.id === t.id ? `2px solid ${t.color}` : '1px solid #e2e8f0',
                  background: selectedTool.id === t.id ? t.badgeBg : '#ffffff',
                  color: selectedTool.id === t.id ? t.color : '#334155',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{t.icon}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>

          {/* Selected Tool Details Card */}
          <div style={{
            border: `1px solid ${selectedTool.borderColor}`,
            background: selectedTool.badgeBg,
            borderRadius: 10,
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{selectedTool.icon}</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: selectedTool.color }}>
                  {selectedTool.name}
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.5rem',
                  borderRadius: 6,
                  background: '#ffffff',
                  color: selectedTool.color,
                  border: `1px solid ${selectedTool.borderColor}`,
                }}>
                  {selectedTool.category}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#334155', margin: '0.35rem 0 0 0' }}>
                {selectedTool.description}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Target Integration</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{selectedTool.targetSystem}</div>
            </div>
          </div>

          {/* JSON-RPC Request & Response Two-Column Code Boxes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}>
            {/* Request Box */}
            <div style={{
              background: '#0f172a',
              borderRadius: 10,
              padding: '1rem',
              color: '#f8fafc',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #334155',
                marginBottom: '0.75rem',
              }}>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>📤 JSON-RPC 2.0 Request (Client ➜ Server)</span>
                <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>tools/call</span>
              </div>
              <pre style={{ margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.45, color: '#cbd5e1' }}>
                {JSON.stringify(selectedTool.sampleRequest, null, 2)}
              </pre>
            </div>

            {/* Response Box */}
            <div style={{
              background: '#0f172a',
              borderRadius: 10,
              padding: '1rem',
              color: '#f8fafc',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #334155',
                marginBottom: '0.75rem',
              }}>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>📥 JSON-RPC 2.0 Response (Server ➜ Client)</span>
                <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Success (HTTP 200)</span>
              </div>
              <pre style={{ margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.45, color: '#86efac' }}>
                {JSON.stringify(selectedTool.sampleResponse, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: PROTOCOL SPEC & GOVERNANCE */}
      {/* ========================================================================= */}
      {activeTab === 'spec' && (
        <div style={{
          background: '#ffffff',
          borderRadius: 14,
          border: '1px solid #e2e8f0',
          padding: '1.75rem',
          boxShadow: '0 4px 16px -2px rgba(0,0,0,0.03)',
        }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              🛡️ Enterprise MCP Governance &amp; Security Isolation Boundaries
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 2 }}>
              How PosturePilot prevents prompt injection escapes, unconstrained tool dispatch, and destructive actions.
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '1.25rem',
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                🔒 Strict Schema Sandboxing
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Every parameter passed via <code>tools/call</code> is validated against strict JSON Schema schemas using Zod and TypeScript. Unrecognized fields, unexpected shell characters, or SQL injection vectors are immediately dropped with an MCP protocol error code <code>-32602 (Invalid params)</code>.
              </p>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '1.25rem',
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                👤 Mandatory Human-in-the-Loop Gate
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Read-only tools (e.g. querying Tenable or pulling SARIF ASTs) execute autonomously. Mutating tools (e.g. creating Jira tickets, revoking AWS IAM roles, modifying firewall policies) require an explicit multi-factor confirmation token from the SOC operator before the MCP Server proceeds.
              </p>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '1.25rem',
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                🌐 Multi-Tenant Scoping &amp; TLS 1.3
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                All MCP client connections are scoped to the active tenant session token. The MCP Server rejects any tool call or resource query referencing infrastructure outside the authorized tenant boundary, preventing cross-tenant data leakage.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
