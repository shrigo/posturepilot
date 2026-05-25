'use client';
import { useEffect, useState } from 'react';
import { aiRiskData } from '@/data/mockData';
import Link from 'next/link';

const toolDetails: Record<string, {
  desc: string;
  remediation: string;
  departments: { name: string; users: number }[];
  leakedDataTypes: string[];
  mitreTechniques: string[];
  flaggedUsers: {
    email: string;
    name: string;
    role: string;
    risk: 'Critical' | 'High' | 'Medium' | 'Low';
    riskScore: number;
    reason: string;
  }[];
}> = {
  'ChatGPT (Personal)': {
    desc: 'Public instance of ChatGPT where user prompts are used by default for model training. Highly susceptible to IP leakage and business analytics sharing.',
    remediation: 'Migrate active users to the corporate-approved Enterprise ChatGPT Workspace and enable strict prompt masking rules.',
    departments: [
      { name: 'Engineering', users: 64 },
      { name: 'Finance & Accounting', users: 48 },
      { name: 'Marketing', users: 30 }
    ],
    leakedDataTypes: ['API Credentials', 'Corporate Tax Records', 'Source Code Patches'],
    mitreTechniques: ['AML.T0016: LLM Prompt Injection', 'AML.T0004: Model Data Leakage', 'AML.T0010: LLM Credential Theft'],
    flaggedUsers: [
      { email: 'guruji@posturepilot.io', name: 'Guruji', role: 'Principal Security Architect', risk: 'Critical', riskScore: 96, reason: 'Pasted full proprietary database migration schema & raw server routes' },
      { email: 'sarah.jones@posturepilot.io', name: 'Sarah Jones', role: 'Finance Director', risk: 'High', riskScore: 82, reason: 'Uploaded Q1 financial planning sheets & tax drafts' },
      { email: 'alex.t@posturepilot.io', name: 'Alex Thompson', role: 'Lead Software Engineer', risk: 'High', riskScore: 78, reason: 'Pasted proprietary backend middleware authorization routines' }
    ]
  },
  'Midjourney': {
    desc: 'Generative image service utilized for prompt-based creative assets. High risk of exporting proprietary UI/UX prototypes and marketing wireframes.',
    remediation: 'Implement active content watermarking policies and limit file attachment permissions via corporate network gateway.',
    departments: [
      { name: 'Marketing & Design', users: 32 },
      { name: 'Product Management', users: 6 }
    ],
    leakedDataTypes: ['Figma Prototype Exports', 'Product Roadmap Wireframes'],
    mitreTechniques: ['AML.T0004: Model Data Leakage', 'AML.T0015: Model Evasion Attack'],
    flaggedUsers: [
      { email: 'design.guruji@posturepilot.io', name: 'Guruji', role: 'Principal UX/UI Designer', risk: 'High', riskScore: 74, reason: 'Generated high-fidelity mockups exposing unpublished mobile app layout' },
      { email: 'clara.d@posturepilot.io', name: 'Clara Davis', role: 'Brand & Creative Lead', risk: 'Medium', riskScore: 52, reason: 'Rendered social assets using high-resolution competitor vector logos' }
    ]
  },
  'GitHub Copilot (unlic)': {
    desc: 'Unlicensed developer IDE extensions automatically collecting code context and telemetry without commercial-grade privacy agreements.',
    remediation: 'Enforce standard enterprise license coverage or transition development teams to the approved secure self-hosted LLM copilot.',
    departments: [
      { name: 'Core Engineering', users: 22 },
      { name: 'QA & Testing', users: 5 }
    ],
    leakedDataTypes: ['Database Migration Scripts', 'Private Repository Snippets'],
    mitreTechniques: ['AML.T0004: Model Data Leakage', 'AML.T0010: LLM Credential Theft'],
    flaggedUsers: [
      { email: 'dev.guruji@posturepilot.io', name: 'Guruji', role: 'Principal Developer', risk: 'High', riskScore: 88, reason: 'IDE extension telemetry active on proprietary algorithmic trading repository' },
      { email: 'ryan.c@posturepilot.io', name: 'Ryan Carter', role: 'Senior Platform Engineer', risk: 'Medium', riskScore: 60, reason: 'Telemetry logs active on client telemetry parsing modules' }
    ]
  },
  'Perplexity AI': {
    desc: 'AI-assisted search aggregator often receiving pastes of internal research papers, strategy documents, or competitive drafts.',
    remediation: 'Provide training on secure search boundaries and enforce prompt inspection controls for target research endpoints.',
    departments: [
      { name: 'Strategy & Research', users: 12 },
      { name: 'Legal & Compliance', users: 7 }
    ],
    leakedDataTypes: ['Competitor Acquisition Briefs', 'Patent Filing Drafts'],
    mitreTechniques: ['AML.T0004: Model Data Leakage', 'AML.T0000: ML Artifact Discovery'],
    flaggedUsers: [
      { email: 'research.guruji@posturepilot.io', name: 'Guruji', role: 'Principal Researcher', risk: 'High', riskScore: 75, reason: 'Queried competitor patent filings using internal draft abstracts' },
      { email: 'helen.m@posturepilot.io', name: 'Helen Miller', role: 'VP of Corporate Strategy', risk: 'High', riskScore: 78, reason: 'Researched target acquisitions using sensitive corporate M&A keywords' }
    ]
  },
  'Claude (Personal)': {
    desc: 'Personal/free tier of Anthropic Claude. Highly capable reasoning engine often receiving very large text inputs and full document uploads.',
    remediation: 'Integrate the corporate Claude Team subscription and direct personal browser traffic to corporate API gateways.',
    departments: [
      { name: 'Executive Operations', users: 5 },
      { name: 'Finance & Risk', users: 9 }
    ],
    leakedDataTypes: ['Q1 Financial Projections', 'Board Meeting Minutes'],
    mitreTechniques: ['AML.T0016: LLM Prompt Injection', 'AML.T0004: Model Data Leakage'],
    flaggedUsers: [
      { email: 'guruji.advisor@posturepilot.io', name: 'Guruji', role: 'Executive Strategy Advisor', risk: 'Critical', riskScore: 95, reason: 'Uploaded entire board meeting minutes & strategic roadmap decks for summary' },
      { email: 'mark.r@posturepilot.io', name: 'Mark Ross', role: 'Risk Management Analyst', risk: 'High', riskScore: 85, reason: 'Pasted regulatory audit spreadsheets containing sensitive client metadata' }
    ]
  },
  'Self-Hosted LLaMA-3 (AWS)': {
    desc: 'Open-source Llama-3 model deployed on an unmanaged AWS EC2 instance without corporate firewall or rate limiting guards. Highly vulnerable to direct prompt injection and model theft.',
    remediation: 'Route the instance behind the centralized PosturePilot Multi-Cloud AI Gateway and apply IAM access control policies.',
    departments: [
      { name: 'Core Research & AI', users: 12 },
      { name: 'DevOps & Infrastructure', users: 6 }
    ],
    leakedDataTypes: ['AWS Private Access Keys', 'Internal Training Dataset (Unencrypted)'],
    mitreTechniques: ['AML.T0016: LLM Prompt Injection', 'AML.T0000: ML Artifact Discovery', 'AML.T0004: Model Data Leakage'],
    flaggedUsers: [
      { email: 'dev.guruji@posturepilot.io', name: 'Guruji', role: 'Principal AI Architect', risk: 'Critical', riskScore: 97, reason: 'Deployed unmanaged LLaMA-3 node exposing raw AWS S3 buckets to public internet' },
      { email: 'marsha.k@posturepilot.io', name: 'Marsha K.', role: 'Senior Cloud Engineer', risk: 'High', riskScore: 84, reason: 'Configured EC2 instance using public security groups allowing unauthenticated ingress' }
    ]
  },
  'Azure OpenAI Sandbox': {
    desc: 'Ad-hoc sandbox instance of Azure OpenAI created by developers without proper enterprise governance or proxy audit trails.',
    remediation: 'Transition resources to the corporate-approved Microsoft Entra enterprise tenant and enforce prompt audit logging.',
    departments: [
      { name: 'Data Engineering', users: 8 },
      { name: 'Product Growth', users: 4 }
    ],
    leakedDataTypes: ['Pinecone Vector DB API Key', 'Customer Service Chat History'],
    mitreTechniques: ['AML.T0010: LLM Credential Theft', 'AML.T0004: Model Data Leakage'],
    flaggedUsers: [
      { email: 'architect.guruji@posturepilot.io', name: 'Guruji', role: 'Principal Infrastructure Lead', risk: 'High', riskScore: 86, reason: 'Pasted production vector database connection credentials inside unsecured sandbox session' },
      { email: 'tim.b@posturepilot.io', name: 'Tim Bailey', role: 'Lead Growth Developer', risk: 'Medium', riskScore: 59, reason: 'Configured unauthenticated sandbox API routes for external testing' }
    ]
  }
};

