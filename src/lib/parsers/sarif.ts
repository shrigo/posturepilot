// src/lib/parsers/sarif.ts
// Parses SARIF v2.1.0 JSON output (SAST/code-scan results) → Universal Finding Schema
// Supports GitHub Advanced Security, Semgrep, CodeQL, Checkmarx, etc.

import { UFinding } from './qualys';

// ─── SARIF Level → UFS Severity ──────────────────────────────────────────────
function sarifLevelToSeverity(level?: string, tags?: string[]): UFinding['severity'] {
  // Some tools encode severity in rule tags instead of result level
  if (tags) {
    const tagStr = tags.join(' ').toLowerCase();
    if (tagStr.includes('critical'))              return 'Critical';
    if (tagStr.includes('high') || tagStr.includes('error')) return 'High';
    if (tagStr.includes('medium') || tagStr.includes('warning')) return 'Medium';
    if (tagStr.includes('low') || tagStr.includes('note'))   return 'Low';
  }
  switch ((level ?? '').toLowerCase()) {
    case 'error':   return 'High';
    case 'warning': return 'Medium';
    case 'note':    return 'Low';
    default:        return 'Info';
  }
}

// ─── SARIF JSON Shape (SARIF 2.1.0) ──────────────────────────────────────────
interface SarifMessage   { text?: string; markdown?: string }
interface SarifArtifactLocation { uri?: string }
interface SarifPhysicalLocation {
  artifactLocation?: SarifArtifactLocation;
  region?: { startLine?: number; startColumn?: number };
}
interface SarifLocation { physicalLocation?: SarifPhysicalLocation }

interface SarifRule {
  id:           string;
  name?:        string;
  shortDescription?: SarifMessage;
  fullDescription?:  SarifMessage;
  help?:             SarifMessage;
  properties?: {
    tags?:       string[];
    precision?:  string;
    severity?:   string;
    problem?: { severity?: string };
    'security-severity'?: string; // numeric CVSS-like string e.g. "9.8"
  };
}

interface SarifResult {
  ruleId?:    string;
  level?:     string;   // error | warning | note | none
  message:    SarifMessage;
  locations?: SarifLocation[];
  properties?: Record<string, unknown>;
}

interface SarifDriver {
  name?:  string;
  rules?: SarifRule[];
}

interface SarifRun {
  tool?:    { driver?: SarifDriver };
  results?: SarifResult[];
}

interface SarifReport {
  $schema?: string;
  version?: string;
  runs?:    SarifRun[];
}

// ─── Parse SARIF JSON ─────────────────────────────────────────────────────────
export function parseSarifJSON(content: string): UFinding[] {
  let report: SarifReport;
  try {
    report = JSON.parse(content);
  } catch {
    return [];
  }

  if (!report.runs || !Array.isArray(report.runs)) return [];

  const findings: UFinding[] = [];

  for (const run of report.runs) {
    const toolName = run.tool?.driver?.name ?? 'sarif';

    // Build rule lookup map from driver.rules
    const ruleMap = new Map<string, SarifRule>();
    for (const rule of run.tool?.driver?.rules ?? []) {
      ruleMap.set(rule.id, rule);
    }

    for (const result of run.results ?? []) {
      const ruleId  = result.ruleId ?? 'unknown-rule';
      const rule    = ruleId !== 'unknown-rule' ? ruleMap.get(ruleId) : undefined;

      // Title: rule short description or result message
      const title =
        rule?.shortDescription?.text ??
        rule?.name ??
        result.message?.text ??
        `${toolName} ${ruleId}`;

      // Description: rule full description or result message
      const description =
        rule?.fullDescription?.text ??
        result.message?.text ??
        undefined;

      // Solution / help from rule
      const solution = rule?.help?.text ?? undefined;

      // Severity: use rule properties.severity, security-severity, or level
      const secSeverityStr = rule?.properties?.['security-severity'];
      const secSeverityNum = secSeverityStr ? parseFloat(secSeverityStr) : NaN;
      let severity: UFinding['severity'];
      if (!isNaN(secSeverityNum)) {
        // Map CVSS numeric to our bucket
        if (secSeverityNum >= 9.0)       severity = 'Critical';
        else if (secSeverityNum >= 7.0)  severity = 'High';
        else if (secSeverityNum >= 4.0)  severity = 'Medium';
        else                             severity = 'Low';
      } else {
        severity = sarifLevelToSeverity(result.level, rule?.properties?.tags);
      }

      // Host / asset: extract from first physical location URI + line
      const firstLoc    = result.locations?.[0];
      const uri         = firstLoc?.physicalLocation?.artifactLocation?.uri;
      const startLine   = firstLoc?.physicalLocation?.region?.startLine;
      const host        = uri
        ? (startLine !== undefined ? `${uri}:${startLine}` : uri)
        : toolName;

      // CVE: some tools embed CVE in rule tags or id
      const tags   = rule?.properties?.tags ?? [];
      const cveTag = tags.find(t => /^CVE-\d{4}-\d+$/i.test(t));

      findings.push({
        sourceTool:  'sarif',
        pluginId:    ruleId,
        cveId:       cveTag,
        host,
        ip:          undefined,
        port:        undefined,
        protocol:    toolName,
        title,
        description,
        solution,
        severity,
        cvssScore:   !isNaN(secSeverityNum) ? secSeverityNum : undefined,
        cvssVector:  undefined,
      });
    }
  }

  return findings;
}
