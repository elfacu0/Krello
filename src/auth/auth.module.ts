import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy, JwtStrategy, RtStrategy } from './strategies/index';
import { jwtConstants } from './constants';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '15m' },
  }),],
  providers: [AuthService, LocalStrategy, JwtStrategy, RtStrategy],
  controllers: [AuthController]
})
export class AuthModule { }
