import {
  Bind,
  Body,
  Controller,
  Dependencies,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { validar } from '../common/pipes/validar';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { Rol } from './rol.enum';
import { UsuariosService } from './usuarios.service';

@ApiTags('usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
@Dependencies(UsuariosService)
export class UsuariosController {
  constructor(usuariosService) {
    this.usuariosService = usuariosService;
  }

  @Get('me')
  @Bind(UsuarioActual())
  perfil(usuario) {
    return this.usuariosService.buscarPorId(usuario.id);
  }

  @Get()
  @Roles(Rol.ADMIN, Rol.VENDEDOR)
  @ApiQuery({ name: 'rol', enum: Rol, required: false })
  @Bind(Query('rol'))
  listar(rol) {
    return this.usuariosService.listar(rol);
  }

  @Patch(':id')
  @Roles(Rol.ADMIN)
  @ApiBody({ type: ActualizarUsuarioDto })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @Bind(Param('id', ParseUUIDPipe), Body(validar(ActualizarUsuarioDto)))
  actualizar(id, dto) {
    return this.usuariosService.actualizar(id, dto);
  }
}
