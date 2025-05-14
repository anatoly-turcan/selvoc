import { ConfigurableModuleBuilder } from '@nestjs/common';
import { Logger, LoggerOptions } from 'pino';

export type NestPinoLoggerModuleOptions = LoggerOptions | Logger;

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<NestPinoLoggerModuleOptions>()
    .setClassMethodName('forRoot')
    .build();
