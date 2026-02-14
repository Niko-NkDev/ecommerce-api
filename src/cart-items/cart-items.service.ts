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
	) {}

	create(dto: CreateCartItemDto) {
		const item = this.itemsRepo.create({
			cart: { id: dto.cartId } as any,
			product: { id: dto.productId } as any,
			quantity: dto.quantity,
		});
		return this.itemsRepo.save(item);
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
		const item = await this.findOne(id);
		if (dto.cartId) item.cart = { id: dto.cartId } as any;
		if (dto.productId) item.product = { id: dto.productId } as any;
		if (dto.quantity) item.quantity = dto.quantity;
		return this.itemsRepo.save(item);
	}

	async remove(id: number) {
		const item = await this.findOne(id);
		await this.itemsRepo.remove(item);
		return { deleted: true };
	}
}
