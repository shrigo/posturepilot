import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
    // directUrl bypasses pgBouncer transaction pooler — required for DDL (migrate/push)
    directUrl: env('DIRECT_URL'),
  },
});
