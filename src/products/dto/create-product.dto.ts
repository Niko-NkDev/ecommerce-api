import { IsNumber, IsString, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name: string;
  
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;
}
