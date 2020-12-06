import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IUserResult } from './../interface/auth.interface';

@Injectable()
export class AuthGuardOptional extends AuthGuard() {
  handleRequest<T = IUserResult | false>(err, user: T, info): T {
    return user;
  }
}