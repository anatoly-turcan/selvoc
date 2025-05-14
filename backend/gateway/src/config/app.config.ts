import 'dotenv/config';

import { IntrospectAndComposeOptions } from '@apollo/gateway/dist/supergraphManagers/IntrospectAndCompose';
import { get } from 'env-var';

import { LoggerConfig, loggerConfig } from './logger.config';

export type AppConfig = {
  port: number;
  hostname: string;
  logger: LoggerConfig;
  supergraph: Pick<IntrospectAndComposeOptions, 'subgraphs' | 'pollIntervalInMs'>;
};

export function loadAppConfig(): AppConfig {
  return {
    port: get('PORT').default('3000').asInt(),
    hostname: get('HOSTNAME').default('0.0.0.0').asString(),
    logger: loggerConfig,
    supergraph: {
      pollIntervalInMs: get('SUBGRAPH_POLL_INTERVAL_IN_MS').default('60000').asInt(),
      subgraphs: [
        { name: 'user', url: get('SUBGRAPH_USER_URL').required().asString() },
        { name: 'chat', url: get('SUBGRAPH_CHAT_URL').required().asString() },
      ],
    },
  };
}
