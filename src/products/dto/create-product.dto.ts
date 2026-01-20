import { ApiProperty } from '@nestjs/swagger'; // <--- Import
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

class CreateProductUnitDto {
  @ApiProperty({ example: 'Bao 50kg', description: 'Tên đơn vị tính' }) // <--- Thêm dòng này
  @IsString()
  @IsNotEmpty()
  unit_name: string;

  @ApiProperty({ example: 50, description: 'Hệ số quy đổi' })
  @IsNumber()
  @Min(0)
  conversion_factor: number;

  @ApiProperty({ example: 95000, description: 'Giá bán' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  is_base_unit: boolean;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Xi măng Hà Tiên' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'XM-HT-001' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ required: false, example: 'https://anh.com/xm.jpg' })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiProperty({ type: [CreateProductUnitDto] }) // <--- Quan trọng: Báo cho Swagger biết đây là mảng
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductUnitDto)
  units: CreateProductUnitDto[];
}