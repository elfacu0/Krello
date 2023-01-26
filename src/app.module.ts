import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RepositoryModule } from './repository/repository.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), AuthModule, UsersModule, RepositoryModule, TasksModule],
  providers: [AppService],
  controllers: [AppController]
})
export class AppModule { }
