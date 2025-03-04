import { Injectable } from '@nestjs/common';

@Injectable()
export class IsAdminGuard {
  canActivate(context) {
    const request = context.switchToHttp().getRequest();
    return request.user.isAdmin;
  }
}
