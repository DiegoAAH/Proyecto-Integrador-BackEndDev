import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CrearProductoDto } from './crear-producto.dto';

/** Los mismos campos que CrearProductoDto, todos opcionales, más "disponible". */
export class ActualizarProductoDto extends PartialType(CrearProductoDto) {
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  disponible;
}
