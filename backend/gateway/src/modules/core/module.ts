import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { CoreController } from './interfaces/rest/controllers';

@Module({
  controllers: [CoreController],
  imports: [TerminusModule],
})
export class CoreModule {}
