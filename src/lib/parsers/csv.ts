// src/lib/parsers/csv.ts
// Generic CSV parser for Qualys CSV, Tenable CSV, OpenVAS CSV exports

import Papa from 'papaparse';
import type { UFinding } from './qualys';

// Column name aliases across different tools
const COL = {
  severity:    ['Severity', 'Risk', 'Risk Factor', 'Level', 'severity'],
  title:       ['Title', 'Name', 'Vulnerability', 'Plugin Name', 'title', 'Summary'],
  ip:          ['IP', 'IP Address', 'Host', 'ip', 'Asset IP'],
  host:        ['DNS', 'Hostname', 'FQDN', 'NetBIOS', 'hostname'],
  port:        ['Port', 'port'],
  protocol:    ['Protocol', 'protocol'],
  cve:         ['CVE', 'CVE ID', 'CVE IDs', 'cve'],
  cvss:        ['CVSS', 'CVSS Score', 'CVSS Base Score', 'CVSS3 Base Score', 'cvss_score'],
  description: ['Description', 'Synopsis', 'description'],
  solution:    ['Solution', 'Recommendation', 'solution'],
  pluginId:    ['QID', 'Plugin ID', 'plugin_id', 'Check ID'],
};

function pick(row: Record<string, string>, keys: string[]): string | undefined {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== '') return row[k].trim();
  }
  return undefined;
}

function mapSeverity(raw: string | undefined): UFinding['severity'] {
  if (!raw) return 'Info';
  const s = raw.toLowerCase();
  if (s.includes('critical') || s === '5') return 'Critical';
  if (s.includes('high')     || s === '4') return 'High';
  if (s.includes('medium')   || s === '3') return 'Medium';
  if (s.includes('low')      || s === '2') return 'Low';
  return 'Info';
}

export function parseCSV(csvContent: string, sourceTool = 'csv'): UFinding[] {
  const result = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data.map((row) => ({
    sourceTool,
    pluginId:    pick(row, COL.pluginId),
    cveId:       pick(row, COL.cve),
    ip:          pick(row, COL.ip),
    host:        pick(row, COL.host),
    port:        pick(row, COL.port),
    protocol:    pick(row, COL.protocol),
    title:       pick(row, COL.title) || 'Unknown Finding',
    description: pick(row, COL.description),
    solution:    pick(row, COL.solution),
    severity:    mapSeverity(pick(row, COL.severity)),
    cvssScore:   parseFloat(pick(row, COL.cvss) || '') || undefined,
  })).filter(f => f.title !== 'Unknown Finding' || f.cveId);
}
