// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Import
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity'; // Cần cái này để check sản phẩm

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]), // Đăng ký 3 bảng
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}