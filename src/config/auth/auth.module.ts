import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/common/constants';
import { JwtStrategy } from './jwt/jwt.strategy';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule, PassportModule, JwtStrategy],
})
export class AuthModule {}
