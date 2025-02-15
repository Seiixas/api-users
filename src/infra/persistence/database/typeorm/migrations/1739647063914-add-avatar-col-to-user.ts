import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarColToUser1739647063914 implements MigrationInterface {
    name = 'AddAvatarColToUser1739647063914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "avatar" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "avatar"
        `);
    }

}
