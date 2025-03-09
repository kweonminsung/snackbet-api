import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/app.module';
import { AccountModule } from './modules/account/account.module';
import { ChatModule } from './modules/chat/chat.module';
import { BettingModule } from './modules/betting/betting.module';
import { HealthzModule } from './modules/healthz/healthz.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    AppConfigModule,
    AccountModule,
    ChatModule,
    BettingModule,
    HealthzModule,
    LoggerModule.forRoot(),
  ],
})
export class AppModule {}
