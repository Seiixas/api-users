import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersEntity1739402202760 implements MigrationInterface {
  name = 'CreateUsersEntity1739402202760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('STANDARD', 'MANAGER', 'ADMIN')
        `);
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'STANDARD',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "users"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."users_role_enum"
        `);
  }
}
