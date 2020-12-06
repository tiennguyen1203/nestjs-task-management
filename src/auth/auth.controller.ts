import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GetUser } from './get-user.decorator';
import { IUserResult } from './interface/auth.interface';
import { AuthGuardOptional } from './guard/auth.guard.optional';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  @Post('/signUp')
  @UsePipes(ValidationPipe)
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<IUserResult> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signIn')
  signIn(@Body(ValidationPipe) authCredentials: AuthCredentialsDto): Promise<IUserResult> {
    return this.authService.signIn(authCredentials);
  }

  @Post('/test')
  @UseGuards(AuthGuardOptional)
  test(@GetUser() user: User) {
    console.log(user);
  }
}
