import { Body, Controller, Post, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);        
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req) {
        console.log(req.user);
        return req.user;
    }
}
