import { Module } from '@nestjs/common';
import { BettingService } from './betting.service';
import { BettingController } from './betting.controller';

@Module({
  providers: [BettingService],
  controllers: [BettingController],
})
export class BettingModule {}
