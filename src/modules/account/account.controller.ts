import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { AuthAccountRequestDto } from './dtos/authAccount-request.dto';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { CurrentAccount } from 'src/common/decorators/current-account.decorator';
import { Account } from '@prisma/client';
import { IsAdminGuard } from './jwt/isAdmin.guard';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('auth/nonce')
  @HttpCode(201)
  @ApiOperation({ summary: '로그인 nonce 생성' })
  async createAccountNonce() {
    return await this.accountService.createAccountNonce();
  }

  @Post('auth')
  @HttpCode(201)
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: AuthAccountRequestDto })
  async authAccount(@Body() dto: AuthAccountRequestDto) {
    return await this.accountService.authAccount(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 계정 정보 조회' })
  @ApiBearerAuth('access-token')
  async getMyAccount(@CurrentAccount() currentAccount: Account) {
    return await this.accountService.getMyAccount(currentAccount);
  }

  @Get('me/chats')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 채팅방 목록 조회' })
  @ApiBearerAuth('access-token')
  async getMyChats(@CurrentAccount() currentAccount: Account) {
    return await this.accountService.getMyChats(currentAccount);
  }

  @Get(':id')
  @UseGuards(IsAdminGuard)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '회원 정보 조회' })
  async getAccount(@Param('id') id: string) {
    return await this.accountService.getAccount(id);
  }

  // 이하 코드는 디버그용 코드입니다.
  @Post('debug/admin')
  @HttpCode(201)
  @ApiOperation({ summary: '디버그용 관리자 계정 생성' })
  async createAdminAccount() {
    return await this.accountService.createAdminAccount();
  }

  @Post('debug/admin/auth')
  @ApiOperation({ summary: '디버그용 관리자 계정 로그인' })
  @ApiBody({ type: AuthAccountRequestDto })
  async authAdminAccount(@Body() dto: AuthAccountRequestDto) {
    return await this.accountService.authAdminAccount(dto);
  }
}
