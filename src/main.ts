// src/main.ts (Backend)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors(); 

  app.useGlobalPipes(new ValidationPipe()); 

  const config = new DocumentBuilder()
    .setTitle('Hệ thống Quản lý Vật liệu Xây dựng')
    .setVersion('1.0')
    .addTag('products') 
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  await app.listen(3000);
}
bootstrap();