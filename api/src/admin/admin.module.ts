import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdicionaisController } from './adicionais/adicionais.controller.js';
import { AdicionaisService } from './adicionais/adicionais.service.js';
import { CategoriasController } from './categorias/categorias.controller.js';
import { CategoriasService } from './categorias/categorias.service.js';
import { ProdutosController } from './produtos/produtos.controller.js';
import { ProdutosService } from './produtos/produtos.service.js';
import { TamanhosController } from './tamanhos/tamanhos.controller.js';
import { TamanhosService } from './tamanhos/tamanhos.service.js';

@Module({
  imports: [AuthModule],
  controllers: [
    CategoriasController,
    ProdutosController,
    TamanhosController,
    AdicionaisController,
  ],
  providers: [
    CategoriasService,
    ProdutosService,
    TamanhosService,
    AdicionaisService,
  ],
})
export class AdminModule {}
