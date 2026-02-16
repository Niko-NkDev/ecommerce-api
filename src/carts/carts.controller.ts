import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('carts')
export class CartsController {
	constructor(private readonly cartsService: CartsService) {}

	@Post()
	create(@Req() req: any) {
		const userId = req.user?.userId;
		return this.cartsService.createForUser(userId);
	}

	@Get()
	findMine(@Req() req: any) {
		const userId = req.user?.userId;
		return this.cartsService.findMine(userId);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
		const userId = req.user?.userId;
		return this.cartsService.findOneForUser(id, userId);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateCartDto,
		@Req() req: any,
	) {
		const userId = req.user?.userId;
		return this.cartsService.update(id, dto, userId);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
		const userId = req.user?.userId;
		return this.cartsService.remove(id, userId);
	}

	// Nuevo endpoint para limpiar un carrito completo
	@Delete(':id/clear')
	clear(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
		const userId = req.user?.userId;
		return this.cartsService.clearCart(id, userId);
	}

}
