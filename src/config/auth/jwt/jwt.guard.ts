import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    } else if (context.getType() === 'ws') {
      const wsContext = context.switchToWs();
      const client = wsContext.getClient();

      // Extract token from custom query
      const { token } = client.handshake.query;
      if (!token) {
        throw new WsException('Token not found');
      }
      client.handshake.headers.authorization = token;
      return client.handshake;
    }
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new WsException('Unauthorized');
    }
    return user;
  }
}
