import { Controller, Get } from '@nestjs/common';
import { HealthCheckResult, HealthCheckService } from '@nestjs/terminus';
import { Public } from '@selvoc/nest-auth';

import { APP_VERSION } from '../../common';

@Controller()
export class CoreController {
  constructor(private readonly healthService: HealthCheckService) {}

  @Public()
  @Get('health')
  public health(): Promise<HealthCheckResult> {
    return this.healthService.check([]);
  }

  @Public()
  @Get('version')
  public version(): string {
    return APP_VERSION;
  }
}
