import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatMessageRequestDto } from './dtos/createChatMessage-request.dto';
import { forwardRef, Inject, Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../config/auth/jwt/jwt.guard';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CurrentAccount } from 'src/common/decorators/current-account.decorator';
import { Account } from '@prisma/client';
import { CommonMessageResposeDto } from 'src/common/dtos/common-message-response.dto';

@UseGuards(JwtAuthGuard)
@WebSocketGateway({
  cors: true,
  path: '/chat/ws',
  namespace: 'chat/ws',
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger();

  constructor(
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
    private readonly prismaService: PrismaService,
  ) {}

  sendChatMessage(
    chatId: string,
    messageId: string,
    content: string,
    craetedAt: Date,
    senderId: string,
  ) {
    this.server
      .to(chatId)
      .emit(
        'newChatMessage',
        new CommonMessageResposeDto(messageId, content, craetedAt, senderId),
      );
  }

  @SubscribeMessage('sendChatMessage')
  async handleChatMessage(
    @MessageBody() createChatMessageRequestDto: CreateChatMessageRequestDto,
    @ConnectedSocket() client: Socket,
    @CurrentAccount() currentAccount: Account,
  ) {
    await this.chatService.createChatMessage(
      currentAccount,
      createChatMessageRequestDto,
    );
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
    @CurrentAccount() currentAccount: Account,
  ) {
    const isMember = await this.prismaService.chatRoomAccount.findFirst({
      where: {
        chatRoomId: chatId,
        accountId: currentAccount.id,
      },
    });
    if (isMember === null) {
      throw new WsException('You are not a member of this chat');
    }

    this.logger.log(`account[${currentAccount.id}] joined chat[${chatId}]`);

    client.join(chatId);
  }

  @SubscribeMessage('leaveChat')
  async handleLeaveChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
    @CurrentAccount() currentAccount: Account,
  ) {
    const isMember = await this.prismaService.chatRoomAccount.findFirst({
      where: {
        chatRoomId: chatId,
        accountId: currentAccount.id,
      },
    });
    if (isMember === null) {
      throw new WsException('You are not a member of this chat');
    }

    this.logger.log(`account[${currentAccount.id}] left chat[${chatId}]`);

    client.leave(chatId);
  }
}
