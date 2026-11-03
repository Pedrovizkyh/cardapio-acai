import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { CategoriasController } from './categorias/categorias.controller.js';
import { CategoriasService } from './categorias/categorias.service.js';
import { ProdutosController } from './produtos/produtos.controller.js';
import { ProdutosService } from './produtos/produtos.service.js';
import { TamanhosController } from './tamanhos/tamanhos.controller.js';
import { TamanhosService } from './tamanhos/tamanhos.service.js';

@Module({
  imports: [AuthModule],
  controllers: [CategoriasController, ProdutosController, TamanhosController],
  providers: [CategoriasService, ProdutosService, TamanhosService],
})
export class AdminModule {}
