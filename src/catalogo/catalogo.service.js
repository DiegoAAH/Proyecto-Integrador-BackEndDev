import { Dependencies, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rol } from '../usuarios/rol.enum';
import { Producto } from './producto.entity';
import { Tienda } from './tienda.entity';

@Injectable()
@Dependencies(getRepositoryToken(Tienda), getRepositoryToken(Producto))
export class CatalogoService {
  constructor(tiendas, productos) {
    this.tiendas = tiendas;
    this.productos = productos;
  }

  // ---- Tiendas ----

  crearTienda(dto, usuario) {
    const propietarioId = usuario.rol === Rol.ADMIN && dto.propietarioId ? dto.propietarioId : usuario.id;
    return this.tiendas.save(
      this.tiendas.create({ nombre: dto.nombre, descripcion: dto.descripcion ?? null, propietarioId }),
    );
  }

  listarTiendas() {
    return this.tiendas.find({ where: { activa: true }, order: { nombre: 'ASC' } });
  }

  async buscarTienda(id) {
    const tienda = await this.tiendas.findOneBy({ id });
    if (!tienda) throw new NotFoundException('Tienda no encontrada');
    return tienda;
  }

  /** IDs de las tiendas de un vendedor (lo usan pedidos y notificaciones). */
  async tiendasDeVendedor(vendedorId) {
    const tiendas = await this.tiendas.find({ where: { propietarioId: vendedorId }, select: { id: true } });
    return tiendas.map((t) => t.id);
  }

  /** Lanza 403 si el usuario no es dueño de la tienda ni administrador. */
  async verificarDueno(tiendaId, usuario) {
    const tienda = await this.buscarTienda(tiendaId);
    if (usuario.rol !== Rol.ADMIN && tienda.propietarioId !== usuario.id) {
      throw new ForbiddenException('No administras esta tienda');
    }
    return tienda;
  }

  // ---- Productos ----

  listarProductos(tiendaId, incluirNoDisponibles = false) {
    return this.productos.find({
      where: incluirNoDisponibles ? { tiendaId } : { tiendaId, disponible: true },
      order: { nombre: 'ASC' },
    });
  }

  async buscarProducto(id) {
    const producto = await this.productos.findOneBy({ id });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async crearProducto(tiendaId, dto, usuario) {
    await this.verificarDueno(tiendaId, usuario);
    return this.productos.save(this.productos.create({ ...dto, tiendaId }));
  }

  async actualizarProducto(id, dto, usuario) {
    const producto = await this.buscarProducto(id);
    await this.verificarDueno(producto.tiendaId, usuario);
    Object.assign(producto, dto);
    return this.productos.save(producto);
  }

  async darDeBajaProducto(id, usuario) {
    return this.actualizarProducto(id, { disponible: false }, usuario);
  }
}
