import { BadRequestException, Injectable } from '@nestjs/common';
import { Collection } from '@prisma/client';
import { RepositoryService } from '../repository/repository.service';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CollectionsService {
    constructor(private tasksService: TasksService, private usersService: UsersService, private repository: RepositoryService) { }

    async getCollection(collectionId: number): Promise<Collection | Error> {
        if (collectionId === undefined) throw new BadRequestException('parameter error', { cause: new Error(), description: 'id needs to be a number' })
        try {
            return await this.repository.collection.findUnique({ where: { id: collectionId } });
        } catch (err) {
            return err;
        }
    }

    async deleteCollection(collectionId: number): Promise<Collection | Error> {
        if (collectionId === undefined) throw new BadRequestException('parameter error', { cause: new Error(), description: 'id needs to be a number' })
        try {
            return await this.repository.collection.delete({ where: { id: collectionId } });
        } catch (err) {
            return err;
        }
    }

    async exportCollection(userId: number) {
        const tasks = await this.usersService.getUserTasks(userId);
        const taskIds = tasks.map(task => task.id);
        return await this.repository.collection.create({
            data: {
                taskIds
            }
        });
    }

    async importCollection(userId: number, collectionId: number) {
        const res = await this.getCollection(Number(collectionId));
        if (res instanceof Error) return;
        const { taskIds } = res;
        const tasks = await this.repository.task.findMany({
            where: {
                id: { in: taskIds },
            }
        });

        tasks.forEach(task => {
            delete task.id;
            task.userId = userId;
        });

        return await this.repository.task.createMany({
            data: tasks
        });
    }
}
