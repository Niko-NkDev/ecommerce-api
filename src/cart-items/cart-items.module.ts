import { Module } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { CartItemsController } from './cart-items.controller';

// Módulo para manejar los items del carrito, incluyendo la lógica de agregar, actualizar y eliminar productos del carrito
@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  providers: [CartItemsService],
  controllers: [CartItemsController]
})
export class CartItemsModule {}
