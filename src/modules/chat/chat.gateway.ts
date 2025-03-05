import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatMessageRequestDto } from './dtos/createChatMessage-request.dto';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../account/jwt/jwt.guard';
import { PrismaService } from 'src/config/prisma/prisma.service';

@UseGuards(JwtAuthGuard)
@WebSocketGateway({
  cors: true,
  path: '/chat',
  namespace: 'chat',
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger();

  constructor(
    private readonly chatService: ChatService,
    private readonly prismaService: PrismaService,
  ) {}

  sendChatMessage() {
    this.server.emit('newChatMessage', 'Hello World!');
  }

  @SubscribeMessage('sendChatMessage')
  async handleChatMessage(
    @MessageBody() createChatMessageRequestDto: CreateChatMessageRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(createChatMessageRequestDto);
    // const data = {
    // const message = await this.chatService.createChatMessage(data);
    // this.server
    //   .to(`chat-${createChatMessageRequestDto.chatId}`)
    //   .emit('newMessage', message);
    // return message;
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`User joined chat-${chatId}`);
    client.join(chatId);
    this.server.to(chatId).emit('newMessage', `User joined chat-${chatId}`);
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`chat-${chatId}`);
  }
}
