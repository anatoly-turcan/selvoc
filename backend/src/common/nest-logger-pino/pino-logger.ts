import { Inject, Injectable, LoggerService } from '@nestjs/common';
import pino, { Logger } from 'pino';

import { MODULE_OPTIONS_TOKEN, NestPinoLoggerModuleOptions } from './module-definition';

@Injectable()
export class PinoLogger implements LoggerService {
  protected readonly pino: Logger;

  protected context?: string;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) optionsOrLogger: NestPinoLoggerModuleOptions) {
    this.pino =
      optionsOrLogger && 'info' in optionsOrLogger ? optionsOrLogger : pino(optionsOrLogger);
  }

  public setContext(context: string): this {
    this.context = context;

    return this;
  }

  public child(context: string): PinoLogger {
    return new PinoLogger(this.pino).setContext(context);
  }

  public log(input: string | object, ...optionalData: any[]): void {
    this.pino.info(...this.buildArgs(input, ...optionalData));
  }

  public info(input: string | object, ...optionalData: any[]): void {
    this.pino.info(...this.buildArgs(input, ...optionalData));
  }

  public error(input: string | object, ...optionalData: any[]): void {
    this.pino.error(...this.buildArgs(input, ...optionalData));
  }

  public warn(input: string | object, ...optionalData: any[]): void {
    this.pino.warn(...this.buildArgs(input, ...optionalData));
  }

  public debug(input: string | object, ...optionalData: any[]): void {
    this.pino.debug(...this.buildArgs(input, ...optionalData));
  }

  protected buildArgs(
    input: string | object,
    ...optionalData: any[]
  ): [object, string | undefined] {
    let data: any[] | undefined;
    let context: string | undefined;

    if (optionalData.length === 1 && typeof optionalData[0] === 'string') {
      // nest context provided
      data = undefined;
      context = this.context ?? optionalData[0];
    } else {
      data = optionalData.length ? data : undefined;
      context = this.context;
    }

    let message = typeof input === 'string' ? input : undefined;
    if (message && context) {
      message = `${context}: ${message}`;
    }

    const obj = {
      ...(typeof input === 'object' ? input : undefined),
      context,
      data,
    };

    return [obj, message];
  }
}
