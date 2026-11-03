import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import {
  AtualizarTamanhoDto,
  CriarTamanhoDto,
} from '../produtos/dto/produto.dto.js';
import { TamanhosService } from './tamanhos.service.js';

@ApiTags('admin — tamanhos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class TamanhosController {
  constructor(private readonly tamanhosService: TamanhosService) {}

  @Post('produtos/:produtoId/tamanhos')
  criar(
    @Param('produtoId', ParseIntPipe) produtoId: number,
    @Body() dto: CriarTamanhoDto,
  ) {
    return this.tamanhosService.criar(produtoId, dto);
  }

  @Patch('tamanhos/:id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarTamanhoDto,
  ) {
    return this.tamanhosService.atualizar(id, dto);
  }

  @Delete('tamanhos/:id')
  @HttpCode(204)
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.tamanhosService.remover(id);
  }
}
