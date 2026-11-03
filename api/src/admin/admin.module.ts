import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { CategoriasController } from './categorias/categorias.controller.js';
import { CategoriasService } from './categorias/categorias.service.js';

@Module({
  imports: [AuthModule],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class AdminModule {}
