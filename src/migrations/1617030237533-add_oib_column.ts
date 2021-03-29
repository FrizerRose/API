import { MigrationInterface, QueryRunner } from 'typeorm';

export class addOibColumn1617030237533 implements MigrationInterface {
  name = 'addOibColumn1617030237533';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_eb0137ccf80c181df8ca0b75c3c"`);
    await queryRunner.query(
      `CREATE TABLE "gallery" ("id" SERIAL NOT NULL, "images" text NOT NULL,
      CONSTRAINT "PK_65d7a1ef91ddafb3e7071b188a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "hours"`);
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "companyId"`);
    await queryRunner.query(`ALTER TABLE "staff" ADD "name" character varying(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "staff" ADD "email" character varying(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "staff" ADD "hours" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "staff" ADD "companyId" integer`);
    await queryRunner.query(`ALTER TABLE "company" ADD "oib" character varying(255) NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "staff" ADD "question" character varying(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "staff" ADD "answer" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "staff" ADD "order" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(
      `ALTER TABLE "staff" ADD CONSTRAINT "FK_eb0137ccf80c181df8ca0b75c3c"
      FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_eb0137ccf80c181df8ca0b75c3c"`);
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "order"`);
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "answer"`);
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "question"`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "oib"`);
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "companyId"`);
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "hours"`);
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "staff" ADD "companyId" integer`);
    await queryRunner.query(`ALTER TABLE "staff" ADD "hours" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "staff" ADD "email" character varying(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "staff" ADD "name" character varying(255) NOT NULL`);
    await queryRunner.query(`DROP TABLE "gallery"`);
    await queryRunner.query(
      `ALTER TABLE "staff" ADD CONSTRAINT "FK_eb0137ccf80c181df8ca0b75c3c"
      FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
