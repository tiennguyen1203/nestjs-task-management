import { IJwtPayload, IUserResult } from './interface/auth.interface';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) { }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<IUserResult> {
    const { username, password } = authCredentialsDto;

    const user: User = new User();
    user.username = username;
    user.password = await this.userRepository.hashPassword(password);

    try {
      await user.save();
      const jwtPayload: IJwtPayload = {
        id: user.id,
        username: user.username
      };
      const accessToken: string = this.jwtService.sign(jwtPayload);

      return {
        id: user.id,
        username: user.username,
        accessToken
      }
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username has been existing in system');
      }

      throw new InternalServerErrorException();
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const { username, password }: AuthCredentialsDto = authCredentialsDto;

    const user: User = await this.userRepository.createQueryBuilder('user')
      .where({ username })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    const correctPassword: boolean = await this.userRepository.compare(password, user.password);
    if (!correctPassword) {
      throw new UnauthorizedException('Username or password is incorrect');
    };

    const jwtPayload: IJwtPayload = {
      id: user.id,
      username: user.username
    };
    const accessToken: string = await this.jwtService.sign(jwtPayload);

    delete user.password;
    return {
      ...user,
      accessToken,
    };

  }
}
