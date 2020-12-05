import { UserResult } from './dto/user-result.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  @Post('/signUp')
  @UsePipes(ValidationPipe)
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<UserResult> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signIn')
  signIn(@Body(ValidationPipe) authCredentials: AuthCredentialsDto): Promise<UserResult> {
    return this.authService.signIn(authCredentials);
  }
}
