import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './users/users.module';
import { RepositoryModule } from './repository/repository.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { CollectionsModule } from './collections/collections.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule.forRoot({
    isGlobal: true
  }), AuthModule, UsersModule, RepositoryModule, TasksModule, CollectionsModule, JobsModule],
  providers: [AppService],
  controllers: [AppController]
})
export class AppModule { }
