import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoService } from './catalogo.service';
import { Producto } from './producto.entity';
import { ProductosController } from './productos.controller';
import { Tienda } from './tienda.entity';
import { TiendasController } from './tiendas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tienda, Producto])],
  controllers: [TiendasController, ProductosController],
  providers: [CatalogoService],
  exports: [CatalogoService],
})
export class CatalogoModule {}
