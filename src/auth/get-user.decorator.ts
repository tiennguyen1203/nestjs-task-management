import { IncomingMessage } from 'http';
import { User } from './user.entity';
import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JsonWebTokenError } from 'jsonwebtoken'

export class RequestIncomingMessage extends IncomingMessage {
  user: User;
  authInfo: Error | undefined;
}

export const GetUser = createParamDecorator((data, input: ExecutionContext): User => {
  const req: RequestIncomingMessage = input.switchToHttp().getRequest();
  if (req.authInfo instanceof JsonWebTokenError) {
    throw new UnauthorizedException('Username or password is incorrect');
  }

  return req.user;
})