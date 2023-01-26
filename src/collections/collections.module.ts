import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';

@Module({
  providers: [CollectionsService, TasksService, UsersService],
  controllers: [CollectionsController]
})
export class CollectionsModule { }
