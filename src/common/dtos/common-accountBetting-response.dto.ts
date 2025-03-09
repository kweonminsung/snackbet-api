import { CommonBettingResponseDto } from './common-betting-response.dto';
import { CommonOptionResponseDto } from './common-option-response.dto';

export class CommonAccountBettingResponseDto {
  amount: number;
  accountId: string;
  betting: CommonBettingResponseDto;
  option: CommonOptionResponseDto;

  constructor(
    amount: number,
    accountId: string,
    betting: CommonBettingResponseDto,
    option: CommonOptionResponseDto,
  ) {
    this.amount = amount;
    this.accountId = accountId;
    this.betting = betting;
    this.option = option;
  }
}
