import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items, ...orderData } = createOrderDto;

    // 1. Chuẩn bị danh sách các món hàng (Order Items)
    const orderItems: OrderItem[] = [];
    let totalOrderPrice = 0;

    for (const itemDto of items) {
      // Tìm sản phẩm trong kho để lấy tên (Snapshot Name)
      const product = await this.productRepository.findOne({ where: { id: itemDto.product_id } });
      
      if (!product) {
        throw new NotFoundException(`Sản phẩm ID ${itemDto.product_id} không tồn tại`);
      }

      // Tính thành tiền từng món
      const itemAmount = itemDto.quantity * itemDto.price;
      
      // Cộng dồn vào tổng đơn hàng
      totalOrderPrice += itemAmount;

      // Tạo đối tượng OrderItem
      const newItem = new OrderItem();
      newItem.product = product; // Link tới Product ID
      newItem.product_name = product.name; // Lưu cứng tên SP tại thời điểm bán
      newItem.unit_name = itemDto.unit_name;
      newItem.quantity = itemDto.quantity;
      newItem.price = itemDto.price;
      newItem.amount = itemAmount;

      orderItems.push(newItem);
    }

    // 2. Tạo đối tượng Order
    const newOrder = this.orderRepository.create({
      ...orderData,
      total_price: totalOrderPrice, // Backend tự tính, không lấy từ DTO
      order_items: orderItems,
    });

    // 3. Lưu vào DB (Cascade sẽ tự lưu luôn các Order Items)
    return await this.orderRepository.save(newOrder);
  }

  async findAll() {
    return this.orderRepository.find({
      relations: ['order_items'], // Lấy đơn hàng kèm chi tiết
      order: { created_at: 'DESC' } // Đơn mới nhất lên đầu
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['order_items'],
    });
    if (!order) throw new NotFoundException(`Không tìm thấy đơn hàng #${id}`);
    return order;
  }

}
