// src/products/entities/product.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductUnit } from './product-unit.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tên sản phẩm

  @Column({ unique: true })
  code: string; // Mã SKU (VD: XM-HT-001)

  @Column({ nullable: true })
  image_url: string;

  // Quan hệ ngược lại: 1 Sản phẩm có nhiều Đơn vị
  @OneToMany(() => ProductUnit, (unit) => unit.product, {
    cascade: true, // Cho phép lưu sản phẩm kèm luôn đơn vị trong 1 lệnh
  })
  product_units: ProductUnit[];
}