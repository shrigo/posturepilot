import fs from 'fs';
import path from 'path';
import { prisma } from './db';

export interface LeadRecord {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  provider: string;
  status: string;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface UpgradeRecord {
  id: string;
  clientName: string;
  userEmail: string;
  moduleName: string;
  createdAt: string;
}

// In-memory cache for ultra-fast, zero-failure operations
const memoryLeads: LeadRecord[] = [
  {
    id: 'seed-1',
    email: 'shrigo.now@gmail.com',
    firstName: 'Shrigo',
    lastName: 'gmail.com',
    provider: 'google',
    status: 'success',
    ip: '127.0.0.1',
    userAgent: 'Admin Session',
    createdAt: new Date().toISOString(),
  }
];

const memoryUpgrades: UpgradeRecord[] = [];

// Determine safe storage path for persistence across restarts
const LEADS_FILE = path.join(process.env.TMPDIR || '/tmp', 'posturepilot_leads.json');
const UPGRADES_FILE = path.join(process.env.TMPDIR || '/tmp', 'posturepilot_upgrades.json');

// Read from disk fallback if available
function loadFromFile<T>(filePath: string): T[] {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content) as T[];
    }
  } catch (err) {
    console.warn(`[LeadStorage] Failed to read ${filePath}:`, err);
  }
  return [];
}

// Save to disk fallback
function saveToFile<T>(filePath: string, data: T[]) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn(`[LeadStorage] Failed to write ${filePath}:`, err);
  }
}

// Initialize from file if exists
try {
  const loaded = loadFromFile<LeadRecord>(LEADS_FILE);
  if (loaded.length > 0) {
    loaded.forEach(item => {
      if (!memoryLeads.some(m => m.id === item.id)) {
        memoryLeads.push(item);
      }
    });
  }
} catch {}

/**
 * Record a lead safely to both Prisma (if DB active) and persistent fallback store
 */
export async function saveLeadAttempt(data: {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  provider?: string;
  status?: string;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<LeadRecord> {
  const now = new Date().toISOString();
  const id = 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

  const cleanEmail = (data.email || '').toLowerCase().trim();
  let fName = data.firstName;
  let lName = data.lastName;

  if (!fName && cleanEmail.includes('@')) {
    const [userPart, domainPart] = cleanEmail.split('@');
    const cleanUser = userPart.replace(/[._+-]/g, ' ');
    fName = cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1);
    lName = domainPart;
  }

  const newRecord: LeadRecord = {
    id,
    email: cleanEmail || 'unknown',
    firstName: fName || null,
    lastName: lName || null,
    provider: data.provider || 'free_trial',
    status: data.status || 'success',
    ip: data.ip || null,
    userAgent: data.userAgent || null,
    createdAt: now,
  };

  // Always update in-memory and disk first so the lead is NEVER lost
  memoryLeads.unshift(newRecord);
  saveToFile(LEADS_FILE, memoryLeads);

  // Try Prisma (if Supabase / Postgres is responsive)
  try {
    const prismaRecord = await prisma.loginAttempt.create({
      data: {
        email: newRecord.email,
        firstName: newRecord.firstName,
        lastName: newRecord.lastName,
        provider: newRecord.provider,
        status: newRecord.status,
        ip: newRecord.ip,
        userAgent: newRecord.userAgent,
      },
    });
    newRecord.id = prismaRecord.id;
  } catch (err: any) {
    console.warn('[LeadStorage] Prisma DB write bypassed (DB unreachable or paused):', err?.message || err);
  }

  return newRecord;
}

/**
 * Retrieve all leads, combining Prisma records and fallback store
 */
export async function getAllLeads(): Promise<{ attempts: LeadRecord[]; isDatabaseConnected: boolean }> {
  try {
    const dbAttempts = await prisma.loginAttempt.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    const formatted: LeadRecord[] = dbAttempts.map(a => ({
      id: a.id,
      email: a.email,
      firstName: a.firstName,
      lastName: a.lastName,
      provider: a.provider,
      status: a.status,
      ip: a.ip,
      userAgent: a.userAgent,
      createdAt: a.createdAt.toISOString(),
    }));

    // Merge any memory leads not yet in DB
    formatted.forEach(f => {
      if (!memoryLeads.some(m => m.email === f.email && Math.abs(new Date(m.createdAt).getTime() - new Date(f.createdAt).getTime()) < 5000)) {
        memoryLeads.push(f);
      }
    });

    return { attempts: formatted.length > 0 ? formatted : memoryLeads, isDatabaseConnected: true };
  } catch (err: any) {
    console.warn('[LeadStorage] Serving fallback leads (DB unreachable or paused):', err?.message || err);
    return { attempts: memoryLeads, isDatabaseConnected: false };
  }
}

/**
 * Retrieve upgrade requests safely
 */
export async function getAllUpgradeRequests(): Promise<UpgradeRecord[]> {
  try {
    const dbReqs = await prisma.upgradeRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return dbReqs.map(r => ({
      id: r.id,
      clientName: r.clientName,
      userEmail: r.userEmail,
      moduleName: r.moduleName,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch {
    return memoryUpgrades;
  }
}
