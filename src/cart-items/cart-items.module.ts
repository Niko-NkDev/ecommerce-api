import { Module } from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { CartItemsController } from './cart-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  providers: [CartItemsService],
  controllers: [CartItemsController]
})
export class CartItemsModule {}
