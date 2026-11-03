import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { CategoriasService } from './categorias.service.js';
import {
  AtualizarCategoriaDto,
  CriarCategoriaDto,
} from './dto/categoria.dto.js';

@ApiTags('admin — categorias')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  listar() {
    return this.categoriasService.listar();
  }

  @Post()
  criar(@Body() dto: CriarCategoriaDto) {
    return this.categoriasService.criar(dto);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarCategoriaDto,
  ) {
    return this.categoriasService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.remover(id);
  }
}
