import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SoftUserAuthGuard extends AuthGuard('user-jwt') {
  handleRequest(err, user) {
    // no error is thrown if no user is found
    // You can use info for logging (e.g. token is expired etc.)
    // e.g.: if (info instanceof TokenExpiredError) ...
    return user;
  }
}

@Injectable()
export class SoftAdminAuthGuard extends AuthGuard('admin-jwt') {
  handleRequest(err, user) {
    // no error is thrown if no user is found
    // You can use info for logging (e.g. token is expired etc.)
    // e.g.: if (info instanceof TokenExpiredError) ...
    return user;
  }
}
