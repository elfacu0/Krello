import { Injectable } from '@nestjs/common';
import { RepositoryService } from 'src/repository/repository.service';
import { TasksService } from 'src/tasks/tasks.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CollectionsService {
    constructor(private tasksService: TasksService, private usersService: UsersService, private repository: RepositoryService) { }

    exportCollection(userId: number) {
        const tasks = this.usersService.getUserTasks(userId);
        console.log(tasks);

    }
}
