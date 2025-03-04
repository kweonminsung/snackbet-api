import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Account } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Payload } from './jwt.payload';
import { JWT_SECRET } from 'src/common/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const account: Account = await this.prismaService.account.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!account) {
      throw new UnauthorizedException();
    }
    return account;
  }
}
