import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { TasksService } from 'src/tasks/tasks.service';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [CollectionsService, TasksService, UsersService],
  controllers: [CollectionsController]
})
export class CollectionsModule { }
