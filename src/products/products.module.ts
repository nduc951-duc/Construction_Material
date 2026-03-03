// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Thêm dòng này
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity'; // <--- Import Entity
import { ProductUnit } from './entities/product-unit.entity'; // <--- Import Entity

@Module({
  imports: [
    // Đăng ký 2 Entity này để TypeORM nhận diện và tạo bảng
    TypeOrmModule.forFeature([Product, ProductUnit]), 
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}