import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards, Request, Body, Delete, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto, EditTaskDto } from './dto';
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
    @HttpCode(HttpStatus.CREATED)
    @Post("create")
    createTask(@Request() req, @Body() dto: CreateTaskDto) {
        const { user } = req;
        return this.taskService.createTask(user.id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Patch("edit")
    editTask(@Request() req, @Body() dto: EditTaskDto) {
        const { user } = req;
        return this.taskService.editTask(user.id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete("delete")
    deleteTask(@Request() req, @Body() dto: DeleteTaskDto) {
        const { user } = req;
        return this.taskService.deleteTask(user.id, dto);
    }

}
