import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'; // <--- Đã thêm NotFoundException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    // console.log('1. Đã vào hàm create Service'); 

    const baseUnits = createProductDto.units.filter(u => u.is_base_unit === true);
    if (baseUnits.length === 0) {
      throw new BadRequestException('Phải có ít nhất một đơn vị cơ bản');
    }
    if (baseUnits.length > 1) {
      throw new BadRequestException('Chỉ được phép có duy nhất một đơn vị cơ bản (Base Unit)');
    }
    if (!baseUnits.length) {
      throw new BadRequestException('Sản phẩm phải có ít nhất một đơn vị cơ bản (is_base_unit = true)');
    }

    const newProduct = this.productRepository.create({
      ...createProductDto,
      product_units: createProductDto.units,
    });

    return await this.productRepository.save(newProduct);
  }

  findAll() {
    return this.productRepository.find({
      relations: ['product_units'],
    });
  }

  // Sửa tạm hàm này để trả về đúng kiểu Promise
  async findOne(id: number) {
    const product = await this.productRepository.findOne({
        where: { id },
        relations: ['product_units'],
    });
    if (!product) throw new NotFoundException(`Không tìm thấy sản phẩm ${id}`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    if (updateProductDto.units) {
      const baseUnits = updateProductDto.units.filter(u => u.is_base_unit === true);
      if (baseUnits.length > 1) {
         throw new BadRequestException('Trong danh sách cập nhật đang có nhiều hơn 1 đơn vị cơ bản');
      }
    // 1. Tìm sản phẩm cũ
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['product_units'],
    });

    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm có id ${id}`);
    }

    // 2. Xử lý xóa các Unit thừa
    if (updateProductDto.units) {
      // Ép kiểu 'any' ở đây để TypeScript không báo lỗi thiếu thuộc tính 'id'
      const unitsArray = updateProductDto.units as any[];

      const incomingUnitIds = unitsArray
        .filter(u => u.id) 
        .map(u => u.id);

      const unitsToDelete = product.product_units.filter(
        originalUnit => !incomingUnitIds.includes(originalUnit.id)
      );

      if (unitsToDelete.length > 0) {
        await this.productRepository.manager.remove(unitsToDelete);
      }
    }
  

    // 3. Merge và Lưu
    const updatedProduct = this.productRepository.merge(product, {
      ...updateProductDto,
      product_units: updateProductDto.units as any,
    });

    return await this.productRepository.save(updatedProduct);
  }
}

  async remove(id: number) {
    const product = await this.findOne(id); // Tận dụng hàm findOne đã viết ở trên
    return await this.productRepository.remove(product);
  }
}