import { Body, Controller, Post, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto';
import { LocalAuthGuard } from './local-auth.guard';
import { RefreshAuthGuard } from './rt-auth.guard';

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

    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshAuthGuard)
    @Post('refresh')
    async refresh(@Request() req) {
        return this.authService.refresh(req.user);
    }
}
