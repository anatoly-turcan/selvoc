import { join } from 'path/posix';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventClient } from '@common/event-client';
import { AmqpEventTransport } from '@common/event-client-transport-amqp';
import { MemoryEventTransport } from '@common/event-client-transport-memory';
import { CommonConfig, loadCommonConfig } from '@common/infrastructure/config/common.config';
import { NestEventClientModule } from '@common/nest-event-client';
import { NestPinoLoggerModule, PinoLogger } from '@common/nest-logger-pino';
import { ChatModule } from '@modules/chat/chat.module';

import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadCommonConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<CommonConfig, true>) => ({
        ...configService.get('typeorm', { infer: true }),
        autoLoadEntities: true,
      }),
    }),
    NestPinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<CommonConfig, true>) =>
        configService.get('logger', { infer: true }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      playground: false,
      path: 'api/graphql',
      autoSchemaFile: {
        federation: 2,
        path: join(process.cwd(), 'schema.gql'),
      },
      subscriptions: {
        'graphql-ws': true,
      },
    }),
    NestEventClientModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, PinoLogger],
      useFactory: (configService: ConfigService<CommonConfig, true>, logger: PinoLogger) => ({
        transports: [
          new AmqpEventTransport(configService.get('events.amqp', { infer: true })),
          new MemoryEventTransport(configService.get('events.memory', { infer: true })),
        ],
        logger: logger.child(EventClient.name),
      }),
    }),
    UserModule,
    ChatModule,
  ],
})
export class AppModule {}
