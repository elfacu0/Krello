import { Body, Controller, Post, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AuthService } from './auth.service';
import { RegisterDto } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { RefreshAuthGuard } from './rt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @ApiOperation({ description: "Generate a new access token using refresh token" })
    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshAuthGuard)
    @Post('refresh')
    async refresh(@Request() req) {
        return this.authService.refresh(req.user);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Request() req) {
        return this.authService.logout(req.user);
    }
}
