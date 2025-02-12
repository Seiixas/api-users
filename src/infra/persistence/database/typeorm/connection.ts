import { resolve } from 'node:path';
import { Env } from 'src/shared/env';
import { DataSource } from 'typeorm';

const migrationsDir = resolve(__dirname, 'migrations', '*{.ts,.js}');
const entitiesDir = resolve(__dirname, 'entities', '*{.ts,.js}');

export const dataSource = new DataSource({
  type: 'postgres',
  url: Env.DATABASE_URL,
  migrations: [migrationsDir],
  entities: [entitiesDir],
  synchronize: false,
});
