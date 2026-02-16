import { IsInt, IsPositive, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  cartId: number;

  @IsInt()
  @IsPositive()
  @Min(1)
  productId: number;

  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}
