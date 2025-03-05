import { CommonSimpleAccountResposeDto } from 'src/common/dtos/common-account-response.dto';
import { CommonMessageResposeDto } from 'src/common/dtos/common-message-response.dto';

export class GetChatMessagesResponseDto {
  chatId: string;
  messages: CommonMessageResposeDto[];
  senders: CommonSimpleAccountResposeDto[];

  constructor(
    chatId: string,
    messages: CommonMessageResposeDto[],
    senders: CommonSimpleAccountResposeDto[],
  ) {
    this.chatId = chatId;
    this.messages = messages;
    this.senders = senders;
  }
}
