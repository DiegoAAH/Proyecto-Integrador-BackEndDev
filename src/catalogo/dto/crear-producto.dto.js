import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl } from 'class-validator';

export class CrearProductoDto {
  @ApiProperty({ type: String, example: 'Concha de vainilla' })
  @IsString()
  @IsNotEmpty()
  nombre;

  @ApiPropertyOptional({ type: String, example: 'Pieza individual' })
  @IsOptional()
  @IsString()
  descripcion;

  @ApiProperty({ type: Number, example: 18.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUrl()
  imagenUrl;
}
