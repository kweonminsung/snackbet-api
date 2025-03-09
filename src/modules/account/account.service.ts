import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { AuthAccountRequestDto } from './dtos/authAccount-request.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import bs58 from 'bs58';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { CommonResponseDto } from 'src/common/dtos/common-response.dto';
import { AuthAccountResponseDto } from './dtos/authAccount-response.dto';
import { v4 as uuidv4 } from 'uuid';
import { Account } from '@prisma/client';
import { CommonAccountResposeDto } from '../../common/dtos/common-account-response.dto';
import { CommonChatResposeDto } from 'src/common/dtos/common-chat-response.dto';
import { UpdateAccountRequestDto } from './dtos/updateAccount-request.dto';
import { CommonAccountBettingResponseDto } from 'src/common/dtos/common-accountBetting-response.dto';
import { GetMyChatsResponseDto } from './dtos/getMyChats-response.dto';
import { GetMyBettingsResponseDto } from './dtos/getMyBettings-response.dto';
import { CommonBettingResponseDto } from 'src/common/dtos/common-betting-response.dto';
import { CommonOptionResponseDto } from 'src/common/dtos/common-option-response.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private logger = new Logger();

  async createAccountNonce() {
    const nonce = Math.random().toString(36).substring(2);

    await this.cacheManager.set(nonce, true);

    return nonce;
  }

  async authAccount(dto: AuthAccountRequestDto) {
    const { publicKey, signature, nonce } = dto;

    const cachedNonce = await this.cacheManager.get(nonce);
    if (cachedNonce === undefined) {
      throw new UnauthorizedException('Invalid Request');
    }
    await this.cacheManager.del(nonce);

    try {
      // 1. signature (base64 or hex) 디코딩
      // Phantom에서 넘어오는 값이 base64라면 bs58 디코딩이 아니라
      // Buffer.from(signature, 'base64')를 사용해야 합니다.
      // Phantom signMessage에서 전달되는 signature는 기본적으로 base64입니다.
      const signatureUint8 = new Uint8Array(Buffer.from(signature, 'base64'));

      // 2. publicKey 디코딩
      // Phantom에서 resp.publicKey.toString() 한 값은 base58 형식이므로 bs58 디코딩
      const publicKeyUint8 = bs58.decode(publicKey);
      const pubKey = new PublicKey(publicKeyUint8);

      // 3. Nonce를 다시 Uint8Array로
      const messageUint8 = new TextEncoder().encode(nonce);

      // 4. TweetNacl을 이용한 서명 검증
      const verified = nacl.sign.detached.verify(
        messageUint8, // 원본 메시지
        signatureUint8, // 서명
        pubKey.toBytes(), // 공개키
      );

      if (!verified) {
        throw new UnauthorizedException('Signature verification failed');
      }

      // 여기서 verified == true라면 => 해당 publicKey의 개인키 소유자가 맞음
      let account = await this.prismaService.account.findUnique({
        where: {
          walletAddress: publicKey,
        },
      });

      if (!account) {
        account = (await this.prismaService.$transaction(async (tx) => {
          return await tx.account.create({
            data: {
              id: uuidv4(),
              walletAddress: publicKey,
            },
          });
        })) as Account;
      }

      return new CommonResponseDto(
        new AuthAccountResponseDto(
          account.id,
          this.jwtService.sign({ sub: account.id }),
        ),
      );
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  getMyAccount(account: Account) {
    return new CommonResponseDto(
      new CommonAccountResposeDto(
        account.id,
        account.username,
        account.walletAddress,
      ),
    );
  }

  async updateMyAccount(
    updateAccountRequestDto: UpdateAccountRequestDto,
    account: Account,
  ) {
    const { username } = updateAccountRequestDto;

    try {
      await this.prismaService.$transaction(async (tx) => {
        await tx.account.update({
          where: {
            id: account.id,
          },
          data: {
            username,
          },
        });
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Failed to update account');
    }
  }

  async getMyChats(account: Account) {
    const chats = await this.prismaService.chatRoomAccount.findMany({
      where: {
        accountId: account.id,
      },
      include: {
        chatRoom: {
          include: {
            messages: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });

    return new CommonResponseDto(
      new GetMyChatsResponseDto(
        chats.map(
          (chat) =>
            new CommonChatResposeDto(
              chat.id,
              chat.chatRoom.name,
              chat.chatRoom.description,
              chat.chatRoom.createdAt,
              chat.chatRoom.messages[0]?.content,
              chat.chatRoom.messages[0]?.createdAt,
            ),
        ),
      ),
    );
  }

  async getMyBettings(account: Account) {
    const bettings = await this.prismaService.accountBetting.findMany({
      where: {
        accountId: account.id,
        deletedAt: null,
      },
      include: {
        betting: {
          include: {
            options: true,
          },
        },
        option: true,
      },
    });

    return new CommonResponseDto(
      new GetMyBettingsResponseDto(
        bettings.map(
          (betting) =>
            new CommonAccountBettingResponseDto(
              betting.amount,
              betting.accountId,
              new CommonBettingResponseDto(
                betting.betting.id,
                betting.betting.name,
                betting.betting.description,
                betting.betting.createdAt,
                betting.betting.isEnded,
                betting.betting.endDate,
                betting.betting.isSettled,
                betting.betting.options.map(
                  (option) =>
                    new CommonOptionResponseDto(
                      option.id,
                      option.name,
                      option.description,
                    ),
                ),
              ),
              new CommonOptionResponseDto(
                betting.option.id,
                betting.option.name,
                betting.option.description,
              ),
            ),
        ),
      ),
    );
  }

  async getAccount(id: string) {
    const account = await this.prismaService.account.findUnique({
      where: {
        id,
      },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return new CommonResponseDto(
      new CommonAccountResposeDto(
        account.id,
        account.username,
        account.walletAddress,
      ),
    );
  }

  // 이하 코드는 디버그용 코드입니다.
  async createAdminAccount() {
    const account = (await this.prismaService.$transaction(async (tx) => {
      return await tx.account.create({
        data: {
          id: uuidv4(),
          username: 'administator',
          walletAddress: 'admin',
          isAdmin: true,
        },
      });
    })) as Account;

    return new CommonResponseDto(
      new CommonAccountResposeDto(
        account.id,
        account.username,
        account.walletAddress,
      ),
    );
  }

  async authAdminAccount(dto: AuthAccountRequestDto) {
    const { publicKey, signature, nonce } = dto;

    let account = await this.prismaService.account.findUnique({
      where: {
        walletAddress: publicKey,
      },
    });

    return new CommonResponseDto(
      new AuthAccountResponseDto(
        account.id,
        this.jwtService.sign({ sub: account.id }),
      ),
    );
  }
}
