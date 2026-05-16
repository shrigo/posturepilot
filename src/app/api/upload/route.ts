// src/app/api/upload/route.ts
// POST /api/upload — receives scan file, detects format, parses, stores findings

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseQualysXML } from '@/lib/parsers/qualys';
import { parseNessusXML } from '@/lib/parsers/nessus';
import { parseCSV }       from '@/lib/parsers/csv';

const DEFAULT_ORG_ID = 'demo-org';

// Ensure demo org exists
async function ensureOrg() {
  return prisma.org.upsert({
    where: { id: DEFAULT_ORG_ID },
    update: {},
    create: { id: DEFAULT_ORG_ID, name: 'Demo Organization' },
  });
}

function detectTool(filename: string, content: string): string {
  const f = filename.toLowerCase();
  if (f.endsWith('.nessus'))          return 'nessus';
  if (f.includes('qualys'))          return 'qualys';
  if (content.includes('NessusClientData_v2')) return 'nessus';
  if (content.includes('ASSET_DATA_REPORT') || content.includes('SCAN_RESULTS')) return 'qualys';
  if (content.includes('HOST_LIST_VM_DETECTION')) return 'qualys';
  if (f.endsWith('.csv'))            return 'csv';
  if (f.endsWith('.xml'))            return 'openvas'; // fallback XML → treat as OpenVAS/generic
  return 'csv';
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const content = await file.text();
    const sourceTool = detectTool(file.name, content);

    await ensureOrg();

    // Create scan job
    const job = await prisma.scanJob.create({
      data: {
        orgId: DEFAULT_ORG_ID,
        sourceTool,
        fileName: file.name,
        status: 'processing',
      },
    });

    // Parse findings
    let rawFindings;
    if (sourceTool === 'nessus') {
      rawFindings = await parseNessusXML(content);
    } else if (sourceTool === 'qualys') {
      rawFindings = await parseQualysXML(content);
    } else {
      rawFindings = parseCSV(content, sourceTool);
    }

    if (rawFindings.length === 0) {
      await prisma.scanJob.update({
        where: { id: job.id },
        data: { status: 'error', completedAt: new Date() },
      });
      return NextResponse.json({ error: 'No findings parsed — check file format' }, { status: 422 });
    }

    // Batch insert findings
    await prisma.finding.createMany({
      data: rawFindings.map((f) => ({
        orgId:       DEFAULT_ORG_ID,
        scanJobId:   job.id,
        sourceTool:  f.sourceTool,
        pluginId:    f.pluginId,
        cveId:       f.cveId,
        host:        f.host,
        ip:          f.ip,
        port:        f.port,
        protocol:    f.protocol,
        title:       f.title,
        description: f.description,
        solution:    f.solution,
        severity:    f.severity,
        cvssScore:   f.cvssScore,
        cvssVector:  f.cvssVector,
      })),
    });

    // Update job as done
    await prisma.scanJob.update({
      where: { id: job.id },
      data: { status: 'done', findingCount: rawFindings.length, completedAt: new Date() },
    });

    // Summary stats
    const bySeverity = rawFindings.reduce<Record<string, number>>((acc, f) => {
      acc[f.severity] = (acc[f.severity] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      jobId: job.id,
      tool: sourceTool,
      total: rawFindings.length,
      bySeverity,
    });

  } catch (err: unknown) {
    console.error('[upload]', err);
    const message = err instanceof Error ? err.message : 'Parse error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
