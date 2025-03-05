import { CommonSimpleAccountResposeDto } from 'src/common/dtos/common-account-response.dto';

export class GetChatAccountsResponseDto {
  chatId: string;
  accounts: CommonSimpleAccountResposeDto[];

  constructor(chatId: string, accounts: CommonSimpleAccountResposeDto[]) {
    this.chatId = chatId;
    this.accounts = accounts;
  }
}
