import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { VersionResolver } from './interfaces/graphql/resolvers';
import { CoreController } from './interfaces/rest/controllers';

@Module({
  controllers: [CoreController],
  imports: [TerminusModule],
  providers: [VersionResolver],
})
export class CoreModule {}
