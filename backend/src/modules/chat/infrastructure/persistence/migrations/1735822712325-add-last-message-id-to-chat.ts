import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLastMessageIdToChat1735822712325 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chats" ADD "last_message_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "chats" ADD CONSTRAINT "FK_07b7d9dde84f3d2f0403de3bf09" FOREIGN KEY ("last_message_id") REFERENCES "chat_messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_07b7d9dde84f3d2f0403de3bf09"`);
    await queryRunner.query(`ALTER TABLE "chats" DROP COLUMN "last_message_id"`);
  }
}
