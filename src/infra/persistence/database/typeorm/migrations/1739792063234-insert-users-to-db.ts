import { hash } from 'bcryptjs';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActivatedColToUser1739792063234 implements MigrationInterface {
  name = 'AddActivatedColToUser1739792063234';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = await hash('my-secret-password', 12);

    await queryRunner.query(`
      INSERT INTO users (id, name, email, password, role, created_at, updated_at, avatar, is_activated)
      VALUES 
        ('6f066a9e-0996-4aca-8c1d-98fc3a0407e3', 'Administrador', 'admin@admin.com', '${password}', 'ADMIN', now(), now(), null, true),
        ('be30758d-1b1e-44d7-8019-69e424132c01', 'Gerente', 'man@man.com', '${password}', 'MANAGER', now(), now(), null, true),
        ('97a32174-3750-4d0e-8eaa-06cebf2644ce', 'Padrão', 'std@std.com', '${password}', 'STANDARD', now(), now(), null, true)
      ON CONFLICT (email) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users WHERE email IN ('admin@admin.com', 'man@man.com', 'std@std.com');
    `);
  }
}
