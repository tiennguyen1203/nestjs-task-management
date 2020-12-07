import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import * as config from 'config';
import * as dotenv from 'dotenv';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from './interface/auth.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

const jwtConfig = config.get('jwt');
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || jwtConfig.secret
    })
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const { id } = payload;

    const user: User = await this.userRepository.findOne({ id });
    // if (!user) {
    //   throw new UnauthorizedException('Username or password is incorrect');
    // }

    return user;
  }
}