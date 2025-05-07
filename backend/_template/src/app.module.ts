import { join } from 'path/posix';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from '@bobo/nest-auth';
import { PinoLoggerModule } from '@bobo/nest-logger-pino';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from '@modules/core';
import { RenameModule } from '@modules/rename';

import { AppConfig, loadAppConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadAppConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => ({
        ...configService.get('typeorm', { infer: true }),
        autoLoadEntities: true,
      }),
    }),
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
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
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) =>
        configService.get('auth', { infer: true }),
    }),
    CoreModule,
    RenameModule,
  ],
})
export class AppModule {}
