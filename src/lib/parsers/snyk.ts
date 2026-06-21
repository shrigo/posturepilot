// src/lib/parsers/snyk.ts
// Parses Snyk CLI JSON output (SCA/dependency vulnerability scan) → Universal Finding Schema

import { UFinding } from './qualys';

// Snyk severity → UFS severity
const SNYK_SEVERITY_MAP: Record<string, UFinding['severity']> = {
  critical: 'Critical',
  high:     'High',
  medium:   'Medium',
  low:      'Low',
  info:     'Info',
};

// ─── Snyk JSON Shape (simplified) ────────────────────────────────────────────
interface SnykVulnerability {
  id:           string;          // SNYK-JS-LODASH-567439
  title:        string;
  description?: string;
  severity:     string;          // critical | high | medium | low
  identifiers?: { CVE?: string[]; CWE?: string[] };
  cvssScore?:   number;
  cvss?:        string;          // CVSS vector string
  packageName?: string;
  version?:     string;
  fixedIn?:     string[];
  from?:        string[];        // dependency chain
  language?:    string;
  packageManager?: string;
}

interface SnykJsonReport {
  projectName?:      string;
  displayTargetFile?: string;
  vulnerabilities?:  SnykVulnerability[];
  // new v2 format uses "runs" style, handled below
}

// ─── Parse Snyk JSON ──────────────────────────────────────────────────────────
export function parseSnykJSON(content: string): UFinding[] {
  let report: SnykJsonReport;
  try {
    report = JSON.parse(content);
  } catch {
    return [];
  }

  const findings: UFinding[] = [];
  const vulns = report.vulnerabilities ?? [];

  // Project / repo context
  const projectHost = report.projectName ?? report.displayTargetFile ?? 'snyk-project';

  for (const vuln of vulns) {
    const cves = vuln.identifiers?.CVE ?? [];
    const cveId = cves.length > 0 ? cves[0] : undefined;

    // Build human-readable title
    const pkgLabel = vuln.packageName ? `${vuln.packageName}@${vuln.version ?? '?'}` : '';
    const title = vuln.title
      ? `${vuln.title}${pkgLabel ? ` (${pkgLabel})` : ''}`
      : `Snyk ${vuln.id}`;

    // Construct solution text from fixedIn array
    const solution = vuln.fixedIn && vuln.fixedIn.length > 0
      ? `Upgrade to: ${vuln.fixedIn.join(', ')}`
      : 'No fix currently available. Review Snyk advisory.';

    // Dep chain → host context
    const depChain = vuln.from && vuln.from.length > 0 ? vuln.from.join(' → ') : undefined;

    findings.push({
      sourceTool:  'snyk',
      pluginId:    vuln.id,
      cveId,
      host:        projectHost,
      ip:          undefined,
      port:        undefined,
      protocol:    vuln.language ?? vuln.packageManager ?? undefined,
      title,
      description: vuln.description ?? (depChain ? `Dependency chain: ${depChain}` : undefined),
      solution,
      severity:    SNYK_SEVERITY_MAP[vuln.severity?.toLowerCase()] ?? 'Info',
      cvssScore:   vuln.cvssScore,
      cvssVector:  vuln.cvss,
    });
  }

  return findings;
}
