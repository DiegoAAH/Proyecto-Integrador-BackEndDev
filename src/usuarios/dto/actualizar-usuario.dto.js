import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Rol } from '../rol.enum';

export class ActualizarUsuarioDto {
  @ApiPropertyOptional({ enum: Rol })
  @IsOptional()
  @IsEnum(Rol)
  rol;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  activo;
}
