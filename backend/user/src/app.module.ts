import { join } from 'path/posix';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventClient } from '@selvoc/event-client';
import { RabbitMqEventTransport } from '@selvoc/event-client-transport-rabbitmq';
import { AuthModule } from '@selvoc/nest-auth';
import { EventClientModule } from '@selvoc/nest-event-client';
import { PinoLogger, PinoLoggerModule } from '@selvoc/nest-logger-pino';

import { CoreModule } from '@modules/core';
import { UserModule } from '@modules/user';

import { AppConfig, loadAppConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadAppConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => ({
        ...configService.get('typeorm', { infer: true }),
        autoLoadEntities: true,
      }),
    }),
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) =>
        configService.get('logger', { infer: true }),
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      playground: false,
      path: '/graphql',
      autoSchemaFile: {
        federation: 2,
        path: join(process.cwd(), 'schema.gql'),
      },
    }),
    AuthModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) =>
        configService.get('auth', { infer: true }),
    }),
    EventClientModule.forRootAsync({
      inject: [ConfigService, PinoLogger],
      useFactory: (configService: ConfigService<AppConfig, true>, logger: PinoLogger) => ({
        transports: [
          new RabbitMqEventTransport(configService.get('events.rabbitmq', { infer: true })),
        ],
        logger: logger.child(EventClient.name),
      }),
    }),
    CoreModule,
    UserModule,
  ],
})
export class AppModule {}
