import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartsService {
	constructor(
		@InjectRepository(Cart)
		private readonly cartsRepo: Repository<Cart>,
	) {}

	create(dto: CreateCartDto) {
		const cart = this.cartsRepo.create({ user: { id: dto.userId } as any });
		return this.cartsRepo.save(cart);
	}

	findAll() {
		return this.cartsRepo.find({ relations: ['user', 'items'] });
	}

	async findOne(id: number) {
		const cart = await this.cartsRepo.findOne({ where: { id }, relations: ['user', 'items'] });
		if (!cart) throw new NotFoundException('Carrito no encontrado');
		return cart;
	}

	async update(id: number, dto: UpdateCartDto) {
		const cart = await this.findOne(id);
		if (dto.userId) cart.user = { id: dto.userId } as any;
		return this.cartsRepo.save(cart);
	}

	async remove(id: number) {
		const cart = await this.findOne(id);
		await this.cartsRepo.remove(cart);
		return { deleted: true };
	}
}
