import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../account/jwt/jwt.guard';
import { CreateChatRequestDto } from './dtos/createChat-request';
import { CurrentAccount } from 'src/common/decorators/current-account.decorator';
import { Account } from '@prisma/client';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '채팅방 생성' })
  @ApiBearerAuth('access-token')
  async createChat(
    @Body() createChatRequestDto: CreateChatRequestDto,
    @CurrentAccount() currentAccount: Account,
  ) {
    return await this.chatService.createChat(
      createChatRequestDto,
      currentAccount,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '채팅방 조회' })
  @ApiBearerAuth('access-token')
  async getChat(
    @Param('id') id: string,
    @CurrentAccount() currentAccount: Account,
  ) {
    return await this.chatService.getChat(id, currentAccount);
  }

  @Get(':id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '채팅방 메시지 조회' })
  @ApiBearerAuth('access-token')
  async getChatMessages(@Param('id') id: string) {
    return await this.chatService.getChatMessages(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '채팅방 삭제' })
  @ApiBearerAuth('access-token')
  async deleteChat(@Param('id') id: string) {
    return await this.chatService.deleteChat(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '채팅방 수정' })
  @ApiBearerAuth('access-token')
  async updateChat(@Param('id') id: string) {
    return await this.chatService.updateChat(id);
  }
}
