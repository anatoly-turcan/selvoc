import { join } from 'path/posix';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonConfig, loadCommonConfig } from '@common/infrastructure/config/common.config';
import { ChatModule } from '@modules/chat/chat.module';

import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forFeature(loadCommonConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<CommonConfig, true>) => ({
        ...configService.get('typeorm', { infer: true }),
        autoLoadEntities: true,
      }),
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
    UserModule,
    ChatModule,
  ],
})
export class AppModule {}
