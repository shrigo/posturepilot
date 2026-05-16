// src/lib/db.ts — singleton Prisma client (Prisma 7 + LibSQL adapter)
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrisma() {
  const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
  const url = dbUrl.startsWith('file:') ? dbUrl : `file:${dbUrl}`;
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  });
}

export const prisma = globalForPrisma.prisma || createPrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
