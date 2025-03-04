import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/common/constants';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    CacheModule.register(),
  ],
  providers: [AccountService, JwtStrategy],
  controllers: [AccountController],
})
export class AccountModule {}
