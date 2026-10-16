import {
  Bind,
  Body,
  Controller,
  Dependencies,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { validar } from '../common/pipes/validar';
import { Rol } from '../usuarios/rol.enum';
import { CatalogoService } from './catalogo.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { CrearTiendaDto } from './dto/crear-tienda.dto';

@ApiTags('catálogo')
@Controller('tiendas')
@Dependencies(CatalogoService)
export class TiendasController {
  constructor(catalogo) {
    this.catalogo = catalogo;
  }

  @Get()
  listar() {
    return this.catalogo.listarTiendas();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Bind(Param('id', ParseUUIDPipe))
  detalle(id) {
    return this.catalogo.buscarTienda(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.VENDEDOR, Rol.ADMIN)
  @ApiBody({ type: CrearTiendaDto })
  @Bind(Body(validar(CrearTiendaDto)), UsuarioActual())
  crear(dto, usuario) {
    return this.catalogo.crearTienda(dto, usuario);
  }

  @Get(':id/productos')
  @ApiQuery({ name: 'todos', type: String, required: false, description: 'true para incluir productos dados de baja' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Bind(Param('id', ParseUUIDPipe), Query('todos'))
  productos(id, todos) {
    return this.catalogo.listarProductos(id, todos === 'true');
  }

  @Post(':id/productos')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Rol.VENDEDOR, Rol.ADMIN)
  @ApiBody({ type: CrearProductoDto })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Bind(Param('id', ParseUUIDPipe), Body(validar(CrearProductoDto)), UsuarioActual())
  crearProducto(id, dto, usuario) {
    return this.catalogo.crearProducto(id, dto, usuario);
  }
}
