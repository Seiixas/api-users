import { resolve } from 'node:path';

import { DataSource } from 'typeorm';

import { Env } from '@/shared/env';

const migrationsDir = resolve(__dirname, 'migrations', '*{.ts,.js}');
const entitiesDir = resolve(__dirname, 'entities', '*{.ts,.js}');

export const dataSource = new DataSource({
  type: 'postgres',
  url: Env.DATABASE_URL,
  migrations: [migrationsDir],
  entities: [entitiesDir],
  synchronize: false,
});
