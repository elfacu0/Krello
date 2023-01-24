import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RepositoryModule } from './repository/repository.module';

@Module({
  imports: [UsersModule, RepositoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
