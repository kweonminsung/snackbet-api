import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Account, Betting } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateBettingRequestDto } from './dtos/createBetting-request.dto';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { CommonBettingResponseDto } from 'src/common/dtos/common-betting-response.dto';
import { CommonOptionResponseDto } from 'src/common/dtos/common-option-response.dto';
import { v4 as uuidv4 } from 'uuid';
import { CreateAccountBettingRequestDto } from './dtos/createAccountBetting-request.dto';
import { CommonAccountBettingResponseDto } from 'src/common/dtos/common-accountBetting-response.dto';

@Injectable()
export class BettingService {
  constructor(private readonly prismaService: PrismaService) {}

  private logger = new Logger();

  async createBetting(
    account: Account,
    createBettingRequestDto: CreateBettingRequestDto,
  ) {
    const {
      chatId,
      name,
      description,
      endDate,
      eventSource,
      governanceType,
      options,
    } = createBettingRequestDto;

    const isMember = await this.prismaService.chatRoomAccount.findFirst({
      where: {
        chatRoomId: chatId,
        accountId: account.id,
      },
    });
    if (isMember === null) {
      throw new UnauthorizedException('You are not a member of this chat');
    }

    try {
      const newBetting = (await this.prismaService.$transaction(async (tx) => {
        const _newBetting = await tx.betting.create({
          data: {
            id: uuidv4(),
            name,
            description,
            endDate,
            governanceType,
            eventSource,
            chatRoomId: chatId,
            creatorId: account.id,
          },
        });

        await tx.bettingOption.createMany({
          data: options.map((option) => ({
            id: uuidv4(),
            name: option.name,
            description: option.description,
            bettingId: _newBetting.id,
          })),
        });

        const chatAccounts = await tx.chatRoomAccount.findMany({
          where: {
            chatRoomId: chatId,
          },
        });

        await tx.bettingWhiteList.createMany({
          data: chatAccounts.map((chatAccount) => ({
            id: uuidv4(),
            bettingId: _newBetting.id,
            accountId: chatAccount.accountId,
          })),
        });

        return _newBetting;
      })) as Betting;

      const bettingOptions = await this.prismaService.bettingOption.findMany({
        where: {
          bettingId: newBetting.id,
        },
      });

      return new CommonResponseDto(
        new CommonBettingResponseDto(
          newBetting.id,
          newBetting.name,
          newBetting.description,
          newBetting.createdAt,
          newBetting.isEnded,
          newBetting.endDate,
          newBetting.isSettled,
          bettingOptions.map(
            (option) =>
              new CommonOptionResponseDto(
                option.id,
                option.name,
                option.description,
              ),
          ),
        ),
      );
    } catch (err) {
      this.logger.error(err);
      throw new Error('Failed to create betting');
    }
  }

  async getBetting(id: string, account: Account) {
    const betting = await this.prismaService.betting.findUnique({
      where: {
        id,
      },
      include: {
        options: true,
      },
    });
    if (!betting) {
      throw new BadRequestException('Betting not found');
    }

    const isInWhiteList = await this.prismaService.bettingWhiteList.findFirst({
      where: {
        bettingId: betting.id,
        accountId: account.id,
      },
    });
    if (isInWhiteList === null) {
      throw new UnauthorizedException('You are not a member of this betting');
    }

    return new CommonResponseDto(
      new CommonBettingResponseDto(
        betting.id,
        betting.name,
        betting.description,
        betting.createdAt,
        betting.isEnded,
        betting.endDate,
        betting.isSettled,
        betting.options.map(
          (option) =>
            new CommonOptionResponseDto(
              option.id,
              option.name,
              option.description,
            ),
        ),
      ),
    );
  }

  async createAccountBetting(
    id: string,
    account: Account,
    createAccountBettingRequestDto: CreateAccountBettingRequestDto,
  ) {
    const betting = await this.prismaService.betting.findUnique({
      where: {
        id,
      },
      include: {
        options: true,
      },
    });
    if (!betting) {
      throw new BadRequestException('Betting not found');
    }

    const isInWhiteList = await this.prismaService.bettingWhiteList.findFirst({
      where: {
        bettingId: betting.id,
        accountId: account.id,
      },
    });
    if (isInWhiteList === null) {
      throw new UnauthorizedException('You are not a member of this betting');
    }

    const { optionId, amount } = createAccountBettingRequestDto;

    const option = betting.options.find((option) => option.id === optionId);
    if (!option) {
      throw new BadRequestException('Option not found');
    }

    try {
      const newAccountBetting = await this.prismaService.$transaction(
        async (tx) => {
          return tx.accountBetting.create({
            data: {
              id: uuidv4(),
              amount,
              accountId: account.id,
              bettingId: betting.id,
              optionId,
            },
          });
        },
      );

      return new CommonResponseDto(
        new CommonAccountBettingResponseDto(
          newAccountBetting.amount,
          newAccountBetting.accountId,
          new CommonBettingResponseDto(
            betting.id,
            betting.name,
            betting.description,
            betting.createdAt,
            betting.isEnded,
            betting.endDate,
            betting.isSettled,
            betting.options.map(
              (option) =>
                new CommonOptionResponseDto(
                  option.id,
                  option.name,
                  option.description,
                ),
            ),
          ),
          new CommonOptionResponseDto(
            option.id,
            option.name,
            option.description,
          ),
        ),
      );
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        'Failed to create account betting',
      );
    }
  }
}
