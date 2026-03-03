// src/products/entities/product-unit.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  unit_name: string; // Ví dụ: Bao, Kg, Hộp

  @Column('float')
  conversion_factor: number; // Ví dụ: 1 (gốc), 50 (1 bao = 50 gốc)

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // Giá bán cho đơn vị này

  @Column({ default: false })
  is_base_unit: boolean; // Đánh dấu đơn vị gốc

  // Thiết lập quan hệ: Nhiều đơn vị thuộc về 1 sản phẩm
  @ManyToOne(() => Product, (product) => product.product_units, {
    onDelete: 'CASCADE', // Xóa sản phẩm thì xóa luôn đơn vị
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}