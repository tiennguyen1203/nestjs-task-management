import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { IJwtPayload } from './interface/auth.interface';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
dotenv.config();

console.log(process.env.JWT_SECRET)
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    })
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const { id } = payload;

    const user: User = await this.userRepository.findOne({ id });
    if (!user) {
      throw new UnauthorizedException('Username or password is incorrect');
    }
    console.log('that\'s right ?');

    return user;
  }
}