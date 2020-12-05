import { UserResult } from './dto/user-result.interface';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) { }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<UserResult> {
    const { username, password } = authCredentialsDto;

    const user: User = new User();
    user.username = username;
    user.salt = await this.userRepository.genSalt();
    user.password = await this.userRepository.hashPassword(password, user.salt);;

    try {
      await user.save();
      return {
        id: user.id,
        username: user.username
      }
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username has been existing in system');
      }

      throw new InternalServerErrorException();
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<UserResult> {
    const { username, password } = authCredentialsDto;

    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    const correctPassword = await user.validatePassword(password);
    if (!correctPassword) {
      throw new UnauthorizedException('Username or password is incorrect');
    };

    return {
      id: user.id,
      username: user.username
    };
  }
}
