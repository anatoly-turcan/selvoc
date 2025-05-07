import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [
    // { provide: ENTITY_REPOSITORY_TOKEN, useClass: EntityTypeormRepository },
  ],
})
export class RenameModule {}
