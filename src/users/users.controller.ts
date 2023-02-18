
import { Controller, Get, HttpCode, HttpStatus, Patch, UseGuards, Request, Body, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards';
import { EditUserDto } from './dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Get("tasks")
    getTasks(@Request() req) {
        const { user } = req;
        return this.usersService.getUserTasks(Number(user.id));
    }

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

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Delete("delete")
    deleteUser(@Request() req) {
        const { user } = req;
        return this.usersService.deleteUser(user.id);
    }
}
