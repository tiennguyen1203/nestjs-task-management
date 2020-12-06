import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';
import { IUserResult } from './../interface/auth.interface';

@Injectable()
export class AuthGuardOptional extends AuthGuard() {
  handleRequest<T = IUserResult | false>(err, user: T, info): T {
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    return user;
  }
}