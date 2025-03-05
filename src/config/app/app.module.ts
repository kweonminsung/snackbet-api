import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import configuration from './configuration';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // cache: true,
      load: [configuration],
      ignoreEnvFile: process.env.APP_ENV === 'production',
    }),
    PrismaModule,
    AuthModule,
  ],
})
export class AppConfigModule {}
