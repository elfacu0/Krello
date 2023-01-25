import { Controller, Get, HttpCode, HttpStatus, Patch, UseGuards, Request, Body, Param, ParseIntPipe } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EditUserDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // @HttpCode(HttpStatus.OK)
    // @Get(":username")
    // getUser(@Param('username') username: string) {
    //     return this.usersService.getUser(username);
    // }

    @HttpCode(HttpStatus.OK)
    @Get(":id")
    getUserById(@Param('id', ParseIntPipe) userId: number) {
        return this.usersService.getUserById(userId);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Patch("edit")
    editProfile(@Request() req, @Body() dto: EditUserDto) {
        const { user } = req;
        return this.usersService.editUser(user.id, dto);
    }
}
