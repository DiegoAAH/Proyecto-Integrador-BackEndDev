import { ConflictException, Dependencies, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Rol } from './rol.enum';
import { Usuario } from './usuario.entity';

@Injectable()
@Dependencies(getRepositoryToken(Usuario), ConfigService)
export class UsuariosService {
  logger = new Logger(UsuariosService.name);

  constructor(usuarios, config) {
    this.usuarios = usuarios;
    this.config = config;
  }

  /** Crea el administrador inicial definido en .env si todavía no existe ninguno. */
  async onApplicationBootstrap() {
    const email = this.config.get('ADMIN_EMAIL');
    const password = this.config.get('ADMIN_PASSWORD');
    if (!email || !password) return;
    if (await this.usuarios.existsBy({ rol: Rol.ADMIN })) return;
    await this.crear({ nombre: 'Administrador', email, password, rol: Rol.ADMIN });
    this.logger.log(`Administrador inicial creado: ${email}`);
  }

  /** datos: { nombre, email, password, rol? } */
  async crear(datos) {
    const email = datos.email.toLowerCase();
    if (await this.usuarios.existsBy({ email })) {
      throw new ConflictException('El email ya está registrado');
    }
    const usuario = this.usuarios.create({
      nombre: datos.nombre,
      email,
      passwordHash: await bcrypt.hash(datos.password, 10),
      rol: datos.rol ?? Rol.CLIENTE,
    });
    const guardado = await this.usuarios.save(usuario);
    const { passwordHash, ...sinPassword } = guardado;
    return sinPassword;
  }

  /** Incluye el hash de la contraseña; solo para el login. */
  buscarParaLogin(email) {
    return this.usuarios.findOne({
      where: { email: email.toLowerCase() },
      select: { id: true, nombre: true, email: true, rol: true, activo: true, passwordHash: true },
    });
  }

  async buscarPorId(id) {
    const usuario = await this.usuarios.findOneBy({ id });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  listar(rol) {
    return this.usuarios.find({ where: rol ? { rol } : {}, order: { creadoEn: 'DESC' } });
  }

  async actualizar(id, dto) {
    const usuario = await this.buscarPorId(id);
    Object.assign(usuario, dto);
    return this.usuarios.save(usuario);
  }
}