interface LiveData {
  hasLiveData: boolean; total: number; critical: number; high: number;
  riskScore: number; shadowAiDetected: number;
  bySeverity: Record<string,number>;
}

export default function AiRiskPage() {
  const [live, setLive] = useState<LiveData | null>(null);
  
  // Interactive AI Policy Firewall Rules State
  const [firewallRules, setFirewallRules] = useState([
    { id: 'pii', label: 'PII Prompt Masking', desc: 'Scrubs names, SSNs, and emails', active: true, impact: 12 },
    { id: 'dlp', label: 'Sensitive Data DLP Filter', desc: 'Blocks credit cards, keys & code', active: false, impact: 15 },
    { id: 'injection', label: 'Prompt Injection Guard', desc: 'Defends against prompt injection attempts', active: true, impact: 12 },
    { id: 'apikey', label: 'Rogue API Key Blocker', desc: 'Blocks exposed LLM API keys', active: false, impact: 14 },
    { id: 'multicloud', label: 'Multi-Cloud API Proxy Guard', desc: 'Secures Azure OpenAI & AWS Bedrock APIs', active: false, impact: 14 },
    { id: 'shadowllm', label: 'Shadow LLM Node Discovery', desc: 'Detects unauthorized LLaMA & Mistral models', active: true, impact: 12 },
  ]);

  // Local State Shadow AI Tools list including Multi-Cloud assets
  const [shadowAiTools, setShadowAiTools] = useState([
    ...aiRiskData.shadowAiTools,
    { tool: 'Self-Hosted LLaMA-3 (AWS)', users: 18, dataShared: 'High', policyStatus: 'Pending', category: 'Cloud Hosted LLM' },
    { tool: 'Azure OpenAI Sandbox', users: 12, dataShared: 'Medium', policyStatus: 'Allowed', category: 'Cloud LLM Proxy' }
  ]);

  // Live Scrolling DLP Logs Feed (13 initial items to perfectly fill the balanced card height)
  const [dlpLogs, setDlpLogs] = useState([
    { time: 'Just now', user: 'Cloud Dev Lead', tool: 'Self-Hosted LLaMA-3 (AWS)', leak: 'Corporate AWS Access Key', severity: 'Critical', color: '#dc2626' },
    { time: '1 min ago', user: 'Finance Admin', tool: 'ChatGPT (Personal)', leak: 'Tax File Sheet (PII)', severity: 'Critical', color: '#dc2626' },
    { time: '2 min ago', user: 'Dev Engineer', tool: 'Claude.ai (Free)', leak: 'OpenAI API key paste', severity: 'High', color: '#ea580c' },
    { time: '3 min ago', user: 'ML Engineer', tool: 'Azure OpenAI Sandbox', leak: 'Pinecone Vector DB Secret', severity: 'High', color: '#ea580c' },
    { time: '5 min ago', user: 'Dev Engineer', tool: 'GitHub Copilot (unlic)', leak: 'Internal Database Schema', severity: 'High', color: '#ea580c' },
    { time: '9 min ago', user: 'HR Generalist', tool: 'ChatGPT (Personal)', leak: 'Candidate Resumes paste', severity: 'Medium', color: '#d97706' },
    { time: '14 min ago', user: 'Product Owner', tool: 'Perplexity AI', leak: 'Roadmap draft leakage', severity: 'Low', color: '#16a34a' },
    { time: '22 min ago', user: 'Dev Engineer', tool: 'Claude.ai (Free)', leak: 'AWS S3 Training Bucket URL', severity: 'High', color: '#ea580c' },
    { time: '35 min ago', user: 'Marketing Spec', tool: 'Midjourney', leak: 'Proprietary UI/UX Prototype', severity: 'Medium', color: '#d97706' },
    { time: '48 min ago', user: 'Data Engineer', tool: 'Azure OpenAI Sandbox', leak: 'Customer Service Chat History', severity: 'Medium', color: '#d97706' },
    { time: '55 min ago', user: 'ML Architect', tool: 'Self-Hosted LLaMA-3 (AWS)', leak: 'Fine-Tuning Dataset Prompt', severity: 'Low', color: '#16a34a' },
    { time: '1 hour ago', user: 'ML Engineer', tool: 'Self-Hosted LLaMA-3 (AWS)', leak: 'HuggingFace Model Access Token', severity: 'High', color: '#ea580c' },
    { time: '2 hours ago', user: 'Strategy Spec', tool: 'Perplexity AI', leak: 'Unreleased Acquisition Draft', severity: 'Medium', color: '#d97706' },
  ]);

  // Premium Clickable Detail Modals
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<'assessment' | 'users'>('assessment');

  // NEW "BEST OF 4" STATES
  // 1. Cisco Onboarding & Protection Router
  const [onboardingStep, setOnboardingStep] = useState<'discover' | 'scan' | 'secure' | 'prevent'>('discover');
  const [protectionMode, setProtectionMode] = useState<'api' | 'gateway' | 'multicloud'>('api');
  const [appUrl, setAppUrl] = useState('https://api.acme.internal/v1/llama3');
  const [isAppAdded, setIsAppAdded] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');
  const [cloudConnected, setCloudConnected] = useState(false);
  const [syncingCloud, setSyncingCloud] = useState(false);

  // 2. Cisco Red-Teaming Scanner
  const [selectedScanModel, setSelectedScanModel] = useState('Self-Hosted LLaMA-3 (AWS)');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanResult, setScanResult] = useState<{ score: number; rating: string; recommendations: string[] } | null>(null);

  // 3. Prisma Threat Flow & Masking Slider
  const [maskingSensitivity, setMaskingSensitivity] = useState<'Low' | 'Medium' | 'Strict'>('Medium');

  // 4. Corgea Code Security & Auto-Patching
  const [vulnerabilities, setVulnerabilities] = useState([
    {
      id: 'vuln1',
      title: 'Exposed Pinecone DB API Key in config.json',
      file: 'config.json',
      type: 'Hardcoded LLM Secret',
      severity: 'Critical',
      patched: false,
      codeBefore: `{\n  "pinecone_env": "us-east-1-aws",\n- "pinecone_api_key": "pc_api_key_8ab12fd97e3c4a22b9a710f27ddc831b",\n  "model": "gpt-4-turbo"\n}`,
      codeAfter: `{\n  "pinecone_env": "us-east-1-aws",\n+ "pinecone_api_key": "process.env.PINECONE_API_KEY", // Resolved securely from Env\n  "model": "gpt-4-turbo"\n}`,
      impact: 14,
      targetRuleId: 'apikey'
    },
    {
      id: 'vuln2',
      title: 'Insecure System Prompt Concatenation in routes/chat.ts',
      file: 'routes/chat.ts',
      type: 'Prompt Injection Susceptibility',
      severity: 'High',
      patched: false,
      codeBefore: `const userQuery = req.body.prompt;\n- const fullPrompt = "You are a helpful assistant. " + userQuery;\nconst response = await openai.createChatCompletion({ prompt: fullPrompt });`,
      codeAfter: `const userQuery = req.body.prompt;\n+ // Enforced Active PosturePilot Guard and Masking Layer\n+ const sanitizedQuery = posturePilotGuard.sanitizePrompt(userQuery);\n+ const fullPrompt = \`You are a helpful assistant. User query: \${sanitizedQuery}\`;\nconst response = await openai.createChatCompletion({ prompt: fullPrompt });`,
      impact: 12,
      targetRuleId: 'injection'
    }
  ]);
  const [selectedVulnId, setSelectedVulnId] = useState('vuln1');
  const [isPatching, setIsPatching] = useState(false);

  const openToolModal = (toolName: string, tab: 'assessment' | 'users' = 'assessment') => {
    setSelectedTool(toolName);
    setModalTab(tab);
  };

  useEffect(() => {
    fetch('/api/findings/ai-risk').then(r => r.json())
      .then(d => { if (d.hasLiveData) setLive(d); }).catch(() => {});
  }, []);

  // Dynamic SOC telemetry feed ticking timestamps up dynamically!
  useEffect(() => {
    const users = ['Cloud Dev', 'ML Architect', 'Marketing Spec', 'Sales Exec', 'Customer Support', 'Legal Associate', 'Data Scientist'];
    const tools = ['Self-Hosted LLaMA-3 (AWS)', 'Azure OpenAI Sandbox', 'ChatGPT (Personal)', 'Claude.ai (Free)', 'Perplexity AI', 'Midjourney', 'DeepSeek'];
    const leaks = ['AWS IAM Admin Credentials', 'Pinecone Vector DB API Key', 'Confidential Training Dataset', 'Customer Contact List', 'Unreleased PR Draft', 'Internal API Endpoint', 'Source Code Snippet'];
    const sevs = ['High', 'Critical', 'Medium', 'Low'];
    const sevColors: Record<string, string> = { Critical: '#dc2626', High: '#ea580c', Medium: '#d97706', Low: '#16a34a' };

    const timer = setInterval(() => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomTool = tools[Math.floor(Math.random() * tools.length)];
      const randomLeak = leaks[Math.floor(Math.random() * leaks.length)];
      const randomSev = sevs[Math.floor(Math.random() * sevs.length)];

      setDlpLogs(prev => [
        { time: 'Just now', user: randomUser, tool: randomTool, leak: randomLeak, severity: randomSev, color: sevColors[randomSev] },
        ...prev.map(log => {
          if (log.time === 'Just now') return { ...log, time: '1 min ago' };
          if (log.time.includes('min ago')) {
            const mins = parseInt(log.time) + 1;
            return { ...log, time: `${mins} min ago` };
          }
          return log;
        }).slice(0, 13)
      ]);
    }, 9000);

    return () => clearInterval(timer);
  }, []);

  // Toggling rules
  const toggleRule = (id: string) => {
    setFirewallRules(prev =>
      prev.map(rule => rule.id === id ? { ...rule, active: !rule.active } : rule)
    );
  };

  // Masking slider effect
  useEffect(() => {
    if (maskingSensitivity === 'Strict') {
      setFirewallRules(prev =>
        prev.map(r => r.id === 'pii' || r.id === 'dlp' ? { ...r, active: true } : r)
      );
    } else if (maskingSensitivity === 'Medium') {
      setFirewallRules(prev =>
        prev.map(r => r.id === 'pii' ? { ...r, active: true } : r)
      );
    }
  }, [maskingSensitivity]);

  // RED-TEAMING TRIGGER SIMULATION
  const startRedTeamScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);
    setScanLogs(['[INIT] Spawning adversarial simulation sub-agents...', '[TARGET] Probing endpoint models...']);

    const steps = [
      { progress: 15, log: '[SCANNING] Testing model susceptibility to Direct Prompt Injections (OWASP LLM01)...' },
      { progress: 35, log: '[SCANNING] Running payload validation against jailbreak sequences...' },
      { progress: 55, log: '[ANALYSIS] Probing context extraction endpoints for credential disclosure (API keys)...' },
      { progress: 75, log: '[WARNING] Alert: Successfully bypassed local model filters using character roleplay injection!' },
      { progress: 90, log: '[SCANNING] Checking data exfiltration vulnerability on vector database connectors...' },
      { progress: 100, log: '[COMPLETE] Algorithmic red-team sweep finished. Safety vulnerabilities identified.' }
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];
        setScanProgress(step.progress);
        setScanLogs(prev => [...prev, step.log]);
        currentStepIndex++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        setScanResult({
          score: selectedScanModel.includes('LLaMA-3') ? 86 : 48,
          rating: selectedScanModel.includes('LLaMA-3') ? 'Critical' : 'Medium',
          recommendations: selectedScanModel.includes('LLaMA-3') 
            ? ['Enforce Prompt Injection Guard immediately', 'Link node behind secure proxy', 'Restrict system prompt alteration']
            : ['Apply credentials check rules', 'Rotate vector DB credentials']
        });
      }
    }, 900);
  };

  // Deploying Code Auto-Patch
  const deployCodePatch = (vulnId: string) => {
    if (isPatching) return;
    setIsPatching(true);
    setTimeout(() => {
      setVulnerabilities(prev =>
        prev.map(v => v.id === vulnId ? { ...v, patched: true } : v)
      );
      const targetVuln = vulnerabilities.find(v => v.id === vulnId);
      if (targetVuln) {
        // Auto-enable corresponding firewall rule!
        setFirewallRules(prev =>
          prev.map(r => r.id === targetVuln.targetRuleId ? { ...r, active: true } : r)
        );
      }
      setIsPatching(false);
    }, 1500);
  };

  // DYNAMIC RISK SCORE
  const baseRiskScore = 94;
  const rulesDeduction = firewallRules.reduce((acc, r) => acc + (r.active ? r.impact : 0), 0);
  const patchedDeduction = vulnerabilities.reduce((acc, v) => acc + (v.patched ? v.impact : 0), 0);
  const sliderDeduction = maskingSensitivity === 'Strict' ? 10 : maskingSensitivity === 'Medium' ? 5 : 0;
  const scanPenalty = scanResult && scanResult.score > 70 && !firewallRules.find(r => r.id === 'injection')?.active ? 8 : 0;

  const currentRiskScore = Math.max(10, baseRiskScore - rulesDeduction - patchedDeduction - sliderDeduction + scanPenalty);
  const riskLevel = currentRiskScore > 65 ? 'Critical' : currentRiskScore > 45 ? 'High' : currentRiskScore > 25 ? 'Medium' : 'Low';
  const riskColor = currentRiskScore > 65 ? '#dc2626' : currentRiskScore > 45 ? '#ea580c' : currentRiskScore > 25 ? '#d97706' : '#16a34a';

  return (
    <>
      <div className="page-content animate-in">

        {/* Dynamic Telemetry Live Banner */}
        <div className="sticky-alert-banner">
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', boxShadow: '0 0 8px #7c3aed' }} />
            <div>
              <div style={{ fontWeight:800, color:'#6d28d9', fontSize:'0.9rem' }}>
                AI Policy Command Active — Global AISPM firewall defending prompts & cloud endpoints dynamically
              </div>
              <div style={{ fontSize:'0.75rem', color:'#7c3aed', fontWeight: 600 }}>
                Active Rules: {firewallRules.filter(r => r.active).length} of {firewallRules.length} · Patched Code Assets: {vulnerabilities.filter(v => v.patched).length} of {vulnerabilities.length} · Live Risk Score: {currentRiskScore}/100
              </div>
            </div>
          </div>
          <Link href="/dashboard/findings" style={{ fontSize:'0.78rem', fontWeight:700, color:'#7c3aed', textDecoration:'none', border:'1px solid #c084fc', padding:'0.375rem 0.875rem', borderRadius:8, background: 'rgba(255, 255, 255, 0.4)' }}>
            View AI Findings →
          </Link>
        </div>

        {/* Dynamic Stats Row */}
        <div className="grid-4">
          {[
            { label:'AI Risk Score',       value: `${currentRiskScore}/100`,   accent: riskColor, delta: 'Calculated dynamically' },
            { label:'Approved AI Tools',   value: String(aiRiskData.approvedAiTools), accent: '#3b82f6', delta: 'Corporate approved' },
            { label:'Shadow AI Detected',   value: String(shadowAiTools.length), accent: '#dc2626', delta: 'Unauthorized & Cloud assets' },
            { label:'Current Risk Level',  value: riskLevel,                   accent: riskColor, delta: 'Dynamic posture status' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card-accent" style={{ background: s.accent }} />
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.accent }}>{s.value}</div>
              <div className="stat-delta delta-down">{s.delta}</div>
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* NEW ONBOARDING LIFECYCLE, PROTECTION CONNECTOR & SCANNING CENTER */}
        {/* ========================================================================= */}
        <div className="card" style={{ marginBottom: '1.25rem', padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>⚙️ AI Security Control Center & Threat Lifecycle</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>Interactive setup connection guides and automated AI red-teaming sweeps.</p>
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '3px 10px', borderRadius: 20, background: '#ede9fe', color: '#7c3aed', border: '1px solid #ddd6fe' }}>
              POSTUREPILOT ENTERPRISE AI SHIELD
            </span>
          </div>

          {/* 4 Onboarding Banner Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {[
              { id: 'discover', title: 'Discover AI Assets', desc: 'Scan environment via Multicloud', icon: '🔍', completed: isAppAdded || cloudConnected },
              { id: 'scan', title: 'Scan AI Assets', desc: 'Run algorithmic red-teaming', icon: '🎯', completed: !!scanResult },
              { id: 'secure', title: 'Secure Prompts & Gateway', desc: 'Configure inline threat firewall', icon: '🛡️', completed: firewallRules.filter(r => r.active).length >= 4 },
              { id: 'prevent', title: 'Prevent Unauthorized Use', desc: 'Audit shadow AI registry logs', icon: '🚫', completed: shadowAiTools.filter(t => t.policyStatus === 'Blocked').length > 0 }
            ].map(step => (
              <div
                key={step.id}
                onClick={() => setOnboardingStep(step.id as any)}
                style={{
                  background: onboardingStep === step.id ? 'linear-gradient(135deg, #f5f3ff, #ede9fe)' : '#fff',
                  border: onboardingStep === step.id ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                  borderRadius: 12, padding: '0.85rem 1rem', cursor: 'pointer', position: 'relative',
                  transition: 'all 0.2s', boxShadow: onboardingStep === step.id ? '0 4px 12px rgba(124, 58, 237, 0.12)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                  <span style={{ fontSize: '1.2rem' }}>{step.icon}</span>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>{step.title}</span>
                  {step.completed && (
                    <span style={{ marginLeft: 'auto', background: '#dcfce7', color: '#15803d', fontSize: '0.6rem', fontWeight: 800, padding: '1px 6px', borderRadius: 10 }}>
                      ✓ Done
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.3 }}>{step.desc}</div>
              </div>
            ))}
          </div>

          {/* DYNAMIC TAB SUBPANELS */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem' }}>
            
            {/* TAB 1: DISCOVER AI ASSETS */}
            {onboardingStep === 'discover' && (
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Select Ingestion Connection Route:</h4>
                
                {/* 3 Protection Connection Card Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                  {[
                    { id: 'api', title: 'API Connection', desc: 'Secure custom models via developer SDK proxy routes', badge: 'Active' },
                    { id: 'gateway', title: 'Gateway Connection', desc: 'Secure endpoints by routing prompts via local gateway', badge: gatewayStatus === 'CONNECTED' ? 'Active' : 'Deployable' },
                    { id: 'multicloud', title: 'Multicloud Integration', desc: 'Inline protection inside AWS, GCP, Azure, or Oracle configurations', badge: cloudConnected ? 'Synced' : 'Inactive' }
                  ].map(mode => (
                    <div
                      key={mode.id}
                      onClick={() => setProtectionMode(mode.id as any)}
                      style={{
                        background: '#fff', border: protectionMode === mode.id ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                        borderRadius: 10, padding: '0.85rem 1rem', cursor: 'pointer', transition: 'all 0.2s',
                        boxShadow: protectionMode === mode.id ? '0 4px 10px rgba(59, 130, 246, 0.1)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>{mode.title}</span>
                        <span style={{
                          fontSize: '0.58rem', fontWeight: 800, padding: '1px 6px', borderRadius: 8,
                          background: mode.badge.includes('Active') || mode.badge.includes('Synced') ? '#dcfce7' : '#f1f5f9',
                          color: mode.badge.includes('Active') || mode.badge.includes('Synced') ? '#15803d' : '#64748b'
                        }}>{mode.badge}</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.35 }}>{mode.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Connection Dynamic Details & Form */}
                <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 8, padding: '1rem' }}>
                  {protectionMode === 'api' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: 1, minWidth: 280 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', marginBottom: 2 }}>Register Model via API:</div>
                        <p style={{ fontSize: '0.74rem', color: '#64748b' }}>Connect internal backend applications using PosturePilot secure endpoints.</p>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 8 }}>
                          <input
                            type="text"
                            value={appUrl}
                            onChange={(e) => setAppUrl(e.target.value)}
                            disabled={isAppAdded}
                            style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.76rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'monospace' }}
                          />
                          <button
                            onClick={() => {
                              setIsAppAdded(true);
                              alert('Application API Endpoint successfully registered and registered in Active Posture Monitoring list!');
                            }}
                            disabled={isAppAdded}
                            style={{
                              background: isAppAdded ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                              color: '#fff', fontWeight: 700, fontSize: '0.75rem', padding: '0.4rem 1rem', border: 'none', borderRadius: 6, cursor: isAppAdded ? 'default' : 'pointer'
                            }}
                          >
                            {isAppAdded ? '✓ Registered' : 'Add Application'}
                          </button>
                        </div>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: 6, border: '1px solid #e2e8f0', minWidth: 200 }}>
                        <div style={{ fontSize: '0.58rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>API Status</div>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: isAppAdded ? '#16a34a' : '#ea580c', marginTop: 2 }}>
                          {isAppAdded ? '● ONLINE (PROXIED)' : '○ AWAITING INTEGRATION'}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: 4 }}>Secured: PII, Credentials, & Injections</div>
                      </div>
                    </div>
                  )}

                  {protectionMode === 'gateway' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: 1, minWidth: 280 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', marginBottom: 2 }}>Deploy PosturePilot Proxy Gateway:</div>
                        <p style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: 8 }}>Route corporate network DNS entries through our secure inspection proxies.</p>
                        <code style={{ display: 'block', padding: '0.5rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.68rem', color: '#334155', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                          docker run -d -p 8443:8443 posturepilot/gateway --proxy-pass=https://api.openai.com
                        </code>
                        <button
                          onClick={() => {
                            setGatewayStatus('CONNECTING');
                            setTimeout(() => {
                              setGatewayStatus('CONNECTED');
                              alert('Secure Proxy Gateway deployed on Port 8443. Prompt validation proxy is active!');
                            }, 1200);
                          }}
                          disabled={gatewayStatus !== 'DISCONNECTED'}
                          style={{
                            background: gatewayStatus === 'CONNECTED' ? '#16a34a' : gatewayStatus === 'CONNECTING' ? '#d97706' : '#0f172a',
                            color: '#fff', fontWeight: 700, fontSize: '0.75rem', padding: '0.45rem 1rem', border: 'none', borderRadius: 6, cursor: 'pointer', marginTop: 8
                          }}
                        >
                          {gatewayStatus === 'CONNECTED' ? '✓ Gateway Connected' : gatewayStatus === 'CONNECTING' ? 'Connecting Gateway...' : 'Deploy Proxy Gateway'}
                        </button>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: 6, border: '1px solid #e2e8f0', minWidth: 200 }}>
                        <div style={{ fontSize: '0.58rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Gateway Status</div>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: gatewayStatus === 'CONNECTED' ? '#16a34a' : gatewayStatus === 'CONNECTING' ? '#d97706' : '#dc2626', marginTop: 2 }}>
                          {gatewayStatus === 'CONNECTED' ? '● RUNNING' : gatewayStatus === 'CONNECTING' ? '● INITIALIZING...' : '○ INACTIVE'}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: 4 }}>
                          {gatewayStatus === 'CONNECTED' ? 'Inspecting: 23 req/sec' : 'DNS routing unresolved'}
                        </div>
                      </div>
                    </div>
                  )}

                  {protectionMode === 'multicloud' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: 1, minWidth: 280 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', marginBottom: 2 }}>Integrate Multicloud Defense Policy:</div>
                        <p style={{ fontSize: '0.74rem', color: '#64748b' }}>Discovers and locks unmanaged models hosted on AWS S3, GCP VMs, Azure Blobs, or Oracle Cloud (OCI) servers.</p>
                        <button
                          onClick={() => {
                            setSyncingCloud(true);
                            setTimeout(() => {
                              setCloudConnected(true);
                              setSyncingCloud(false);
                              alert('Cloud Discovery completed. Found 2 unmanaged model hosts in AWS IAM (Self-Hosted LLaMA-3). Connected to registry.');
                            }, 1500);
                          }}
                          disabled={cloudConnected || syncingCloud}
                          style={{
                            background: cloudConnected ? '#16a34a' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                            color: '#fff', fontWeight: 700, fontSize: '0.75rem', padding: '0.45rem 1rem', border: 'none', borderRadius: 6, cursor: 'pointer', marginTop: 8
                          }}
                        >
                          {cloudConnected ? '✓ Cloud Synced' : syncingCloud ? 'Scanning Cloud Clusters...' : 'Sync Cloud Models'}
                        </button>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: 6, border: '1px solid #e2e8f0', minWidth: 200 }}>
                        <div style={{ fontSize: '0.58rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Multicloud Status</div>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: cloudConnected ? '#16a34a' : syncingCloud ? '#d97706' : '#64748b', marginTop: 2 }}>
                          {cloudConnected ? '● SYNCED (AWS, GCP, AZURE, ORACLE)' : syncingCloud ? '● SCANNING...' : '○ OFFLINE'}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: 4 }}>
                          {cloudConnected ? '2 assets auto-discovered' : 'Awaiting IAM API connection'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SCAN AI ASSETS (ALGORITHMIC RED-TEAMING SCANNER) */}
            {onboardingStep === 'scan' && (
              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.25rem' }}>
                
                {/* Configuration side */}
                <div style={{ background: '#fff', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>🎯 Algorithmic Red-Teaming Scanner</div>
                  <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }}>TARGET MODEL ASSET</label>
                    <select
                      value={selectedScanModel}
                      onChange={(e) => setSelectedScanModel(e.target.value)}
                      disabled={isScanning}
                      style={{ width: '100%', padding: '0.4rem', fontSize: '0.78rem', border: '1px solid #cbd5e1', borderRadius: 6 }}
                    >
                      <option>Self-Hosted LLaMA-3 (AWS)</option>
                      <option>Azure OpenAI Sandbox</option>
                      <option>ChatGPT (Personal)</option>
                    </select>
                  </div>

                  <button
                    onClick={startRedTeamScan}
                    disabled={isScanning}
                    style={{
                      background: isScanning ? '#cbd5e1' : 'linear-gradient(135deg, #dc2626, #b91c1c)',
                      color: isScanning ? '#64748b' : '#fff', border: 'none', padding: '0.6rem',
                      borderRadius: 6, fontWeight: 800, fontSize: '0.78rem', cursor: isScanning ? 'default' : 'pointer',
                      boxShadow: isScanning ? 'none' : '0 4px 12px rgba(220, 38, 38, 0.2)', textTransform: 'uppercase', letterSpacing: '0.04em'
                    }}
                  >
                    {isScanning ? '🔍 Red-Teaming Sweeper...' : 'Run Red-Teaming Scan ⚡'}
                  </button>

                  {/* Scan results */}
                  {scanResult && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.75rem', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#dc2626' }}>Scan Report Complete:</span>
                        <span style={{ fontSize: '0.58rem', fontWeight: 800, background: '#fee2e2', color: '#dc2626', padding: '1px 6px', borderRadius: 4 }}>
                          {scanResult.rating} Risk
                        </span>
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#dc2626', marginBottom: 6 }}>
                        {scanResult.score}/100 <span style={{ fontSize: '0.68rem', fontWeight: 400, color: '#475569' }}>vulnerability rating</span>
                      </div>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>RECOMMENDED REMEDIATIONS:</div>
                      {scanResult.recommendations.map((rec, i) => (
                        <div key={i} style={{ fontSize: '0.65rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '3px', marginTop: 2 }}>
                          <span>⚠</span> <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setOnboardingStep('secure')}>{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Live Output Terminal side */}
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '1rem', display: 'flex', flexDirection: 'column', height: '280px', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308' }} />
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                    </div>
                    <span style={{ fontSize: '0.58rem', fontFamily: 'monospace', color: '#64748b' }}>redteam_sweeper@posturepilot: ~</span>
                  </div>

                  {/* Progress Indicator */}
                  {isScanning && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#38bdf8', fontFamily: 'monospace', marginBottom: 2 }}>
                        <span>SWEEP PROGRESS:</span>
                        <span>{scanProgress}%</span>
                      </div>
                      <div style={{ height: 4, background: '#1e293b', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${scanProgress}%`, background: '#38bdf8', transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  )}

                  {/* Log console */}
                  <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.7rem', color: '#34d399', display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 4 }}>
                    {scanLogs.length === 0 ? (
                      <div style={{ color: '#64748b', fontStyle: 'italic', margin: 'auto', textAlign: 'center' }}>
                        Awaiting Red-Teaming execution trigger...<br/>Select a target application to sweep for vulnerability leaks.
                      </div>
                    ) : (
                      scanLogs.map((log, i) => (
                        <div key={i} style={{ color: log.includes('WARNING') ? '#fbbf24' : log.includes('COMPLETE') ? '#38bdf8' : '#34d399', whiteSpace: 'pre-wrap' }}>
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SECURE PROMPTS & INLINE PROTECTION (THREAT PATH & SLIDERS) */}
            {onboardingStep === 'secure' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>
                
                {/* Visualizer Column */}
                <div style={{ background: '#fff', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0f172a' }}>🛣️ Active Traffic Threat Path Visualizer</span>
                    <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block', boxShadow: '0 0 6px #16a34a' }} />
                      ACTIVE POSTURE MAP
                    </span>
                  </div>

                  {/* CSS Flowchart Node Map */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', justifyContent: 'space-between', position: 'relative', padding: '1rem 0' }}>
                    
                    {/* User Node */}
                    <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0.5rem', textAlign: 'center', zIndex: 2 }}>
                      <span style={{ fontSize: '1.5rem', display: 'block' }}>👤</span>
                      <span style={{ fontWeight: 800, fontSize: '0.72rem', color: '#1e293b' }}>User Prompt</span>
                    </div>

                    {/* Pathway 1 */}
                    <div style={{ flex: 1, height: 2, background: firewallRules.find(r => r.id === 'pii')?.active ? '#22c55e' : '#cbd5e1', position: 'relative' }}>
                      <div className="pulsing-glow" style={{
                        position: 'absolute', width: 8, height: 8, borderRadius: '50%',
                        background: firewallRules.find(r => r.id === 'pii')?.active ? '#22c55e' : '#ea580c',
                        left: '50%', top: -3, boxShadow: '0 0 8px currentColor'
                      }} />
                    </div>

                    {/* Gateway Proxy Node */}
                    <div style={{
                      flex: 1.2, background: firewallRules.find(r => r.id === 'pii')?.active ? '#f0fdf4' : '#fee2e2',
                      border: `1.5px solid ${firewallRules.find(r => r.id === 'pii')?.active ? '#22c55e' : '#fca5a5'}`,
                      borderRadius: 8, padding: '0.5rem', textAlign: 'center', zIndex: 2
                    }}>
                      <span style={{ fontSize: '1.5rem', display: 'block' }}>🛡️</span>
                      <span style={{ fontWeight: 800, fontSize: '0.72rem', color: '#0f172a' }}>Security Gateway</span>
                      <div style={{ fontSize: '0.55rem', fontWeight: 800, color: firewallRules.find(r => r.id === 'pii')?.active ? '#16a34a' : '#dc2626' }}>
                        {firewallRules.find(r => r.id === 'pii')?.active ? 'SECURED (ACTIVE)' : 'VULNERABLE'}
                      </div>
                    </div>

                    {/* Pathway 2 */}
                    <div style={{ flex: 1, height: 2, background: firewallRules.find(r => r.id === 'injection')?.active ? '#22c55e' : '#cbd5e1', position: 'relative' }}>
                      <div className="pulsing-glow" style={{
                        position: 'absolute', width: 8, height: 8, borderRadius: '50%',
                        background: firewallRules.find(r => r.id === 'injection')?.active ? '#22c55e' : '#ea580c',
                        left: '50%', top: -3, boxShadow: '0 0 8px currentColor'
                      }} />
                    </div>

                    {/* Model Endpoint */}
                    <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0.5rem', textAlign: 'center', zIndex: 2 }}>
                      <span style={{ fontSize: '1.5rem', display: 'block' }}>🤖</span>
                      <span style={{ fontWeight: 800, fontSize: '0.72rem', color: '#1e293b' }}>LLM Endpoint</span>
                      <div style={{ fontSize: '0.52rem', color: '#64748b' }}>LLaMA-3 / OpenAI</div>
                    </div>

                  </div>
                </div>

                {/* Config & Masking Sensitivity Sliders Column */}
                <div style={{ background: '#fff', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>🎚️ Prompt Masking Sensitivity</div>
                  <p style={{ fontSize: '0.74rem', color: '#64748b' }}>Slide to adjust the scrubbing severity applied to outgoing prompts.</p>
                  
                  {/* Slider controls */}
                  <div style={{ padding: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      value={maskingSensitivity === 'Low' ? 1 : maskingSensitivity === 'Medium' ? 2 : 3}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setMaskingSensitivity(val === 1 ? 'Low' : val === 2 ? 'Medium' : 'Strict');
                      }}
                      style={{ width: '100%', cursor: 'pointer', accentColor: '#7c3aed' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 800, color: '#475569' }}>
                      <span style={{ color: maskingSensitivity === 'Low' ? '#7c3aed' : '#64748b' }}>LOW</span>
                      <span style={{ color: maskingSensitivity === 'Medium' ? '#7c3aed' : '#64748b' }}>MEDIUM</span>
                      <span style={{ color: maskingSensitivity === 'Strict' ? '#7c3aed' : '#64748b' }}>STRICT</span>
                    </div>
                  </div>

                  {/* Masking Preview */}
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '0.65rem' }}>
                    <div style={{ fontSize: '0.58rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>Active Prompt Masking Preview</div>
                    <div style={{ fontSize: '0.74rem', color: '#1e293b', fontStyle: 'italic', fontFamily: 'monospace' }}>
                      {maskingSensitivity === 'Low' && 'Send summary for Guruji (API Key: pc_api_key_8ab12f)'}
                      {maskingSensitivity === 'Medium' && 'Send summary for [REDACTED GURUJI] (API Key: pc_api_key_8ab12f)'}
                      {maskingSensitivity === 'Strict' && 'Send summary for [ANONYMIZED_USER] (API Key: [MASKED_CREDENTIAL])'}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: PREVENT UNAUTHORIZED USE */}
            {onboardingStep === 'prevent' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#fff', border: '1px solid #cbd5e1', padding: '1rem', borderRadius: 8 }}>
                <span style={{ fontSize: '2.5rem' }}>🚫</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', marginBottom: 2 }}>Block and Restrict Rogue AI Applications</div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 8 }}>
                    Shadow AI nodes and public portals can be automatically banned inside your company proxy. Scroll down to review the discovered items.
                  </p>
                  <button
                    onClick={() => {
                      setShadowAiTools(prev =>
                        prev.map(t => ({ ...t, policyStatus: 'Blocked' }))
                      );
                      alert('Global Block Policy enforced. All unauthorized AI apps successfully routed to company block page!');
                    }}
                    style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: '#fff', border: 'none', padding: '0.45rem 1.1rem', borderRadius: 6, fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Block All Rogue Shadow AI Assets in One-Click
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ========================================================================= */}
        {/* EXISTING CARD STRUCTURE: ACTIVE FIREWALL & DLP TELEMETRY ALERTS (450px) */}
        {/* ========================================================================= */}
        <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
          
          {/* LEFT: AI POLICY FIREWALL CARD */}
          <div className="card" style={{ height: '450px', display: 'flex', flexDirection: 'column' }}>
            <div className="card-title">🛡️ Active AI Policy Firewall</div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.875rem', lineHeight: 1.5 }}>
              Enable safety safeguards to intercept prompts, block rogue credentials, and dynamically protect your organizational data flows.
            </p>
            <div style={{ flex: 1, display:'flex', flexDirection:'column', gap:'0.45rem' }}>
              {firewallRules.map(rule => (
                <div key={rule.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, padding:'0.45rem 0.75rem', transition:'all 0.2s' }}>
                  <div style={{ flex:1, paddingRight:'0.75rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                      <span style={{ fontWeight:700, fontSize:'0.82rem', color:'#0f172a' }}>{rule.label}</span>
                      <span style={{ fontSize: '0.58rem', fontWeight: 800, padding: '1px 5px', borderRadius: 20, background: rule.active ? '#e0e7ff':'#f1f5f9', color: rule.active ? '#4f46e5':'#64748b' }}>
                        {rule.active ? `Active` : 'Inactive'}
                      </span>
                    </div>
                    <div style={{ fontSize:'0.7rem', color:'#64748b', marginTop:'2px' }}>{rule.desc}</div>
                  </div>
                  {/* Custom Switch Toggle */}
                  <label style={{ position:'relative', display:'inline-block', width:36, height:20, cursor:'pointer', flexShrink:0 }}>
                    <input 
                      type="checkbox" 
                      checked={rule.active} 
                      onChange={() => toggleRule(rule.id)}
                      style={{ opacity:0, width:0, height:0 }} 
                    />
                    <span style={{
                      position:'absolute', top:0, left:0, right:0, bottom:0,
                      backgroundColor: rule.active ? '#4f46e5' : '#cbd5e1',
                      borderRadius:20, transition:'0.3s',
                      boxShadow: rule.active ? '0 0 8px rgba(79,70,229,0.3)' : 'none'
                    }} />
                    <span style={{
                      position:'absolute', left:2, bottom:2, width:16, height:16,
                      backgroundColor:'#fff', borderRadius:'50%', transition:'0.3s',
                      transform: rule.active ? 'translateX(16px)' : 'none'
                    }} />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: REAL-TIME DLP TELEMETRY ALERTS (Symmetrical 450px height) */}
          <div className="card" style={{ height: '450px', display: 'flex', flexDirection: 'column' }}>
            <div className="card-title">🚨 Real-time Data Leak Feed (DLP)</div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.875rem', lineHeight: 1.5 }}>
              Active telemetry showing prompt violations, exposed source code, or unauthorized API tokens. Scroll down to view log history.
            </p>
            <div className="dlp-scroll-container" style={{ flex:1, display:'flex', flexDirection:'column', gap:'0.6rem', overflowY:'auto', paddingRight:'4px' }}>
              {dlpLogs.map((log, idx) => (
                <div key={idx} className="animate-in" style={{ display:'grid', gridTemplateColumns:'80px 1fr 90px', gap:'0.75rem', alignItems:'center', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:8, padding:'0.6rem 0.875rem' }}>
                  <div style={{ fontSize:'0.65rem', color:'#94a3b8', fontWeight:600 }}>{log.time}</div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:'0.78rem', fontWeight:700, color:'#0f172a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{log.leak}</div>
                    <div style={{ fontSize:'0.65rem', color:'#64748b' }}>User: {log.user} · {log.tool}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <span className="badge" style={{ background: `${log.color}12`, color: log.color, borderColor: `${log.color}30`, fontSize:'0.62rem', fontWeight:800, padding:'2px 8px' }}>
                      {log.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NEW CORGEA AI CODE SECURITY & GIT AUTO-PATCHING ENGINE */}
        {/* ========================================================================= */}
        <div className="card" style={{ marginBottom: '1.25rem', padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16 }}>
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>⚡ Automated AI Code Security & Single-Click Auto-Patching</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>Scan development code repositories and auto-deploy git patches instantly to secure leaks.</p>
            </div>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}>
              REMEDIATION ENGINE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
            
            {/* Vulnerability list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {vulnerabilities.map(v => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVulnId(v.id)}
                  style={{
                    padding: '0.75rem 1rem', background: selectedVulnId === v.id ? '#f5f3ff' : '#f8fafc',
                    border: selectedVulnId === v.id ? '2.5px solid #7c3aed' : '1px solid #e2e8f0',
                    borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.58rem', fontWeight: 800, fontFamily: 'monospace', color: '#7c3aed', background: '#ede9fe', padding: '1px 5px', borderRadius: 4 }}>{v.file}</span>
                    <span style={{
                      fontSize: '0.58rem', fontWeight: 800, padding: '1px 6px', borderRadius: 4,
                      background: v.patched ? '#dcfce7' : v.severity === 'Critical' ? '#fee2e2' : '#ffedd5',
                      color: v.patched ? '#15803d' : v.severity === 'Critical' ? '#dc2626' : '#ea580c'
                    }}>{v.patched ? 'Patched' : v.severity}</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0f172a', lineHeight: 1.3 }}>{v.title}</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 4 }}>Impact reduction: -{v.impact} Risk Score</div>
                </div>
              ))}
            </div>

            {/* Side-by-side Git Code Diff Viewer */}
            {(() => {
              const vuln = vulnerabilities.find(v => v.id === selectedVulnId);
              if (!vuln) return null;

              return (
                <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #cbd5e1', borderRadius: 8, overflow: 'hidden' }}>
                  
                  {/* File status bar */}
                  <div style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#334155', fontWeight: 700 }}>git diff HEAD -- {vuln.file}</span>
                    <button
                      onClick={() => deployCodePatch(vuln.id)}
                      disabled={vuln.patched || isPatching}
                      style={{
                        background: vuln.patched ? '#16a34a' : isPatching ? '#d97706' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                        color: '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 800, padding: '0.35rem 0.85rem',
                        borderRadius: 6, cursor: vuln.patched || isPatching ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      {vuln.patched ? '✓ Patched & Safe' : isPatching ? 'Applying Patch...' : 'Deploy Auto-Patch ⚡'}
                    </button>
                  </div>

                  {/* Terminal diff display */}
                  <div style={{ background: '#0f172a', padding: '1rem', fontFamily: 'monospace', fontSize: '0.72rem', overflowX: 'auto', flex: 1, minHeight: '140px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {vuln.patched ? (
                      vuln.codeAfter.split('\n').map((line, i) => (
                        <div key={i} style={{ color: line.startsWith('+') ? '#4ade80' : '#94a3b8', background: line.startsWith('+') ? 'rgba(74, 222, 128, 0.08)' : 'transparent', padding: '2px 4px' }}>
                          {line}
                        </div>
                      ))
                    ) : (
                      vuln.codeBefore.split('\n').map((line, i) => (
                        <div key={i} style={{ color: line.startsWith('-') ? '#f87171' : '#94a3b8', background: line.startsWith('-') ? 'rgba(248, 113, 113, 0.08)' : 'transparent', padding: '2px 4px' }}>
                          {line}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })()}

          </div>
        </div>

        {/* ========================================================================= */}
        {/* OWASP, MITRE ATLAS & COMPLIANCE SECTION */}
        {/* ========================================================================= */}
        <div className="grid-3" style={{ marginBottom: '1.25rem' }}>
          
          {/* OWASP Coverage */}
          <div className="card">
            <div className="card-title">📊 OWASP Top 10 for LLMs Matrix</div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Vulnerability classifications matched directly against the industry-recognized security standard for LLM applications.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {aiRiskData.owaspLlmCoverage.slice(0, 5).map(c => {
                const colors: Record<string, string> = { critical: '#dc2626', high: '#ea580c', medium: '#d97706', low: '#16a34a' };
                const isInjectionActive = c.id === 'LLM01' && firewallRules.find(r => r.id === 'injection')?.active;
                const statusStr = c.id === 'LLM01' && isInjectionActive ? 'Implemented' : c.status;
                const coveragePct = statusStr === 'Implemented' ? 100 : statusStr === 'Partial' ? 50 : 15;
                const statusColor = statusStr === 'Implemented' ? '#16a34a' : statusStr === 'Partial' ? '#d97706' : '#dc2626';
                return (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight:800, fontFamily:'monospace', color: '#4f46e5', background: '#ede9fe', padding: '2px 6px', borderRadius: 4, width:52, textAlign:'center' }}>{c.id}</span>
                    <div style={{ flex: 1, minWidth:0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 600, color: '#0f172a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.name}</span>
                        <span style={{ fontWeight: 700, color: statusColor, fontSize:'0.72rem' }}>{statusStr}</span>
                      </div>
                      <div className="progress-bar-wrap" style={{ height: 6 }}>
                        <div className="progress-bar-fill" style={{ width: `${coveragePct}%`, background: statusColor }} />
                      </div>
                    </div>
                    <span className="badge" style={{ fontSize:'0.6rem', fontWeight:800, padding:'2px 6px', background: `${colors[c.risk]}12`, color: colors[c.risk], border: `1px solid ${colors[c.risk]}30` }}>
                      {c.risk}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MITRE ATLAS Threat Matrix */}
          <div className="card">
            <div className="card-title">🎯 MITRE ATLAS™ Threat Tactics</div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Adversarial machine learning threat techniques correlated against corporate active security defense rules.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {[
                { id: 'AML.T0016', name: 'LLM Prompt Injection', status: firewallRules.find(r => r.id === 'injection')?.active ? 'Implemented' : 'Partial', risk: 'critical', coverage: firewallRules.find(r => r.id === 'injection')?.active ? 100 : 50 },
                { id: 'AML.T0004', name: 'Model Data Leakage', status: firewallRules.find(r => r.id === 'dlp')?.active ? 'Implemented' : 'Partial', risk: 'high', coverage: firewallRules.find(r => r.id === 'dlp')?.active ? 100 : 50 },
                { id: 'AML.T0010', name: 'LLM Credential Theft', status: firewallRules.find(r => r.id === 'apikey')?.active ? 'Implemented' : 'Partial', risk: 'high', coverage: firewallRules.find(r => r.id === 'apikey')?.active ? 100 : 50 },
                { id: 'AML.T0015', name: 'Model Evasion Attack', status: 'Partial', risk: 'medium', coverage: 50 },
                { id: 'AML.T0000', name: 'ML Artifact Discovery', status: 'Partial', risk: 'low', coverage: 75 },
              ].map(c => {
                const colors: Record<string, string> = { critical: '#dc2626', high: '#ea580c', medium: '#d97706', low: '#16a34a' };
                const statusColor = c.status === 'Implemented' ? '#16a34a' : '#d97706';
                return (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight:800, fontFamily:'monospace', color: '#d946ef', background: '#fdf4ff', padding: '2px 6px', borderRadius: 4, width:82, textAlign:'center' }}>{c.id}</span>
                    <div style={{ flex: 1, minWidth:0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 600, color: '#0f172a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.name}</span>
                        <span style={{ fontWeight: 700, color: statusColor, fontSize:'0.72rem' }}>{c.status}</span>
                      </div>
                      <div className="progress-bar-wrap" style={{ height: 6 }}>
                        <div className="progress-bar-fill" style={{ width: `${c.coverage}%`, background: statusColor }} />
                      </div>
                    </div>
                    <span className="badge" style={{ fontSize:'0.6rem', fontWeight:800, padding:'2px 6px', background: `${colors[c.risk]}12`, color: colors[c.risk], border: `1px solid ${colors[c.risk]}30` }}>
                      {c.risk}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Compliance Benchmarks */}
          <div className="card" style={{ display:'flex', flexDirection:'column' }}>
            <div className="card-title">⚖️ Regulatory Compliance Benchmarks</div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Track organizational readiness against upcoming AI laws and standardized risk management frameworks.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem', flex:1, justifyContent:'center' }}>
              {aiRiskData.regulatoryCompliance.map(framework => {
                const statusColors: Record<string, string> = { 'At Risk': '#dc2626', 'In Progress': '#d97706', 'Compliant': '#16a34a' };
                // Dynamic coverage booster if all firewall rules are active!
                const activeCount = firewallRules.filter(r => r.active).length;
                const dynamicCoverage = Math.min(100, framework.coverage + (activeCount * 3));
                const dynamicStatus = dynamicCoverage >= 90 ? 'Compliant' : dynamicCoverage >= 70 ? 'In Progress' : 'At Risk';
                return (
                  <div key={framework.framework} style={{ padding: '0.65rem 0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>{framework.framework}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '1px 6px', borderRadius: 20, background: `${statusColors[dynamicStatus]}12`, color: statusColors[dynamicStatus], border: `1px solid ${statusColors[dynamicStatus]}30` }}>
                        {dynamicStatus}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom:'0.2rem' }}>
                      <div className="progress-bar-wrap" style={{ flex: 1, height: 6, marginTop:0 }}>
                        <div className="progress-bar-fill" style={{ width: `${dynamicCoverage}%`, background: statusColors[dynamicStatus] }} />
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '0.8rem', color: statusColors[dynamicStatus], width: 30, textAlign: 'right' }}>{dynamicCoverage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SHADOW AI TOOLS & MULTI-CLOUD REGISTRY INVENTORY */}
        <div className="card">
          <div className="card-title">🤖 Active Shadow AI Discovery & Registry</div>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
            List of detected public AI portals and services used by employees, cataloged automatically through secure proxy analytics.
          </p>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tool/Asset Name</th>
                <th>Category</th>
                <th>Exposed Users</th>
                <th>Risk Profile</th>
                <th>Policy Status</th>
              </tr>
            </thead>
            <tbody>
              {shadowAiTools.map(t => (
                <tr key={t.tool} className="shadow-ai-row" onClick={() => openToolModal(t.tool, 'assessment')} title="Click to view detailed security audit & policy recommendations">
                  <td style={{ fontWeight:600, color:'#4f46e5', textDecoration:'underline' }}>{t.tool}</td>
                  <td style={{ fontSize:'0.78rem' }}>{t.category}</td>
                  <td onClick={(e) => { e.stopPropagation(); openToolModal(t.tool, 'users'); }}>
                    <button className="exposed-users-btn" title="Click to view exposed user accounts">
                      <strong>{t.users}</strong> employees 👤
                    </button>
                  </td>
                  <td>
                    <span className={`badge badge-${t.dataShared === 'High' ? 'critical' : t.dataShared === 'Medium' ? 'medium' : 'low'}`}>
                      {t.dataShared} Exposure
                    </span>
                  </td>
                  <td>
                    <span className="badge" style={{
                      background: t.policyStatus === 'Blocked' ? '#fef2f2' : t.policyStatus === 'Allowed' ? '#f0fdf4' : '#fffbeb',
                      color: t.policyStatus === 'Blocked' ? '#dc2626' : t.policyStatus === 'Allowed' ? '#16a34a' : '#d97706',
                      border: `1px solid ${t.policyStatus === 'Blocked' ? '#fecaca' : t.policyStatus === 'Allowed' ? '#bbf7d0' : '#fde68a'}`,
                      fontSize:'0.68rem', fontWeight:800, padding:'2px 8px'
                    }}>
                      {t.policyStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Clickable Detail Modal Overlay */}
      {selectedTool && (() => {
        const tool = shadowAiTools.find(t => t.tool === selectedTool);
        const details = toolDetails[selectedTool];
        if (!tool || !details) return null;

        return (
          <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(15,23,42,0.4)', backdropFilter:'blur(4px)' }}
               onClick={() => setSelectedTool(null)}>
            <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:20, width:'95%', maxWidth:540, padding:'2rem', boxShadow:'0 24px 64px rgba(15,23,42,0.15)', display:'flex', flexDirection:'column', gap:'1.25rem', position:'relative' }}
                 onClick={e => e.stopPropagation()}>
              
              {/* Close Icon */}
              <button onClick={() => setSelectedTool(null)} style={{ position:'absolute', top:20, right:20, background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', color:'#94a3b8', fontWeight:700 }}>&times;</button>
              
              {/* Header */}
              <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', borderBottom:'1px solid #f1f5f9', paddingBottom:'1rem' }}>
                <div style={{ width:44, height:44, borderRadius:10, background:'#ede9fe', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem' }}>🤖</div>
                <div>
                  <h3 style={{ fontSize:'1.15rem', fontWeight:900, color:'#0f172a' }}>{tool.tool}</h3>
                  <span style={{ fontSize:'0.72rem', color:'#64748b', fontWeight:600 }}>Category: {tool.category}</span>
                </div>
                <span className={`badge badge-${tool.dataShared === 'High' ? 'critical' : tool.dataShared === 'Medium' ? 'medium' : 'low'}`} style={{ marginLeft:'auto', fontSize:'0.65rem' }}>
                  {tool.dataShared} Exposure
                </span>
              </div>

              {/* Premium Tabs */}
              <div style={{ display:'flex', borderBottom:'1px solid #e2e8f0', gap:'1.5rem', margin:'-0.5rem 0 0.5rem 0' }}>
                <button 
                  onClick={() => setModalTab('assessment')}
                  style={{
                    paddingBottom:'0.75rem',
                    background:'none', border:'none',
                    fontSize:'0.85rem', fontWeight:700,
                    color: modalTab === 'assessment' ? '#4f46e5' : '#64748b',
                    borderBottom: modalTab === 'assessment' ? '2px solid #4f46e5' : '2px solid transparent',
                    cursor:'pointer', transition:'all 0.2s'
                  }}
                >
                  🛡️ Threat Assessment
                </button>
                <button 
                  onClick={() => setModalTab('users')}
                  style={{
                    paddingBottom:'0.75rem',
                    background:'none', border:'none',
                    fontSize:'0.85rem', fontWeight:700,
                    color: modalTab === 'users' ? '#4f46e5' : '#64748b',
                    borderBottom: modalTab === 'users' ? '2px solid #4f46e5' : '2px solid transparent',
                    cursor:'pointer', transition:'all 0.2s'
                  }}
                >
                  👤 Flagged Accounts ({details.flaggedUsers.length})
                </button>
              </div>

              {modalTab === 'assessment' ? (
                <>
                  {/* Description */}
                  <div>
                    <div style={{ fontSize:'0.62rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Threat Intel & Assessment</div>
                    <p style={{ fontSize:'0.8rem', color:'#475569', lineHeight:1.55 }}>{details.desc}</p>
                  </div>

                  {/* MITRE ATLAS Techniques */}
                  <div>
                    <div style={{ fontSize:'0.62rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>Mapped MITRE ATLAS™ Threat Vectors</div>
                    <div style={{ display:'flex', gap:'0.375rem', flexWrap:'wrap' }}>
                      {details.mitreTechniques.map(tech => (
                        <span key={tech} style={{ fontSize:'0.68rem', fontWeight:700, background:'#fdf4ff', color:'#d946ef', border:'1px solid #f0abfc', padding:'2px 8px', borderRadius:20 }}>
                          🎯 {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Data Leaks */}
                  <div>
                    <div style={{ fontSize:'0.62rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>Data Leakage Vectors Flagged</div>
                    <div style={{ display:'flex', gap:'0.375rem', flexWrap:'wrap' }}>
                      {details.leakedDataTypes.map(dName => (
                        <span key={dName} style={{ fontSize:'0.68rem', fontWeight:700, background:'#fee2e2', color:'#dc2626', border:'1px solid #fca5a5', padding:'2px 8px', borderRadius:20 }}>
                          ⚠️ {dName}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Users by Dept */}
                  <div>
                    <div style={{ fontSize:'0.62rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>User Base by Department</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                      {details.departments.map(dept => (
                        <div key={dept.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'#f8fafc', padding:'0.45rem 0.75rem', borderRadius:8, border:'1px solid #e2e8f0' }}>
                          <span style={{ fontSize:'0.75rem', fontWeight:600, color:'#475569' }}>{dept.name}</span>
                          <span style={{ fontSize:'0.75rem', fontWeight:800, color:'#0f172a' }}>{dept.users} active users</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Remediation */}
                  <div style={{ background:'#fef3c7', border:'1px solid #fcd34d', borderRadius:10, padding:'0.875rem' }}>
                    <div style={{ fontSize:'0.62rem', fontWeight:800, color:'#b45309', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>💡 Policy Recommendation</div>
                    <p style={{ fontSize:'0.78rem', color:'#92400e', lineHeight:1.5 }}>{details.remediation}</p>
                  </div>
                </>
              ) : (
                <>
                  {/* Flagged Accounts List */}
                  <div>
                    <div style={{ fontSize:'0.62rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Flagged Employee Accounts</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', maxHeight:'280px', overflowY:'auto', paddingRight:'4px' }}>
                      {details.flaggedUsers.map(user => {
                        const isGuruji = user.email.includes('guruji');
                        return (
                          <div key={user.email} style={{
                            display:'flex', flexDirection:'column', gap:'0.5rem',
                            background: isGuruji ? 'linear-gradient(135deg, #f5f3ff, #edd8ff)' : '#f8fafc',
                            border: isGuruji ? '1px solid #c084fc' : '1px solid #e2e8f0',
                            boxShadow: isGuruji ? '0 4px 12px rgba(192, 132, 252, 0.15)' : 'none',
                            borderRadius:12, padding:'0.875rem 1rem', transition:'all 0.2s'
                          }}>
                            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                              <div style={{
                                width:36, height:36, borderRadius:'50%',
                                background: isGuruji ? '#7c3aed' : '#e2e8f0',
                                color: isGuruji ? '#fff' : '#475569',
                                display:'flex', alignItems:'center', justifyContent:'center',
                                fontWeight:800, fontSize:'0.9rem'
                              }}>
                                {isGuruji ? 'GJ' : user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </div>
                              <div style={{ flex:1 }}>
                                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                                  <span style={{ fontWeight:800, fontSize:'0.85rem', color:'#0f172a' }}>{user.name}</span>
                                  {isGuruji && (
                                    <span style={{
                                      background:'#7c3aed', color:'#fff', fontSize:'0.6rem',
                                      fontWeight:800, padding:'2px 8px', borderRadius:20, textTransform:'uppercase'
                                    }}>
                                      🌟 Showcase
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize:'0.72rem', color:'#64748b' }}>{user.role} · <span style={{ fontFamily:'monospace', fontSize:'0.7rem' }}>{user.email}</span></div>
                              </div>
                              <div>
                                <span className="badge" style={{
                                  background: user.risk === 'Critical' ? '#fee2e2' : user.risk === 'High' ? '#ffedd5' : '#fef9c3',
                                  color: user.risk === 'Critical' ? '#dc2626' : user.risk === 'High' ? '#ea580c' : '#ca8a04',
                                  border: `1px solid ${user.risk === 'Critical' ? '#fca5a5' : user.risk === 'High' ? '#fdba74' : '#fef08a'}`,
                                  fontSize:'0.65rem', fontWeight:800, padding:'2px 8px'
                                }}>
                                  Risk Score: {user.riskScore}
                                </span>
                              </div>
                            </div>
                            <div style={{ fontSize:'0.74rem', color:'#475569', borderTop:'1px dashed #e2e8f0', paddingTop:'0.5rem', marginTop:'0.25rem', display:'flex', alignItems:'center', gap:'0.35rem' }}>
                              <span>⚠️</span>
                              <span style={{ fontStyle:'italic' }}>{user.reason}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              <div style={{ display:'flex', gap:'0.75rem', borderTop:'1px solid #f1f5f9', paddingTop:'1rem', marginTop:'0.25rem' }}>
                <button onClick={() => setSelectedTool(null)} style={{ flex:1, padding:'0.65rem', background:'#f1f5f9', border:'1px solid #cbd5e1', borderRadius:8, color:'#475569', fontWeight:700, fontSize:'0.8rem', cursor:'pointer' }}>Close Details</button>
                <button onClick={() => {
                  alert(`Policy Enforcement: Block action issued for ${tool.tool}. All proxy routes will actively reject employee connections.`);
                  setSelectedTool(null);
                }} style={{ flex:1, padding:'0.65rem', background:'linear-gradient(135deg,#dc2626,#b91c1c)', border:'none', borderRadius:8, color:'#fff', fontWeight:700, fontSize:'0.8rem', cursor:'pointer', boxShadow:'0 4px 12px rgba(220,38,38,0.2)' }}>
                  Enforce Block Policy
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      <style>{`
        .shadow-ai-row, .shadow-ai-row td {
          cursor: pointer !important;
          transition: all 0.15s ease;
        }
        .shadow-ai-row:hover td {
          background-color: #ede9fe !important;
        }
        .exposed-users-btn {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #475569;
          font-size: 0.72rem;
          padding: 3px 10px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .exposed-users-btn:hover {
          background: #ede9fe;
          border-color: #a78bfa;
          color: #4f46e5;
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(79, 70, 229, 0.1);
        }
        .exposed-users-btn strong {
          color: #4f46e5;
        }

        /* Pulsing Glow Animation for Threat Path */
        @keyframes flowPulse {
          0% { transform: translateX(-40px) scale(1); opacity: 0.2; }
          50% { opacity: 1; }
          100% { transform: translateX(80px) scale(1); opacity: 0.2; }
        }
        .pulsing-glow {
          animation: flowPulse 2.8s infinite linear;
        }
      `}</style>
    </>
  );
}
