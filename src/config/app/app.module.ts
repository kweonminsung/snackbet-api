import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import configuration from './configuration';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // cache: true,
      load: [configuration],
      ignoreEnvFile: process.env.APP_ENV === 'production',
    }),
    PrismaModule,
  ],
})
export class AppConfigModule {}
