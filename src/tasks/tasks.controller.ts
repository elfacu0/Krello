import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards, Request, Body, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTaskDto } from './dto';
import { DeleteTaskDto } from './dto/deleteTask.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) { }

    @HttpCode(HttpStatus.OK)
    @Get("/all")
    getTasks() {
        return this.taskService.getTasks();
    }


    @HttpCode(HttpStatus.OK)
    @Get(":id")
    getTask(@Param('id', ParseIntPipe) id: number) {
        return this.taskService.getTask(id);
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post("create")
    createTask(@Request() req, @Body() dto: CreateTaskDto) {
        const { user } = req;
        return this.taskService.createTask(user.id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete("delete")
    deleteTask(@Request() req, @Body() dto: DeleteTaskDto) {
        const { user } = req;
        return this.taskService.deleteTask(user.id, dto);
    }




}