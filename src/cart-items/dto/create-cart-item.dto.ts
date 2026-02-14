import { IsInt, IsPositive } from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  @IsPositive()
  cartId: number;

  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
