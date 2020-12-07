import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as config from 'config';
import * as dotenv from 'dotenv';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';

dotenv.config();

const jwtYmlConfig = config.get('jwt');

const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || jwtYmlConfig.secret,
  signOptions: {
    expiresIn: jwtYmlConfig.expiresIn || 3 * 24 * 60 * 60, // 3 days
  }
}
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(jwtConfig),
    TypeOrmModule.forFeature([UserRepository])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [
    //   JwtStrategy,
    PassportModule
  ]
})
export class AuthModule { }
