import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';
import { AuthAccountRequestDto } from './dtos/authAccount-request.dto';
import { Response } from 'express';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('auth/nonce')
  @ApiOperation({ summary: '로그인 nonce 생성' })
  async createAccountNonce() {
    return await this.accountService.createAccountNonce();
  }

  @Post('auth')
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: AuthAccountRequestDto })
  async authAccount(@Body() dto: AuthAccountRequestDto, @Res() res: Response) {
    return await this.accountService.authAccount(dto, res);
  }
}
