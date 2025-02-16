import 'dotenv/config';

import { hash } from 'bcryptjs';
import { QueryFailedError } from 'typeorm';

import { dataSource } from '../connection';

async function createUsersSeed() {
  const connection = await dataSource.initialize();

  const password = await hash('my-secret-password', 12);

  await connection.query(
    `
    INSERT INTO users (id, name, email, password, role, created_at, updated_at, avatar, is_activated)
    VALUES ($1, $2, $3, $4, $5, now(), now(), null, true)
  `,
    [
      crypto.randomUUID(),
      'Administrador',
      'admin@admin.com',
      password,
      'ADMIN',
    ],
  );

  await connection.query(
    `
    INSERT INTO users (id, name, email, password, role, created_at, updated_at, avatar, is_activated)
    VALUES ($1, $2, $3, $4, $5, now(), now(), null, true)
  `,
    [crypto.randomUUID(), 'Gerente', 'man@man.com', password, 'MANAGER'],
  );

  await connection.query(
    `
    INSERT INTO users (id, name, email, password, role, created_at, updated_at, avatar, is_activated)
    VALUES ($1, $2, $3, $4, $5, now(), now(), null, true)
  `,
    [crypto.randomUUID(), 'Padrão', 'std@std.com', password, 'MANAGER'],
  );

  await connection.destroy();
}

createUsersSeed()
  .then(() => {
    console.log('Users created successfully.');
    process.exit(0);
  })
  .catch((err) => {
    if (err instanceof QueryFailedError) {
      const { code } = err as any;

      if (code === '23505') {
        console.error('Users already created.');
      }
    } else {
      console.error(err);
    }

    process.exit(1);
  });
