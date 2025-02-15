import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActivatedColToUser1739659656210 implements MigrationInterface {
    name = 'AddActivatedColToUser1739659656210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "is_activated" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "is_activated"
        `);
    }

}
