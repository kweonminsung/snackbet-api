import { CommonChatResposeDto } from 'src/common/dtos/common-chat-response.dto';

export class GetMyChatsResponseDto {
  chats: CommonChatResposeDto[];

  constructor(chats: CommonChatResposeDto[]) {
    this.chats = chats;
  }
}
