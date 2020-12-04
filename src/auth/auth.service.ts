import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) { }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<{ success: boolean }> {
    const { username, password } = authCredentialsDto;

    const user: User = new User();

    user.username = username;
    user.password = password;

    try {
      await user.save();
      return {
        success: true
      }
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username has been existing in system');
      }

      throw new InternalServerErrorException();
    }
  }
}
