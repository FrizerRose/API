import { MigrationInterface, QueryRunner } from 'typeorm';

export class addOibColumn1617030237533 implements MigrationInterface {
  name = 'addOibColumn1617030237533';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" ADD "oib" character varying(255) NOT NULL DEFAULT ''`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "oib"`);
  }
}
