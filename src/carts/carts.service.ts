import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from '../cart-items/cart-item.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartsRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly itemsRepo: Repository<CartItem>,
  ) { }

  createForUser(userId: number) {
    const cart = this.cartsRepo.create({ user: { id: userId } as any });
    return this.cartsRepo.save(cart);
  }

  async findMine(userId: number) {
    const cart = await this.cartsRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'items', 'items.product'],
    });
    if (!cart) throw new NotFoundException('Carrito no encontrado');
    const total = cart.items?.reduce((sum, item) => sum + item.quantity * item.product.price, 0) ?? 0;
    return { ...cart, total };
  }

  // Método para obtener un carrito por su ID, incluyendo el cálculo del total
  async findOneForUser(id: number, userId: number) {
    const cart = await this.cartsRepo.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });

    if (!cart) throw new NotFoundException('Carrito no encontrado');
    if (cart.user?.id !== userId) throw new ForbiddenException('Acceso denegado');

    const total = cart.items.reduce((sum, item) => {
      return sum + item.quantity * item.product.price;
    }, 0);

    return {
      ...cart,
      total,
    };
  }

  async update(id: number, dto: UpdateCartDto, userId: number) {
    const cart = await this.findOneForUser(id, userId);
    return this.cartsRepo.save(cart);
  }

  async remove(id: number, userId: number) {
    const cart = await this.findOneForUser(id, userId);
    await this.cartsRepo.remove(cart);
    return { deleted: true };
  }

  // Eliminar todos los items de un carrito
  async clearCart(id: number, userId: number) {
    const cart = await this.cartsRepo.findOne({
      where: { id },
      relations: ['items', 'user'],
    });

    if (!cart) throw new NotFoundException('Carrito no encontrado');
    if (cart.user?.id !== userId) throw new ForbiddenException('Acceso denegado');

    const items = cart.items ?? [];
    if (items.length === 0) return { cleared: true, count: 0 };

    await this.itemsRepo.remove(items);
    return { cleared: true, count: items.length };
  }
}
