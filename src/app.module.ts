import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // Nhớ cài: npm i @nestjs/config
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    // Load file .env
    ConfigModule.forRoot(), 

    // Kết nối Database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',      // Chạy trên máy mình
      port: 5432,             // Cổng mặc định
      username: 'postgres',   // Tên đăng nhập mặc định
      password: '123456',     // Mật khẩu bạn vừa đặt lúc cài
      database: 'construction_db', // Tên DB vừa tạo
      autoLoadEntities: true,
      synchronize: true,
    }), ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}