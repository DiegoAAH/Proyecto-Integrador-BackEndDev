import { Dependencies, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Rol } from '../usuarios/rol.enum';
import { UsuariosService } from '../usuarios/usuarios.service';

/** Contenido del JWT: { sub: id del usuario, email, rol }. */
@Injectable()
@Dependencies(UsuariosService, JwtService)
export class AuthService {
  constructor(usuariosService, jwt) {
    this.usuariosService = usuariosService;
    this.jwt = jwt;
  }

  /** El registro público siempre crea clientes; el administrador asigna los demás roles. */
  async registrar(dto) {
    const usuario = await this.usuariosService.crear({ ...dto, rol: Rol.CLIENTE });
    return this.respuestaConToken(usuario);
  }

  async login(dto) {
    const usuario = await this.usuariosService.buscarParaLogin(dto.email);
    if (!usuario || !(await bcrypt.compare(dto.password, usuario.passwordHash))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    if (!usuario.activo) throw new ForbiddenException('La cuenta está desactivada');
    return this.respuestaConToken(usuario);
  }

  verificarToken(token) {
    return this.jwt.verify(token);
  }

  respuestaConToken(usuario) {
    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };
    return {
      accessToken: this.jwt.sign(payload),
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    };
  }
}
