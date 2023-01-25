import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RepositoryModule } from './repository/repository.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), AuthModule, UsersModule, RepositoryModule],
  providers: [AppService],
  controllers: [AppController]
})
export class AppModule { }
