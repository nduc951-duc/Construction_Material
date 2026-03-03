// src/orders/dto/create-order.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, Min, ValidateNested, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateOrderItemDto {
  @ApiProperty({ example: 1, description: 'ID của sản phẩm muốn mua' })
  @IsNumber()
  product_id: number;

  @ApiProperty({ example: 'Bao 50kg', description: 'Tên đơn vị tính muốn mua' })
  @IsString()
  @IsNotEmpty()
  unit_name: string; // Client phải gửi lên muốn mua theo đơn vị nào

  @ApiProperty({ example: 5, description: 'Số lượng mua' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 95000, description: 'Giá bán thực tế (cho phép sửa giá khi bán)' })
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Anh Ba Xây Dựng' })
  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @ApiProperty({ example: '0909123456' })
  @IsString()
  @IsOptional()
  phone_number: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}