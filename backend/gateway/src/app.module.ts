import { GraphQLDataSource, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PinoLoggerModule } from '@selvoc/nest-logger-pino';

import { CoreModule } from '@modules/core';

import { AppConfig, loadAppConfig } from './config';
import { SubgraphGraphQLDataSource } from './utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadAppConfig],
    }),
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) =>
        configService.get('logger', { infer: true }),
    }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        const { pollIntervalInMs, subgraphs } = configService.get('supergraph', { infer: true });

        return {
          server: {
            introspection: true,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            playground: false,
            path: '/graphql',
          },
          gateway: {
            supergraphSdl: new IntrospectAndCompose({ pollIntervalInMs, subgraphs }),
            buildService: (definition): GraphQLDataSource =>
              new SubgraphGraphQLDataSource(definition),
          },
        };
      },
    }),
    CoreModule,
  ],
})
export class AppModule {}
