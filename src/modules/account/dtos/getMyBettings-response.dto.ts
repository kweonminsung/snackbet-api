import { CommonAccountBettingResponseDto } from 'src/common/dtos/common-accountBetting-response.dto';

export class GetMyBettingsResponseDto {
  accountBettings: CommonAccountBettingResponseDto[];

  constructor(accountBettings: CommonAccountBettingResponseDto[]) {
    this.accountBettings = accountBettings;
  }
}
