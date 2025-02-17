import { resolve } from 'node:path';

import { DataSource } from 'typeorm';

import { Env } from '@/shared/env';

const migrationsDir = resolve(__dirname, 'migrations', '*{.ts,.js}');
const entitiesDir = resolve(__dirname, 'entities', '*{.ts,.js}');

export const dataSource = new DataSource({
  type: 'postgres',
  url:
    Env.NODE_ENV && Env.NODE_ENV === 'test'
      ? Env.DATABASE_TESTING_URL
      : Env.DATABASE_URL,
  migrations: [migrationsDir],
  entities: [entitiesDir],
  synchronize: false,
});
