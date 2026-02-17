import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, {
    message: 'La contraseña debe incluir al menos una letra y un número',
  })
  password: string;
}
