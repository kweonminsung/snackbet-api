import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateChatRequestDto } from './dtos/createChat-request';
import { v4 as uuidv4 } from 'uuid';
import { Account, ChatRoom } from '@prisma/client';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { CommonChatResposeDto } from 'src/common/dtos/common-chat-response.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}
  private logger = new Logger();

  async createChat(
    createChatRequestDto: CreateChatRequestDto,
    account: Account,
  ) {
    const { name, description } = createChatRequestDto;

    try {
      const newChat = (await this.prismaService.$transaction(async (tx) => {
        const _newChat = await tx.chatRoom.create({
          data: {
            id: uuidv4(),
            name,
            description,
            creatorId: account.id,
          },
        });

        await tx.chatRoomAccount.create({
          data: {
            id: uuidv4(),
            chatRoomId: _newChat.id,
            accountId: account.id,
          },
        });

        return _newChat;
      })) as ChatRoom;

      return new CommonResponseDto(
        new CommonChatResposeDto(
          newChat.id,
          newChat.name,
          newChat.description,
          newChat.createdAt,
        ),
      );
    } catch (err) {
      this.logger.error(err);
      throw new Error('Failed to create chat');
    }
  }

  async getChat(id: string, account: Account) {
    const chat = await this.prismaService.chatRoom.findUnique({
      where: {
        id,
      },
    });

    if (!chat) {
      throw new Error('Chat not found');
    }

    const isMember = await this.prismaService.chatRoomAccount.findFirst({
      where: {
        chatRoomId: chat.id,
        accountId: account.id,
      },
    });
    if (isMember === null) {
      throw new UnauthorizedException('You are not a member of this chat');
    }

    return new CommonResponseDto(
      new CommonChatResposeDto(
        chat.id,
        chat.name,
        chat.description,
        chat.createdAt,
      ),
    );
  }

  async getChatMessages(id: string) {
    return `getChatMessages ${id}`;
  }

  async deleteChat(id: string) {
    return `deleteChat ${id}`;
  }

  async updateChat(id: string) {
    return `updateChat ${id}`;
  }
}
