import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RepositoryService } from 'src/repository/repository.service';
import { CreateTaskDto } from './dto';
import { DeleteTaskDto } from './dto/deleteTask.dto';
import { TasksModule } from './tasks.module';

@Injectable()
export class TasksService {
    constructor(private repository: RepositoryService) { }

    async getTasks() {
        return await this.repository.task.findMany();
    }

    async getTask(id: number) {
        if (id === undefined) throw new BadRequestException('parameter error', { cause: new Error(), description: 'id needs to be a number' })
        const task = this.repository.task.findUnique({
            where: {
                id
            }
        });
        return task;
    }

    async createTask(userId: number, dto: CreateTaskDto) {
        const { content, status } = dto;
        return await this.repository.task.create({
            data: {
                userId,
                content,
                status
            }
        })

    }

    async deleteTask(userId: number, dto: DeleteTaskDto) {
        const { id } = dto;
        const task = await this.getTask(id);
        if (task.userId != userId) throw new UnauthorizedException();
        return await this.repository.task.delete({ where: { id } });
    }
}
