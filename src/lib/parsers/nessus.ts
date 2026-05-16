// src/lib/parsers/nessus.ts
// Parses Nessus .nessus (XML) export → Universal Finding Schema

import { parseStringPromise } from 'xml2js';
import type { UFinding } from './qualys';

const RISK_MAP: Record<string, UFinding['severity']> = {
  'critical': 'Critical',
  'high':     'High',
  'medium':   'Medium',
  'low':      'Low',
  'none':     'Info',
  'informational': 'Info',
};

function text(val: unknown): string | undefined {
  if (!val) return undefined;
  if (Array.isArray(val)) return String(val[0]).trim() || undefined;
  return String(val).trim() || undefined;
}

function num(val: unknown): number | undefined {
  const v = parseFloat(String(Array.isArray(val) ? val[0] : val));
  return isNaN(v) ? undefined : v;
}

export async function parseNessusXML(xmlContent: string): Promise<UFinding[]> {
  const parsed = await parseStringPromise(xmlContent, { explicitArray: true });
  const findings: UFinding[] = [];

  const policy = parsed?.NessusClientData_v2;
  if (!policy) throw new Error('Not a valid .nessus file');

  const reports = policy?.Report || [];
  for (const report of reports) {
    const hosts = report?.ReportHost || [];

    for (const host of hosts) {
      const hostname = host?.$?.name;
      const props: Record<string, string> = {};
      for (const prop of host?.HostProperties?.[0]?.tag || []) {
        props[prop.$.name] = prop._;
      }
      const ip = props['host-ip'] || hostname;
      const fqdn = props['host-fqdn'] || props['netbios-name'];

      const items = host?.ReportItem || [];
      for (const item of items) {
        const attrs = item.$ || {};
        const riskFactor = text(item?.risk_factor)?.toLowerCase() || 'none';
        const severity = RISK_MAP[riskFactor] || 'Info';

        // Extract CVE IDs (can be multiple)
        const cveList = (item?.cve || []).map((c: unknown) => text(c)).filter(Boolean);
        const primaryCve = cveList[0];

        findings.push({
          sourceTool: 'nessus',
          pluginId: attrs.pluginID,
          cveId: primaryCve,
          host: fqdn || hostname,
          ip,
          port: attrs.port !== '0' ? attrs.port : undefined,
          protocol: attrs.protocol,
          title: attrs.pluginName || text(item?.synopsis) || 'Unknown',
          description: text(item?.description),
          solution: text(item?.solution),
          severity,
          cvssScore: num(item?.cvss3_base_score) || num(item?.cvss_base_score),
          cvssVector: text(item?.cvss3_vector) || text(item?.cvss_vector),
        });
      }
    }
  }

  return findings;
}
