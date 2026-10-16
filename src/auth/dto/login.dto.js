import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ type: String, example: 'ana@correo.com' })
  @IsEmail()
  email;

  @ApiProperty({ type: String, example: 'Secreta123' })
  @IsString()
  password;
}
