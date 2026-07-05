-- AlterTable
ALTER TABLE "LoginAttempt" ADD COLUMN IF NOT EXISTS "firstName" TEXT;
ALTER TABLE "LoginAttempt" ADD COLUMN IF NOT EXISTS "lastName" TEXT;
