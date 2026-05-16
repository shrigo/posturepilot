// src/lib/parsers/qualys.ts
// Parses Qualys VMDR XML export → Universal Finding Schema

import { parseStringPromise } from 'xml2js';

export interface UFinding {
  sourceTool: string;
  pluginId?: string;
  cveId?: string;
  host?: string;
  ip?: string;
  port?: string;
  protocol?: string;
  title: string;
  description?: string;
  solution?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  cvssScore?: number;
  cvssVector?: string;
}

const SEVERITY_MAP: Record<string, UFinding['severity']> = {
  '5': 'Critical',
  '4': 'High',
  '3': 'Medium',
  '2': 'Low',
  '1': 'Info',
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

export async function parseQualysXML(xmlContent: string): Promise<UFinding[]> {
  const parsed = await parseStringPromise(xmlContent, { explicitArray: true });
  const findings: UFinding[] = [];

  // Handle both SCAN_RESULTS and ASSET_DATA_REPORT formats
  const root = parsed.SCAN_RESULTS || parsed.ASSET_DATA_REPORT || parsed;

  // Format 1: SCAN_RESULTS/IP/VULN_INFO_LIST/VULN_INFO
  const ips = root?.IP || root?.ASSET_DATA_REPORT?.IP || [];
  for (const ipEntry of ips) {
    const ipAddr = text(ipEntry?.$?.value) || text(ipEntry?.IP);
    const hostname = text(ipEntry?.$?.name);
    const vulnLists = ipEntry?.VULN_INFO_LIST || [];

    for (const vulnList of vulnLists) {
      const vulns = vulnList?.VULN_INFO || [];
      for (const vuln of vulns) {
        const qid = text(vuln?.QID);
        const severityNum = text(vuln?.SEVERITY) || '1';
        const cvss = num(vuln?.CVSS_BASE);
        const cveRaw = text(vuln?.CVE_ID_LIST?.[0]?.CVE_ID?.[0]?.ID);

        findings.push({
          sourceTool: 'qualys',
          pluginId: qid,
          cveId: cveRaw,
          host: hostname,
          ip: ipAddr,
          port: text(vuln?.PORT),
          protocol: text(vuln?.PROTOCOL),
          title: text(vuln?.TITLE) || text(vuln?.VULN_TYPE) || `Qualys QID ${qid}`,
          description: text(vuln?.DIAGNOSIS),
          solution: text(vuln?.SOLUTION),
          severity: SEVERITY_MAP[severityNum] || 'Info',
          cvssScore: cvss,
          cvssVector: text(vuln?.CVSS_VECTOR),
        });
      }
    }
  }

  // Format 2: HOST_LIST_VM_DETECTION_OUTPUT (Qualys VM Detection)
  const hosts = root?.RESPONSE?.[0]?.HOST_LIST?.[0]?.HOST || [];
  for (const host of hosts) {
    const ip = text(host?.IP);
    const dns = text(host?.DNS);
    const detections = host?.DETECTION_LIST?.[0]?.DETECTION || [];

    for (const det of detections) {
      const qid = text(det?.QID);
      const severityNum = text(det?.SEVERITY) || '1';
      const cvss = num(det?.CVSS_FINAL);

      findings.push({
        sourceTool: 'qualys',
        pluginId: qid,
        ip,
        host: dns,
        port: text(det?.PORT),
        title: text(det?.RESULTS) || `Qualys QID ${qid}`,
        severity: SEVERITY_MAP[severityNum] || 'Info',
        cvssScore: cvss,
      });
    }
  }

  return findings;
}
