import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../account/jwt/jwt.guard';
import { CreateChatRequestDto } from './dtos/createChat-request';
import { CurrentAccount } from 'src/common/decorators/current-account.decorator';
import { Account } from '@prisma/client';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { GetChatMessagesQueryDto } from './dtos/getChatMessages-query.dto';
import { CreateChatMessageRequestDto } from './dtos/createChatMessage-request.dto';

@ApiTags('chat')
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
  async getChatMessages(
    @Param('id') id: string,
    @CurrentAccount() currentAccount: Account,
    @Query() getChatMessagesQueryDto: GetChatMessagesQueryDto,
  ) {
    return await this.chatService.getChatMessages(
      id,
      currentAccount,
      getChatMessagesQueryDto,
    );
  }

  @Post(':id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '채팅방 메시지 생성' })
  @ApiBearerAuth('access-token')
  async createChatMessage(
    @Param('id') id: string,
    @CurrentAccount() currentAccount: Account,
    @Body() createChatMessageRequestDto: CreateChatMessageRequestDto,
  ) {
    await this.chatService.createChatMessage(
      id,
      currentAccount,
      createChatMessageRequestDto,
    );
    return new CommonResponseDto();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '채팅방 삭제' })
  @ApiBearerAuth('access-token')
  async deleteChat(
    @Param('id') id: string,
    @CurrentAccount() currentAccount: Account,
  ) {
    await this.chatService.deleteChat(id, currentAccount);
    return new CommonResponseDto();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '채팅방 수정' })
  @ApiBearerAuth('access-token')
  async updateChat(
    @Param('id') id: string,
    @CurrentAccount() currentAccount: Account,
    @Body() updateChatRequestDto: CreateChatRequestDto,
  ) {
    await this.chatService.updateChat(id, currentAccount, updateChatRequestDto);

    return new CommonResponseDto();
  }
}
