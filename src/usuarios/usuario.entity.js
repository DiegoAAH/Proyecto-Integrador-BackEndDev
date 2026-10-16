import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Rol } from './rol.enum';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar' })
  nombre;

  @Column({ type: 'varchar', unique: true })
  email;

  @Column({ name: 'password_hash', type: 'varchar', select: false })
  passwordHash;

  @Column({ type: 'enum', enum: Rol, default: Rol.CLIENTE })
  rol;

  @Column({ type: 'boolean', default: true })
  activo;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn;
}
