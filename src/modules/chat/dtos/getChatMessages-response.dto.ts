import { CommonMessageResposeDto } from 'src/common/dtos/common-message-response.dto';

export class GetChatMessagesResponseDto {
  chatId: string;
  messages: CommonMessageResposeDto[];

  constructor(chatId: string, messages: CommonMessageResposeDto[]) {
    this.chatId = chatId;
    this.messages = messages;
  }
}
