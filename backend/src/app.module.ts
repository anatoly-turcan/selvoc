import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonConfig, loadCommonConfig } from '@common/infrastructure/config/common.config';

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
    UserModule,
  ],
})
export class AppModule {}
