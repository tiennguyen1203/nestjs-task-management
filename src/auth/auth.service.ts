import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) { }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<{ success: boolean }> {
    const { username, password } = authCredentialsDto;

    const existUser: User = await this.userRepository.getUserByUsername(username);
    if (existUser) {
      throw new BadRequestException('Username has been existing in system');
    }

    const user: User = new User();

    user.username = username;
    user.password = password;

    await user.save();
    return {
      success: true
    };
  }
}
