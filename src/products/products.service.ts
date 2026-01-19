import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // <--- Import quan trọng
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity'; // <--- Nhớ import Entity

@Injectable()
export class ProductsService {
  // 1. PHẢI CÓ CONSTRUCTOR ĐỂ KHAI BÁO REPOSITORY
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // 2. PHẢI CÓ TỪ KHÓA ASYNC
  async create(createProductDto: CreateProductDto) {
    console.log('1. Đã vào hàm create Service'); 

    // Kiểm tra có đơn vị cơ bản chưa
    const hasBaseUnit = createProductDto.units.some(u => u.is_base_unit === true);
    if (!hasBaseUnit) {
      console.log('2. Lỗi validation logic'); 
      throw new BadRequestException('Sản phẩm phải có ít nhất một đơn vị cơ bản (is_base_unit = true)');
    }

    console.log('3. Bắt đầu tạo đối tượng'); 
    const newProduct = this.productRepository.create({
      ...createProductDto,
      product_units: createProductDto.units,
    });

    console.log('4. Bắt đầu lưu vào Database'); 
    
    // Lưu vào DB
    const result = await this.productRepository.save(newProduct);
    
    console.log('5. Đã lưu xong!'); 
    return result;
  }

  findAll() {
    return this.productRepository.find({
      relations: ['product_units'], // Lấy luôn cả đơn vị tính kèm theo
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}