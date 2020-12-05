import { IUserResult } from './interface/auth.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
import { IncomingMessage } from 'http';

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
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req.user);
  }
}
