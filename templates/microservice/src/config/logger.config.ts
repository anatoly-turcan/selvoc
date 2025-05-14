import { NestPinoLoggerModuleOptions } from '@selvoc/nest-logger-pino';
import { get } from 'env-var';
import { LevelWithSilentOrString } from 'pino';

export type LoggerConfig = NestPinoLoggerModuleOptions;

const isPretty = get('LOGGER_PRETTY').default('false').asBool();
const level = get('LOGGER_LEVEL')
  .default('info' satisfies LevelWithSilentOrString)
  .asString() as LevelWithSilentOrString;

export const loggerConfig: LoggerConfig = {
  transport: isPretty
    ? { target: 'pino-pretty', options: { colorize: true, singleLine: true, sync: true } }
    : undefined,
  level,
};
