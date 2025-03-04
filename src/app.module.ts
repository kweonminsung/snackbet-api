import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/app.module';
import { AccountModule } from './modules/account/account.module';
import { ChatModule } from './modules/chat/chat.module';
import { BetModule } from './modules/bet/bet.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    AppConfigModule,
    AccountModule,
    ChatModule,
    BetModule,
    CacheModule.register(),
  ],
})
export class AppModule {}
