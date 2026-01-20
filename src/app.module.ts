import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; 
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // 1. Load biến môi trường từ file .env
    ConfigModule.forRoot({
      isGlobal: true, // Để dùng được biến môi trường ở mọi nơi không cần import lại
    }), 

    // 2. Kết nối Database dùng biến môi trường
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'), // Chuyển chuỗi thành số
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // Dev mode: true. Khi deploy nhớ đổi thành false
    }), 
    ProductsModule, OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}