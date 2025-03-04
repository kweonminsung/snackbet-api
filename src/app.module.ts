import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/app.module';
import { AccountModule } from './modules/account/account.module';
import { ChatModule } from './modules/chat/chat.module';
import { BetModule } from './modules/bet/bet.module';

@Module({
  imports: [AppConfigModule, AccountModule, ChatModule, BetModule],
})
export class AppModule {}
