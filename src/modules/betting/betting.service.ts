import { BadRequestException, Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateBettingRequestDto } from './dtos/createBetting-request.dto';

@Injectable()
export class BettingService {
  constructor(private readonly prismaService: PrismaService) {}

  async createBet(
    currentAccount: Account,
    createBettingRequestDto: CreateBettingRequestDto,
  ) {
    const { chatId, name, description, endDate, eventSource, governanceType } =
      createBettingRequestDto;
  }

  async getBet(id: string, currentAccount: Account) {
    const betting = await this.prismaService.betting.findUnique({
      where: {
        id,
      },
    });

    if (!betting) {
      throw new BadRequestException('Betting not found');
    }
  }
}
