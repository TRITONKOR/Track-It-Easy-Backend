import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1737809838786 implements MigrationInterface {
    name = 'CreateTables1737809838786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "parcel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "trackingNumber" character varying(255) NOT NULL, "userId" uuid NOT NULL, "statusId" uuid NOT NULL, "courierId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c01e9fed31b7433a00942d506b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "courier" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "api" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_183b46a15a02e9efd55fa25b6b5" UNIQUE ("api"), CONSTRAINT "PK_94613ec7dc72f7dfa2d072a31cf" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "courier"`);
        await queryRunner.query(`DROP TABLE "parcel"`);
    }

}
