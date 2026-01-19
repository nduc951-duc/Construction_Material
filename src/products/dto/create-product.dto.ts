// src/products/dto/create-product.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

// 1. Định nghĩa khuôn cho từng Đơn vị tính (Unit)
class CreateProductUnitDto {
  @IsString()
  @IsNotEmpty()
  unit_name: string; // Tên đơn vị (Bao, Kg...)

  @IsNumber()
  @Min(0)
  conversion_factor: number; // Hệ số quy đổi (phải > 0)

  @IsNumber()
  @Min(0)
  price: number; // Giá bán (phải > 0)

  @IsBoolean()
  is_base_unit: boolean; // Có phải đơn vị gốc không?
}

// 2. Định nghĩa khuôn cho Sản phẩm (Product)
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Tên sản phẩm

  @IsString()
  @IsNotEmpty()
  code: string; // Mã SKU

  @IsString()
  @IsOptional()
  image_url?: string;

  // Quan trọng: Validate mảng các đơn vị con
  @IsArray()
  @ValidateNested({ each: true }) // Kiểm tra kỹ từng phần tử bên trong
  @Type(() => CreateProductUnitDto)
  units: CreateProductUnitDto[];
}