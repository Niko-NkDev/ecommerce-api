import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private readonly itemsRepo: Repository<CartItem>,
  ) { }

  // Método para agregar un producto al carrito, o actualizar la cantidad si ya existe
  async create(dto: CreateCartItemDto) {
    const { cartId, productId, quantity } = dto;

    const existingItem = await this.itemsRepo.findOne({
      where: {
        cart: { id: cartId },
        product: { id: productId },
      },
      relations: ['cart', 'product'],
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      return this.itemsRepo.save(existingItem);
    }

    const newItem = this.itemsRepo.create({
      cart: { id: cartId } as any,
      product: { id: productId } as any,
      quantity,
    });

    return this.itemsRepo.save(newItem);
  }

  findAll() {
    return this.itemsRepo.find({ relations: ['cart', 'product'] });
  }

  async findOne(id: number) {
    const item = await this.itemsRepo.findOne({ where: { id }, relations: ['cart', 'product'] });
    if (!item) throw new NotFoundException('Item de carrito no encontrado');
    return item;
  }

 async update(id: number, dto: UpdateCartItemDto) {
  const item = await this.itemsRepo.findOne({ where: { id } });

  if (!item) {
    throw new NotFoundException('Item no encontrado');
  }

  //  Si quantity es 0 → eliminar
  if (dto.quantity === 0) {
    await this.itemsRepo.remove(item);
    return { deleted: true };
  }

  // Si es mayor a 0 → actualizar normalmente
  if (dto.quantity !== undefined) {
    item.quantity = dto.quantity;
  }
  return this.itemsRepo.save(item);
}

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.itemsRepo.remove(item);
    return { deleted: true };
  }

  async clearCart(cartId: number) {
    const cart = await this.findOne(cartId);

    await this.itemsRepo.delete({
      cart: { id: cartId },
    });

    return { message: 'Carrito limpiado' };
  }
}
