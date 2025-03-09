import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BettingService } from './betting.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/config/auth/jwt/jwt.guard';
import { CreateBettingRequestDto } from './dtos/createBetting-request.dto';
import { CurrentAccount } from 'src/common/decorators/current-account.decorator';
import { Account } from '@prisma/client';
import { CreateAccountBettingRequestDto } from './dtos/createAccountBetting-request.dto';

@ApiTags('betting')
@UseGuards(JwtAuthGuard)
@Controller('betting')
export class BettingController {
  constructor(private readonly bettingService: BettingService) {}

  @Post()
  @ApiOperation({ summary: '배팅 생성' })
  @ApiBearerAuth('access-token')
  async createBetting(
    @Body() createBettingRequestDto: CreateBettingRequestDto,
    @CurrentAccount() currentAccount: Account,
  ) {
    return this.bettingService.createBetting(
      currentAccount,
      createBettingRequestDto,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: '배팅 조회' })
  @ApiBearerAuth('access-token')
  async getBetting(
    @Param('id') id: string,
    @CurrentAccount() currentAccount: Account,
  ) {
    return this.bettingService.getBetting(id, currentAccount);
  }

  @Post(':id')
  @ApiOperation({ summary: '배팅 참여' })
  @ApiBearerAuth('access-token')
  async createAccountBetting(
    @Param('id') id: string,
    @Body() createAccountBettingRequestDto: CreateAccountBettingRequestDto,
    @CurrentAccount() currentAccount: Account,
  ) {
    return this.bettingService.createAccountBetting(
      id,
      currentAccount,
      createAccountBettingRequestDto,
    );
  }
}
