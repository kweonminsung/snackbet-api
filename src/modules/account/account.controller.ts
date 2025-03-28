import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { AuthAccountRequestDto } from './dtos/authAccount-request.dto';
import { JwtAuthGuard } from '../../config/auth/jwt/jwt.guard';
import { CurrentAccount } from 'src/common/decorators/current-account.decorator';
import { Account } from '@prisma/client';
import { IsAdminGuard } from '../../config/auth/jwt/isAdmin.guard';
import { UpdateAccountRequestDto } from './dtos/updateAccount-request.dto';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';

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

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 계정 정보 수정' })
  @ApiBearerAuth('access-token')
  async updateMyAccount(
    @CurrentAccount() currentAccount: Account,
    @Body() updateAccountRequestDto: UpdateAccountRequestDto,
  ) {
    await this.accountService.updateMyAccount(
      updateAccountRequestDto,
      currentAccount,
    );

    return new CommonResponseDto();
  }

  @Get('me/chats')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 채팅방 목록 조회' })
  @ApiBearerAuth('access-token')
  async getMyChats(@CurrentAccount() currentAccount: Account) {
    return await this.accountService.getMyChats(currentAccount);
  }

  @Get('me/bets')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 배팅 목록 조회' })
  @ApiBearerAuth('access-token')
  async getMyBets(@CurrentAccount() currentAccount: Account) {
    return await this.accountService.getMyBettings(currentAccount);
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
