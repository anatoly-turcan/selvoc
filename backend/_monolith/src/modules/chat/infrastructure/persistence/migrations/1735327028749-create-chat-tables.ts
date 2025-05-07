import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChatTables1735327028749 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chat_messages" ("id" uuid NOT NULL, "user_id" uuid NOT NULL, "chat_id" uuid NOT NULL, "content" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chats" ("id" uuid NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_memberships" ("chat_id" uuid NOT NULL, "user_id" uuid NOT NULL, "joined_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_2cc0144f73b05c551695fba7362" PRIMARY KEY ("chat_id", "user_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_9f5c0b96255734666b7b4bc98c3" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_memberships" ADD CONSTRAINT "FK_992f0ae4dd09685f393c52932d5" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_memberships" DROP CONSTRAINT "FK_992f0ae4dd09685f393c52932d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_9f5c0b96255734666b7b4bc98c3"`,
    );
    await queryRunner.query(`DROP TABLE "chat_memberships"`);
    await queryRunner.query(`DROP TABLE "chats"`);
    await queryRunner.query(`DROP TABLE "chat_messages"`);
  }
}
