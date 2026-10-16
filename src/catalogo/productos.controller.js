import {
  Bind,
  Body,
  Controller,
  Delete,
  Dependencies,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { validar } from '../common/pipes/validar';
import { Rol } from '../usuarios/rol.enum';
import { CatalogoService } from './catalogo.service';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';

@ApiTags('catálogo')
@Controller('productos')
@Dependencies(CatalogoService)
export class ProductosController {
  constructor(catalogo) {
    this.catalogo = catalogo;
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Bind(Param('id', ParseUUIDPipe))
  detalle(id) {
    return this.catalogo.buscarProducto(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.VENDEDOR, Rol.ADMIN)
  @ApiBody({ type: ActualizarProductoDto })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Bind(Param('id', ParseUUIDPipe), Body(validar(ActualizarProductoDto)), UsuarioActual())
  actualizar(id, dto, usuario) {
    return this.catalogo.actualizarProducto(id, dto, usuario);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.VENDEDOR, Rol.ADMIN)
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Bind(Param('id', ParseUUIDPipe), UsuarioActual())
  darDeBaja(id, usuario) {
    return this.catalogo.darDeBajaProducto(id, usuario);
  }
}
