import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateChatRequestDto } from './dtos/createChat-request';
import { v4 as uuidv4 } from 'uuid';
import { Account, ChatRoom } from '@prisma/client';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { CommonChatResposeDto } from 'src/common/dtos/common-chat-response.dto';
import { GetChatMessagesQueryDto } from './dtos/getChatMessages-query.dto';
import { GetChatMessagesResponseDto } from './dtos/getChatMessages-response.dto';
import { CommonSimpleAccountResposeDto } from 'src/common/dtos/common-account-response.dto';
import { CommonMessageResposeDto } from 'src/common/dtos/common-message-response.dto';

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
      throw new BadRequestException('Chat not found');
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

  async getChatMessages(
    id: string,
    account: Account,
    getChatMessagesQueryDto: GetChatMessagesQueryDto,
  ) {
    const chat = await this.prismaService.chatRoom.findUnique({
      where: {
        id,
      },
    });

    if (!chat) {
      throw new BadRequestException('Chat not found');
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

    const { lastMessageId, limit, sortBy, orderBy } = getChatMessagesQueryDto;

    const sortByColumn = (() => {
      switch (sortBy) {
        case 'WRITE_DATE':
        default:
          return 'createdAt';
      }
    })();

    const messages = await this.prismaService.message.findMany({
      where: {
        chatRoomId: id,
      },
      take: limit,
      orderBy: {
        [sortByColumn]: orderBy,
      },
      ...(lastMessageId
        ? {
            cursor: { id: lastMessageId },
            skip: 1, // 커서 메시지는 제외하고 이후 메시지부터 가져오기
          }
        : {}),
    });

    const accountIds = [...new Set(messages.map((msg) => msg.senderId))];
    const accounts = await this.prismaService.account.findMany({
      where: {
        id: {
          in: accountIds,
        },
      },
    });

    return new CommonResponseDto(
      new GetChatMessagesResponseDto(
        id,
        messages.map(
          (msg) =>
            new CommonMessageResposeDto(
              msg.id,
              msg.content,
              msg.createdAt,
              msg.senderId,
            ),
        ),
        accounts.map(
          (acc) => new CommonSimpleAccountResposeDto(acc.id, acc.username),
        ),
      ),
    );
  }

  async deleteChat(id: string, account: Account) {
    const chat = await this.prismaService.chatRoom.findUnique({
      where: {
        id,
      },
    });

    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    if (chat.creatorId !== account.id) {
      throw new UnauthorizedException('You are not the owner of this chat');
    }

    try {
      await this.prismaService.$transaction(async (tx) => {
        await tx.chatRoom.delete({
          where: {
            id,
          },
        });
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Failed to delete chat');
    }
  }

  async updateChat(
    id: string,
    account: Account,
    updateChatRequestDto: CreateChatRequestDto,
  ) {
    const chat = await this.prismaService.chatRoom.findUnique({
      where: {
        id,
      },
    });

    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    if (chat.creatorId !== account.id) {
      throw new UnauthorizedException('You are not the owner of this chat');
    }

    const { name, description } = updateChatRequestDto;

    try {
      await this.prismaService.$transaction(async (tx) => {
        await tx.chatRoom.update({
          where: {
            id,
          },
          data: {
            name,
            description,
          },
        });
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Failed to update chat');
    }
  }
}
