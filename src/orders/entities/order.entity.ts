// src/orders/entities/order.entity.ts
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customer_name: string; // Tạm thời lưu tên khách (sau này có module User thì nối ID sau)

  @Column({ nullable: true })
  phone_number: string;

  @Column('decimal', { precision: 15, scale: 2 })
  total_price: number; // Tổng giá trị đơn hàng

  @CreateDateColumn()
  created_at: Date; // Ngày bán

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true, // Cho phép lưu Order + OrderItem cùng lúc
  })
  order_items: OrderItem[];
}