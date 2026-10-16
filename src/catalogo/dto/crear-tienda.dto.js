import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CrearTiendaDto {
  @ApiProperty({ type: String, example: 'Panadería La Espiga' })
  @IsString()
  @IsNotEmpty()
  nombre;

  @ApiPropertyOptional({ type: String, example: 'Pan artesanal y repostería' })
  @IsOptional()
  @IsString()
  descripcion;

  @ApiPropertyOptional({ type: String, format: 'uuid', description: 'Solo administrador: vendedor dueño de la tienda' })
  @IsOptional()
  @IsUUID()
  propietarioId;
}
