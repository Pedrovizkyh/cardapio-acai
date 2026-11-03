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
import { AtualizarProdutoDto, CriarProdutoDto } from './dto/produto.dto.js';
import { ProdutosService } from './produtos.service.js';

@ApiTags('admin — produtos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Get()
  listar() {
    return this.produtosService.listar();
  }

  @Get(':id')
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.produtosService.buscar(id);
  }

  @Post()
  criar(@Body() dto: CriarProdutoDto) {
    return this.produtosService.criar(dto);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarProdutoDto,
  ) {
    return this.produtosService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.produtosService.remover(id);
  }
}
