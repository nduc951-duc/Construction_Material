// src/orders/entities/order-item.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_name: string; // Lưu tên SP lúc bán (phòng khi sau này đổi tên SP)

  @Column()
  unit_name: string; // Lưu tên đơn vị lúc bán (Bao, Kg...)

  @Column('int')
  quantity: number; // Số lượng mua

  @Column('decimal', { precision: 12, scale: 2 })
  price: number; // Giá bán tại thời điểm mua (QUAN TRỌNG)

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number; // Thành tiền = quantity * price

  // Quan hệ: Nhiều item thuộc về 1 đơn hàng
  @ManyToOne(() => Order, (order) => order.order_items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  // Quan hệ: Item này là của Product nào (để sau này thống kê doanh số theo SP)
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}   