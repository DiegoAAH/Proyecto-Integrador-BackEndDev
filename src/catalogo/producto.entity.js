import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { numericTransformer } from '../common/utils/numeric.transformer';
import { Tienda } from './tienda.entity';

@Entity('producto')
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ name: 'tienda_id', type: 'uuid' })
  tiendaId;

  @ManyToOne(() => Tienda, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tienda_id' })
  tienda;

  @Column({ type: 'varchar' })
  nombre;

  @Column({ type: 'text', nullable: true })
  descripcion;

  @Column({ type: 'numeric', precision: 10, scale: 2, transformer: numericTransformer })
  precio;

  @Column({ name: 'imagen_url', type: 'varchar', nullable: true })
  imagenUrl;

  /** Baja lógica: un producto dado de baja deja de aparecer en el catálogo pero conserva su historial. */
  @Column({ type: 'boolean', default: true })
  disponible;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn;
}
