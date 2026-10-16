import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('tienda')
export class Tienda {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar' })
  nombre;

  @Column({ type: 'text', nullable: true })
  descripcion;

  @Column({ name: 'propietario_id', type: 'uuid' })
  propietarioId;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'propietario_id' })
  propietario;

  @Column({ type: 'boolean', default: true })
  activa;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn;
}
