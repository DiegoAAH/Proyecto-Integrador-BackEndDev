import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegistroDto {
  @ApiProperty({ type: String, example: 'Ana López' })
  @IsString()
  @IsNotEmpty()
  nombre;

  @ApiProperty({ type: String, example: 'ana@correo.com' })
  @IsEmail()
  email;

  @ApiProperty({ type: String, example: 'Secreta123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password;
}
