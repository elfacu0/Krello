import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  app.enableCors({
    allowedHeaders: ['content-type',"Authorization"],
    origin: 'https://krello-front.vercel.app/',
    credentials: true,
  });

  await app.listen(8080);
}
bootstrap();
