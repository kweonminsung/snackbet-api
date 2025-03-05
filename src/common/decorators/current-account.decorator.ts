import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentAccount = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (ctx.getType() === 'http') {
      return request.user;
    } else if (ctx.getType() === 'ws') {
      const client = ctx.switchToWs().getClient();
      return client.handshake.user;
    }
  },
);
